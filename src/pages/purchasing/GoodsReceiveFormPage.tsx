
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { purchaseOrders, goodsReceive } from '@/data/purchasingSampleData';
import { FileText, Plus, Trash2, Upload, Check } from 'lucide-react';
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
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { sendEmailNotification, createSubject } from '@/components/purchasing/EmailNotification';

const GoodsReceiveFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = id !== 'new';
  
  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const poId = searchParams.get('poId');
  
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [formData, setFormData] = useState({
    grNumber: '',
    poNumber: '',
    poId: '',
    vendor: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    receivedBy: '',
    receiverEmail: '',
    items: [] as any[],
    attachments: [] as {
      id: string;
      name: string;
      type: string;
      url: string;
    }[],
    status: 'pending'
  });

  // Load data for editing or reference a PO
  useEffect(() => {
    if (isEdit) {
      // Load existing GR data
      const receipt = goodsReceive.find(gr => gr.id === id);
      if (receipt) {
        setFormData({
          grNumber: receipt.grNumber,
          poNumber: receipt.poNumber,
          poId: receipt.poId,
          vendor: receipt.vendor,
          deliveryDate: receipt.deliveryDate,
          receivedBy: receipt.receivedBy,
          receiverEmail: receipt.receiverEmail,
          items: receipt.items,
          attachments: receipt.attachments || [],
          status: receipt.status
        });
        
        // Also load the related PO data
        const po = purchaseOrders.find(po => po.id === receipt.poId);
        if (po) {
          setSelectedPO(po);
        }
      }
    } else if (poId) {
      // Load PO data
      const po = purchaseOrders.find(po => po.id === poId);
      if (po) {
        setSelectedPO(po);
        
        // Pre-fill the form with PO data
        const newGRNumber = `GR-2025-${String(goodsReceive.length + 1).padStart(3, '0')}`;
        
        setFormData({
          grNumber: newGRNumber,
          poNumber: po.poNumber,
          poId: po.id,
          vendor: po.vendor,
          deliveryDate: new Date().toISOString().split('T')[0],
          receivedBy: '',
          receiverEmail: '',
          items: po.items.map(item => ({
            ...item,
            receivedQuantity: 0,
            condition: 'good',
            remarks: ''
          })),
          attachments: [],
          status: 'pending'
        });
      }
    } else {
      // Generate new GR number
      const newGRNumber = `GR-2025-${String(goodsReceive.length + 1).padStart(3, '0')}`;
      setFormData({
        ...formData,
        grNumber: newGRNumber
      });
    }
  }, [id, isEdit, poId]);

  // Handle PO selection
  const handlePOSelect = (poNumber: string) => {
    const po = purchaseOrders.find(po => po.poNumber === poNumber);
    if (po) {
      setSelectedPO(po);
      setFormData({
        ...formData,
        poNumber: po.poNumber,
        poId: po.id,
        vendor: po.vendor,
        items: po.items.map(item => ({
          ...item,
          receivedQuantity: 0,
          condition: 'good',
          remarks: ''
        }))
      });
    }
  };

  // Handle item receiving quantity change
  const handleQuantityChange = (index: number, value: number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      receivedQuantity: value
    };
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  // Handle item condition change
  const handleConditionChange = (index: number, condition: 'good' | 'damaged') => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      condition
    };
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  // Handle item remarks change
  const handleRemarksChange = (index: number, remarks: string) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      remarks
    };
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const handleAttachmentUpload = () => {
    // Simulate file upload - in a real app this would use a file input
    const mockAttachment = {
      id: `file-${Date.now()}`,
      name: 'delivery_order.pdf',
      type: 'application/pdf',
      url: '#'
    };
    
    setFormData({
      ...formData,
      attachments: [...formData.attachments, mockAttachment]
    });
    
    toast({
      title: "File Uploaded",
      description: "delivery_order.pdf has been attached to the receipt."
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
    if (!formData.poId || !formData.receivedBy || formData.items.every(item => item.receivedQuantity === 0)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and receive at least one item.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if any item exceeds the ordered quantity
    const hasExcessItem = formData.items.some(item => item.receivedQuantity > item.quantity);
    if (hasExcessItem) {
      toast({
        title: "Validation Error",
        description: "Received quantity cannot exceed ordered quantity for any item.",
        variant: "destructive"
      });
      return;
    }
    
    // Determine if all items are received in full
    const isCompleted = formData.items.every(item => item.receivedQuantity === item.quantity);
    const updatedStatus = isCompleted ? 'completed' : 'partial';
    
    // Send notification
    sendEmailNotification({
      to: 'inventory@example.com',
      subject: createSubject('Goods Receive', formData.grNumber, 'Processed'),
      message: `Goods have been received for PO ${formData.poNumber} with receipt number ${formData.grNumber}.`,
      module: 'Goods Receive',
      action: 'Processed',
      timestamp: new Date().toISOString(),
      link: `/purchasing/goods-receive/${formData.grNumber}`
    });
    
    // Save with status update
    toast({
      title: `Goods Receipt ${isEdit ? 'Updated' : 'Processed'}`,
      description: `Goods Receipt ${formData.grNumber} has been ${isEdit ? 'updated' : 'processed'} with status: ${updatedStatus}.`
    });
    
    // In a real app, you'd make an API call here
    navigate('/purchasing/goods-receive');
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/purchasing/goods-receive">Goods Receive</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {isEdit ? 'Edit' : 'New'} Goods Receipt
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit' : 'New'} Goods Receipt</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Information</CardTitle>
            <CardDescription>Enter the details of the goods receipt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grNumber">GR Number</Label>
                <Input
                  id="grNumber"
                  value={formData.grNumber}
                  readOnly
                  className="bg-gray-100"
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
                <Label htmlFor="poNumber">Purchase Order</Label>
                {!selectedPO ? (
                  <Select
                    value={formData.poNumber}
                    onValueChange={handlePOSelect}
                    disabled={isEdit || poId !== null}
                  >
                    <SelectTrigger id="poNumber">
                      <SelectValue placeholder="Select PO" />
                    </SelectTrigger>
                    <SelectContent>
                      {purchaseOrders
                        .filter(po => po.status === 'approved' || po.status === 'partial')
                        .map(po => (
                          <SelectItem key={po.id} value={po.poNumber}>
                            {po.poNumber} - {po.vendor}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Input
                      id="poNumber"
                      value={formData.poNumber}
                      readOnly
                      className="bg-gray-100"
                    />
                    {!isEdit && !poId && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setSelectedPO(null);
                          setFormData({
                            ...formData,
                            poNumber: '',
                            poId: '',
                            vendor: '',
                            items: []
                          });
                        }}
                      >
                        Change
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input
                  id="vendor"
                  value={formData.vendor}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receivedBy">Received By</Label>
                <Input
                  id="receivedBy"
                  value={formData.receivedBy}
                  onChange={e => setFormData({...formData, receivedBy: e.target.value})}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiverEmail">Email</Label>
                <Input
                  id="receiverEmail"
                  type="email"
                  value={formData.receiverEmail}
                  onChange={e => setFormData({...formData, receiverEmail: e.target.value})}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {selectedPO && (
          <Card>
            <CardHeader>
              <CardTitle>Received Items</CardTitle>
              <CardDescription>Record items received from this delivery</CardDescription>
            </CardHeader>
            <CardContent>
              {formData.items.length === 0 ? (
                <div className="text-center p-6 border rounded-md border-dashed">
                  <p className="text-gray-500">No items to receive. Please select a purchase order first.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.items.map((item, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="text-sm text-gray-500">
                          Ordered: {item.quantity} {item.uom} (RM {item.unitPrice.toFixed(2)} each)
                        </div>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="space-y-2">
                          <Label htmlFor={`item-quantity-${index}`}>Received Quantity</Label>
                          <div className="flex space-x-2">
                            <Input
                              id={`item-quantity-${index}`}
                              type="number"
                              min="0"
                              max={item.quantity}
                              value={item.receivedQuantity}
                              onChange={e => handleQuantityChange(index, Number(e.target.value))}
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => handleQuantityChange(index, item.quantity)}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Receive All
                            </Button>
                          </div>
                          {item.receivedQuantity > item.quantity && (
                            <p className="text-sm text-red-500">
                              Cannot exceed ordered quantity ({item.quantity})
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Condition</Label>
                          <RadioGroup 
                            value={item.condition} 
                            onValueChange={(value) => handleConditionChange(index, value as 'good' | 'damaged')}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="good" id={`condition-good-${index}`} />
                              <Label htmlFor={`condition-good-${index}`}>Good</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="damaged" id={`condition-damaged-${index}`} />
                              <Label htmlFor={`condition-damaged-${index}`}>Damaged</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`item-remarks-${index}`}>Remarks</Label>
                          <Textarea
                            id={`item-remarks-${index}`}
                            value={item.remarks || ''}
                            onChange={e => handleRemarksChange(index, e.target.value)}
                            placeholder="Add any remarks about the condition or quantity received"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
            <CardDescription>Upload delivery order or other relevant documents</CardDescription>
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
            <Button type="button" variant="outline" onClick={() => navigate('/purchasing/goods-receive')}>
              Cancel
            </Button>
            <div className="space-x-2">
              <Button type="submit">
                {isEdit ? 'Update Receipt' : 'Process Receipt'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default GoodsReceiveFormPage;
