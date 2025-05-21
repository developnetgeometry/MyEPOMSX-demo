import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

interface WorkRequest {
  id: number;
  cm_status_id: number | null;
  description: string | null;
  work_request_date: string | null;
  target_due_date: string | null;
  facility_id: number | null;
  system_id: number | null;
  package_id: number | null;
  asset_id: number | null;
  cm_sce_code: number | null;
  work_center_id: number | null;
  date_finding: string | null;
  maintenance_type: number | null;
  requested_by: string | null;
  criticality_id: number | null;
  finding_detail: string | null;
  anomaly_report: boolean | null;
  quick_incident_report: boolean | null;
  work_request_no: string;
}

const WorkRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workRequest, setWorkRequest] = useState<WorkRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkRequest = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('e_new_work_request')
        .select('*')
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
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Work Request No</TableCell>
                  <TableCell>{workRequest.work_request_no}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CM Status ID</TableCell>
                  <TableCell>{workRequest.cm_status_id ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Description</TableCell>
                  <TableCell>{workRequest.description ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Work Request Date</TableCell>
                  <TableCell>
                    {workRequest.work_request_date
                      ? new Date(workRequest.work_request_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                      : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Target Due Date</TableCell>
                  <TableCell>
                    {workRequest.target_due_date
                      ? new Date(workRequest.target_due_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                      : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Facility ID</TableCell>
                  <TableCell>{workRequest.facility_id ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">System ID</TableCell>
                  <TableCell>{workRequest.system_id ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Package ID</TableCell>
                  <TableCell>{workRequest.package_id ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Asset ID</TableCell>
                  <TableCell>{workRequest.asset_id ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CM SCE Code</TableCell>
                  <TableCell>{workRequest.cm_sce_code ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Work Center ID</TableCell>
                  <TableCell>{workRequest.work_center_id ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Date Finding</TableCell>
                  <TableCell>
                    {workRequest.date_finding
                      ? new Date(workRequest.date_finding).toLocaleDateString("en-GB").replace(/\//g, "-")
                      : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Maintenance Type</TableCell>
                  <TableCell>{workRequest.maintenance_type ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Requested By</TableCell>
                  <TableCell>{workRequest.requested_by ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Criticality ID</TableCell>
                  <TableCell>{workRequest.criticality_id ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Finding Detail</TableCell>
                  <TableCell>{workRequest.finding_detail ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Anomaly Report</TableCell>
                  <TableCell>{workRequest.anomaly_report ? "Yes" : "No"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Quick Incident Report</TableCell>
                  <TableCell>{workRequest.quick_incident_report ? "Yes" : "No"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default WorkRequestDetailPage;