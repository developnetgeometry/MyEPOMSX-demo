import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ListOrdered, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog, ConfirmVariant } from '@/components/ui/confirmation-dialog';
import { useQueryClient } from "@tanstack/react-query";
import { deleteWorkOrderData, updateWorkOrderData, useWorkOrderDataById } from '../hooks/use-work-order-data';
import WorkOrderListDetailsCard from '@/components/work-orders/work-order-list/WorkOrderListDetailsCard';
import WorkOrderListDialogForm from './WorkOrderListDialogForm';
import CmGeneralTab from '@/components/work-orders/work-order-list/general/CmGeneralTab';
import CmActualTab from '@/components/work-orders/work-order-list/actual/CmActualTab';
import CmFindingTab from '@/components/work-orders/work-order-list/finding/CmFindingTab';
import RelatedWoTab from '@/components/work-orders/work-order-list/relatedWo/RelatedWoTab';
import CmReportsTab from '@/components/work-orders/work-order-list/reports/CmReportsTab';
import CmDeferTab from '@/components/work-orders/work-order-list/defer/CmDeferTab';
import CmFailureTab from '@/components/work-orders/work-order-list/failure/CmFailureTab';
import CmAttachmentTab from '@/components/work-orders/work-order-list/attachment/CmAttachmentTab';
import CmTaskDetailTab from '@/components/work-orders/work-order-list/task-detail/CmTaskDetailTab';
import PmGeneralTab from '@/components/work-orders/work-order-list/general/PmGeneralTab';
import PmTaskDetailTab from '@/components/work-orders/work-order-list/task-detail/PmTaskDetailTab';
import PmActualTab from '@/components/work-orders/work-order-list/actual/PmActualTab';
import PmPlanTab from '@/components/work-orders/work-order-list/plan/PmPlanTab';
import PmReportsTab from '@/components/work-orders/work-order-list/reports/PmReportsTab';
import PmDeferTab from '@/components/work-orders/work-order-list/defer/PmDeferTab';
import PmAttachmentTab from '@/components/work-orders/work-order-list/attachment/PmAttachmentTab';
import PmMinAcceptCriteriaTab from '@/components/work-orders/work-order-list/minAcceptCriteria/PmMinAcceptCriteriaTab';
import PmChecksheetTab from '@/components/work-orders/work-order-list/checksheet/PmChecksheetTab';
import PmAdditionalInfoTab from '@/components/work-orders/work-order-list/additionalInfo/PmAdditionalInfoTab';
import PmMaintainGroupTab from '@/components/work-orders/work-order-list/maintainGroup/PmMaintainGroupTab';


const WorkOrderListDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: workOrder, isLoading, refetch } = useWorkOrderDataById(Number(id)); // Use the new hook
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

  const handleDeleteWorkRequest = async () => {
    setConfirmationDialogData({
      title: "Delete Work Request",
      description: "Are you sure you want to delete Work Request Order?",
      confirmVariant: "destructive", // Set the button variant dynamically
      onConfirm: async () => {
        try {
          await deleteWorkOrderData(workOrder.id);
          toast({
            title: "Success",
            description: "Work request has been deleted successfully!",
            variant: "default",
          });
          refetch();
          setIsConfirmationDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ["e-new-work-request-data"] });
          navigate('/work-orders/work-request');
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete work request.",
            variant: "destructive",
          });
        }
      },
    });
    setIsConfirmationDialogOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (workOrder) {
        await updateWorkOrderData(workOrder.id, formData);
        toast({
          title: "Success",
          description: "Work order updated successfully!",
          variant: "default",
        });
        refetch();
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update work order data:", error);
      toast({
        title: "Error",
        description: "Failed to update work order data.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="space-y-6">
      {/* <pre>{JSON.stringify(workOrder, null, 2)}</pre> */}


      <div className="flex items-center justify-between">
        <PageHeader
          title="Work Order Detail"
          icon={<ListOrdered className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate('/work-orders/work-order-list')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Work Order List
        </Button>
      </div>

      <WorkOrderListDetailsCard
        workOrder={workOrder}
        isLoading={isLoading}
        onEditClick={handleEditClick}
      // onDeleteClick={handleDeleteWorkRequest}
      />

      {/* Tabs Section */}
      <Card>
        <CardContent className="pt-6">
          {!isLoading && workOrder && (
            <Tabs defaultValue={
              workOrder.work_order_type === 1
                ? "generalCm"
                : workOrder.work_order_type === 2
                  ? "generalPm"
                  : "relatedWo"
            }>
              <TabsList className="w-full border-b justify-start">
                {(workOrder?.work_order_type === 1 &&
                  <>
                    <TabsTrigger value="generalCm">General</TabsTrigger>
                    <TabsTrigger value="actualCm">Actual</TabsTrigger>
                    <TabsTrigger value="findingCm">Findings</TabsTrigger>
                    <TabsTrigger value="relatedWo">Related WO</TabsTrigger>
                    <TabsTrigger value="reportsCm">Reports</TabsTrigger>
                    <TabsTrigger value="deferCm">Defer</TabsTrigger>
                    <TabsTrigger value="attachmentCm">Attachment</TabsTrigger>
                    <TabsTrigger value="taskDetailCm">Task Detail</TabsTrigger>
                    <TabsTrigger value="failureCm">Failure</TabsTrigger>
                  </>
                )}
                {(workOrder?.work_order_type === 2 &&
                  <>
                    <TabsTrigger value="generalPm" className="px-2">General</TabsTrigger>
                    <TabsTrigger value="taskDetailPm" className="px-2">Task Detail</TabsTrigger>
                    <TabsTrigger value="planPm" className="px-2">Plan</TabsTrigger>
                    <TabsTrigger value="actualPm" className="px-2">Actual</TabsTrigger>
                    <TabsTrigger value="relatedWo" className="px-2">Related WO</TabsTrigger>
                    <TabsTrigger value="reportPm" className="px-2">Reports</TabsTrigger>
                    <TabsTrigger value="deferPm" className="px-2">Defer</TabsTrigger>
                    <TabsTrigger value="attachmentPm" className="px-2">Attachment</TabsTrigger>
                    <TabsTrigger value="criteriaPm" className="px-2">Min Acceptance Criteria</TabsTrigger>
                    <TabsTrigger value="checksheetPm" className="px-2">Checksheet</TabsTrigger>
                    <TabsTrigger value="additionalInfoPm" className="px-2">Additional Info</TabsTrigger>
                    <TabsTrigger value="maintainGroupPm">Maintanable Group</TabsTrigger>
                  </>
                )}

              </TabsList>


              {(workOrder?.work_order_type === 1 &&
                <>
                  <TabsContent value="generalCm">
                    {id && <CmGeneralTab cmGeneralId={Number(workOrder.cm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="actualCm">
                    {id && <CmActualTab cmGeneralId={Number(workOrder.cm_work_order_id.id)} workCenterId={workOrder.cm_work_order_id.work_center_id} />}
                  </TabsContent>
                  <TabsContent value="findingCm">
                    {id && <CmFindingTab cmGeneralId={Number(workOrder.cm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="relatedWo">
                    {id && workOrder.asset_id ? (
                      <RelatedWoTab assetId={Number(workOrder.asset_id)} />
                    ) : (
                      <div>No related work orders available for this asset.</div>
                    )}
                  </TabsContent>
                  <TabsContent value="reportsCm">
                    {id && <CmReportsTab cmGeneralId={Number(workOrder.cm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="deferCm">
                    {id && <CmDeferTab cmGeneralId={Number(workOrder.cm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="attachmentCm">
                    {id && <CmAttachmentTab cmGeneralId={Number(workOrder.cm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="taskDetailCm">
                    {id && <CmTaskDetailTab cmGeneralId={Number(workOrder.cm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="failureCm">
                    {id && <CmFailureTab workRequestId={workOrder.cm_work_order_id.work_request_id} />}
                  </TabsContent>
                </>
              )}
              {(workOrder?.work_order_type === 2 &&
                <>
                  <TabsContent value="generalPm">
                    {id && <PmGeneralTab pmWoId={Number(workOrder.pm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="taskDetailPm">
                    {id && <PmTaskDetailTab pmWoId={Number(workOrder.pm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="planPm">
                    {id && <PmPlanTab pmWoId={Number(workOrder.pm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="actualPm">
                    {id && <PmActualTab pmWoId={Number(workOrder.pm_work_order_id.id)} workCenterId={workOrder.pm_work_order_id.work_center_id} />}
                  </TabsContent>
                  <TabsContent value="relatedWo">
                    {id && workOrder.asset_id ? (
                      <RelatedWoTab assetId={Number(workOrder.asset_id)} />
                    ) : (
                      <div>No related work orders available for this asset.</div>
                    )}
                  </TabsContent>
                  <TabsContent value="reportPm">
                    {id && <PmReportsTab pmWoId={Number(workOrder.pm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="deferPm">
                    {id && <PmDeferTab pmWoId={Number(workOrder.pm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="attachmentPm">
                    {id && <PmAttachmentTab pmWoId={Number(workOrder.pm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="criteriaPm">
                    {id && <PmMinAcceptCriteriaTab pmWoId={Number(workOrder.pm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="checksheetPm">
                    {id && <PmChecksheetTab pmWoId={Number(workOrder.pm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="additionalInfoPm">
                    {id && <PmAdditionalInfoTab pmWoId={Number(workOrder.pm_work_order_id.id)} />}
                  </TabsContent>
                  <TabsContent value="maintainGroupPm">
                    {id && <PmMaintainGroupTab pmWoId={Number(workOrder.pm_work_order_id.id)} />}
                  </TabsContent>
                </>
              )}

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
                <DialogTitle>Edit Work Order</DialogTitle>
                <DialogDescription>Update the details of the work order.</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <WorkOrderListDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={workOrder}
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

export default WorkOrderListDetailPage;