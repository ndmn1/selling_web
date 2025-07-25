"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize search term from URL
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);
 
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }

    // Reset to page 1 when searching
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <FaSearch className="w-4 h-4" />
      </button>
    </form>
  );
}
