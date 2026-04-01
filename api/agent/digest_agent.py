import os
import json
from typing import Optional
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

load_dotenv()

def safe_parse(text: str):
    try:
        return json.loads(text)
    except:
        text = text.replace("```json", "").replace("```", "")
        return json.loads(text)


class DigestOutput(BaseModel):
    title: str
    summary: str

PROMPT = """You are an expert AI news analyst specializing in summarizing technical articles, research papers, and video content about artificial intelligence.

Your role is to create concise, informative digests that help readers quickly understand the key points and significance of AI-related content.

Guidelines:
- Create a compelling title (5-10 words) that captures the essence of the content
- Write a 2-3 sentence summary that highlights the main points and why they matter
- Focus on actionable insights and implications
- Use clear, accessible language while maintaining technical accuracy
- Avoid marketing fluff - focus on substance"""


class DigestAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

        self.model = os.getenv("GOOGLE_MODEL_NAME")

        self.system_prompt = PROMPT

    def generate_digest(
        self,
        title: str,
        content: str,
        article_type: str
    ) -> Optional[DigestOutput]:

        try:
            user_prompt = f"""
Create a digest for this {article_type}

Title: {title}

Content:
{content[:8000]}
"""

            full_prompt = self.system_prompt + "\n\n" + user_prompt

            response = self.client.models.generate_content(
                model=self.model,
                contents=full_prompt,
                config={
                    "temperature": 0.7,
                    "max_output_tokens": 1024,
                    "response_mime_type": "application/json",
                    "response_schema": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string"},
                            "summary": {"type": "string"}
                        },
                        "required": ["title", "summary"]
                    }
                }
            )

            # Parse JSON response safely
            parsed = safe_parse(response.text)

            return DigestOutput(**parsed)

        except Exception as e:
            print(f"Error generating digest: {e}")
            return None
