import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading"; // Import the Loading component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useItemMasterData } from "@/hooks/lookup/lookup-item-master";

interface ActualMaterialDialogFormProps {
  onSubmit: (formData: any) => Promise<void>; // Assuming onSubmit is async
  onCancel: () => void;
  initialData?: any; // Optional initial data for editing
}

const ActualMaterialDialogForm: React.FC<ActualMaterialDialogFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { data: items, isLoading: isItemLoading } = useItemMasterData();

  const [formData, setFormData] = useState({
    item_id: initialData?.item_id?.id ?? null,
    quantity: initialData?.quantity ?? 0,
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true
    try {
      await onSubmit(formData); // Wait for the onSubmit function to complete
    } finally {
      setIsLoading(false); // Set loading to false after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isLoading || isItemLoading ? ( // Show the Loading component if isLoading is true
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item_id">Item</Label>
              <Select
                value={formData.item_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, item_id: parseInt(value) }))
                }
              >
                <SelectTrigger id="item_id" className="w-full">
                  <SelectValue
                    placeholder="Select Item"
                    defaultValue={
                      items?.find((item) => item.id === formData.item_id)?.item_name || ""
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {items?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.item_name} ({item.item_no})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </>
      )}
    </form>
  );
};

export default ActualMaterialDialogForm;