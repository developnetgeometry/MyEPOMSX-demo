import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

interface Client {
  id: number;
  code: string;
  name: string | null;
  email: string | null;
  office_no: string | null;
  onboard_date: string | null;
  type: string | null;
  // Add other fields if needed
}

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('e_client')
        .select('*')
        .eq('id', Number(id))
        .single();

      if (error || !data) {
        toast.error("Client not found");
        navigate('/admin/setup/client');
      } else {
        setClient(data);
      }
      setLoading(false);
    };

    if (id) fetchClient();
  }, [id, navigate]);



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Client Details"
          icon={<Users className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate('/admin/setup/client')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Clients
        </Button>
      </div>

      {loading ? (
          <Skeleton className="h-[200px] w-full" />
      ) : client ? (
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
                  <TableCell className="font-medium">Client Code</TableCell>
                  <TableCell>{client.code ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Client Name</TableCell>
                  <TableCell>{client.name ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>{client.email ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Office No.</TableCell>
                  <TableCell>{client.office_no ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Onboard Date</TableCell>
                  <TableCell>
                    {client.onboard_date
                      ? new Date(client.onboard_date).toLocaleDateString("en-GB") // dd/mm/yyyy
                        .replace(/\//g, "-") // convert to dd-mm-yyyy
                      : "N/A"}
                  </TableCell>

                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Type</TableCell>
                  <TableCell>{client.type ?? "N/A"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );

};

export default ClientDetailPage;