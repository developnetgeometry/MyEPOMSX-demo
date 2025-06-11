import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import { ShieldIcon, Plus } from "lucide-react";

const IntegrityPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pressureVessel");

  const columns: Column[] = [
    { id: "assetCode", header: "Asset Code", accessorKey: "assetCode" },
    { id: "assetName", header: "Asset Name", accessorKey: "assetName" },
    { id: "area", header: "Area", accessorKey: "area" },
    { id: "system", header: "System", accessorKey: "system" },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
  ];

  const handleRowClick = (row: any) => {
    // Navigate to the asset integrity detail page with the current tab type and row id
    const assetType = activeTab === "piping" ? "piping" : "pressureVessel";
    navigate(`/monitor/integrity/${assetType}/${row.id}`);
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

  // Empty data arrays - replace with actual data from your backend
  const pressureVesselData: any[] = [];
  const pipingData: any[] = [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrity Management"
        subtitle="Asset integrity monitoring and reporting"
        icon={<ShieldIcon className="h-6 w-6" />}
        onSearch={(query) => console.log("Search:", query)}
      />

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
              {pressureVesselData.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={pressureVesselData}
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
              {pipingData.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={pipingData}
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
