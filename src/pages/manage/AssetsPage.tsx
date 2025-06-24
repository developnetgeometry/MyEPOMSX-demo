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

const AssetsPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [workRequestData, setWorkRequestData] = useState<any | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetWithRelations | null>(
    null
  );
  const navigate = useNavigate();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
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

  const handleCreateWorkRequest = (assetId: number) => {
    navigate("/work-orders/work-request/new", {
      state: { asset_id: assetId },
    });
  };

  const handleFormSubmit = async (formData: any) => {};

  const columns: Column[] = [
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
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If there was an error fetching the data
  if (isError) {
    return <div>Error loading assets: {error?.message}</div>;
  }

};

export default AssetsPage;
