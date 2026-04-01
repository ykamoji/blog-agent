"use client";

import ArticleList from "../components/ArticleList";
import Sidebar from "../components/Sidebar";

export default function Root() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-9xl mx-auto">

        <h1 className="text-3xl font-bold mb-1">
          AI News Dashboard
        </h1>
        <p className="text-gray-500 mb-8">
          Latest digests from YouTube, Anthropic and OpenAI
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-[1fr_320px] gap-8 items-start">
          <ArticleList />
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
