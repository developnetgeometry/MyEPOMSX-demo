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
import { usePmScheduleDataById, updatePmScheduleData } from "../hooks/use-pm-schedule-data";
import TaskDetailTab from "@/components/maintain/pm-schedule/task-detail/TaskDetailTab";
import MinAcceptCriteriaTab from "@/components/maintain/pm-schedule/minAcceptCriteria/MinAcceptCriteriaTab";
import ChecksheetTab from "@/components/maintain/pm-schedule/checksheet/ChecksheetTab";
import AdditionalInfoTab from "@/components/maintain/pm-schedule/additionalInfo/AdditionalInfoTab";
import MaintainGroupTab from "@/components/maintain/pm-schedule/maintainGroup/MaintainGroupTab";
import PlanTab from "@/components/maintain/pm-schedule/plan/PlanTab";
import RelatedWoTab from "@/components/work-orders/work-order-list/relatedWo/RelatedWoTab";
import PMScheduleDialogForm from "./PMScheduleDialogForm";
import { ConfirmationDialog, ConfirmVariant } from '@/components/ui/confirmation-dialog';
import { createWorkOrderIndividual } from "../hooks/use-pm-work-generate";
import { useAuth } from "@/contexts/AuthContext";

const PMScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
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

  const handleDeleteClick = () => {
    setConfirmationDialogData({
      title: "Delete PM Schedule",
      description: "Are you sure you want to delete this PM Schedule?",
      confirmVariant: "destructive", // Set the button variant dynamically
      onConfirm: async () => {
        try {
          if (pmSchedule) {
            await updatePmScheduleData(pmSchedule.id, { is_active: false, is_deleted: true });
            toast({
              title: "Success",
              description: "PM Schedule deleted successfully!",
              variant: "default",
            });
            setIsConfirmationDialogOpen(false);
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
      },
    });
    setIsConfirmationDialogOpen(true);
  };

  const handleCreateWoIndi = () => {
    setConfirmationDialogData({
      title: "Create Work Order",
      description: "Are you sure you want to create a work order for this PM Schedule?",
      confirmVariant: "default",
      onConfirm: async () => {
        try {
          if (pmSchedule) {
            const workOrderData = {
              pm_schedule_id: pmSchedule.id,
              start_date: new Date(Date.now()).toISOString(),
              end_date: new Date(Date.now()).toISOString(),
              created_by: user.id,
              due_date: pmSchedule.due_date,
            };
            await createWorkOrderIndividual(workOrderData);
            toast({
              title: "Success",
              description: "Work order created successfully!",
              variant: "default",
            });
            setIsConfirmationDialogOpen(false);
            refetch();
            queryClient.invalidateQueries({ queryKey: ["e-pm-schedule-data"] });
            queryClient.invalidateQueries({ queryKey: ["e-work-order-data"] });
          }
        } catch (error) {
          console.error("Failed to create work order:", error);
          toast({
            title: "Error",
            description: "Failed to create work order.",
            variant: "destructive",
          });
        }
      },
    });
    setIsConfirmationDialogOpen(true);
  }

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
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}

      <div className="flex items-center justify-between">
        <PageHeader title="PM Schedule Detail" />
        <Button variant="outline" onClick={() => navigate("/maintain/pm-schedule")}>
          Back to PM Schedule
        </Button>
      </div>

      {!isLoading && !authLoading && pmSchedule && (
        <PmScheduleDetailsCard
          pmScheduleDetail={pmSchedule}
          isLoading={isLoading}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onSubmitCreateWoIndi={handleCreateWoIndi}
        />
      )}

      <Card>
        <CardContent className="pt-6">
          {!isLoading && !authLoading && pmSchedule && (
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
              {id && pmSchedule.asset_id?.id ? (
                <RelatedWoTab assetId={Number(pmSchedule.asset_id.id)} />
              ) : (
                <div>No related work orders available for this asset.</div>
              )}
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

    </div >
  );
};

export default PMScheduleDetailPage;