import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Building } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/shared/StatusBadge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

interface WorkCenter {
  id: number;
  code: string;
  name: string | null;
  type: string | null;
  effective_date: string | null;
  remark: string | null;
  is_active: boolean | null;
}

const WorkCenterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workCenter, setWorkCenter] = useState<WorkCenter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkCenter = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('e_work_center')
        .select('*')
        .eq('id', Number(id))
        .single();

      if (error || !data) {
        toast.error("Work Center not found");
        navigate('/admin/setup/work-center');
      } else {
        setWorkCenter(data);
      }
      setLoading(false);
    };

    if (id) fetchWorkCenter();
  }, [id, navigate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Work Center Details"
          icon={<Building className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate('/admin/setup/work-center')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Work Centers
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-[200px] w-full" />
      ) : workCenter ? (
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
                  <TableCell className="font-medium">Code</TableCell>
                  <TableCell>{workCenter.code}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>{workCenter.name ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Type</TableCell>
                  <TableCell>{workCenter.type ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Effective Date</TableCell>
                  <TableCell>
                    {workCenter.effective_date
                      ? new Date(workCenter.effective_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                      : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Remark</TableCell>
                  <TableCell>{workCenter.remark ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Is Active</TableCell>
                  <TableCell>
                    {workCenter.is_active !== null ? (
                      <StatusBadge status={workCenter.is_active ? "Active" : "Inactive"} />
                    ) : "N/A"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default WorkCenterDetailPage;