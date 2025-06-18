import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WorkRequestDialogForm from "../work-orders/work-request/WorkRequestDialogForm";

const AssetsPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isWorkRequestDialogOpen, setIsWorkRequestDialogOpen] = useState(false);
  const [workRequestData, setWorkRequestData] = useState<any | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetWithRelations | null>(
    null
  );
  const navigate = useNavigate();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set()
  );
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

  const handleNodeSelect = (node: any) => {
    setSelectedNode(node);

    // If the selected node is an asset, we could optionally navigate directly to its detail page
    // or show a button to navigate in the metadata section
    if (node.type === "asset") {
      // Option 1: Direct navigation (commented out)
      // navigate(`/manage/assets/${node.id}`);
      // Option 2: Just set selected node to show details in the sidebar
      // This is already done with setSelectedNode(node) above
    }
  };

  const handleExpandAll = () => {
  const collectIds = (nodes: any[]): string[] => {
    let ids: string[] = [];
    nodes.forEach((node) => {
      ids.push(String(node.id)); // Ensure string
      if (node.children && node.children.length > 0) {
        ids = ids.concat(collectIds(node.children));
      }
    });
    return ids;
  };
  if (assetHierarchy && assetHierarchy.facilities) {
    const allIds = collectIds(assetHierarchy.facilities);
    setExpandedNodes(new Set(allIds));
  }
};

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
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

  const handleCreateWorkRequest = () => {
    if (selectedNode && selectedNode.type === "asset" && nodeDetails) {
      setWorkRequestData({
        facility_id: nodeDetails.facility_id,
        system_id: nodeDetails.system_id,
        package_id: nodeDetails.package_id,
        asset_id: nodeDetails.id,
        asset_sce_id: nodeDetails.asset_sce?.id || "",
      });
    }
    setIsWorkRequestDialogOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {};

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
                      ? `${
                          selectedNode.type.charAt(0).toUpperCase() +
                          selectedNode.type.slice(1)
                        } Details`
                      : "Details"}
                  </h3>

                  {selectedNode ? (
                    <div className="space-y-4">
                      <div
                        className={
                          selectedNode.type === "asset"
                            ? "grid grid-cols-3 gap-4"
                            : "grid grid-cols-2 gap-4"
                        }
                      >
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
                              onClick={() => handleCreateWorkRequest()}
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

                        {isNodeDetailsLoading ? (
                          <p className="text-sm text-gray-500">
                            Loading details...
                          </p>
                        ) : nodeDetailsError ? (
                          <p className="text-sm text-red-500">
                            Error loading details
                          </p>
                        ) : (
                          <>
                            {selectedNode.type === "package" && nodeDetails && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="p-2 bg-gray-50 rounded-md">
                                    <span className="text-xs text-gray-500 block">
                                      Package Code
                                    </span>
                                    <span className="text-sm font-medium">
                                      {nodeDetails.package_code || "-"}
                                    </span>
                                  </div>
                                  <div className="p-2 bg-gray-50 rounded-md">
                                    <span className="text-xs text-gray-500 block">
                                      Total Assets
                                    </span>
                                    <span className="text-sm font-medium">
                                      {nodeDetails.assets?.length || 0}
                                    </span>
                                  </div>
                                </div>

                                {/* Package Assets Summary */}
                                {nodeDetails.assets &&
                                  nodeDetails.assets.length > 0 && (
                                    <div className="mt-4">
                                      <h5 className="text-xs font-medium text-gray-500 mb-2">
                                        Assets in this Package
                                      </h5>
                                      <div className="border rounded-md divide-y divide-gray-100 overflow-hidden">
                                        {nodeDetails.assets.map(
                                          (asset: any) => (
                                            <div
                                              key={asset.id}
                                              className="p-3 text-sm hover:bg-gray-50"
                                            >
                                              <div className="flex justify-between mb-1">
                                                <span className="font-medium">
                                                  {asset.asset_name ||
                                                    asset.asset_no}
                                                </span>
                                                {asset.asset_status ? (
                                                  <StatusBadge
                                                    status={
                                                      asset.asset_status.name
                                                    }
                                                  />
                                                ) : null}
                                              </div>
                                              <div className="grid grid-cols-2 gap-1 mt-2">
                                                {asset.asset_detail
                                                  ?.manufacturer?.name && (
                                                  <div>
                                                    <span className="text-xs text-gray-500 block">
                                                      Manufacturer
                                                    </span>
                                                    <span className="text-xs">
                                                      {
                                                        asset.asset_detail
                                                          .manufacturer.name
                                                      }
                                                    </span>
                                                  </div>
                                                )}
                                                {asset.asset_detail?.model && (
                                                  <div>
                                                    <span className="text-xs text-gray-500 block">
                                                      Model
                                                    </span>
                                                    <span className="text-xs">
                                                      {asset.asset_detail.model}
                                                    </span>
                                                  </div>
                                                )}
                                                {asset.asset_detail
                                                  ?.serial_number && (
                                                  <div>
                                                    <span className="text-xs text-gray-500 block">
                                                      Serial Number
                                                    </span>
                                                    <span className="text-xs">
                                                      {
                                                        asset.asset_detail
                                                          .serial_number
                                                      }
                                                    </span>
                                                  </div>
                                                )}
                                                {asset.asset_detail?.type
                                                  ?.name && (
                                                  <div>
                                                    <span className="text-xs text-gray-500 block">
                                                      Type
                                                    </span>
                                                    <span className="text-xs">
                                                      {
                                                        asset.asset_detail.type
                                                          .name
                                                      }
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Asset Distribution by Category/Type */}
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500 mb-2">
                                    Asset Distribution
                                  </h5>
                                  <div className="grid grid-cols-1 gap-1">
                                    {nodeDetails.assets &&
                                      Array.from(
                                        new Set(
                                          nodeDetails.assets
                                            .filter(
                                              (asset: any) =>
                                                asset.asset_detail?.type
                                                  ?.category?.name
                                            )
                                            .map(
                                              (asset: any) =>
                                                asset.asset_detail.type.category
                                                  .name
                                            )
                                        )
                                      ).map((category: string) => {
                                        const count = nodeDetails.assets.filter(
                                          (asset: any) =>
                                            asset.asset_detail?.type?.category
                                              ?.name === category
                                        ).length;

                                        return (
                                          <div
                                            key={category}
                                            className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                                          >
                                            <span className="text-xs">
                                              {category}
                                            </span>
                                            <span className="text-xs font-medium">
                                              {count}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    {(!nodeDetails.assets ||
                                      nodeDetails.assets.length === 0) && (
                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500">
                                          No category data available
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Asset Distribution by Status */}
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500 mb-2">
                                    Assets by Status
                                  </h5>
                                  <div className="grid grid-cols-1 gap-1">
                                    {nodeDetails.statistics?.assetsByStatus &&
                                      Object.entries(
                                        nodeDetails.statistics.assetsByStatus
                                      ).map(([status, count]) => (
                                        <div
                                          key={status}
                                          className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                                        >
                                          <div className="flex items-center">
                                            <div
                                              className={`w-2 h-2 rounded-full mr-2 ${
                                                status === "Operational"
                                                  ? "bg-green-500"
                                                  : status ===
                                                    "Under Maintenance"
                                                  ? "bg-orange-500"
                                                  : status === "Out of Service"
                                                  ? "bg-red-500"
                                                  : "bg-gray-500"
                                              }`}
                                            ></div>
                                            <span className="text-xs">
                                              {status}
                                            </span>
                                          </div>
                                          <span className="text-xs font-medium">
                                            {count}
                                          </span>
                                        </div>
                                      ))}
                                    {(!nodeDetails.statistics?.assetsByStatus ||
                                      Object.keys(
                                        nodeDetails.statistics?.assetsByStatus
                                      ).length === 0) && (
                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500">
                                          No status data available
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Recent Assets List (showing just first 5) */}
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500 mb-2">
                                    Recent Assets
                                  </h5>
                                  <div className="grid grid-cols-1 gap-1 max-h-[200px] overflow-y-auto">
                                    {nodeDetails.assets &&
                                      nodeDetails.assets
                                        .slice(0, 5)
                                        .map((asset: any) => (
                                          <div
                                            key={asset.id}
                                            className="p-2 bg-gray-50 rounded-md"
                                          >
                                            <div className="flex justify-between">
                                              <span className="text-xs font-medium">
                                                {asset.asset_name ||
                                                  asset.asset_no}
                                              </span>
                                              <StatusBadge
                                                status={
                                                  asset.asset_status?.name ||
                                                  "Unknown"
                                                }
                                              />
                                            </div>
                                            <span className="text-xs text-gray-500 block mt-1">
                                              {asset.asset_detail?.category
                                                ?.name || "Uncategorized"}{" "}
                                              •
                                              {asset.asset_detail?.manufacturer
                                                ?.name ||
                                                "Unknown Manufacturer"}
                                            </span>
                                          </div>
                                        ))}
                                    {(!nodeDetails.assets ||
                                      nodeDetails.assets.length === 0) && (
                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500">
                                          No assets in this package
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {selectedNode.type === "facility" &&
                              nodeDetails && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="p-2 bg-gray-50 rounded-md">
                                    <span className="text-xs text-gray-500 block">
                                      Location Name
                                    </span>
                                    <span className="text-sm font-medium">
                                      {nodeDetails.location_name || "-"}
                                    </span>
                                  </div>
                                  <div className="p-2 bg-gray-50 rounded-md">
                                    <span className="text-xs text-gray-500 block">
                                      Location Code
                                    </span>
                                    <span className="text-sm font-medium">
                                      {nodeDetails.location_code || "-"}
                                    </span>
                                  </div>
                                  <div className="p-2 bg-gray-50 rounded-md">
                                    <span className="text-xs text-gray-500 block">
                                      Address
                                    </span>
                                    <span className="text-sm font-medium">
                                      {nodeDetails.address || "-"}
                                    </span>
                                  </div>
                                </div>
                              )}

                            {selectedNode.type === "system" && nodeDetails && (
                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-2 bg-gray-50 rounded-md">
                                  <span className="text-xs text-gray-500 block">
                                    System Name
                                  </span>
                                  <span className="text-sm font-medium">
                                    {nodeDetails.system_name || "-"}
                                  </span>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-md">
                                  <span className="text-xs text-gray-500 block">
                                    System Code
                                  </span>
                                  <span className="text-sm font-medium">
                                    {nodeDetails.system_code || "-"}
                                  </span>
                                </div>
                              </div>
                            )}

                            {selectedNode.type === "asset" && nodeDetails && (
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="p-2 bg-gray-50 rounded-md">
                                    <span className="text-xs text-gray-500 block">
                                      Asset Name
                                    </span>
                                    <span className="text-sm font-medium">
                                      {nodeDetails.asset_name || "-"}
                                    </span>
                                  </div>
                                  <div className="p-2 bg-gray-50 rounded-md">
                                    <span className="text-xs text-gray-500 block">
                                      Asset No
                                    </span>
                                    <span className="text-sm font-medium">
                                      {nodeDetails.asset_no || "-"}
                                    </span>
                                  </div>
                                  <div className="p-2 bg-gray-50 rounded-md">
                                    <span className="text-xs text-gray-500 block">
                                      Status
                                    </span>
                                    <StatusBadge
                                      status={
                                        nodeDetails.asset_status?.name ||
                                        "Unknown"
                                      }
                                    />
                                  </div>
                                  <div className="p-2 bg-gray-50 rounded-md">
                                    <span className="text-xs text-gray-500 block">
                                      Commission Date
                                    </span>
                                    <span className="text-sm font-medium">
                                      {nodeDetails.commission_date
                                        ? new Date(
                                            nodeDetails.commission_date
                                          ).toLocaleDateString()
                                        : "-"}
                                    </span>
                                  </div>
                                </div>

                                {nodeDetails.asset_detail && (
                                  <div>
                                    <h5 className="text-xs font-medium text-gray-500 mb-2">
                                      Asset Technical Information
                                    </h5>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500 block">
                                          Category
                                        </span>
                                        <span className="text-sm font-medium">
                                          {nodeDetails.asset_detail.type
                                            ?.category?.name || "-"}
                                        </span>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500 block">
                                          Type
                                        </span>
                                        <span className="text-sm font-medium">
                                          {nodeDetails.asset_detail.type
                                            ?.name || "-"}
                                        </span>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500 block">
                                          Manufacturer
                                        </span>
                                        <span className="text-sm font-medium">
                                          {nodeDetails.asset_detail.manufacturer
                                            ?.name || "-"}
                                        </span>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500 block">
                                          Model
                                        </span>
                                        <span className="text-sm font-medium">
                                          {nodeDetails.asset_detail.model ||
                                            "-"}
                                        </span>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500 block">
                                          Serial Number
                                        </span>
                                        <span className="text-sm font-medium">
                                          {nodeDetails.asset_detail
                                            .serial_number || "-"}
                                        </span>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500 block">
                                          Area
                                        </span>
                                        <span className="text-sm font-medium">
                                          {nodeDetails.asset_detail.area
                                            ?.name || "-"}
                                        </span>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500 block">
                                          Asset Class
                                        </span>
                                        <span className="text-sm font-medium">
                                          {nodeDetails.asset_detail.asset_class
                                            ?.name || "-"}
                                        </span>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500 block">
                                          Maker Number
                                        </span>
                                        <span className="text-sm font-medium">
                                          {nodeDetails.asset_detail.maker_no ||
                                            "-"}
                                        </span>
                                      </div>

                                      <div className="p-2 bg-gray-50 rounded-md col-span-2">
                                        <span className="text-xs text-gray-500 block">
                                          Specification
                                        </span>
                                        <span className="text-sm font-medium">
                                          {nodeDetails.asset_detail
                                            .specification || "-"}
                                        </span>
                                      </div>

                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500 block">
                                          Integrity Critical
                                        </span>
                                        <span className="text-sm font-medium">
                                          {nodeDetails.asset_detail.is_integrity
                                            ? "Yes"
                                            : "No"}
                                        </span>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded-md">
                                        <span className="text-xs text-gray-500 block">
                                          Reliability Critical
                                        </span>
                                        <span className="text-sm font-medium">
                                          {nodeDetails.asset_detail
                                            .is_reliability
                                            ? "Yes"
                                            : "No"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {nodeDetails.asset_installation && (
                                  <div className="mt-4">
                                    <h5 className="text-xs font-medium text-gray-500 mb-2">
                                      Installation Information
                                    </h5>
                                    <div className="grid grid-cols-2 gap-3">
                                      {nodeDetails.asset_installation
                                        .actual_installation_date && (
                                        <div className="p-2 bg-gray-50 rounded-md">
                                          <span className="text-xs text-gray-500 block">
                                            Installation Date
                                          </span>
                                          <span className="text-sm font-medium">
                                            {new Date(
                                              nodeDetails.asset_installation.actual_installation_date
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                      )}
                                      {nodeDetails.asset_installation
                                        .actual_startup_date && (
                                        <div className="p-2 bg-gray-50 rounded-md">
                                          <span className="text-xs text-gray-500 block">
                                            Startup Date
                                          </span>
                                          <span className="text-sm font-medium">
                                            {new Date(
                                              nodeDetails.asset_installation.actual_startup_date
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                      )}
                                      {nodeDetails.asset_installation
                                        .warranty_date && (
                                        <div className="p-2 bg-gray-50 rounded-md">
                                          <span className="text-xs text-gray-500 block">
                                            Warranty Date
                                          </span>
                                          <span className="text-sm font-medium">
                                            {new Date(
                                              nodeDetails.asset_installation.warranty_date
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                      )}
                                      {nodeDetails.asset_installation
                                        .drawing_no && (
                                        <div className="p-2 bg-gray-50 rounded-md">
                                          <span className="text-xs text-gray-500 block">
                                            Drawing No
                                          </span>
                                          <span className="text-sm font-medium">
                                            {
                                              nodeDetails.asset_installation
                                                .drawing_no
                                            }
                                          </span>
                                        </div>
                                      )}

                                      {nodeDetails.asset_installation
                                        .orientation && (
                                        <div className="p-2 bg-gray-50 rounded-md">
                                          <span className="text-xs text-gray-500 block">
                                            Orientation
                                          </span>
                                          <span className="text-sm font-medium">
                                            {
                                              nodeDetails.asset_installation
                                                .orientation
                                            }
                                          </span>
                                        </div>
                                      )}

                                      {(nodeDetails.asset_installation
                                        .overall_height ||
                                        nodeDetails.asset_installation
                                          .overall_length ||
                                        nodeDetails.asset_installation
                                          .overall_width) && (
                                        <div className="p-2 bg-gray-50 rounded-md">
                                          <span className="text-xs text-gray-500 block">
                                            Dimensions (H×L×W)
                                          </span>
                                          <span className="text-sm font-medium">
                                            {nodeDetails.asset_installation
                                              .overall_height || "-"}
                                            ×
                                            {nodeDetails.asset_installation
                                              .overall_length || "-"}
                                            ×
                                            {nodeDetails.asset_installation
                                              .overall_width || "-"}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {nodeDetails.asset_detail?.child_assets &&
                                  nodeDetails.asset_detail.child_assets.length >
                                    0 && (
                                    <div className="mt-4">
                                      <h5 className="text-xs font-medium text-gray-500 mb-2">
                                        Child Assets (
                                        {
                                          nodeDetails.asset_detail.child_assets
                                            .length
                                        }
                                        )
                                      </h5>
                                      <div className="border rounded-md divide-y divide-gray-100 overflow-hidden">
                                        {nodeDetails.asset_detail.child_assets.map(
                                          (childAsset: any) => (
                                            <div
                                              key={childAsset.id}
                                              className="p-2 text-sm hover:bg-gray-50"
                                            >
                                              <div className="flex justify-between items-center">
                                                <span className="font-medium">
                                                  {childAsset.asset
                                                    ?.asset_name ||
                                                    childAsset.asset
                                                      ?.asset_no ||
                                                    "-"}
                                                </span>
                                                {childAsset.asset
                                                  ?.asset_status && (
                                                  <StatusBadge
                                                    status={
                                                      childAsset.asset
                                                        .asset_status.name
                                                    }
                                                  />
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {nodeDetails.asset_sce &&
                                  nodeDetails.asset_sce.length > 0 && (
                                    <div className="mt-4">
                                      <h5 className="text-xs font-medium text-gray-500 mb-2">
                                        SCE Information
                                      </h5>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="p-2 bg-gray-50 rounded-md">
                                          <span className="text-xs text-gray-500 block">
                                            SCE Code
                                          </span>
                                          <span className="text-sm font-medium">
                                            {nodeDetails.asset_sce[0]
                                              .sce_code || "-"}
                                          </span>
                                        </div>
                                        <div className="p-2 bg-gray-50 rounded-md">
                                          <span className="text-xs text-gray-500 block">
                                            Group Name
                                          </span>
                                          <span className="text-sm font-medium">
                                            {nodeDetails.asset_sce[0]
                                              .group_name || "-"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            )}

                            {selectedNode.type !== "facility" &&
                              selectedNode.type !== "system" &&
                              selectedNode.type !== "package" &&
                              selectedNode.type !== "asset" && (
                                <p className="text-sm text-gray-500">
                                  Additional information about this{" "}
                                  {selectedNode.type} would be displayed here.
                                </p>
                              )}
                          </>
                        )}
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

      <Dialog
        open={isWorkRequestDialogOpen}
        onOpenChange={(open) => {
          setIsWorkRequestDialogOpen(open);
          if (!open) setWorkRequestData(null);
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>Add New Work Request</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new work request.
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWorkRequestDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <WorkRequestDialogForm
            initialData={workRequestData}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsWorkRequestDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetsPage;
