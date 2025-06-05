import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/shared/DatePicker";
import { inventory } from "@/data/sampleData";
import { formatCurrency } from "@/utils/formatters";

const suppliers = [
  "ABC Supplies Sdn Bhd",
  "XYZ Engineering Parts",
  "Malaysia Industrial Components",
  "Tech Solutions Bhd",
  "Engineering Parts Supplier",
];

interface POItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

const CreatePurchaseOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [poNumber, setPoNumber] = useState(
    `PO-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 10000)
    ).padStart(4, "0")}`
  );
  const [supplier, setSupplier] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [remarks, setRemarks] = useState("");
  const [items, setItems] = useState<POItem[]>([
    { id: "1", itemName: "", quantity: 1, unitPrice: 0, subtotal: 0 },
  ]);

  const inventoryMap = inventory.reduce((acc, item) => {
    acc[item.itemName] = item.unitPrice;
    return acc;
  }, {} as Record<string, number>);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: String(items.length + 1),
        itemName: "",
        quantity: 1,
        unitPrice: 0,
        subtotal: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (
    id: string,
    field: keyof POItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Update unit price if item name changes
          if (field === "itemName" && typeof value === "string") {
            updatedItem.unitPrice = inventoryMap[value] || 0;
          }

          // Recalculate subtotal
          if (
            field === "itemName" ||
            field === "quantity" ||
            field === "unitPrice"
          ) {
            updatedItem.subtotal = updatedItem.quantity * updatedItem.unitPrice;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      poNumber,
      supplier,
      deliveryDate,
      items,
      total: calculateTotal(),
      remarks,
    });

    // Redirect back to inventory page
    navigate("/manage/inventory");
  };

  const handleCancel = () => {
    navigate("/manage/inventory");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Purchase Order"
        subtitle="Fill in the details to generate a new PO record"
        icon={<FileText className="h-6 w-6" />}
      />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PO Number */}
              <div className="space-y-2">
                <Label htmlFor="poNumber">PO Number</Label>
                <Input
                  id="poNumber"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-xs text-muted-foreground">
                  Auto-generated PO number
                </p>
              </div>

              {/* Supplier */}
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier Name</Label>
                <div className="relative">
                  <select
                    id="supplier"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((sup, index) => (
                      <option key={index} value={sup}>
                        {sup}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Delivery Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
                <div className="flex">
                  <DatePicker
                    date={deliveryDate}
                    setDate={setDeliveryDate}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddItem}
                  className="text-sm"
                >
                  + Add Item
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-muted-foreground px-2">
                  <div className="col-span-5">Item Name</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Unit Price (RM)</div>
                  <div className="col-span-2">Subtotal (RM)</div>
                  <div className="col-span-1"></div>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 items-center"
                  >
                    {/* Item Name */}
                    <div className="col-span-5">
                      <select
                        value={item.itemName}
                        onChange={(e) =>
                          handleItemChange(item.id, "itemName", e.target.value)
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select item</option>
                        {inventory.map((invItem) => (
                          <option key={invItem.id} value={invItem.itemName}>
                            {invItem.itemName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "unitPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-2">
                      <Input
                        type="text"
                        value={formatCurrency(item.subtotal).replace("RM ", "")}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1 flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-end pt-4 border-t">
                <div className="w-1/3 flex justify-between items-center">
                  <span className="font-semibold">Total PO Value:</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter any additional information or instructions"
                rows={3}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Create Purchase Order</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePurchaseOrderPage;
