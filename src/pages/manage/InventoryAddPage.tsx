import PageHeader from "@/components/shared/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Warehouse, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react"; // Added useEffect
import {
  useAddInventory,
  useRackNoOptions,
  useStoreOptions,
} from "@/hooks/queries/useInventory";
import { useItemMasterOptions } from "@/hooks/queries/useItemsMaster";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const InventoryAddPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: itemMasterOptions, isLoading: isItemMasterLoading } =
    useItemMasterOptions();
  const { data: storeOptions, isLoading: isStoreLoading } = useStoreOptions();
  const { data: rackNoOptions, isLoading: isRackNoLoading } =
    useRackNoOptions();
  const addInventoryMutation = useAddInventory();

  const [formData, setFormData] = useState({
    itemMaster: "",
    store: "",
    balanceQuantity: "",
    balanceDate: "",
    minLevel: "",
    maxLevel: "",
    reOrderLevel: "",
    currBalanceQuantity: "",
    unitPrice: "",
    rackNo: "",
    createdBy: user?.id,
    createdAt: new Date().toISOString(),
  });

  // Added state for calculated total price
  const [totalPrice, setTotalPrice] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total price whenever quantity or unit price changes
  useEffect(() => {
    const quantity = parseFloat(formData.currBalanceQuantity) || 0;
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    const calculatedTotal = quantity * unitPrice;

    setTotalPrice(calculatedTotal.toFixed(2));
  }, [formData.currBalanceQuantity, formData.unitPrice]);

  const handleCancel = () => {
    navigate("/manage/inventory");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transformedValues = {
      item_master_id: parseInt(formData.itemMaster),
      store_id: parseInt(formData.store),
      open_balance: parseInt(formData.balanceQuantity),
      open_balance_date: formData.balanceDate,
      min_level: parseInt(formData.minLevel),
      max_level: parseInt(formData.maxLevel),
      reorder_table: parseInt(formData.reOrderLevel),
      current_balance: parseInt(formData.currBalanceQuantity),
      unit_price: parseFloat(formData.unitPrice),
      total_price: parseFloat(totalPrice),
      rack_id: parseInt(formData.rackNo),
      created_by: formData.createdBy,
      created_at: formData.createdAt,
    };

    setIsSubmitting(true);

    try {
      await addInventoryMutation.mutateAsync(transformedValues);
      toast.success("Inventory added successfully");
    } catch (error) {
      console.error("Error adding inventory:", error);
      toast.error("Error adding inventory");
    } finally {
      setIsSubmitting(false);
    }
    navigate("/manage/inventory");
  };

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Add New Inventory"
          icon={<Warehouse className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Assets
        </Button>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itemMaster">
                    Spare Parts<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.itemMaster}
                    onValueChange={(value) => handleChange("itemMaster", value)}
                    disabled={isItemMasterLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Spare Parts" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemMasterOptions?.map((option) => (
                        <SelectItem key={option.id} value={String(option.id)}>
                          {option.item_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balanceQuantity">
                    Opening Balance Quantity
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="balanceQuantity"
                    type="number"
                    value={formData.balanceQuantity}
                    onChange={(e) =>
                      handleChange("balanceQuantity", e.target.value)
                    }
                    placeholder="Opening Balance Quantity"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minLevel">
                    Min Level<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="minLevel"
                    type="number"
                    value={formData.minLevel}
                    onChange={(e) => handleChange("minLevel", e.target.value)}
                    placeholder="Min Level"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reOrderLevel">
                    Reorder Level<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="reOrderLevel"
                    type="number"
                    value={formData.reOrderLevel}
                    onChange={(e) =>
                      handleChange("reOrderLevel", e.target.value)
                    }
                    placeholder="Reorder Level"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitPrice">
                    Unit Price<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step={0.01}
                    value={formData.unitPrice}
                    onChange={(e) => handleChange("unitPrice", e.target.value)}
                    placeholder="Unit Price"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Rack No.<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.rackNo}
                    onValueChange={(value) => handleChange("rackNo", value)}
                    disabled={isRackNoLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rack No." />
                    </SelectTrigger>
                    <SelectContent>
                      {rackNoOptions?.map((option) => (
                        <SelectItem key={option.id} value={String(option.id)}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Store<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.store}
                    onValueChange={(value) => handleChange("store", value)}
                    disabled={isStoreLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Store" />
                    </SelectTrigger>
                    <SelectContent>
                      {storeOptions?.map((option) => (
                        <SelectItem key={option.id} value={String(option.id)}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balanceDate">
                    Opening Balance Date<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="balanceDate"
                    type="date"
                    value={formData.balanceDate}
                    onChange={(e) =>
                      handleChange("balanceDate", e.target.value)
                    }
                    placeholder="Opening Balance Date"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLevel">
                    Max Level<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="maxLevel"
                    type="number"
                    value={formData.maxLevel}
                    onChange={(e) => handleChange("maxLevel", e.target.value)}
                    placeholder="Max Level"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currBalanceQuantity">
                    Current Balance Quantity
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="currBalanceQuantity"
                    type="number"
                    value={formData.currBalanceQuantity}
                    onChange={(e) =>
                      handleChange("currBalanceQuantity", e.target.value)
                    }
                    placeholder="Current Balance Quantity"
                  />
                </div>

                {/* Fixed total price field */}
                <div className="space-y-2">
                  <Label htmlFor="totalPrice">Total Price</Label>
                  <Input
                    id="totalPrice"
                    value={totalPrice}
                    readOnly
                    disabled
                    placeholder="Total Price"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-14">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Asset"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default InventoryAddPage;
