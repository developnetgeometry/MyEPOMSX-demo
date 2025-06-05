import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, Printer } from "lucide-react";
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
  useAssetsWithRelations,
} from "@/hooks/queries/useAssets";
import HierarchyNode from "@/components/ui/hierarchy";

const AssetsPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetWithRelations | null>(
    null
  );
  const navigate = useNavigate();

  const { data: assets, isLoading, isError, error } = useAssetsWithRelations();
  const {
    data: assetHierarchy,
    isLoading: isHierarchyLoading,
    error: hierarchyError,
  } = useAssetHierarchy();

  const handleNodeSelect = (node: any) => {
    setSelectedNode(node);
  };

  const handleExpandAll = () => {
    // In a real application, you would implement logic to expand all nodes
    console.log("Expand all nodes");
  };

  const handleCollapseAll = () => {
    // In a real application, you would implement logic to collapse all nodes
    console.log("Collapse all nodes");
  };

  const handleAddNew = () => {
    navigate("/manage/assets/add");
  };

  const handleEdit = (item: Asset) => {
    navigate(`/manage/assets/${item.id}`);
  };

  const handleRowClick = (row: Asset) => {
    navigate(`/manage/assets/${row.id}`);
  };

  const columns: Column[] = [
    {
      id: "asset_no",
      header: "Asset No",
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
      cell: (value) => value.package_name || "-",
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
  ];

  if (isLoading) {
    return <div>Loading assets...</div>;
  }

  // If there was an error fetching the data
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
              <DataTable
                data={assets}
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
                      assetHierarchy.facilities.map((facility) => (
                        <HierarchyNode
                          key={facility.id}
                          node={facility}
                          onSelect={handleNodeSelect}
                        />
                      ))
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">
                    {selectedNode
                      ? `${
                          selectedNode.type.charAt(0).toUpperCase() +
                          selectedNode.type.slice(1)
                        } Details`
                      : "Details"}
                  </h3>

                  {selectedNode ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
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
                        <div className="p-3 bg-gray-50 rounded-md">
                          <span className="text-xs text-gray-500 block">
                            ID
                          </span>
                          <span className="text-sm font-medium">
                            {selectedNode.id}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 border rounded-md">
                        <h4 className="text-sm font-medium mb-2">Metadata</h4>
                        <p className="text-sm text-gray-500">
                          Additional information about this {selectedNode.type}{" "}
                          would be displayed here.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border rounded-md bg-muted/50 text-center">
                      <p className="text-muted-foreground">
                        Select an item from the hierarchy tree to view its
                        details
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
                          Asset Tag
                        </span>
                        <span className="text-sm font-medium">
                          {selectedAsset.asset_tag?.name || "-"}
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
                          Package
                        </span>
                        <span className="text-sm font-medium">
                          {selectedAsset.package?.package_name || "-"}
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

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Technical Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="text-xs text-gray-500 block">
                        SCE Code
                      </span>
                      <span className="text-sm font-medium">
                        {selectedAsset.asset_sce &&
                        selectedAsset.asset_sce.length > 0
                          ? selectedAsset.asset_sce[0].sce_code
                          : "-"}
                      </span>
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

export default AssetsPage;
