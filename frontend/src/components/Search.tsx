"use client";
import React, { useState } from "react";
import { RiSearch2Line } from "react-icons/ri";

function Search({ handleSearch }: { handleSearch: (searchTerm: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };
  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full bg-white text-black rounded-full pl-10 pr-4 py-2 outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
      <button onClick={handleClick} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500">
        <RiSearch2Line color="black" />
      </button>
    </div>
  );
}

export default Search;
