
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, X, Plus } from 'lucide-react';

interface TableFiltersProps {
  onSearch: (query: string) => void;
  onAddNew?: () => void;
  addNewLabel?: string;
  placeholder?: string;
}

const TableFilters: React.FC<TableFiltersProps> = ({
  onSearch,
  onAddNew,
  addNewLabel = "Bulk Load",
  placeholder = "Search..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = () => {
    onSearch(searchTerm);
  };
  
  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };
  
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex flex-1 gap-2">
        <div className="relative flex-1">
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3 pr-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={handleClear}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button 
          onClick={handleSearch} 
          size="default" 
          className="flex gap-2 items-center"
        >
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>
      
      {onAddNew && (
        <Button 
          onClick={onAddNew} 
          className="flex gap-2 items-center"
        >
          <Plus className="h-4 w-4" /> {addNewLabel}
        </Button>
      )}
    </div>
  );
};

export default TableFilters;
