"use client"; // Ensure this line is correct

import React from "react";
import Image from "next/image";
import searchIcon from "../../../public/images/SearchIcon.svg";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="flex flex-row w-fit bg-white text-gray-700 pl-12 py-2 gap-8">
      <Image
        src={searchIcon as string}
        alt="Search Icon"
        width={24}
        height={24}
      />
      <input
        type="text"
        placeholder="Search projects or databases"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 min-w-[324px] w-full text-black placeholder:text-input-text outline-none"
      />
    </div>
  );
};

export default SearchInput;
