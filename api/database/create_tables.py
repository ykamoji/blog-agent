from api.database.connection import get_database

if __name__ == "__main__":

    db = get_database()
    db.youtube_videos.create_index("video_id", unique=True)
    db.openai_articles.create_index("guid", unique=True)
    db.anthropic_articles.create_index("guid", unique=True)
    db.digests.create_index("id", unique=True)
    db.digests.create_index("created_at")
    print("Indexes created successfully")
