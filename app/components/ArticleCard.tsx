"use client";

const categoryStyles: Record<string, { gradient: string; icon: string; label: string }> = {
  youtube: {
    gradient: "from-red-500 to-red-600",
    icon: "\u25B6",
    label: "YouTube",
  },
  anthropic: {
    gradient: "from-orange-400 to-amber-500",
    icon: "\u2728",
    label: "Anthropic",
  },
  openai: {
    gradient: "from-emerald-500 to-teal-600",
    icon: "\u2B21",
    label: "OpenAI",
  },
};

interface Article {
  article_id: string;
  article_type: string;
  title: string;
  summary: string;
  url: string;
  created_at: string;
}

export default function ArticleCard({ article }: { article: Article }) {
  const style = categoryStyles[article.article_type.toLowerCase()] ?? {
    gradient: "from-gray-400 to-gray-500",
    icon: "\u25CF",
    label: article.article_type,
  };

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className={`bg-gradient-to-r ${style.gradient} px-5 py-4 flex items-center gap-2`}>
        <span className="text-white text-lg">{style.icon}</span>
        <span className="text-white text-sm font-semibold tracking-wide uppercase">
          {style.label}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h2>

        <p className="text-sm text-gray-500 mt-2 flex-1">
          {article.summary}
        </p>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {new Date(article.created_at).toLocaleDateString()}
          </span>
          <span className="text-blue-600 text-sm font-medium group-hover:translate-x-0.5 transition-transform">
            Read more &rarr;
          </span>
        </div>
      </div>
    </a>
  );
}
