"use client"; // Ensure this line is correct

import React from "react";
import Image from "next/image";
import searchIcon from "../../../public/images/Search Icon.svg";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="flex flex-row bg-white text-gray-700 pl-12 p-2 gap-4">
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
        className="p-2 w-full text-black placeholder:text-input-text"
      />
    </div>
  );
};

export default SearchInput;
