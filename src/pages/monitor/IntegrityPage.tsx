import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import { ShieldIcon, Plus, Loader2 } from "lucide-react";
import {
  usePressureVesselAssets,
  usePipingAssets,
} from "@/hooks/queries/useIntegrityAssets";
import { Alert, AlertDescription } from "@/components/ui/alert";

const IntegrityPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pressureVessel");

  // Fetch data using the new hooks
  const {
    data: pressureVesselData = [],
    isLoading: isPressureVesselLoading,
    error: pressureVesselError,
  } = usePressureVesselAssets();

  const {
    data: pipingData = [],
    isLoading: isPipingLoading,
    error: pipingError,
  } = usePipingAssets();

  const columns: Column[] = [
    { id: "asset_no", header: "Asset Code", accessorKey: "asset_no" },
    { id: "asset_name", header: "Asset Name", accessorKey: "asset_name" },
    { id: "area", header: "Area", accessorKey: "area" },
    { id: "system", header: "System", accessorKey: "system" },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value || "Unknown"} />,
    },
  ];

  const handleRowClick = (row: any) => {
    // Navigate to the asset integrity detail page with the current tab type and row id
    if (activeTab === "piping") {
      navigate(`/monitor/integrity/piping/${row.id}`);
    } else {
      navigate(`/monitor/integrity/pressure-vessel/${row.id}`);
    }
  };

  const handleNewAsset = () => {
    if (activeTab === "pressureVessel") {
      navigate("/monitor/integrity/new-pressure-vessel");
    } else {
      navigate("/monitor/integrity/new-piping");
    }
  };

  const getNewButtonText = () => {
    return activeTab === "pressureVessel"
      ? "New Pressure Vessel"
      : "New Piping";
  };

  // Handle loading and error states
  const isLoading =
    activeTab === "pressureVessel" ? isPressureVesselLoading : isPipingLoading;
  const error =
    activeTab === "pressureVessel" ? pressureVesselError : pipingError;
  const currentData =
    activeTab === "pressureVessel" ? pressureVesselData : pipingData;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrity Management"
        subtitle="Asset integrity monitoring and reporting"
        icon={<ShieldIcon className="h-6 w-6" />}
        onSearch={(query) => console.log("Search:", query)}
      />

      {/* Display error if any */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading integrity data: {error.message}
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        defaultValue="pressureVessel"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="pressureVessel">Pressure Vessel</TabsTrigger>
          <TabsTrigger value="piping">Piping</TabsTrigger>
        </TabsList>

        <TabsContent value="pressureVessel" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Pressure Vessels</h3>
                <p className="text-sm text-muted-foreground">
                  Manage pressure vessel assets and their integrity status
                </p>
              </div>
              <Button onClick={handleNewAsset}>
                <Plus className="h-4 w-4 mr-2" />
                {getNewButtonText()}
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Loading pressure vessels...
                  </span>
                </div>
              ) : currentData.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={currentData}
                  onRowClick={handleRowClick}
                />
              ) : (
                <div className="text-center py-12">
                  <ShieldIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No Pressure Vessels
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by creating your first pressure vessel asset.
                  </p>
                  <Button onClick={handleNewAsset}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Pressure Vessel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="piping" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Piping Systems</h3>
                <p className="text-sm text-muted-foreground">
                  Manage piping assets and their integrity status
                </p>
              </div>
              <Button onClick={handleNewAsset}>
                <Plus className="h-4 w-4 mr-2" />
                {getNewButtonText()}
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Loading piping assets...
                  </span>
                </div>
              ) : currentData.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={currentData}
                  onRowClick={handleRowClick}
                />
              ) : (
                <div className="text-center py-12">
                  <ShieldIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Piping Assets</h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by creating your first piping asset.
                  </p>
                  <Button onClick={handleNewAsset}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Piping Asset
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrityPage;
