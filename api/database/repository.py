from datetime import datetime, timedelta, timezone
from typing import List, Optional, Dict, Any
from .connection import get_database


class Repository:
    def __init__(self):
        self.db = get_database()

    def create_youtube_video(self, video_id: str, title: str, url: str, channel_id: str,
                             published_at: datetime, description: str = "", transcript: Optional[str] = None) -> Optional[dict]:
        if self.db.youtube_videos.find_one({"_id": video_id}):
            return None
        doc = {
            "_id": video_id,
            "video_id": video_id,
            "title": title,
            "url": url,
            "channel_id": channel_id,
            "published_at": published_at,
            "description": description,
            "transcript": transcript,
            "created_at": datetime.now(timezone.utc)
        }
        self.db.youtube_videos.insert_one(doc)
        return doc

    def create_openai_article(self, guid: str, title: str, url: str, published_at: datetime,
                              description: str = "", category: Optional[str] = None) -> Optional[dict]:
        if self.db.openai_articles.find_one({"_id": guid}):
            return None
        doc = {
            "_id": guid,
            "guid": guid,
            "title": title,
            "url": url,
            "published_at": published_at,
            "description": description,
            "category": category,
            "created_at": datetime.now(timezone.utc)
        }
        self.db.openai_articles.insert_one(doc)
        return doc

    def create_anthropic_article(self, guid: str, title: str, url: str, published_at: datetime,
                                 description: str = "", category: Optional[str] = None) -> Optional[dict]:
        if self.db.anthropic_articles.find_one({"_id": guid}):
            return None
        doc = {
            "_id": guid,
            "guid": guid,
            "title": title,
            "url": url,
            "published_at": published_at,
            "description": description,
            "category": category,
            "markdown": None,
            "created_at": datetime.now(timezone.utc)
        }
        self.db.anthropic_articles.insert_one(doc)
        return doc

    def bulk_create_youtube_videos(self, videos: List[dict]) -> int:
        count = 0
        for v in videos:
            result = self.db.youtube_videos.update_one(
                {"_id": v["video_id"]},
                {"$setOnInsert": {
                    "_id": v["video_id"],
                    "video_id": v["video_id"],
                    "title": v["title"],
                    "url": v["url"],
                    "channel_id": v.get("channel_id", ""),
                    "published_at": v["published_at"],
                    "description": v.get("description", ""),
                    "transcript": v.get("transcript"),
                    "created_at": datetime.now(timezone.utc)
                }},
                upsert=True
            )
            if result.upserted_id is not None:
                count += 1
        return count

    def bulk_create_openai_articles(self, articles: List[dict]) -> int:
        count = 0
        for a in articles:
            result = self.db.openai_articles.update_one(
                {"_id": a["guid"]},
                {"$setOnInsert": {
                    "_id": a["guid"],
                    "guid": a["guid"],
                    "title": a["title"],
                    "url": a["url"],
                    "published_at": a["published_at"],
                    "description": a.get("description", ""),
                    "category": a.get("category"),
                    "created_at": datetime.now(timezone.utc)
                }},
                upsert=True
            )
            if result.upserted_id is not None:
                count += 1
        return count

    def bulk_create_anthropic_articles(self, articles: List[dict]) -> int:
        count = 0
        for a in articles:
            result = self.db.anthropic_articles.update_one(
                {"_id": a["guid"]},
                {"$setOnInsert": {
                    "_id": a["guid"],
                    "guid": a["guid"],
                    "title": a["title"],
                    "url": a["url"],
                    "published_at": a["published_at"],
                    "description": a.get("description", ""),
                    "category": a.get("category"),
                    "markdown": None,
                    "created_at": datetime.now(timezone.utc)
                }},
                upsert=True
            )
            if result.upserted_id is not None:
                count += 1
        return count

    def get_anthropic_articles_without_markdown(self, limit: Optional[int] = None) -> List[dict]:
        query = self.db.anthropic_articles.find({"markdown": None})
        if limit:
            query = query.limit(limit)
        return list(query)

    def update_anthropic_article_markdown(self, guid: str, markdown: str) -> bool:
        result = self.db.anthropic_articles.update_one(
            {"_id": guid},
            {"$set": {"markdown": markdown}}
        )
        return result.modified_count > 0

    def get_youtube_videos_without_transcript(self, limit: Optional[int] = None) -> List[dict]:
        query = self.db.youtube_videos.find({"transcript": None})
        if limit:
            query = query.limit(limit)
        return list(query)

    def update_youtube_video_transcript(self, video_id: str, transcript: str) -> bool:
        result = self.db.youtube_videos.update_one(
            {"_id": video_id},
            {"$set": {"transcript": transcript}}
        )
        return result.modified_count > 0

    def get_articles_without_digest(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        articles = []

        seen_ids = {d["_id"] for d in self.db.digests.find({}, {"_id": 1})}

        for video in self.db.youtube_videos.find({"transcript": {"$nin": [None, "__UNAVAILABLE__"]}}):
            key = f"youtube:{video['video_id']}"
            if key not in seen_ids:
                articles.append({
                    "type": "youtube",
                    "id": video["video_id"],
                    "title": video["title"],
                    "url": video["url"],
                    "content": video.get("transcript") or video.get("description") or "",
                    "published_at": video.get("published_at")
                })

        for article in self.db.openai_articles.find({}):
            key = f"openai:{article['guid']}"
            if key not in seen_ids:
                articles.append({
                    "type": "openai",
                    "id": article["guid"],
                    "title": article["title"],
                    "url": article["url"],
                    "content": article.get("description") or "",
                    "published_at": article.get("published_at")
                })

        for article in self.db.anthropic_articles.find({"markdown": {"$ne": None}}):
            key = f"anthropic:{article['guid']}"
            if key not in seen_ids:
                articles.append({
                    "type": "anthropic",
                    "id": article["guid"],
                    "title": article["title"],
                    "url": article["url"],
                    "content": article.get("markdown") or article.get("description") or "",
                    "published_at": article.get("published_at")
                })

        if limit:
            articles = articles[:limit]

        return articles

    def create_digest(self, article_type: str, article_id: str, url: str, title: str, summary: str,
                      published_at: Optional[datetime] = None) -> Optional[dict]:
        digest_id = f"{article_type}:{article_id}"
        if self.db.digests.find_one({"_id": digest_id}):
            return None

        if published_at:
            if published_at.tzinfo is None:
                published_at = published_at.replace(tzinfo=timezone.utc)
            created_at = published_at
        else:
            created_at = datetime.now(timezone.utc)

        doc = {
            "_id": digest_id,
            "id": digest_id,
            "article_type": article_type,
            "article_id": article_id,
            "url": url,
            "title": title,
            "summary": summary,
            "created_at": created_at
        }
        self.db.digests.insert_one(doc)
        return doc

    def get_recent_digests(self, hours: int = 24) -> List[Dict[str, Any]]:
        cutoff_time = datetime.now(timezone.utc) - timedelta(hours=hours)
        digests = self.db.digests.find(
            {"created_at": {"$gte": cutoff_time}}
        ).sort("created_at", -1)

        return [
            {
                "id": d["id"],
                "article_type": d["article_type"],
                "article_id": d["article_id"],
                "url": d["url"],
                "title": d["title"],
                "summary": d["summary"],
                "created_at": d["created_at"]
            }
            for d in digests
        ]

    def get_all_digests(self) -> List[Dict[str, Any]]:
        digests = self.db.digests.find().sort("created_at", -1)
        return [
            {
                "id": d["id"],
                "article_type": d["article_type"],
                "article_id": d["article_id"],
                "url": d["url"],
                "title": d["title"],
                "summary": d["summary"],
                "created_at": d["created_at"]
            }
            for d in digests
        ]
