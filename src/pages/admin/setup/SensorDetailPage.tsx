import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Gauge } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/shared/StatusBadge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

interface Sensor {
  id: number;
  name: string | null;
  sensor_type_id: number | null;
  sensor_type_name: string | null;
  description: string | null;
  manufacturer_id: number | null;
  manufacturer_name: string | null;
  model: string | null;
  calibration_date: string | null;
  client_id: number | null;
  client_name: string | null;
}

const SensorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSensor = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('e_iot_sensor')
        .select( `id, name, sensor_type_id, sensor_type_name: e_sensor_type(name),
          description, manufacturer_id, manufacturer_name: e_manufacturer(name),
          model, calibration_date, client_id, client_name: e_client(name)`)
        .eq('id', Number(id))
        .single();

      if (error || !data) {
        toast.error("Sensor not found");
        navigate('/admin/setup/sensor');
      } else {
        setSensor({
          ...data,
          sensor_type_name: data.sensor_type_name?.name ?? null,
          manufacturer_name: data.manufacturer_name?.name ?? null,
          client_name: data.client_name?.name ?? null,
        });
      }
      setLoading(false);
    };

    if (id) fetchSensor();
  }, [id, navigate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Sensor Details"
          icon={<Gauge className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate('/admin/setup/sensor')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Sensors
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-[200px] w-full" />
      ) : sensor ? (
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
                  <TableCell className="font-medium">Sensor Name</TableCell>
                  <TableCell>{sensor.name ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sensor Type</TableCell>
                  <TableCell>{sensor.sensor_type_name ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Description</TableCell>
                  <TableCell>{sensor.description ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Manufacturer ID</TableCell>
                  <TableCell>{sensor.manufacturer_name ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Model</TableCell>
                  <TableCell>{sensor.model ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Calibration Date</TableCell>
                  <TableCell>
                    {sensor.calibration_date
                      ? new Date(sensor.calibration_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                      : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Client ID</TableCell>
                  <TableCell>
                    {sensor.client_id ? (
                      <Link to={`/admin/setup/client/${sensor.client_id}`} className="text-blue-600 hover:underline">
                        {sensor.client_name ?? "N/A"}
                      </Link>
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

export default SensorDetailPage;