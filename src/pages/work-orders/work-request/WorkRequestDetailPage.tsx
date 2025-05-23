import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import TaskDetailTab from '@/components/work-orders/work-request/task-detail/TaskDetailTab';
import ReportsTab from '@/components/work-orders/work-request/reports/ReportsTab';
import FailureTab from '@/components/work-orders/work-request/failure/FailureTab';
import AttachmentTab from '@/components/work-orders/work-request/attachment/AttachmentTab';

const WorkRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workRequest, setWorkRequest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkRequest = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('e_new_work_request')
        .select(
          `id, cm_status_id (id, name), 
          description, work_request_date, target_due_date, 
          facility_id (id, location_code, location_name), system_id (id, system_name), 
          package_id (id, package_no, package_tag, package_name), 
          asset_id (id, asset_name), cm_sce_code (id, cm_group_name, cm_sce_code ), 
          work_center_id (id, code, name), date_finding, 
          maintenance_type (id, code, name), requested_by, 
          criticality_id (id, name), 
          finding_detail, anomaly_report, quick_incident_report,
          work_request_no, work_request_prefix`
        )
        .eq('id', Number(id))
        .single();

      if (error || !data) {
        toast.error("Work Request not found");
        navigate('/work-orders/work-request');
      } else {
        setWorkRequest(data);
      }
      setLoading(false);
    };

    if (id) fetchWorkRequest();
  }, [id, navigate]);

  return (
    <div className="space-y-6">
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

      {loading ? (
        <Skeleton className="h-[200px] w-full" />
      ) : workRequest ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700">Work Request No</Label>
                <Input className="cursor-default" value={workRequest.work_request_no ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">CM Status</Label>
                <Input className="cursor-default" value={workRequest.cm_status_id?.name ?? "N/A"} readOnly />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="block text-sm font-medium text-gray-700">Description</Label>
                <Textarea className="cursor-default" value={workRequest.description ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Work Request Date</Label>
                <Input className="cursor-default"
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
                <Input className="cursor-default"
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
                <Input className="cursor-default" value={workRequest.facility_id?.location_name ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">System</Label>
                <Input className="cursor-default" value={workRequest.system_id?.system_name ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Package</Label>
                <Input className="cursor-default" value={workRequest.package_id?.package_name ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Asset</Label>
                <Input className="cursor-default" value={workRequest.asset_id?.asset_name ?? "N/A"} readOnly />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="block text-sm font-medium text-gray-700">CM SEC Code</Label>
                <Input className="cursor-default"
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
                <Input className="cursor-default" value={workRequest.work_center_id?.name ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Maintenance Type</Label>
                <Input className="cursor-default" value={workRequest.maintenance_type?.name ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Requested By</Label>
                <Input className="cursor-default" value={workRequest.requested_by ?? "N/A"} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Criticality</Label>
                <Input className="cursor-default" value={workRequest.criticality_id?.name ?? "N/A"} readOnly />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="block text-sm font-medium text-gray-700">Finding Incident Details</Label>
                <Textarea className="cursor-default" value={workRequest.finding_detail ?? "N/A"} readOnly />
              </div>

              <div className="flex flex-row items-center justify-start space-x-3 space-y-0">
                <Switch className="cursor-default"
                  checked={workRequest.anomaly_report ?? false}
                />
                <Label className="block text-sm font-medium text-gray-700">Anomaly Report</Label>
              </div>
              <div className="flex flex-row items-center justify-start space-x-3 space-y-0">
                <Switch className="cursor-default"
                  checked={workRequest.quick_incident_report ?? false}
                />
                <Label className="block text-sm font-medium text-gray-700">Quick Incident Report</Label>
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
    </div>
  );
};

export default WorkRequestDetailPage;