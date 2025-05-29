import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { purchaseOrders, vendors, purchaseRequests } from '@/data/purchasingSampleData';
import { FileText, Plus, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface FormItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  uom: string;
}

const PurchaseOrderFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = id !== 'new';
  
  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const fromRequestId = searchParams.get('fromRequest');
  
  const [formData, setFormData] = useState({
    poNumber: '',
    date: new Date().toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    vendor: '',
    vendorEmail: '',
    terms: 'Net 30',
    notes: '',
    items: [] as FormItem[],
    status: 'draft',
    requestId: fromRequestId || '',
    attachments: [] as {
      id: string;
      name: string;
      type: string;
      url: string;
    }[]
  });

  // Fetch data if editing or creating from request
  useEffect(() => {
    if (isEdit) {
      const order = purchaseOrders.find(po => po.id === id);
      if (order) {
        setFormData({
          poNumber: order.poNumber,
          date: order.date,
          deliveryDate: order.deliveryDate,
          vendor: order.vendor,
          vendorEmail: order.vendorEmail,
          terms: order.terms || 'Net 30',
          notes: order.notes || '',
          items: order.items,
          status: order.status,
          requestId: order.requestId || '',
          attachments: order.attachments || []
        });
      }
    } else if (fromRequestId) {
      // Populate from request data
      const request = purchaseRequests.find(req => req.id === fromRequestId);
      if (request) {
        // Generate new PO number
        const newPoNumber = `PO-2025-${String(purchaseOrders.length + 1).padStart(3, '0')}`;
        
        setFormData({
          ...formData,
          poNumber: newPoNumber,
          items: request.items,
          requestId: fromRequestId,
          notes: `Created from PR ${request.requestNumber}`
        });
      }
    } else {
      // Generate new PO number for fresh PO
      const newPoNumber = `PO-2025-${String(purchaseOrders.length + 1).padStart(3, '0')}`;
      setFormData({
        ...formData,
        poNumber: newPoNumber
      });
    }
  }, [id, isEdit, fromRequestId]);

  const handleItemChange = (index: number, field: keyof FormItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Recalculate total price if quantity or unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].totalPrice = 
        Number(updatedItems[index].quantity) * Number(updatedItems[index].unitPrice);
    }
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const addItem = () => {
    const newItem: FormItem = {
      id: `temp-${Date.now()}`,
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      uom: 'Unit'
    };
    
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  };

  const removeItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const handleVendorChange = (vendorName: string) => {
    const selectedVendor = vendors.find(v => v.name === vendorName);
    if (selectedVendor) {
      setFormData({
        ...formData,
        vendor: selectedVendor.name,
        vendorEmail: selectedVendor.email
      });
    }
  };

  const handleAttachmentUpload = () => {
    // Simulate file upload - in a real app this would use a file input
    const mockAttachment = {
      id: `file-${Date.now()}`,
      name: 'quotation.pdf',
      type: 'application/pdf',
      url: '#'
    };
    
    setFormData({
      ...formData,
      attachments: [...formData.attachments, mockAttachment]
    });
    
    toast({
      title: "File Uploaded",
      description: "quotation.pdf has been attached to the PO."
    });
  };

  const removeAttachment = (id: string) => {
    const updatedAttachments = formData.attachments.filter(a => a.id !== id);
    setFormData({
      ...formData,
      attachments: updatedAttachments
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.vendor || formData.items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add at least one item.",
        variant: "destructive"
      });
      return;
    }
    
    // Save and navigate back
    toast({
      title: `Purchase Order ${isEdit ? 'Updated' : 'Created'}`,
      description: `Purchase Order ${formData.poNumber} has been ${isEdit ? 'updated' : 'created'}.`
    });
    
    // In a real app, you'd make an API call here
    navigate('/purchasing/orders');
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/purchasing/orders">Purchase Orders</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {isEdit ? 'Edit' : 'New'} Purchase Order
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit' : 'New'} Purchase Order</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Information</CardTitle>
            <CardDescription>Enter the details of your purchase order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="poNumber">PO Number</Label>
                <Input
                  id="poNumber"
                  value={formData.poNumber}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Select
                  value={formData.vendor}
                  onValueChange={handleVendorChange}
                >
                  <SelectTrigger id="vendor">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.name}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorEmail">Vendor Email</Label>
                <Input
                  id="vendorEmail"
                  type="email"
                  value={formData.vendorEmail}
                  onChange={e => setFormData({...formData, vendorEmail: e.target.value})}
                  placeholder="vendor@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={e => setFormData({...formData, deliveryDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms</Label>
                <Select
                  value={formData.terms}
                  onValueChange={value => setFormData({...formData, terms: value})}
                >
                  <SelectTrigger id="terms">
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                    <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="Add any additional notes or instructions"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Items</CardTitle>
              <CardDescription>Add items to your purchase order</CardDescription>
            </div>
            <Button type="button" onClick={addItem} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            {formData.items.length === 0 ? (
              <div className="text-center p-6 border rounded-md border-dashed">
                <p className="text-gray-500">No items added yet. Click "Add Item" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="p-4 border rounded-md flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">Item #{index + 1}</h3>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`item-name-${index}`}>Item Name</Label>
                        <Input
                          id={`item-name-${index}`}
                          value={item.name}
                          onChange={e => handleItemChange(index, 'name', e.target.value)}
                          placeholder="Item name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-description-${index}`}>Description</Label>
                        <Input
                          id={`item-description-${index}`}
                          value={item.description}
                          onChange={e => handleItemChange(index, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`item-quantity-${index}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-uom-${index}`}>Unit of Measure</Label>
                        <Select
                          value={item.uom}
                          onValueChange={value => handleItemChange(index, 'uom', value)}
                        >
                          <SelectTrigger id={`item-uom-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unit">Unit</SelectItem>
                            <SelectItem value="Box">Box</SelectItem>
                            <SelectItem value="Meter">Meter</SelectItem>
                            <SelectItem value="Liter">Liter</SelectItem>
                            <SelectItem value="Kilogram">Kilogram</SelectItem>
                            <SelectItem value="Set">Set</SelectItem>
                            <SelectItem value="Pair">Pair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-unitPrice-${index}`}>Unit Price (RM)</Label>
                        <Input
                          id={`item-unitPrice-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={e => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-totalPrice-${index}`}>Total Price (RM)</Label>
                        <Input
                          id={`item-totalPrice-${index}`}
                          value={item.totalPrice.toFixed(2)}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end">
                  <div className="text-right min-w-[150px]">
                    <p className="text-sm text-gray-500">Total:</p>
                    <p className="font-medium">
                      RM {calculateTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
            <CardDescription>Upload supporting documents such as quotations</CardDescription>
          </CardHeader>
          <CardContent>
            {formData.attachments.length === 0 ? (
              <div className="text-center p-6 border rounded-md border-dashed">
                <p className="text-gray-500">No attachments added yet.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {formData.attachments.map(attachment => (
                  <li key={attachment.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <span>{attachment.name}</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeAttachment(attachment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="mt-4">
              <Button type="button" onClick={handleAttachmentUpload} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button type="button" variant="outline" onClick={() => navigate('/purchasing/orders')}>
              Cancel
            </Button>
            <div className="space-x-2">
              <Button type="submit">
                {isEdit ? 'Update Order' : 'Create Order'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default PurchaseOrderFormPage;
