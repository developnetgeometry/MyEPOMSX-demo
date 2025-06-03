import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ClipboardList, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskDetailTab from '@/components/work-orders/work-request/task-detail/TaskDetailTab';
import ReportsTab from '@/components/work-orders/work-request/reports/ReportsTab';
import FailureTab from '@/components/work-orders/work-request/failure/FailureTab';
import AttachmentTab from '@/components/work-orders/work-request/attachment/AttachmentTab';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog, ConfirmVariant } from '@/components/ui/confirmation-dialog';
import { useQueryClient } from "@tanstack/react-query";
import { deleteWorkOrderData, updateWorkOrderData, useWorkOrderDataById } from '../hooks/use-work-order-data';
import WorkOrderListDetailsCard from '@/components/work-orders/work-order-list/WorkOrderListDetailsCard';
import WorkOrderListDialogForm from './WorkOrderListDialogForm';
import CmGeneralTab from '@/components/work-orders/work-order-list/general/CmGeneralTab';


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
          title="Work Request Details"
          icon={<ClipboardList className="h-6 w-6" />}
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
          <Tabs defaultValue={workOrder?.work_order_type === 1 ? "generalCm" : "actual"}>
            <TabsList className="w-full border-b justify-start">
              {(workOrder?.work_order_type === 1 &&
                <TabsTrigger value="generalCm">General</TabsTrigger>
              )}
              <TabsTrigger value="actual">Actual</TabsTrigger>
              <TabsTrigger value="finding">Findings/Failure</TabsTrigger>
              <TabsTrigger value="relatedWo">Related WO</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="defer">Defer</TabsTrigger>
              <TabsTrigger value="attachment">Attachment</TabsTrigger>
              <TabsTrigger value="taskDetail">Task Detail</TabsTrigger>
              <TabsTrigger value="failure">Failure</TabsTrigger>
            </TabsList>
            {(workOrder?.work_order_type === 1 &&
              <TabsContent value="generalCm">
                {id && <CmGeneralTab cmGeneralId={Number(workOrder.cm_work_order_id.id)} />}
              </TabsContent>
            )}
            <TabsContent value="actual">
              <h1>actual</h1>
            </TabsContent>
            <TabsContent value="finding">
              <h1>finding</h1>
            </TabsContent>
            <TabsContent value="relatedWo">
              <h1>relatedWo</h1>
            </TabsContent>
            <TabsContent value="reports">
              {id && <ReportsTab workRequestId={Number(id)} />}
            </TabsContent>
            <TabsContent value="defer">
              <h1>defer</h1>
            </TabsContent>
            <TabsContent value="attachment">
              {id && <AttachmentTab workRequestId={Number(id)} />}
            </TabsContent>
            <TabsContent value="taskDetail">
              {id && <TaskDetailTab newWorkRequestId={Number(id)} />}
            </TabsContent>
            <TabsContent value="failure">
              {id && <FailureTab workRequestId={Number(id)} />}
            </TabsContent>
          </Tabs>
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