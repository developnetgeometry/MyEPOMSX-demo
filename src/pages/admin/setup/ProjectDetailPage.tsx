import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Database, MapPin } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/shared/StatusBadge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import Loading from '@/components/shared/Loading';
import { Skeleton } from '@/components/ui/skeleton';

interface Project {
  id: number;
  project_code: string;
  project_name: string | null;
  client_id: number | null;
  client_name: string | null;
  project_type: number | null;
  project_type_name: string | null;
  start_date: string | null;
  end_date: string | null;
  fund_code: string | null;
  project_purpose: string | null;
  remark: string | null;
  latitude: string | null;
  longitude: string | null;
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('e_project')
        .select(`
          id,
          project_code,
          project_name,
          client_id,
          client: e_client(name),
          project_type,
          project_type_name: e_project_type(name),
          start_date,
          end_date,
          fund_code,
          project_purpose,
          remark,
          latitude,
          longitude
        `)
        .eq('id', Number(id))
        .single();

      if (error || !data) {
        toast.error("Project not found");
        navigate('/admin/setup/project');
      } else {
        setProject({
          ...data,
          client_name: data.client?.name || null,
          project_type_name: data.project_type_name?.name || null,
        });
      }
      setLoading(false);
    };

    if (id) fetchProject();
  }, [id, navigate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Project Details"
          icon={<Database className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate('/admin/setup/project')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-[200px] w-full" />
      ) : project ? (
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
                  <TableCell className="font-medium">Project Code</TableCell>
                  <TableCell>{project.project_code}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Project Name</TableCell>
                  <TableCell>{project.project_name ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Project Type</TableCell>
                  <TableCell>{project.project_type_name ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Client</TableCell>
                  <TableCell>
                    {project.client_id ? (
                      <Link
                        to={`/admin/setup/client/${project.client_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {project.client_name ?? "N/A"}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Start Date</TableCell>
                  <TableCell>
                    {project.start_date
                      ? new Date(project.start_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                      : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">End Date</TableCell>
                  <TableCell>
                    {project.end_date
                      ? new Date(project.end_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                      : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Fund Code</TableCell>
                  <TableCell>{project.fund_code ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Latitude and Longitude</TableCell>
                  <TableCell className='flex'>
                    {project.latitude && project.longitude ? (
                      <>
                        {`${project.latitude}, ${project.longitude}`}
                        <a
                          href={`https://www.google.com/maps?q=${project.latitude},${project.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 text-blue-600 hover:text-blue-800"
                        >
                          <MapPin className="w-5 h-5" />
                        </a>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Project Purpose</TableCell>
                  <TableCell>{project.project_purpose ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Remark</TableCell>
                  <TableCell>{project.remark ?? "N/A"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default ProjectDetailPage;