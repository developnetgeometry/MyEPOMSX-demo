import React from "react";
import { Input } from "../ui/input";

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    handleSearch: () => void;
    text: string
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ searchTerm, setSearchTerm, handleSearch, text }) => {
  return (
    <div className="flex items-center mb-4">
      <div className="flex-1">
        <div className="flex gap-2">
          <Input
            placeholder={`Search ${text}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
