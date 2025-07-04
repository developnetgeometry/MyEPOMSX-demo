import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, Printer, X } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { Asset, AssetWithRelations } from "@/types/manage";
import { Column } from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  useAssetHierarchy,
  useAssetHierarchyNodeDetails,
  useAssetsWithRelations,
} from "@/hooks/queries/useAssets";
import HierarchyNode from "@/components/ui/hierarchy";
import { Loader2 } from "lucide-react";
import SearchFilters from "@/components/shared/SearchFilters";
import useDebounce from "@/hooks/use-debounce";

const AssetsPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetWithRelations | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search term
  
  const navigate = useNavigate();
  
  const { data: assets, isLoading, isError, error } = useAssetsWithRelations();
  const {
    data: assetHierarchy,
    isLoading: isHierarchyLoading,
    error: hierarchyError,
  } = useAssetHierarchy();

  const {
    data: nodeDetails,
    isLoading: isNodeDetailsLoading,
    error: nodeDetailsError,
  } = useAssetHierarchyNodeDetails(
    selectedNode?.type || "",
    selectedNode?.id || ""
  );

  // Memoized columns
  const columns = useMemo<Column[]>(() => [
    {
      id: "asset_no",
      header: "Asset Code",
      accessorKey: "asset_no",
    },
    {
      id: "asset_name",
      header: "Asset Name",
      accessorKey: "asset_name",
    },
    {
      id: "package",
      header: "Package",
      accessorKey: "package",
      cell: (value) => value?.package_name || "-",
    },
    {
      id: "system",
      header: "System",
      accessorKey: "system",
      cell: (value) => value.system_name || "-",
    },
    {
      id: "facility",
      header: "Facility",
      accessorKey: "facility",
      cell: (value) => value.location_name || "-",
    },
    {
      id: "asset_tag",
      header: "Asset Tag",
      accessorKey: "asset_tag",
      cell: (value) => value.name || "-",
    },
    {
      id: "asset_status",
      header: "Status",
      accessorKey: "asset_status",
      cell: (value) => <StatusBadge status={value.name || "Unknown"} />,
    },
    {
      id: "sceCode",
      header: "SCE Code",
      accessorKey: "asset_sce.sce_code",
    },
  ], []);

  // Memoized filtered assets for list view
  const filteredAssets = useMemo(() => {
    if (!assets) return [];
    
    // Handle empty search term
    if (!debouncedSearchTerm) return assets;
    
    // Ensure we have a string to work with
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    
    return assets.filter(asset => 
      (asset.asset_no || "").toLowerCase().includes(lowerSearch) ||
      (asset.asset_name || "").toLowerCase().includes(lowerSearch)
    );
  }, [assets, debouncedSearchTerm]);

  // Callbacks with useCallback
  const handleNodeSelect = useCallback((node: any) => {
    setSelectedNode(node);
    if (node.type === "asset") {
      setSelectedAsset(node);
    }
  }, []);

  const handleExpandAll = useCallback(() => {
    if (!assetHierarchy?.facilities) return;

    const collectIds = (nodes: any[]): string[] => {
      return nodes.flatMap(node => [
        String(node.id),
        ...(node.children ? collectIds(node.children) : [])
      ]);
    };

    const allIds = collectIds(assetHierarchy.facilities);
    setExpandedNodes(new Set(allIds));
  }, [assetHierarchy]);

  const handleCollapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  const handleAddNew = useCallback(() => {
    navigate("/manage/assets/add");
  }, [navigate]);

  const handleEdit = useCallback((item: Asset) => {
    navigate(`/manage/assets/${item.id}`);
  }, [navigate]);

  const handleRowClick = useCallback((row: Asset) => {
    navigate(`/manage/assets/${row.id}`);
  }, [navigate]);

  const handleCreateWorkRequest = useCallback((assetId: number) => {
    navigate("/work-orders/work-request/new", {
      state: { asset_id: assetId },
    });
  }, [navigate]);

  // Handle search - triggered on Enter key
  const handleSearch = useCallback(() => {
    // Already handled by debouncedSearchTerm
  }, []);

  // Render node details based on type
  const renderNodeDetails = useMemo(() => {
    if (!selectedNode) return null;

    if (isNodeDetailsLoading) {
      return <p className="text-sm text-gray-500">Loading details...</p>;
    }

    if (nodeDetailsError) {
      return <p className="text-sm text-red-500">Error loading details</p>;
    }

    // Simplified details rendering
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <span className="text-xs text-gray-500 block">Name</span>
            <span className="text-sm font-medium">{selectedNode.name}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <span className="text-xs text-gray-500 block">Type</span>
            <span className="text-sm font-medium capitalize">{selectedNode.type}</span>
          </div>
        </div>

        {selectedNode.type === "asset" && nodeDetails && (
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 bg-gray-50 rounded-md">
              <span className="text-xs text-gray-500 block">Asset Code</span>
              <span className="text-sm font-medium">{nodeDetails.asset_no || "-"}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <span className="text-xs text-gray-500 block">Asset Name</span>
              <span className="text-sm font-medium">{nodeDetails.asset_name || "-"}</span>
            </div>
          </div>
        )}
      </div>
    );
  }, [selectedNode, nodeDetails, isNodeDetailsLoading, nodeDetailsError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading assets: {error?.message}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assets"
        icon={<Archive className="h-6 w-6" />}
        onAddNew={handleAddNew}
      />

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="hierarchy">Asset Hierarchy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="pt-4">
              <SearchFilters
                text="Asset"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
              />
              
              <DataTable
                data={filteredAssets}
                columns={columns}
                onEdit={handleEdit}
                onRowClick={handleRowClick}
              />
            </TabsContent>
            
            <TabsContent value="hierarchy" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Hierarchy</h3>
                    <div className="flex space-x-2">
                      <button
                        className="text-xs text-blue-500 hover:underline"
                        onClick={handleExpandAll}
                      >
                        Expand All
                      </button>
                      <button
                        className="text-xs text-blue-500 hover:underline"
                        onClick={handleCollapseAll}
                      >
                        Collapse All
                      </button>
                    </div>
                  </div>

                  <div className="border rounded-md p-2 h-[calc(100vh-350px)] overflow-auto">
                    {isHierarchyLoading ? (
                      <div>Loading hierarchy...</div>
                    ) : (
                      assetHierarchy?.facilities?.map((facility) => (
                        <HierarchyNode
                          key={facility.id}
                          node={facility}
                          onSelect={handleNodeSelect}
                          expandedNodes={expandedNodes}
                          setExpandedNodes={setExpandedNodes}
                        />
                      ))
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">
                    {selectedNode
                      ? `${selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)} Details`
                      : "Details"}
                  </h3>

                  {selectedNode ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-md">
                          <span className="text-xs text-gray-500 block">
                            Name
                          </span>
                          <span className="text-sm font-medium">
                            {selectedNode.name}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <span className="text-xs text-gray-500 block">
                            Type
                          </span>
                          <span className="text-sm font-medium capitalize">
                            {selectedNode.type}
                          </span>
                        </div>
                        {selectedNode.type === "asset" && (
                          <div className="flex justify-end">
                            <Button
                              variant="default"
                              onClick={() =>
                                handleCreateWorkRequest(selectedNode.id)
                              }
                            >
                              Create Work Request
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="p-4 border rounded-md">
                        <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
                          <span>Metadata</span>
                          {isNodeDetailsLoading && (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          )}
                        </h4>
                        {renderNodeDetails}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border rounded-md bg-muted/50 text-center">
                      <p className="text-muted-foreground">
                        Select an item from the hierarchy tree to view its details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Asset Details Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b border-gray-200 pb-4">
            <DrawerTitle className="text-xl font-semibold">
              {selectedAsset?.asset_name || "Asset Details"}
            </DrawerTitle>
            <DrawerDescription>
              Asset ID: {selectedAsset?.asset_no}
            </DrawerDescription>
          </DrawerHeader>

          {selectedAsset && (
            <div className="px-4 py-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Asset Information
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-xs text-gray-500 block">
                          Asset Name
                        </span>
                        <span className="text-sm font-medium">
                          {selectedAsset.asset_name}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-xs text-gray-500 block">
                          Status
                        </span>
                        <StatusBadge
                          status={selectedAsset.asset_status?.name || "Unknown"}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Location Information
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-xs text-gray-500 block">
                          System
                        </span>
                        <span className="text-sm font-medium">
                          {selectedAsset.system?.system_name || "-"}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-xs text-gray-500 block">
                          Facility
                        </span>
                        <span className="text-sm font-medium">
                          {selectedAsset.facility?.location_name || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DrawerFooter className="border-t border-gray-200 pt-4">
            <div className="flex justify-between w-full">
              <Button
                onClick={() => {
                  if (selectedAsset) handleEdit(selectedAsset);
                  setIsDrawerOpen(false);
                }}
                variant="outline"
              >
                Edit Asset
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log("Print asset details")}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Details
              </Button>
            </div>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default React.memo(AssetsPage);