"use client";

import { useState, useRef, useEffect } from "react";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export default function FilterDropdown({ options, selectedIds, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAllSelected = selectedIds.length === options.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(options.map((opt) => opt.id));
    }
  };

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((itemId) => itemId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const getButtonText = () => {
    if (isAllSelected) return "All Types";
    if (selectedIds.length === 0) return "No Types Selected";
    if (selectedIds.length === 1) {
      return options.find((opt) => opt.id === selectedIds[0])?.label || "1 Type Selected";
    }
    return `${selectedIds.length} Types Selected`;
  };

  return (
    <div className="relative inline-block text-left mb-8" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between w-64 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:ring-gray-300 hover:bg-gray-50 transition-all duration-200 group"
          id="filter-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="flex items-center gap-2">
            <svg
              className={`w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors ${
                selectedIds.length > 0 ? "text-blue-500" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {getButtonText()}
          </span>
          <svg
            className={`-mr-1 h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute left-0 z-10 mt-2 w-64 origin-top-left rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="filter-menu-button"
        >
          <div className="p-2 space-y-1" role="none">
            {/* "All" Option */}
            <button
              onClick={toggleAll}
              className="group flex w-full items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
              role="menuitem"
            >
              <div
                className={`flex h-5 w-5 items-center justify-center rounded border transition-all duration-200 ${
                  isAllSelected
                    ? "bg-blue-600 border-blue-600 shadow-sm"
                    : "border-gray-300 bg-white group-hover:border-blue-400"
                }`}
              >
                {isAllSelected && (
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`font-semibold ${isAllSelected ? "text-blue-600" : "text-gray-900"}`}>
                All Types
              </span>
            </button>

            <div className="h-px bg-gray-100 my-1 mx-2" />

            {/* Individual Options */}
            {options.map((option) => {
              const isSelected = selectedIds.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className="group flex w-full items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  role="menuitem"
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 shadow-sm"
                        : "border-gray-300 bg-white group-hover:border-blue-400"
                    }`}
                  >
                    {isSelected && (
                      <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={isSelected ? "text-gray-900" : "text-gray-600"}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
