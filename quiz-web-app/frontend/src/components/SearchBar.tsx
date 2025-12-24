// frontend/src/components/SearchBar.tsx
'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search quizzes...",
  className = "" 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative ${className}`}
    >
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}>
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
          isFocused ? 'text-blue-500' : 'text-gray-400'
        }`} />
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === '') onSearch('');
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium w-full md:w-auto md:absolute md:right-1 md:top-1 md:bottom-1 md:mt-0"
      >
        Search
      </button>
    </form>
  );
}