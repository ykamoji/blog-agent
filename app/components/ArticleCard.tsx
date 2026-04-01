"use client";

// @ts-ignore
export default function ArticleCard({ article }) {
  const openArticle = () => {
    window.open(article.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition flex flex-col justify-between">
      <div>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
          {article.article_type}
        </span>

        <h2 className="text-lg font-semibold mt-2 line-clamp-2">
          {article.title}
        </h2>

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {article.summary}
        </p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          {new Date(article.created_at).toLocaleDateString()}
        </span>

        <button
          onClick={openArticle}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          See more →
        </button>
      </div>
    </div>
  );
}