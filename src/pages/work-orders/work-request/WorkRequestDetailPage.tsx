import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ClipboardList, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useWorkRequestDataById, updateWorkRequestData } from "../hooks/use-work-request-data";
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

const WorkRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: workRequest, isLoading, refetch } = useWorkRequestDataById(Number(id)); // Use the new hook
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (workRequest) {
        await updateWorkRequestData(workRequest.id, formData); // Use updateWorkRequestData for editing
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

      {isLoading ? (
        <Skeleton className="h-[200px] w-full" />
      ) : workRequest ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleEditClick}
              >
                <Edit className="h-4 w-4" /> Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700">Work Request No</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.work_request_no ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">CM Status</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.cm_status_id?.name ?? "N/A"} readOnly />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="block text-sm font-medium text-gray-700">Description</Label>
                <Textarea className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.description ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Work Request Date</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={
                    workRequest.work_request_date
                      ? new Date(workRequest.work_request_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                      : "N/A"
                  }
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Target Due Date</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={
                    workRequest.target_due_date
                      ? new Date(workRequest.target_due_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                      : "N/A"
                  }
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Facility</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.facility_id?.location_name ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">System</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.system_id?.system_name ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Package</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.package_id?.package_name ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Asset</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.asset_id?.asset_name ?? "N/A"} readOnly />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="block text-sm font-medium text-gray-700">CM SEC Code</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={
                    workRequest.cm_sce_code
                      ? `${workRequest.cm_sce_code.cm_sce_code} - ${workRequest.cm_sce_code.cm_group_name}`
                      : "N/A"
                  }
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Work Center</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.work_center_id?.name ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Maintenance Type</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.maintenance_type?.name ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Requested By</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.requested_by ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Criticality</Label>
                <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.criticality_id?.name ?? "N/A"} readOnly />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="block text-sm font-medium text-gray-700">Finding Incident Details</Label>
                <Textarea className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.finding_detail ?? "N/A"} readOnly />
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    className="cursor-default"
                    checked={workRequest.anomaly_report ?? false}
                  />
                  <Label className="text-sm font-medium text-gray-700">Anomaly Report</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    className="cursor-default"
                    checked={workRequest.quick_incident_report ?? false}
                  />
                  <Label className="text-sm font-medium text-gray-700">Quick Incident Report</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {(workRequest.cm_status_id?.id === 1 &&
                  <>
                    <Button variant="destructive">Reject</Button>
                    <Button variant="outline">Submit</Button>
                  </>
                )}
                {(workRequest.cm_status_id?.id === 2 &&
                  <Button variant="outline">Approve</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

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
            <DialogTitle>Edit Work Request</DialogTitle>
            <DialogDescription>Update the details of the work request.</DialogDescription>
          </DialogHeader>
          <WorkRequestDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={workRequest}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkRequestDetailPage;