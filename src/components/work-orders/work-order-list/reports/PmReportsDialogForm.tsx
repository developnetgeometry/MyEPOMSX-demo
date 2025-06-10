import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import { Textarea } from "@/components/ui/textarea";
import { useGeneralMaintenanceData } from "../hooks/pm/use-general-maintenance-data";
import GeneralMaintenanceDialogForm from "./GeneralMaitenanceDialogForm";

interface PmReportsDialogFormProps {
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
}

const PmReportsDialogForm: React.FC<PmReportsDialogFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { data: generalMaintenances } = useGeneralMaintenanceData();

  const [formData, setFormData] = useState({
    sce_result: initialData?.sce_result || "",
    detail_description: initialData?.detail_description || "",
    equipment_status: initialData?.equipment_status || "",
    general_maintenances: initialData?.general_maintenances || [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneralMaintenanceDialogOpen, setIsGeneralMaintenanceDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => {
      const updatedArray = checked
        ? [...prev.general_maintenances, name] // Add to array if checked
        : prev.general_maintenances.filter((item) => item !== name); // Remove from array if unchecked
      return { ...prev, general_maintenances: updatedArray };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="sce_result">SCE Result</Label>
              <Input
                id="sce_result"
                name="sce_result"
                value={formData.sce_result}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment_status">Equipment Status</Label>
              <Input
                id="equipment_status"
                name="equipment_status"
                value={formData.equipment_status}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detail_description">Detail Description</Label>
              <Textarea
                id="detail_description"
                name="detail_description"
                value={formData.detail_description}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
            <div className="flex justify-between items-center mt-6">
                <Label>General Maintenances</Label>
                <Button type="button" onClick={() => setIsGeneralMaintenanceDialogOpen(true)}>
                  Edit General Maintenance
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generalMaintenances?.map((maintenance) => (
                  <div key={maintenance.name} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={maintenance.name}
                      checked={formData.general_maintenances.includes(maintenance.name)}
                      onChange={(e) => handleCheckboxChange(maintenance.name, e.target.checked)}
                    />
                    <Label htmlFor={maintenance.name}>{maintenance.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <div className="flex space-x-2">
                <Button type="submit">Save</Button>
              </div>
            </div>
          </>
        )}
      </form>

      {isGeneralMaintenanceDialogOpen && (
        <div className="modal">
          <div className="modal-content">
            <GeneralMaintenanceDialogForm onCancel={() => setIsGeneralMaintenanceDialogOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default PmReportsDialogForm;