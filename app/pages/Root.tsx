"use client";

import ArticleList from "../components/ArticleList";
import EmailActionBar from "../components/EmailActionBar";

export default function Root() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          AI News Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Latest AI articles and backend actions
        </p>

        <EmailActionBar />

        <ArticleList />
      </div>
    </div>
  );
}