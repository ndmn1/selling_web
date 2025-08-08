"use client";

import React, { useState, useTransition } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

interface SearchProps {
  placeholder: string;
  defaultValue?: string;
  onSearch: (value: string) => void;
  isLoading?: boolean;
}

function Search({
  placeholder,
  defaultValue = "",
  onSearch,
  isLoading = false,
}: SearchProps) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(defaultValue);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      onSearch(searchTerm);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Call onSearch with empty string when clear button is pressed
  const handleClear = () => {
    setSearchTerm("");
    startTransition(() => {
      onSearch("");
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-white text-black rounded-full pl-10 pr-10 py-2 outline-none border border-gray-200 focus:border-blue-500 transition-colors"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(e);
          }
        }}
        disabled={isLoading || isPending}
      />
      <button
        type="submit"
        disabled={isLoading || isPending}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 disabled:opacity-50"
      >
        <RiSearch2Line
          className={isLoading || isPending ? "text-gray-400" : "text-gray-600"}
        />
      </button>
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading || isPending}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Clear search"
        >
          <IoMdClose />
        </button>
      )}
    </form>
  );
}

export default Search;
