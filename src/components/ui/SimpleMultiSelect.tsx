// components/ui/SimpleMultiSelect.tsx
import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options?: Option[]; // Make optional
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  label?: string;
}

export function SimpleMultiSelect({
  options = [], // Default to empty array
  selected = [],
  onChange,
  placeholder = "Select options",
  className,
  icon,
  label,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Safe filtering with fallback
  const filteredOptions = React.useMemo(() => {
    if (!options || !Array.isArray(options)) return [];
    return options.filter((option) =>
      option?.label?.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  // Show loading state if options are not loaded yet
  if (!options || options.length === 0) {
    return (
      <div className={cn("flex flex-col space-y-1", className)}>
        {label && (
          <label className="text-xs font-medium text-muted-foreground">
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm",
            "text-muted-foreground"
          )}
        >
          <span>Loading options...</span>
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {label && (
        <label className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            role="combobox"
            aria-expanded={open}
            className={cn(
              "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "cursor-pointer",
              selected.length > 0 && "border-primary/30 bg-primary/5",
              "transition-all duration-200"
            )}
          >
            <div className="flex items-center truncate">
              {icon && (
                <span className="mr-2 shrink-0 text-muted-foreground">
                  {icon}
                </span>
              )}
              {selected.length > 0 ? (
                <div className="flex gap-1 items-center max-w-[250px] overflow-hidden">
                  {selected.length <= 2 ? (
                    selected.map((value) => {
                      const option = options.find((opt) => opt.value === value);
                      return (
                        <Badge
                          key={value}
                          variant="secondary"
                          className="mr-1 truncate max-w-[200px]"
                          onClick={(e) => handleRemove(value, e)}
                        >
                          {option?.label || value}
                        </Badge>
                      );
                    })
                  ) : (
                    <Badge variant="secondary" className="font-medium">
                      {selected.length} selected
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <div className="flex items-center">
              {selected.length > 0 && (
                <div
                  onClick={clearAll}
                  className="h-auto p-0 px-1 mr-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </div>
              )}
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0 shadow-lg shadow-primary/10 border-primary/20">
          <div className="p-1">
            <div className="relative mb-1">
              <input
                type="text"
                placeholder="Search options..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="max-h-64 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="py-2 text-center text-sm text-muted-foreground">
                  {search ? "No options found" : "No options available"}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        handleSelect(option.value);
                        setSearch("");
                      }}
                      className={cn(
                        "flex items-center gap-2 p-2 text-sm rounded-sm cursor-pointer",
                        "hover:bg-accent hover:text-accent-foreground",
                        selected.includes(option.value) && "bg-accent/50"
                      )}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                          selected.includes(option.value)
                            ? "bg-primary border-primary"
                            : "opacity-50"
                        )}
                      >
                        {selected.includes(option.value) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
