import React, { useState, useMemo } from "react";
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
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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

  // Fetch inventory with store filter
  const {
    data: inventoryData = { items: [], totalCount: 0 },
    isLoading: loadingInventory,
  } = useInventoryList({
    storeId: selectedStore === "all" ? undefined : selectedStore,
    page,
    pageSize,
    searchQuery: searchQuery || undefined,
  });
  console.log(inventoryData);
  // Memoized columns configuration
  const columns = useMemo<Column[]>(
    () => [
      { id: "rackNo", header: "Rack No.", accessorKey: "rack.name" },
      { id: "itemNo", header: "Item No.", accessorKey: "item_master.item_no" },
      { id: "itemName", header: "Item Name", accessorKey: "item_master.item_name" },
      { id: "manufacturerPartsNo", header: "Manufacturer Parts No.", accessorKey: "item_master.manufacturer_part_no" },
      { id: "manufacturerName", header: "Manufacturer", accessorKey: "item_master.manu.name" },
      { id: "type", header: "Type", accessorKey: "item_master.type.name" },
      { id: "category", header: "Category", accessorKey: "item_master.category.name" },
      { id: "itemSpec", header: "Item Specification", accessorKey: "item_master.specification" },
      { id: "minLevel", header: "Min Level", accessorKey: "min_level" },
      { id: "maxLevel", header: "Max Level", accessorKey: "max_level" },
      { id: "reorderLevel", header: "Reorder Level", accessorKey: "reorder_table" },
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
  const handleStoreChange = (value: string) => {
    setSelectedStore(value);
    setPage(1); // Reset to first page when store changes
  };

  const handleRowClick = (row: any) => {
    navigate(`/manage/inventory/${row.id}`);
  };

  // Pagination controls
  const totalPages = Math.ceil(inventoryData.totalCount / pageSize);

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
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page when searching
                }}
                className="max-w-[200px]"
              />

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
          {loadingInventory ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={inventoryData.items}
                onRowClick={handleRowClick}
                // emptyMessage="No inventory items found"
              />

              {/* Pagination */}
              {inventoryData.totalCount > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1} to{" "}
                    {Math.min(page * pageSize, inventoryData.totalCount)} of{" "}
                    {inventoryData.totalCount} items
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;
