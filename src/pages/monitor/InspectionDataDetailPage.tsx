import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/shared/PageHeader";
import { ChevronLeft, Edit, ClipboardList } from "lucide-react";

// This would typically come from an API call based on the ID
const getInspectionDataById = (id: string) => {
  const sampleData = {
    "1": {
      id: "1",
      assetNo: "PV-1001",
      assetName: "Pressure Vessel - Main Reactor",
      ltcr: 0.15,
      stcr: 0.12,
      inspectionStrategy: "Visual + UT Thickness",
      remainingLife: 8.5,
      inspectionRequest: "Annual thickness survey due to corrosion concerns",
      isActive: true,
      createdAt: "2024-01-15",
      lastUpdated: "2024-06-10",
    },
    "2": {
      id: "2",
      assetNo: "PP-2003",
      assetName: "Process Piping - Feed Line",
      ltcr: 0.08,
      stcr: 0.06,
      inspectionStrategy: "Radiographic Testing",
      remainingLife: 12.3,
      inspectionRequest: "Routine inspection for pipeline integrity",
      isActive: true,
      createdAt: "2024-02-20",
      lastUpdated: "2024-06-08",
    },
  };
  
  return sampleData[id as keyof typeof sampleData] || null;
};

const InspectionDataDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const inspectionData = getInspectionDataById(id || "");

  if (!inspectionData) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Inspection Data Not Found"
          subtitle="The requested inspection data could not be found"
          icon={<ClipboardList className="h-6 w-6" />}
        />
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              The inspection data you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              onClick={() => navigate("/monitor/inspection-data")}
              className="mt-4"
            >
              Back to Inspection Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleGoBack = () => {
    navigate("/monitor/inspection-data");
  };

  const handleEdit = () => {
    // This would navigate to an edit page when implemented
    console.log("Edit inspection data:", id);
  };

  const getRemainingLifeColor = (life: number) => {
    if (life < 5) return "destructive";
    if (life < 10) return "secondary";
    return "default";
  };

  const getCorrosionRateColor = (rate: number) => {
    if (rate > 0.2) return "text-red-600";
    if (rate > 0.1) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Inspection Data - ${inspectionData.assetNo}`}
        subtitle={inspectionData.assetName}
        icon={<ClipboardList className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGoBack}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
            <Button onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Asset Number</label>
              <p className="text-lg font-semibold">{inspectionData.assetNo}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Asset Name</label>
              <p className="text-lg">{inspectionData.assetName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1">
                <Badge variant={inspectionData.isActive ? "default" : "secondary"}>
                  {inspectionData.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Inspection Strategy</label>
              <p className="text-lg">{inspectionData.inspectionStrategy}</p>
            </div>
          </CardContent>
        </Card>

        {/* Corrosion Data */}
        <Card>
          <CardHeader>
            <CardTitle>Corrosion Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Long Term Corrosion Rate (LTCR)</label>
              <p className={`text-lg font-semibold ${getCorrosionRateColor(inspectionData.ltcr)}`}>
                {inspectionData.ltcr.toFixed(2)} mm/year
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Short Term Corrosion Rate (STCR)</label>
              <p className={`text-lg font-semibold ${getCorrosionRateColor(inspectionData.stcr)}`}>
                {inspectionData.stcr.toFixed(2)} mm/year
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Remaining Life</label>
              <div className="mt-1">
                <Badge variant={getRemainingLifeColor(inspectionData.remainingLife)}>
                  {inspectionData.remainingLife.toFixed(1)} years
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspection Request */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inspection Request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {inspectionData.inspectionRequest || "No inspection request details provided."}
            </p>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Record Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Created Date</label>
                <p className="text-lg">{new Date(inspectionData.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                <p className="text-lg">{new Date(inspectionData.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InspectionDataDetailPage;
