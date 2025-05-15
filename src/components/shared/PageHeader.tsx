
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onAddNew?: () => void;
  addNewLabel?: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  breadcrumbOverride?: BreadcrumbItem[];
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  onAddNew,
  addNewLabel = "+ Add New",
  onSearch,
  searchPlaceholder = "Search...",
  actions,
  breadcrumbOverride,
  children
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-3">
            {icon && <div className="flex items-center justify-center rounded-lg p-2 bg-primary/10 text-primary">{icon}</div>}
            <div>
              <h1 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          {onSearch && (
            <div className="relative">
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full sm:w-64"
              />
              <Button
                className="absolute right-0 top-0 rounded-l-none"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          )}
          
          {onAddNew && (
            <Button
              onClick={onAddNew}
              className="flex gap-2 items-center"
            >
              <Plus className="h-4 w-4" /> {addNewLabel}
            </Button>
          )}
          
          {actions}
        </div>
      </div>
      
      {children}
    </div>
  );
};

export default PageHeader;
