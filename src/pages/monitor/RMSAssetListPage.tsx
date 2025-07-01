import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import TableFilters from "@/components/shared/TableFilters";
import { Card, CardContent } from "@/components/ui/card";
import { HardDrive } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/utils/formatters";
import { useAssets, useDeleteAsset } from "@/hooks/monitor/useAssets";
import { toast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { useRMSUptime } from "@/hooks/monitor/useRMSUptime";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  // React Query hooks
  const { data: assets = [], isLoading, error, isRefetching } = useAssets();
  const deleteAssetMutation = useDeleteAsset();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [displayAssets, setDisplayAssets] = useState<DisplayAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<DisplayAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (assets.length > 0) {
      const transformed = assets.map(
        (asset): DisplayAsset => ({
          id: asset.id.toString(),
          assetNo: asset.asset_no,
          assetName: asset.asset_name || "",
          package: asset.package?.package_name || "",
          system: asset.system?.system_name || "",
          facility: asset.facility?.location_name || "",
          assetTag: asset.asset_tag?.name || "",
          model: asset.asset_detail?.model || "",
          status: asset.status?.name || "",
          sceCode: asset.asset_sce?.sce_code || "",
          criticalityCode: asset.asset_detail?.criticality?.name || "",
          healthStatus: "Good",
          lastSync: formatDateTime(new Date().toISOString()),
          asset_detail_id: asset.asset_detail_id,
        })
      );

      setDisplayAssets(transformed);
      setFilteredAssets(transformed);
    }
  }, [assets]);

  const handleAddNew = () => {
    // Navigate to create page or open create modal
    // navigate("/monitor/rms-asset-create");
    fileInputRef.current?.click();
  };

  const handleEdit = (row: DisplayAsset) => {
    // Navigate to edit page
    navigate(`/monitor/rms-asset-edit/${row.id}`);
  };

  const handleDelete = async (row: DisplayAsset) => {
    if (!confirm("Are you sure you want to delete this asset?")) {
      return;
    }

    try {
      await deleteAssetMutation.mutateAsync(parseInt(row.id));
      toast({
        title: "Success",
        description: "Asset deleted successfully.",
      });
    } catch (error) {
      console.error("Delete error:", error);
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

    const filtered = displayAssets.filter(
      (asset) =>
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        processBulkUptimeData(jsonData);

      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: "Import Error",
          description: "Failed to process the upload file. Please check the file format.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = '';
  }

  const processBulkUptimeData = async (data: any []) => {
    if (!data || data.length < 2) return;

    try {
      // Find header row with asset names
      let headerRowIndex = -1;
      let headers: string[] = [];

      // Look for row with asset names
      for (let i = 0; i < Math.min(10, data.length); i++) {
        const row = data[i];
        if (Array.isArray(row)) {
          const rowStr = row.join('').toLowerCase();
          if (rowStr.includes('asset_name') || rowStr.includes('date') || rowStr.includes('up_time') || rowStr.includes('uptime')) {
            headerRowIndex = i;
            headers = row.map((h: any) => String(h).toLowerCase().trim());
            break;
          }
        }
      }

      if (headerRowIndex === -1) {
        throw new Error('Header row not found. Please ensure your Excel has headers: ASSET_NAME, DATE, UP_TIME, UNPLANNED_SHUTDOWN, PLANNED_SHUTDOWN');
      }

      // Find Column indices
      const assetNameIndex = headers.findIndex(h =>
        h.includes('asset_name') || h.includes('asset')
      );

      const dateIndex = headers.findIndex(h =>
        h.includes('date')
      );

      const uptimeIndex = headers.findIndex(h =>
        h.includes('up_time') || h.includes('uptime')
      );

      const unplannedIndex = headers.findIndex(h =>
        h.includes('unplanned_shutdown')
      );

      const plannedIndex = headers.findIndex(h =>
        h.includes('planned_shutdown')
      );

      if (assetNameIndex === -1 || dateIndex === -1 || uptimeIndex === -1) {
        throw new Error('Required columns not found. Please ensure your Excel has: ASSET_NAME, DATE, UP_TIME columns')
      }

      // Create asset name to asset_detail_id mapping
      const assetMapping: { [key: string]: number } = {};
      assets.forEach(asset => {
        const assetKey = asset.asset_name?.toLowerCase().trim();
        if (assetKey) {
          assetMapping[assetKey] = asset.asset_detail_id;
        }
      });

      // Process data rows
      const uptimeEntries: any[] = [];
      const skippedAssets: string[] = [];

      for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i];
        if (!Array.isArray(row) || row.length === 0) continue;

        // Skip empty rows
        if (row.every(cell => !cell || String(cell).trim() === '')) continue;

        const assetName = row[assetNameIndex];
        const dateValue = row[dateIndex];
        const uptimeValue = row[uptimeIndex];

        if (!assetName || !dateValue || uptimeValue === undefined || uptimeValue === null) continue;

        // Find matching asset_detail_id
        const assetKey = String(assetName).toLowerCase().trim();
        const asset_detail_id = assetMapping[assetKey];

        if (!asset_detail_id) {
          if (!skippedAssets.includes(assetName)) {
            skippedAssets.push(assetName);
          }
          continue;
        }

        // Parse date
        let parsedDate: Date;
        
        try {
          if (typeof dateValue === 'number') {
            // Excel date serial number
            const excelEpoch = new Date(1900, 0, 1);
            parsedDate = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
          } else {
            // String date
            const dateStr = String(dateValue).trim();
            parsedDate = new Date(dateStr);

            // Handle DD/MM/YYYY format if needed
            if (isNaN(parsedDate.getTime())) {
              const parts = dateStr.split('/');
              if (parts.length === 3) {
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const year = parseInt(parts[2]);

                parsedDate = new Date(year, month, day);
              }
            }
          }

          if (isNaN(parsedDate.getTime())) {
            console.warn(`Skipping row ${i}: Invalid date ${dateValue}`);
            continue;
          }
        } catch (error) {
          console.warn(`Skipping row ${i}: Date parsing error`, error);
          continue;
        }

        // Parse numeric values
        const uptime = typeof uptimeValue === 'number' ? uptimeValue : parseFloat(String(uptimeValue)) || 0;
        const unplannedShutdown = unplannedIndex !== -1 && row[unplannedIndex] !== null && row[unplannedIndex] !== undefined ?
          (typeof row[unplannedIndex] === 'number' ? row[unplannedIndex] : parseFloat(String(row[unplannedIndex])) || 0): 0;
        const plannedShutdown = plannedIndex !== -1 && row[plannedIndex] !== null && row[plannedIndex] !== undefined ?
          (typeof row[plannedIndex] === 'number' ? row[plannedIndex] : parseFloat(String(row[plannedIndex])) || 0): 0;

        uptimeEntries.push({
          date: parsedDate.toLocaleDateString('en-CA'), // YYYY-MM-DD format
          uptime,
          unplanned_shutdown: unplannedShutdown,
          planned_shutdown: plannedShutdown,
          asset_detail_id,
          description: ''
        });
      }

      // Show warnings for skipped assets
      if (skippedAssets.length > 0) {
        toast({
          title: "Warning",
          description: `Assets not found in system: ${skippedAssets.join(', ')}. These entries were skipped.`,
          variant: 'destructive',
        });
      }

      // Save entries
      if (uptimeEntries.length > 0) {
        await saveBulkUptimeEntries(uptimeEntries);

        toast({
          title: "Success",
          description: `Successfully imported ${uptimeEntries.length} uptime records for ${new Set(uptimeEntries.map(e => e.asset_detail_id)).size} assets.`,
        });
      } else {
        toast({
          title: "No Data",
          description: `No valid uptime entries found to import.`,
          variant: 'destructive',
        });
      };

    } catch (error) {
      console.error('Error processing bulk data:', error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Failed to process bulk uptime data. Please check the file format.",
        variant: "destructive",
      });
    }
  };

  const saveBulkUptimeEntries = async (entries: any []) => {
    try {
      const recordsWithTimestamps = entries.map(entry => ({
        ...entry,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('r_rms_uptime')
        .insert(recordsWithTimestamps);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['uptime'] });
      
    } catch (error) {
      console.error('Error saving bulk uptime entries:', error);
      throw error;
    }
  }

  const columns: Column[] = [
    { id: "assetNo", header: "Asset Code", accessorKey: "assetNo" },
    { id: "assetName", header: "Asset Name", accessorKey: "assetName" },
    { id: "package", header: "Package", accessorKey: "package" },
    { id: "system", header: "System", accessorKey: "system" },
    { id: "facility", header: "Facility", accessorKey: "facility" },
    { id: "assetTag", header: "Asset Tag", accessorKey: "assetTag" },
    { id: "model", header: "Model", accessorKey: "model" },
    { id: "status", header: "Status", accessorKey: "status" },
    { id: "sceCode", header: "SCE Code", accessorKey: "sceCode" },
    {
      id: "criticalityCode",
      header: "Criticality Code",
      accessorKey: "criticalityCode",
    },
    {
      id: "healthStatus",
      header: "Health Status",
      accessorKey: "healthStatus",
      cell: (value) => <StatusBadge status={value} />,
    },
    {
      id: "lastSync",
      header: "Last Sync",
      accessorKey: "lastSync",
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
          <div className="text-lg text-red-500">
            Error loading assets: {error.message}
          </div>
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
        addNewLabel={isProcessing ? "Processing..." : "Bulk Load"}
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

      <input 
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default RMSAssetListPage;
