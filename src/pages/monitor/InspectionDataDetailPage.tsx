import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/shared/PageHeader";
import { ChevronLeft, Edit, ClipboardList, Loader2 } from "lucide-react";
import {
  useInspectionData,
  useUpdateInspectionData,
} from "@/hooks/queries/useInspectionData";
import { formatDate } from "@/utils/formatters";
import InspectionDataEditModal from "@/components/inspection/InspectionDataEditModal";

const InspectionDataDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: inspectionData, isLoading } = useInspectionData(Number(id));
  const updateInspectionDataMutation = useUpdateInspectionData();

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
              The inspection data you're looking for doesn't exist or has been
              removed.
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
    setIsEditModalOpen(true);
  };

  const handleSave = async (formData: any) => {
    
    const { asset_detail, ...formDataWithoutAssetDetail } = formData;
    
    if (!id) return;
    await updateInspectionDataMutation.mutateAsync({
      id: Number(id),
      formData: formDataWithoutAssetDetail,
    });
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
        title={isLoading ? "Loading..." : `Inspection Data - ${inspectionData?.asset_detail?.asset?.asset_no}`}
        subtitle={isLoading ? "" : inspectionData?.asset_detail?.asset?.asset_name}
        icon={<ClipboardList className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleGoBack} 
              disabled={updateInspectionDataMutation.isPending}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
            <Button 
              onClick={handleEdit} 
              disabled={updateInspectionDataMutation.isPending || isLoading}
            >
              {updateInspectionDataMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Edit className="mr-2 h-4 w-4" />
              )}
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
              <label className="text-sm font-medium text-gray-600">
                Asset Number
              </label>
              <p className="text-lg font-semibold">
                {inspectionData?.asset_detail?.asset?.asset_no}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Asset Name
              </label>
              <p className="text-lg">
                {inspectionData?.asset_detail?.asset?.asset_name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Status
              </label>
              <div className="mt-1">
                <Badge
                  variant={inspectionData.is_active ? "default" : "secondary"}
                >
                  {inspectionData.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Inspection Strategy
              </label>
              <p className="text-lg">{inspectionData.inspection_strategy}</p>
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
              <label className="text-sm font-medium text-gray-600">
                Long Term Corrosion Rate (LTCR)
              </label>
              <p
                className={`text-lg font-semibold ${getCorrosionRateColor(
                  inspectionData.ltcr
                )}`}
              >
                {inspectionData.ltcr.toFixed(2)} mm/year
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Short Term Corrosion Rate (STCR)
              </label>
              <p
                className={`text-lg font-semibold ${getCorrosionRateColor(
                  inspectionData.stcr
                )}`}
              >
                {inspectionData.stcr.toFixed(2)} mm/year
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Remaining Life
              </label>
              <div className="mt-1">
                <Badge
                  variant={getRemainingLifeColor(inspectionData.remaining_life)}
                >
                  {inspectionData.remaining_life.toFixed(1)} years
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
              {inspectionData.inspection_request ||
                "No inspection request details provided."}
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
                <label className="text-sm font-medium text-gray-600">
                  Created Date
                </label>
                <p className="text-lg">
                  {formatDate(
                    new Date(inspectionData.created_at).toLocaleDateString()
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Last Updated
                </label>
                <p className="text-lg">
                  {formatDate(
                    new Date(inspectionData.updated_at).toLocaleDateString()
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {inspectionData && (
        <InspectionDataEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          inspectionData={inspectionData}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default InspectionDataDetailPage;
