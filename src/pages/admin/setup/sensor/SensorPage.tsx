import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { useSensorData, insertSensorData, updateSensorData, deleteSensorData } from "../hooks/use-sensor-data";
import SensorDialogForm from "./SensorDialogForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/shared/Loading";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const SensorPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: sensors, isLoading, refetch } = useSensorData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState<any | null>(null);
  const { toast } = useToast();

  const handleRowClick = (row: any) => {
    navigate(`/admin/setup/sensor/${row.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddNew = () => {
    setEditingSensor(null);
    setIsDialogOpen(true);
  };

  const handleEditSensor = (sensor: any) => {
    setEditingSensor(sensor);
    setIsDialogOpen(true);
  };

  const handleDeleteSensor = async (sensor: any) => {
    try {
      await deleteSensorData(sensor.id);
      toast({
        title: "Success",
        description: "Sensor deleted successfully!",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete sensor data:", error);
      toast({
        title: "Error",
        description: "Failed to delete sensor data.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingSensor) {
        await updateSensorData(editingSensor.id, formData);
        toast({
          title: "Success",
          description: "Sensor updated successfully!",
          variant: "default",
        });
      } else {
        await insertSensorData(formData);
        toast({
          title: "Success",
          description: "Sensor added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to save sensor data:", error);
      toast({
        title: "Error",
        description: "Failed to save sensor data.",
        variant: "destructive",
      });
    }
  };

  const filteredSensors = useMemo(() => {
    if (!sensors) return [];
    if (!searchQuery) return sensors;
    const lower = searchQuery.toLowerCase();
    return sensors.filter(
      (sensor: any) =>
        sensor.name?.toLowerCase().includes(lower) ||
        sensor.sensor_type_id?.name?.toLowerCase().includes(lower) ||
        sensor.description?.toLowerCase().includes(lower) ||
        sensor.manufacturer_id?.name?.toLowerCase().includes(lower) ||
        sensor.model?.toLowerCase().includes(lower) ||
        sensor.calibration_date?.toLowerCase().includes(lower)
    );
  }, [sensors, searchQuery]);

  const columns: Column[] = [
    { id: "name", header: "Sensor Name", accessorKey: "name" },
    { id: "sensor_type", header: "Sensor Type", accessorKey: "sensor_type_id.name" },
    { id: "description", header: "Description", accessorKey: "description" },
    { id: "manufacturer", header: "Manufacturer", accessorKey: "manufacturer_id.name" },
    { id: "model", header: "Model", accessorKey: "model" },
    {
      id: "calibration_date", header: "Calibration Date", accessorKey: "calibration_date", cell: (value: any) => formatDate(value) // Use the formatter here
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sensor Setup"
        onAddNew={handleAddNew}
        addNewLabel="New Sensor"
        onSearch={handleSearch}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={filteredSensors}
          onRowClick={handleRowClick}
          onEdit={handleEditSensor}
          onDelete={handleDeleteSensor}
          onIndex={true}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>{editingSensor ? "Edit Sensor" : "Add New Sensor"}</DialogTitle>
                <DialogDescription>
                  {editingSensor
                    ? "Update the details of the sensor."
                    : "Fill in the details to add a new sensor."}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <SensorDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingSensor}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SensorPage;