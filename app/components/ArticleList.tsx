"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { fetchArticles } from "../services/api";
import ArticleCard from "./ArticleCard";
import LoadingSkeleton from "./LoadingSkeleton";
import FilterDropdown from "./FilterDropdown";

const FILTER_OPTIONS = [
  { id: "youtube", label: "YouTube" },
  { id: "anthropic", label: "Anthropic" },
  { id: "openai", label: "OpenAI" },
];

export default function ArticleList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    FILTER_OPTIONS.map((opt) => opt.id)
  );

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((article: any) =>
      selectedTypes.includes(article.article_type.toLowerCase())
    );
  }, [data, selectedTypes]);

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
    return <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100"><p className="text-red-500 font-medium">Failed to load articles</p></div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100"><p className="text-gray-500 font-medium">No articles available</p></div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
        <div className="flex flex-col gap-2">
          <FilterDropdown
            options={FILTER_OPTIONS}
            selectedIds={selectedTypes}
            onChange={setSelectedTypes}
          />
        </div>
        <p className="text-sm font-medium text-gray-500 mb-2">
          Showing <span className="text-blue-600">{filteredData.length}</span> of {data.length} articles
        </p>
      </div>

      {filteredData.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredData.map((article: any) => (
            <ArticleCard key={article.article_id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-600 font-semibold text-lg">No matches found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or resetting them.</p>
          <button
            onClick={() => setSelectedTypes(FILTER_OPTIONS.map((opt) => opt.id))}
            className="mt-6 inline-flex items-center px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}