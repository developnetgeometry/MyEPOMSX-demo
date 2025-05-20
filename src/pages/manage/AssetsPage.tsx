
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Archive, ChevronDown, ChevronRight, Printer } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { assets, packages, systems, facilityLocations, assetHierarchy } from '@/data/sampleData';
import { Asset, AssetWithRelations } from '@/types/manage';
import ManageDialog from '@/components/manage/ManageDialog';
import { Column } from '@/components/shared/DataTable';
import * as z from 'zod';
import StatusBadge from '@/components/shared/StatusBadge';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { useAssets, useAssetsWithRelations } from '@/hooks/queries/useAssets';

type HierarchyNodeProps = {
  node: any;
  level?: number;
  onSelect: (node: any) => void;
};

const HierarchyNode: React.FC<HierarchyNodeProps> = ({ node, level = 0, onSelect }) => {
  const [isOpen, setIsOpen] = useState(level === 0);
  const hasChildren = node.children && node.children.length > 0;
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  
  const handleSelect = () => {
    onSelect(node);
  };
  
  const getNodeIcon = (type: string) => {
    switch(type) {
      case 'facility': return <span className="h-4 w-4 text-blue-500">🏢</span>;
      case 'system': return <span className="h-4 w-4 text-green-500">⚙️</span>;
      case 'package': return <span className="h-4 w-4 text-orange-500">📦</span>;
      case 'asset': return <span className="h-4 w-4 text-purple-500">🔧</span>;
      default: return <span className="h-4 w-4">•</span>;
    }
  };
  
  return (
    <div className="pl-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div 
          className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-md ${level === 0 ? 'mt-0' : 'mt-1'}`}
          onClick={handleSelect}
        >
          {hasChildren && (
            <CollapsibleTrigger asChild onClick={handleToggle}>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 mr-1">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          )}
          {!hasChildren && <div className="w-5 mr-1" />}
          <span className="mr-2">{getNodeIcon(node.type)}</span>
          <span className="text-sm">{node.name}</span>
        </div>
        
        {hasChildren && (
          <CollapsibleContent>
            <div className="border-l-2 border-gray-200 ml-2 pl-2">
              {node.children.map((child: any, index: number) => (
                <HierarchyNode 
                  key={`${child.id}-${index}`} 
                  node={child} 
                  level={level + 1}
                  onSelect={onSelect} 
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

const AssetsPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<AssetWithRelations | null>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetWithRelations | null>(null);
  const navigate = useNavigate();

  const { data: assets, isLoading, isError, error } = useAssetsWithRelations();

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
    setIsEditMode(false);
    setCurrentItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Asset) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleRowClick = (row: Asset) => {
    navigate(`/manage/assets/${row.id}`);
  };

  const handleSubmit = (values: any) => {
    if (isEditMode && currentItem) {
      console.log("Update asset with values:", values);
    } else {
      console.log("Create new asset with values:", values);
    }
  };

  const columns: Column[] = [
    {
      id: 'asset_no',
      header: 'Asset No',
      accessorKey: 'asset_no',
    },
    {
      id: 'asset_name',
      header: 'Asset Name',
      accessorKey: 'asset_name',
    },
    {
      id: 'package',
      header: 'Package',
      accessorKey: 'package',
      cell: (value) => value.package_name || '-'
    },
    {
      id: 'system',
      header: 'System',
      accessorKey: 'system',
      cell: (value) => value.system_name || '-'
    },
    {
      id: 'facility',
      header: 'Facility',
      accessorKey: 'facility',
      cell: (value) => value.location_name || '-'
    },
    {
      id: 'asset_tag',
      header: 'Asset Tag',
      accessorKey: 'asset_tag',
      cell: (value) => value.name || '-'
    },
    // {
    //   id: 'model',
    //   header: 'Model',
    //   accessorKey: 'model',
    // },
    {
      id: 'asset_status',
      header: 'Status',
      accessorKey: 'asset_status',
      cell: (value) => <StatusBadge status={value.name || 'Unknown'} />
    },
    // {
    //   id: 'sceCode',
    //   header: 'SCE Code',
    //   accessorKey: 'sceCode',
    // },
    // {
    //   id: 'criticalityCode',
    //   header: 'Criticality Code',
    //   accessorKey: 'criticalityCode',
    // },
  ];

  const formSchema = z.object({
    assetNo: z.string().min(1, "Asset No is required"),
    name: z.string().min(1, "Asset Name is required"),
    packageId: z.string().min(1, "Package is required"),
    systemId: z.string().min(1, "System is required"),
    facilityId: z.string().min(1, "Facility is required"),
    assetTag: z.string().min(1, "Asset Tag is required"),
    model: z.string().min(1, "Model is required"),
    status: z.string().min(1, "Status is required"),
    sceCode: z.string().min(1, "SCE Code is required"),
    criticalityCode: z.string().min(1, "Criticality Code is required"),
  });

  const packageOptions = packages.map(pkg => ({
    value: pkg.id,
    label: pkg.name
  }));

  const systemOptions = systems.map(system => ({
    value: system.id,
    label: system.name
  }));

  const facilityOptions = facilityLocations.map(facility => ({
    value: facility.id,
    label: facility.name
  }));

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Decommissioned', label: 'Decommissioned' },
  ];

  const criticalityOptions = [
    { value: 'A', label: 'A - Critical' },
    { value: 'B', label: 'B - Important' },
    { value: 'C', label: 'C - Standard' },
  ];

  const formFields = [
    { name: 'assetNo', label: 'Asset No', type: 'text' as const },
    { name: 'name', label: 'Asset Name', type: 'text' as const },
    { 
      name: 'packageId', 
      label: 'Package', 
      type: 'select' as const,
      options: packageOptions
    },
    { 
      name: 'systemId', 
      label: 'System', 
      type: 'select' as const,
      options: systemOptions
    },
    { 
      name: 'facilityId', 
      label: 'Facility', 
      type: 'select' as const,
      options: facilityOptions
    },
    { name: 'assetTag', label: 'Asset Tag', type: 'text' as const },
    { name: 'model', label: 'Model', type: 'text' as const },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: statusOptions
    },
    { name: 'sceCode', label: 'SCE Code', type: 'text' as const },
    {
      name: 'criticalityCode',
      label: 'Criticality Code',
      type: 'select' as const,
      options: criticalityOptions
    }
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
                    {assetHierarchy.facilities.map((facility, index) => (
                      <HierarchyNode 
                        key={`${facility.id}-${index}`} 
                        node={facility} 
                        onSelect={handleNodeSelect} 
                      />
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">
                    {selectedNode ? `${selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)} Details` : 'Details'}
                  </h3>
                  
                  {selectedNode ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-md">
                          <span className="text-xs text-gray-500 block">Name</span>
                          <span className="text-sm font-medium">{selectedNode.name}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <span className="text-xs text-gray-500 block">Type</span>
                          <span className="text-sm font-medium capitalize">{selectedNode.type}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <span className="text-xs text-gray-500 block">ID</span>
                          <span className="text-sm font-medium">{selectedNode.id}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h4 className="text-sm font-medium mb-2">Metadata</h4>
                        <p className="text-sm text-gray-500">
                          Additional information about this {selectedNode.type} would be displayed here.
                        </p>
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

      <ManageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={isEditMode ? "Edit Asset" : "Add New Asset"}
        formSchema={formSchema}
        defaultValues={currentItem || { 
          assetNo: "", 
          name: "", 
          packageId: "", 
          systemId: "", 
          facilityId: "", 
          assetTag: "", 
          model: "", 
          status: "Active", 
          sceCode: "", 
          criticalityCode: "" 
        }}
        formFields={formFields}
        onSubmit={handleSubmit}
        isEdit={isEditMode}
      />

      {/* Asset Details Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b border-gray-200 pb-4">
            {/* <DrawerTitle className="text-xl font-semibold">{selectedAsset?.name || 'Asset Details'}</DrawerTitle> */}
            <DrawerDescription>
              {/* Asset ID: {selectedAsset?.assetNo} */}
            </DrawerDescription>
          </DrawerHeader>
          
          {selectedAsset && (
            <div className="px-4 py-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Asset Information</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-xs text-gray-500 block">Asset Name</span>
                        {/* <span className="text-sm font-medium">{selectedAsset.name}</span> */}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-xs text-gray-500 block">Asset Tag</span>
                        {/* <span className="text-sm font-medium">{selectedAsset.assetTag}</span> */}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-xs text-gray-500 block">Model</span>
                        {/* <span className="text-sm font-medium">{selectedAsset.model}</span> */}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-xs text-gray-500 block">Status</span>
                        {/* <StatusBadge status={selectedAsset.status} /> */}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Location Information</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-xs text-gray-500 block">System</span>
                        {/* <span className="text-sm font-medium">{selectedAsset.system}</span> */}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-xs text-gray-500 block">Package</span>
                        {/* <span className="text-sm font-medium">{selectedAsset.package}</span> */}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-xs text-gray-500 block">Facility</span>
                        {/* <span className="text-sm font-medium">{selectedAsset.facility}</span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Technical Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="text-xs text-gray-500 block">SCE Code</span>
                      {/* <span className="text-sm font-medium">{selectedAsset.sceCode}</span> */}
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="text-xs text-gray-500 block">Criticality Code</span>
                      {/* <Badge variant={
                        selectedAsset.criticalityCode === 'A' ? 'danger' :
                        selectedAsset.criticalityCode === 'B' ? 'warning' : 'success'
                      }>
                        {selectedAsset.criticalityCode === 'A' ? 'A - Critical' :
                         selectedAsset.criticalityCode === 'B' ? 'B - Important' : 'C - Standard'}
                      </Badge> */}
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
              <Button variant="outline" onClick={() => console.log('Print asset details')}>
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
