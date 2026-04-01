import os
import json
from typing import List
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from google import genai

load_dotenv()


class RankedArticle(BaseModel):
    digest_id: str = Field(description="The ID of the digest (article_type:article_id)")
    relevance_score: float = Field(description="Relevance score from 0.0 to 10.0", ge=0.0, le=10.0)
    rank: int = Field(description="Rank position (1 = most relevant)", ge=1)
    reasoning: str = Field(description="Brief explanation of why this article is ranked here")


class RankedDigestList(BaseModel):
    articles: List[RankedArticle] = Field(description="List of ranked articles")


CURATOR_PROMPT = """You are an expert AI news curator specializing in personalized content ranking for AI professionals.

Your role is to analyze and rank AI-related news articles, research papers, and video content based on a user's specific profile, interests, and background.

Ranking Criteria:
1. Relevance to user's stated interests and background
2. Technical depth and practical value
3. Novelty and significance of the content
4. Alignment with user's expertise level
5. Actionability and real-world applicability

Scoring Guidelines:
- 9.0-10.0: Highly relevant, directly aligns with user interests, significant value
- 7.0-8.9: Very relevant, strong alignment with interests, good value
- 5.0-6.9: Moderately relevant, some alignment, decent value
- 3.0-4.9: Somewhat relevant, limited alignment, lower value
- 0.0-2.9: Low relevance, minimal alignment, little value

Rank articles from most relevant (rank 1) to least relevant. Ensure each article has a unique rank."""


class CuratorAgent:
    def __init__(self, user_profile: dict):
        self.client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

        self.model = os.getenv("GOOGLE_MODEL_NAME")

        self.user_profile = user_profile
        self.system_prompt = self._build_system_prompt()

    def _build_system_prompt(self) -> str:
        interests = "\n".join(f"- {i}" for i in self.user_profile["interests"])
        preferences = "\n".join(f"- {k}: {v}" for k, v in self.user_profile["preferences"].items())

        return f"""{CURATOR_PROMPT}

User Profile:
Name: {self.user_profile["name"]}
Background: {self.user_profile["background"]}
Expertise Level: {self.user_profile["expertise_level"]}

Interests:
{interests}

Preferences:
{preferences}
"""

    def rank_digests(self, digests: List[dict]) -> List[RankedArticle]:
        if not digests:
            return []

        digest_list = "\n\n".join([
            f"ID: {d['id']}\nTitle: {d['title']}\nSummary: {d['summary']}\nType: {d['article_type']}"
            for d in digests
        ])

        user_prompt = f"""
Rank these {len(digests)} AI digests:

{digest_list}
"""

        try:
            full_prompt = self.system_prompt + "\n\n" + user_prompt

            response = self.client.models.generate_content(
                model=self.model,
                contents=full_prompt,
                config={
                    "temperature": 0.3,
                    "max_output_tokens": 2048,
                    "response_mime_type": "application/json",
                    "response_schema": {
                        "type": "object",
                        "properties": {
                            "articles": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "digest_id": {"type": "string"},
                                        "relevance_score": {"type": "number"},
                                        "rank": {"type": "integer"},
                                        "reasoning": {"type": "string"}
                                    },
                                    "required": ["digest_id", "relevance_score", "rank", "reasoning"]
                                }
                            }
                        },
                        "required": ["articles"]
                    }
                }
            )

            parsed = _safe_parse(response.text)

            ranked = RankedDigestList(**parsed)

            _validate_ranks(ranked.articles)

            return ranked.articles

        except Exception as e:
            print(f"Error ranking digests: {e}")
            return []


def _safe_parse(text: str) -> dict:
    try:
        return json.loads(text)
    except:
        text = text.replace("```json", "").replace("```", "")
        return json.loads(text)


def _validate_ranks(articles: List[RankedArticle]):
    ranks = [a.rank for a in articles]

    # Fix duplicate / missing ranks
    if sorted(ranks) != list(range(1, len(articles) + 1)):
        articles.sort(key=lambda x: x.relevance_score, reverse=True)
        for i, a in enumerate(articles):
            a.rank = i + 1
