
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { goodsReceive, purchaseOrders } from '@/data/purchasingSampleData';
import { FileText, PaperclipIcon, Truck, CheckCircle, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge, { PurchasingStatus } from '@/components/purchasing/StatusBadge';
import PurchasingTimeline from '@/components/purchasing/PurchasingTimeline';
import { sendEmailNotification, createSubject } from '@/components/purchasing/EmailNotification';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

// Define GoodsReceiveData type that matches the expected structure
type GoodsReceiveData = {
  id: string;
  grNumber: string;
  poNumber: string;
  poId: string;
  vendor: string;
  deliveryDate: string;
  receivedBy: string;
  receiverEmail: string;
  items: Array<any>;
  attachments?: Array<any>;
  status: 'pending' | 'partial' | 'completed';
};

interface TimelineEvent {
  id: string;
  type: 'delivered' | 'checked' | 'uploaded' | 'confirmed';
  date: string;
  user: string;
  description?: string;
  link?: {
    text: string;
    url: string;
  };
}

const GoodsReceiveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<GoodsReceiveData | undefined>(
    goodsReceive.find(gr => gr.id === id) as GoodsReceiveData | undefined
  );
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  
  // Find related PO
  const relatedPO = receipt ? purchaseOrders.find(po => po.id === receipt.poId) : null;

  // Generate timeline events
  useEffect(() => {
    if (receipt) {
      const events: TimelineEvent[] = [
        {
          id: '1',
          type: 'delivered',
          date: receipt.deliveryDate,
          user: receipt.receivedBy,
          description: `Goods for PO #${receipt.poNumber} delivered`
        }
      ];

      // Add check event
      events.push({
        id: '2',
        type: 'checked',
        date: receipt.deliveryDate,
        user: receipt.receivedBy,
        description: 'Items checked upon delivery'
      });

      // Add document upload event if attachments exist
      if (receipt.attachments && receipt.attachments.length > 0) {
        events.push({
          id: '3',
          type: 'uploaded',
          date: receipt.deliveryDate,
          user: receipt.receivedBy,
          description: `${receipt.attachments.length} document(s) uploaded as proof of delivery`
        });
      }

      // Add confirmation event if completed
      if (receipt.status === 'completed') {
        events.push({
          id: '4',
          type: 'confirmed',
          date: receipt.deliveryDate,
          user: receipt.receivedBy,
          description: 'Receipt confirmed and completed'
        });
      }

      setTimelineEvents(events);
    }
  }, [receipt]);

  // Handler for confirming receipt
  const handleConfirmReceipt = () => {
    if (receipt && receipt.status === 'pending') {
      // Update the receipt status
      const updatedReceipt = { 
        ...receipt, 
        status: 'completed' as 'completed' | 'partial' | 'pending'
      };
      setReceipt(updatedReceipt);
      
      // Send notification
      sendEmailNotification({
        to: 'inventory@example.com',
        subject: createSubject('Goods Receive', receipt.grNumber, 'Confirmed'),
        message: `Goods receipt ${receipt.grNumber} for PO ${receipt.poNumber} has been confirmed.`,
        module: 'Goods Receive',
        action: 'Confirmed',
        timestamp: new Date().toISOString(),
        link: `/purchasing/goods-receive/${receipt.id}`
      });
      
      // Update timeline events
      setTimelineEvents([
        ...timelineEvents,
        {
          id: '4',
          type: 'confirmed',
          date: new Date().toISOString().split('T')[0],
          user: receipt.receivedBy,
          description: 'Receipt confirmed and completed'
        }
      ]);
    }
  };

  if (!receipt) {
    return <div>Goods Receipt not found</div>;
  }

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
            {receipt.grNumber}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Goods Receipt Detail</h1>
        <div className="flex gap-2">
          {receipt.status === 'pending' && (
            <Button onClick={() => navigate(`/purchasing/goods-receive/${id}/receive`)}>
              Process Receipt
            </Button>
          )}
          {receipt.status === 'pending' && (
            <Button onClick={handleConfirmReceipt}>
              Confirm Receipt
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/purchasing/goods-receive')}>
            Back to List
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Goods Receipt Information</CardTitle>
                  <CardDescription>Details of the goods receipt</CardDescription>
                </div>
                <StatusBadge status={receipt.status} className="ml-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">GR Number</h3>
                  <p>{receipt.grNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Delivery Date</h3>
                  <p>{receipt.deliveryDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">PO Number</h3>
                  <Link to={`/purchasing/orders/${receipt.poId}`} className="text-blue-600 hover:underline">
                    {receipt.poNumber}
                  </Link>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Vendor</h3>
                  <p>{receipt.vendor}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Received By</h3>
                  <p>{receipt.receivedBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Received Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Item</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-right py-3 px-4">Ordered Qty</th>
                      <th className="text-right py-3 px-4">Received Qty</th>
                      <th className="text-center py-3 px-4">Condition</th>
                      <th className="text-right py-3 px-4">Unit Price</th>
                      <th className="text-right py-3 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipt.items.map(item => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4 text-right">{item.quantity} {item.uom}</td>
                        <td className="py-3 px-4 text-right">{item.receivedQuantity} {item.uom}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={
                            item.condition === 'good' ? 
                              'inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs' :
                              'inline-block px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs'
                          }>
                            {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">RM {item.unitPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">RM {(item.unitPrice * item.receivedQuantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={6} className="text-right py-3 px-4 font-medium">Total:</td>
                      <td className="py-3 px-4 text-right font-medium">
                        RM {receipt.items.reduce((sum, item) => sum + (item.unitPrice * item.receivedQuantity), 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {receipt.attachments && receipt.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>Delivery documents and proof of receipt</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {receipt.attachments.map(attachment => (
                    <li key={attachment.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <PaperclipIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span>{attachment.name}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Receipt history and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <PurchasingTimeline events={timelineEvents} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoodsReceiveDetailPage;
