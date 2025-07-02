import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/formatters";
import {
  useInventoryList,
  useStoreOptions,
} from "@/hooks/queries/useInventory";
import DataTable, { Column } from "@/components/shared/DataTable";
import SearchFilters from "@/components/shared/SearchFilters";
import useDebounce from "@/hooks/use-debounce";

interface InventoryPageProps {
  hideHeader?: boolean;
  onRowClick?: (row: any) => void;
}

const InventoryPage: React.FC<InventoryPageProps> = ({
  hideHeader = false,
  onRowClick,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Increase debounce time to 500ms
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Track if this is the initial load
  const hasLoadedOnce = useRef(false);

  // Fetch stores for dropdown
  const { data: storeOptions = [], isLoading: loadingStores } =
    useStoreOptions();

  // Create store map for efficient lookups
  const storeMap = useMemo(() => {
    return storeOptions.reduce((acc: Record<string, string>, store) => {
      acc[store.id] = store.name;
      return acc;
    }, {});
  }, [storeOptions]);

  const {
    data: inventoryData = { items: [], totalCount: 0 },
    isLoading: loadingInventory,
    isFetching: isFetchingInventory,
  } = useInventoryList({
    storeId: selectedStore === "all" ? undefined : selectedStore,
    page: 1,
    pageSize: 500, // fetch a large enough number for frontend filtering
  });

  const filteredItems = useMemo(() => {
    if (!debouncedSearchQuery) return inventoryData.items;
    const q = debouncedSearchQuery.toLowerCase();
    return inventoryData.items.filter((item) => {
      const itemName = item.item_master?.item_name?.toLowerCase() || "";
      const itemNo = item.item_master?.item_no?.toLowerCase() || "";
      const manuPartNo =
        item.item_master?.manufacturer_part_no?.toLowerCase() || "";
      return (
        itemName.includes(q) || itemNo.includes(q) || manuPartNo.includes(q)
      );
    });
  }, [inventoryData.items, debouncedSearchQuery]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  // Mark as loaded once we have data
  useEffect(() => {
    if (
      inventoryData.items.length > 0 ||
      (!loadingInventory && hasLoadedOnce.current === false)
    ) {
      hasLoadedOnce.current = true;
    }
  }, [inventoryData.items, loadingInventory]);

  // Reset to first page when store or search term changes
  useEffect(() => {
    setPage(1);
  }, [selectedStore, debouncedSearchQuery]);

  // Memoized columns configuration
  const columns = useMemo<Column[]>(
    () => [
      { id: "rackNo", header: "Rack No.", accessorKey: "rack.name" },
      { id: "itemNo", header: "Item No.", accessorKey: "item_master.item_no" },
      {
        id: "itemName",
        header: "Item Name",
        accessorKey: "item_master.item_name",
      },
      {
        id: "manufacturerPartsNo",
        header: "Manufacturer Parts No.",
        accessorKey: "item_master.manufacturer_part_no",
      },
      {
        id: "manufacturerName",
        header: "Manufacturer",
        accessorKey: "item_master.manu.name",
      },
      { id: "type", header: "Type", accessorKey: "item_master.type.name" },
      {
        id: "category",
        header: "Category",
        accessorKey: "item_master.category.name",
      },
      {
        id: "itemSpec",
        header: "Item Specification",
        accessorKey: "item_master.specification",
      },
      { id: "minLevel", header: "Min Level", accessorKey: "min_level" },
      { id: "maxLevel", header: "Max Level", accessorKey: "max_level" },
      {
        id: "reorderLevel",
        header: "Reorder Level",
        accessorKey: "reorder_table",
      },
      {
        id: "storeId",
        header: "Store",
        accessorKey: "store_id",
        cell: (value) => <span>{storeMap[value] || "Unknown Store"}</span>,
      },
      {
        id: "balance",
        header: "Balance",
        accessorKey: "current_balance",
        cell: (value) => <span className="font-medium">{value}</span>,
      },
      {
        id: "unitPrice",
        header: "Unit Price",
        accessorKey: "unit_price",
        cell: (value) => <span>{formatCurrency(value)}</span>,
      },
      {
        id: "totalPrice",
        header: "Total Price",
        accessorKey: "total_price",
        cell: (value) => <span>{formatCurrency(value)}</span>,
      },
    ],
    [storeMap]
  );

  // Handle store change
  const handleStoreChange = useCallback((value: string) => {
    setSelectedStore(value);
  }, []);

  const handleRowClick = useCallback(
    (row: any) => {
      if (onRowClick) {
        onRowClick(row);
      } else {
        navigate(`/manage/inventory/${row.id}`);
      }
    },
    [navigate, onRowClick]
  );

  // Handle search - no-op since filtering is automatic
  const handleSearch = useCallback(() => {
    // Already handled by debouncedSearchQuery
  }, []);

  // Determine if we should show skeleton (only on initial load)
  const shouldShowSkeleton = loadingInventory && !hasLoadedOnce.current;

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <header className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Inventory Management</h1>
              <p className="text-muted-foreground">
                Manage spare parts inventory
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2">
              <Select
                value={selectedStore}
                onValueChange={handleStoreChange}
                disabled={loadingStores}
              >
                <SelectTrigger className="w-[150px]">
                  {loadingStores ? (
                    <Skeleton className="h-4 w-[100px]" />
                  ) : (
                    <SelectValue placeholder="Select store" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {storeOptions.map((store) => (
                    <SelectItem key={store.id} value={String(store.id)}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => navigate("/manage/inventory/add")}>
              Add New Item
            </Button>
          </div>
        </header>
      )}

      <Card>
        <CardContent className="p-0">
          {/* Show loading skeleton only on initial load */}
          {shouldShowSkeleton ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border-b">
                <SearchFilters
                  text="Search by item name, item number, or manufacturer part number"
                  searchTerm={searchQuery}
                  setSearchTerm={setSearchQuery}
                  handleSearch={handleSearch}
                />
              </div>

              {/* Show small loading indicator during searches */}
              {isFetchingInventory && (
                <div className="h-1 w-full bg-blue-500 animate-pulse"></div>
              )}

              <DataTable
                columns={columns}
                data={paginatedItems}
                onRowClick={handleRowClick}
              />

              {filteredItems.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1} to{" "}
                    {Math.min(page * pageSize, filteredItems.length)} of{" "}
                    {filteredItems.length} items
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(InventoryPage);
