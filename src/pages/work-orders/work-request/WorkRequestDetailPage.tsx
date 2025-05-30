import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ClipboardList, Edit, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useWorkRequestDataById, updateWorkRequestData, insertCmGeneral } from "../hooks/use-work-request-data";
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import TaskDetailTab from '@/components/work-orders/work-request/task-detail/TaskDetailTab';
import ReportsTab from '@/components/work-orders/work-request/reports/ReportsTab';
import FailureTab from '@/components/work-orders/work-request/failure/FailureTab';
import AttachmentTab from '@/components/work-orders/work-request/attachment/AttachmentTab';
import WorkRequestDialogForm from './WorkRequestDialogForm';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog, ConfirmVariant } from '@/components/ui/confirmation-dialog';
import WorkRequestDetailsCard from '@/components/work-orders/work-request/WorkRequestDetailsCard';

const WorkRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: workRequest, isLoading, refetch } = useWorkRequestDataById(Number(id)); // Use the new hook
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

  const handleFormSubmit = async (formData: any) => {
    try {
      if (workRequest) {
        await updateWorkRequestData(workRequest.id, formData);
        toast({
          title: "Success",
          description: "Work request updated successfully!",
          variant: "default",
        });
        refetch();
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update work request data:", error);
      toast({
        title: "Error",
        description: "Failed to update work request data.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitToNRQ = () => {
    setConfirmationDialogData({
      title: "Submit Work Request",
      description: "Are you sure you want to change the status to 'NRQ'?",
      confirmVariant: "default", // Set the button variant dynamically
      onConfirm: async () => {
        try {
          if (workRequest) {
            await updateWorkRequestData(workRequest.id, { cm_status_id: 2 });
            toast({
              title: "Success",
              description: "Work request status updated to 'NRQ' successfully!",
              variant: "default",
            });
            refetch();
          }
          setIsConfirmationDialogOpen(false);
        } catch (error) {
          console.error("Failed to update work request status:", error);
          toast({
            title: "Error",
            description: "Failed to update work request status.",
            variant: "destructive",
          });
        }
      },
    });
    setIsConfirmationDialogOpen(true);
  };

  const handleSubmitWoRaised = () => {
    setConfirmationDialogData({
      title: "Submit Work Request",
      description: "Are you sure you want to change the status to 'WO Raised'?",
      confirmVariant: "default", // Set the button variant dynamically
      onConfirm: async () => {
        try {
          if (workRequest) {
            // Step 1: Update the cm_status_id to 3 in e_new_work_request
            await updateWorkRequestData(workRequest.id, { cm_status_id: 3 });

            // Step 2: Insert data into e_cm_general
            const cmGeneralData = {
              priority_id: workRequest.priority_id?.id,
              work_center_id: workRequest.work_center_id?.id,
              facility_id: workRequest.facility_id?.id,
              system_id: workRequest.system_id?.id,
              package_id: workRequest.package_id?.id,
              asset_id: workRequest.asset_id?.id,
              completed_by: null, // Adjust as needed
              closed_by: null, // Adjust as needed
              date_finding: workRequest.date_finding,
              target_start_date: workRequest.target_due_date, // Assuming target_due_date is the start date
              target_end_date: null, // Adjust as needed
              asset_available_time: null, // Adjust as needed
              requested_by: workRequest.requested_by,
              approved_by: null, // Adjust as needed
              cm_sce_code: workRequest.cm_sce_code?.id,
              due_date: workRequest.target_due_date,
              downtime: null, // Adjust as needed
              work_request_id: workRequest.id, // Link to the e_new_work_request ID
              work_order_no: null, // Adjust as needed
            };

            await insertCmGeneral(cmGeneralData);

            toast({
              title: "Success",
              description: "Work request status updated to 'WO Raised' and data inserted into e_cm_general successfully!",
              variant: "default",
            });

            refetch();
          }
          setIsConfirmationDialogOpen(false);
        } catch (error) {
          console.error("Failed to update work request status or insert data into e_cm_general:", error);
          toast({
            title: "Error",
            description: "Failed to update work request status or insert data into e_cm_general.",
            variant: "destructive",
          });
        }
      },
    });
    setIsConfirmationDialogOpen(true);
  };


  return (
    <div className="space-y-6">
      {/* <pre>{JSON.stringify(workRequest, null, 2)}</pre> */}

      <div className="flex items-center justify-between">
        <PageHeader
          title="Work Request Details"
          icon={<ClipboardList className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate('/work-orders/work-request')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Work Requests
        </Button>
      </div>

      <WorkRequestDetailsCard
        workRequest={workRequest}
        isLoading={isLoading}
        onEditClick={handleEditClick}
        onSubmitToNRQ={handleSubmitToNRQ}
      />

      {/* Tabs Section */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="taskDetail">
            <TabsList className="w-full border-b justify-start">
              <TabsTrigger value="taskDetail">Task Detail</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="failure">Failure</TabsTrigger>
              <TabsTrigger value="attachment">Attachment</TabsTrigger>
            </TabsList>

            <TabsContent value="taskDetail">
              {id && <TaskDetailTab newWorkRequestId={Number(id)} />}
            </TabsContent>
            <TabsContent value="reports">
              {id && <ReportsTab workRequestId={Number(id)} />}
            </TabsContent>
            <TabsContent value="failure">
              {id && <FailureTab workRequestId={Number(id)} />}
            </TabsContent>
            <TabsContent value="attachment">
              {id && <AttachmentTab workRequestId={Number(id)} />}
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
                <DialogTitle>Edit Work Request</DialogTitle>
                <DialogDescription>Update the details of the work request.</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <WorkRequestDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={workRequest}
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

export default WorkRequestDetailPage;