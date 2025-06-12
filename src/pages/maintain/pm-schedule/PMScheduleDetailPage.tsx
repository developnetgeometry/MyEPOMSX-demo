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
import { usePmScheduleDataById, updatePmScheduleData, deletePmScheduleData, insertPmWorkOrderData } from "../hooks/use-pm-schedule-data";
import TaskDetailTab from "@/components/maintain/pm-schedule/task-detail/TaskDetailTab";
import MinAcceptCriteriaTab from "@/components/maintain/pm-schedule/minAcceptCriteria/MinAcceptCriteriaTab";
import ChecksheetTab from "@/components/maintain/pm-schedule/checksheet/ChecksheetTab";
import AdditionalInfoTab from "@/components/maintain/pm-schedule/additionalInfo/AdditionalInfoTab";
import MaintainGroupTab from "@/components/maintain/pm-schedule/maintainGroup/MaintainGroupTab";
import PlanTab from "@/components/maintain/pm-schedule/plan/PlanTab";
import RelatedWoTab from "@/components/work-orders/work-order-list/relatedWo/RelatedWoTab";
import PMScheduleDialogForm from "./PMScheduleDialogForm";
import { ConfirmationDialog, ConfirmVariant } from '@/components/ui/confirmation-dialog';

const PMScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: pmSchedule, isLoading, refetch } = usePmScheduleDataById(Number(id));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [confirmationDialogData, setConfirmationDialogData] = useState<{
    title: string;
    description: string;
    confirmVariant: ConfirmVariant;
    onConfirm: () => void;
  }>({
    title: "",
    description: "",
    confirmVariant: "default",
    onConfirm: () => { },
  });
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

  const handleSubmitToPmWo = () => {
    setConfirmationDialogData({
      title: "Submit Task Schedule",
      description: "Are you sure you want to submit to PM Work Order?",
      confirmVariant: "default", // Set the button variant dynamically
      onConfirm: async () => {
        try {
          if (pmSchedule) {
            // Step 1: Update the cm_status_id to 3 in e_new_work_request
            await updatePmScheduleData(pmSchedule.id, { is_pm_work_order_created: true, is_active: true });

            // // Step 2: Insert data into e_pm_work_order
            const pmWorkOrderData = {
              due_date: pmSchedule.due_date,
              is_active: true,
              priority_id: pmSchedule.priority_id?.id,
              work_center_id: pmSchedule.work_center_id?.id,
              task_id: pmSchedule.task_id?.id,
              frequency_id: pmSchedule.frequency_id?.id,
              asset_id: pmSchedule.asset_id?.id,
              system_id: pmSchedule.system_id?.id,
              package_id: pmSchedule.package_id?.id,
              pm_group_id: pmSchedule.pm_group_id?.id,
              asset_sce_code_id: pmSchedule.pm_sce_group_id?.id,
              pm_description: pmSchedule.pm_description,
              pm_schedule_id: pmSchedule.id,
              facility_id: pmSchedule.facility_id?.id,
            };

            await insertPmWorkOrderData(pmWorkOrderData);
            // Step 3: Trigger supabase on insert e_cm_general to copy table
            // work_request to e_cm_general

            toast({
              title: "Success",
              description: "PM Work Order submitted successfully!",
              variant: "default",
            });

            refetch();
            queryClient.invalidateQueries({ queryKey: ["e-pm-schedule-data"] });
          }
          setIsConfirmationDialogOpen(false);
        } catch (error) {
          console.error("Failed to submit PM Work Order:", error);
          toast({
            title: "Error",
            description: "Failed to submit PM Work Order",
            variant: "destructive",
          });
        }
      },
    });
    setIsConfirmationDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* <pre>{JSON.stringify(pmSchedule, null, 2)}</pre> */}

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
        onSubmitToPmWo={handleSubmitToPmWo}
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

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
        title={confirmationDialogData.title}
        description={confirmationDialogData.description}
        confirmText="Confirm"
        cancelText="Cancel"
        confirmVariant={confirmationDialogData.confirmVariant}
        onConfirm={confirmationDialogData.onConfirm}
      />
    </div>
  );
};

export default PMScheduleDetailPage;