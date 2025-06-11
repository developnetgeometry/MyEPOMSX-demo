import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import PmScheduleDetailsCard from "@/components/maintain/pm-schedule/workOrder/PmScheduleDetailsCard";
import { usePmScheduleDataById, updatePmScheduleData, deletePmScheduleData } from "../hooks/use-pm-schedule-data";
import TaskDetailTab from "@/components/maintain/pm-schedule/task-detail/TaskDetailTab";
import MinAcceptCriteriaTab from "@/components/maintain/pm-schedule/minAcceptCriteria/MinAcceptCriteriaTab";
import ChecksheetTab from "@/components/maintain/pm-schedule/checksheet/ChecksheetTab";
import AdditionalInfoTab from "@/components/maintain/pm-schedule/additionalInfo/AdditionalInfoTab";
import MaintainGroupTab from "@/components/maintain/pm-schedule/maintainGroup/MaintainGroupTab";
import PlanTab from "@/components/maintain/pm-schedule/plan/PlanTab";
import RelatedWoTab from "@/components/work-orders/work-order-list/relatedWo/RelatedWoTab";
import PMScheduleDialogForm from "./PMScheduleDialogForm";

const PMScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: pmSchedule, isLoading, refetch } = usePmScheduleDataById(Number(id));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async () => {
    try {
      if (pmSchedule) {
        await deletePmScheduleData(pmSchedule.id);
        toast({
          title: "Success",
          description: "PM Schedule deleted successfully!",
          variant: "default",
        });
        navigate("/maintain/pm-schedule");
        queryClient.invalidateQueries({ queryKey: ["e-pm-schedule-data"] });
      }
    } catch (error) {
      console.error("Failed to delete PM Schedule:", error);
      toast({
        title: "Error",
        description: "Failed to delete PM Schedule.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (pmSchedule) {
        await updatePmScheduleData(pmSchedule.id, formData);
        toast({
          title: "Success",
          description: "PM Schedule updated successfully!",
          variant: "default",
        });
        refetch();
        queryClient.invalidateQueries({ queryKey: ["e-pm-schedule-data"] });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update PM Schedule:", error);
      toast({
        title: "Error",
        description: "Failed to update PM Schedule.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="PM Schedule Detail" />
        <Button variant="outline" onClick={() => navigate("/maintain/pm-schedule")}>
          Back to PM Schedule
        </Button>
      </div>

      <PmScheduleDetailsCard
        pmScheduleDetail={pmSchedule}
        isLoading={isLoading}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <Card>
        <CardContent className="pt-6">
          {!isLoading && pmSchedule && (
            <Tabs defaultValue="taskDetail">
              <TabsList>
                <TabsTrigger value="taskDetail">Task Detail</TabsTrigger>
                <TabsTrigger value="minAcceptance">Min Acceptance Criteria</TabsTrigger>
                <TabsTrigger value="checksheet">Checksheet</TabsTrigger>
                <TabsTrigger value="workOrder">Work Order</TabsTrigger>
                <TabsTrigger value="additionalInfo">Additional Info</TabsTrigger>
                <TabsTrigger value="maintainGroup">Maintainable Group</TabsTrigger>
                <TabsTrigger value="plan">Plan</TabsTrigger>
              </TabsList>

              <TabsContent value="taskDetail">
                {id && <TaskDetailTab pmScheduleId={Number(pmSchedule.id)} />}
              </TabsContent>
              <TabsContent value="minAcceptance">
                {id && <MinAcceptCriteriaTab pmScheduleId={Number(pmSchedule.id)} />}
              </TabsContent>
              <TabsContent value="checksheet">
                {id && <ChecksheetTab pmScheduleId={Number(pmSchedule.id)} />}
              </TabsContent>
              <TabsContent value="workOrder">
                {id && <RelatedWoTab assetId={Number(pmSchedule.asset_id.id)} />}
              </TabsContent>
              <TabsContent value="additionalInfo">
                {id && <AdditionalInfoTab pmScheduleId={Number(pmSchedule.id)} />}
              </TabsContent>
              <TabsContent value="maintainGroup">
                {id && <MaintainGroupTab pmScheduleId={Number(pmSchedule.id)} />}
              </TabsContent>
              <TabsContent value="plan">
                {id && <PlanTab pmScheduleId={Number(pmSchedule.id)} workCenterId={pmSchedule.work_center_id.id} />}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>Edit PM Schedule</DialogTitle>
                <DialogDescription>Update the details of the PM Schedule.</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <PMScheduleDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={pmSchedule}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PMScheduleDetailPage;