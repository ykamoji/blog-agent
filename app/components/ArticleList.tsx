"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "../services/api";
import ArticleCard from "./ArticleCard";
import LoadingSkeleton from "./LoadingSkeleton";

export default function ArticleList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Failed to load articles</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-gray-500">No articles available</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {data.map((article: any) => (
        <ArticleCard key={article.article_id} article={article} />
      ))}
    </div>
  );
}