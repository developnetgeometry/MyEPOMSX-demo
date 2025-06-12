import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import TableFilters from '@/components/shared/TableFilters';
import { Card, CardContent } from '@/components/ui/card';
import { HardDrive } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/utils/formatters';
import { useAssets, useDeleteAsset } from '@/hooks/monitor/useAssets';
import { toast } from '@/hooks/use-toast';

interface DisplayAsset {
  id: string;
  assetNo: string;
  assetName: string;
  package: string;
  system: string;
  facility: string;
  assetTag: string;
  model: string;
  status: string;
  sceCode: string;
  criticalityCode: string;
  healthStatus: string;
  lastSync: string;
  asset_detail_id: number;
}

const RMSAssetListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // React Query hooks
  const { data: assets = [], isLoading, error, isRefetching } = useAssets();
  const deleteAssetMutation = useDeleteAsset();
  
  const [displayAssets, setDisplayAssets] = useState<DisplayAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<DisplayAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (assets.length > 0) {
      const transformed = assets.map((asset): DisplayAsset => ({
        id: asset.id.toString(),
        assetNo: asset.asset_no,
        assetName: asset.asset_name || '',
        package: asset.package?.package_name || '',
        system: asset.system?.system_name || '',
        facility: asset.facility?.location_name || '',
        assetTag: asset.asset_tag?.name || '',
        model: asset.asset_detail?.model || '',
        status: asset.status?.name || '',
        sceCode: asset.asset_sce?.sce_code || '',
        criticalityCode: asset.asset_detail?.criticality?.name || '',
        healthStatus: 'Good',
        lastSync: formatDateTime(new Date().toISOString()),
        asset_detail_id: asset.asset_detail_id
      }));
      
      setDisplayAssets(transformed);
      setFilteredAssets(transformed);
    }
  }, [assets]);

  const handleAddNew = () => {
    // Navigate to create page or open create modal
    navigate('/monitor/rms-asset-create');
  };

  const handleEdit = (row: DisplayAsset) => {
    // Navigate to edit page
    navigate(`/monitor/rms-asset-edit/${row.id}`);
  };

  const handleDelete = async (row: DisplayAsset) => {
    if (!confirm('Are you sure you want to delete this asset?')) {
      return;
    }

    try {
      await deleteAssetMutation.mutateAsync(parseInt(row.id));
      toast({
        title: "Success",
        description: "Asset deleted successfully.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Error",
        description: "Failed to delete asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    if (!query) {
      setFilteredAssets(displayAssets);
      return;
    }
    
    const filtered = displayAssets.filter(asset => 
      asset.assetNo.toLowerCase().includes(query.toLowerCase()) ||
      asset.assetName.toLowerCase().includes(query.toLowerCase()) ||
      asset.package.toLowerCase().includes(query.toLowerCase()) ||
      asset.system.toLowerCase().includes(query.toLowerCase()) ||
      asset.facility.toLowerCase().includes(query.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(query.toLowerCase()) ||
      asset.model.toLowerCase().includes(query.toLowerCase()) ||
      asset.status.toLowerCase().includes(query.toLowerCase()) ||
      asset.sceCode.toLowerCase().includes(query.toLowerCase()) ||
      asset.criticalityCode.toLowerCase().includes(query.toLowerCase()) ||
      asset.healthStatus.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredAssets(filtered);
  };

  const handleRowClick = (row: DisplayAsset) => {
    navigate(`/monitor/rms-asset-detail/${row.id}`);
  };

  const handleExport = () => {
    // Mock export functionality
    alert("Export functionality will be implemented");
  };

  const columns: Column[] = [
    { id: 'assetNo', header: 'Asset No', accessorKey: 'assetNo' },
    { id: 'assetName', header: 'Asset Name', accessorKey: 'assetName' },
    { id: 'package', header: 'Package', accessorKey: 'package' },
    { id: 'system', header: 'System', accessorKey: 'system' },
    { id: 'facility', header: 'Facility', accessorKey: 'facility' },
    { id: 'assetTag', header: 'Asset Tag', accessorKey: 'assetTag' },
    { id: 'model', header: 'Model', accessorKey: 'model' },
    { id: 'status', header: 'Status', accessorKey: 'status' },
    { id: 'sceCode', header: 'SCE Code', accessorKey: 'sceCode' },
    { id: 'criticalityCode', header: 'Criticality Code', accessorKey: 'criticalityCode' },
    { 
      id: 'healthStatus', 
      header: 'Health Status', 
      accessorKey: 'healthStatus',
      cell: (value) => <StatusBadge status={value} />
    },
    { 
      id: 'lastSync', 
      header: 'Last Sync', 
      accessorKey: 'lastSync'
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="RMS Asset List" 
          subtitle="Remote monitoring system assets"
          icon={<HardDrive className="h-6 w-6" />}
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading assets...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="RMS Asset List" 
          subtitle="Remote monitoring system assets"
          icon={<HardDrive className="h-6 w-6" />}
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Error loading assets: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="RMS Asset List" 
        subtitle="Remote monitoring system assets"
        icon={<HardDrive className="h-6 w-6" />}
      />

      <TableFilters 
        onSearch={handleSearch}
        onAddNew={handleAddNew}
        addNewLabel="Add Asset"
        placeholder="Search assets..."
      />

      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={filteredAssets}
            onEdit={handleEdit}
            onRowClick={handleRowClick}
            onDelete={handleDelete}
            onExport={handleExport}
            loading={isRefetching || deleteAssetMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RMSAssetListPage;