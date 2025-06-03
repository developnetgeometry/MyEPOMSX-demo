import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { purchaseOrders, goodsReceive } from '@/data/purchasingSampleData';
import { FileText, PaperclipIcon, Clock, User, CheckCircle, Truck, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge, { PurchasingStatus } from '@/components/purchasing/StatusBadge';
import PurchasingTimeline from '@/components/purchasing/PurchasingTimeline';
import { sendEmailNotification, createSubject } from '@/components/purchasing/EmailNotification';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

// Define PurchaseOrderData type with the correct status values
type PurchaseOrderData = {
  id: string;
  poNumber: string;
  date: string;
  deliveryDate: string;
  vendor: string;
  vendorEmail: string;
  items: any[];
  totalCost: number;
  terms?: string;
  notes?: string;
  requestId?: string;
  attachments?: { id: string; name: string; type: string; url: string; }[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled' | 'partial' | 'completed';
};

interface TimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'submitted' | 'approved' | 'delivered' | 'uploaded';
  date: string;
  user: string;
  description?: string;
  link?: {
    text: string;
    url: string;
  };
}

const PurchaseOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<PurchaseOrderData | undefined>(
    purchaseOrders.find(po => po.id === id) as PurchaseOrderData | undefined
  );
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  
  // Find related goods receive records
  const relatedGR = goodsReceive.filter(gr => gr.poId === order?.id);

  // Generate timeline events
  useEffect(() => {
    if (order) {
      const events: TimelineEvent[] = [
        {
          id: '1',
          type: 'created',
          date: order.date,
          user: 'System',
          description: `Purchase Order #${order.poNumber} was created`
        }
      ];

      // Add status changes based on order status
      if (order.status === 'submitted' || order.status === 'approved' || order.status === 'partial' || order.status === 'completed') {
        events.push({
          id: '2',
          type: 'submitted',
          date: new Date(new Date(order.date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          user: 'Procurement Officer',
          description: 'PO was submitted for approval'
        });
      }

      if (order.status === 'approved' || order.status === 'partial' || order.status === 'completed') {
        events.push({
          id: '3',
          type: 'approved',
          date: new Date(new Date(order.date).getTime() + 48 * 60 * 60 * 1000).toISOString().split('T')[0],
          user: 'Finance Manager',
          description: 'PO was approved'
        });
      }

      // Add attachments if any
      if (order.attachments && order.attachments.length > 0) {
        events.push({
          id: '4',
          type: 'uploaded',
          date: new Date(new Date(order.date).getTime() + 12 * 60 * 60 * 1000).toISOString().split('T')[0],
          user: 'Procurement Officer',
          description: `${order.attachments.length} document(s) attached to PO`
        });
      }

      // Add goods receive events if any
      if (relatedGR.length > 0) {
        relatedGR.forEach((gr, index) => {
          events.push({
            id: `5-${index}`,
            type: 'delivered',
            date: gr.deliveryDate,
            user: gr.receivedBy,
            description: gr.status === 'completed' ? 
              'All items were received' :
              'Items were partially received',
            link: {
              text: `View GR #${gr.grNumber}`,
              url: `/purchasing/goods-receive/${gr.id}`
            }
          });
        });
      }

      setTimelineEvents(events);
    }
  }, [order, relatedGR]);

  // Handler for submitting the PO
  const handleSubmit = () => {
    if (order && order.status === 'draft') {
      // Update the order status
      const updatedOrder = { 
        ...order, 
        status: 'submitted' as 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled' | 'partial' | 'completed'
      };
      setOrder(updatedOrder);
      
      // Send notification
      sendEmailNotification({
        to: 'finance@example.com',
        subject: createSubject('Purchase Order', order.poNumber, 'Submitted for Approval'),
        message: `Purchase Order ${order.poNumber} has been submitted for your approval.`,
        module: 'Purchase Order',
        action: 'Submitted',
        timestamp: new Date().toISOString(),
        link: `/purchasing/orders/${order.id}`
      });
      
      // Update timeline events
      setTimelineEvents([
        ...timelineEvents,
        {
          id: String(timelineEvents.length + 1),
          type: 'submitted',
          date: new Date().toISOString().split('T')[0],
          user: 'Procurement Officer',
          description: 'PO was submitted for approval'
        }
      ]);
    }
  };

  // Handler for approving the PO
  const handleApprove = () => {
    if (order && order.status === 'submitted') {
      // Update the order status
      const updatedOrder = { 
        ...order, 
        status: 'approved' as 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled' | 'partial' | 'completed'
      };
      setOrder(updatedOrder);
      
      // Send notification
      sendEmailNotification({
        to: order.vendorEmail,
        subject: createSubject('Purchase Order', order.poNumber, 'Approved and Ready'),
        message: `Purchase Order ${order.poNumber} has been approved and is ready for processing.`,
        module: 'Purchase Order',
        action: 'Approved',
        timestamp: new Date().toISOString(),
        link: `/purchasing/orders/${order.id}`
      });
      
      // Update timeline events
      setTimelineEvents([
        ...timelineEvents,
        {
          id: String(timelineEvents.length + 1),
          type: 'approved',
          date: new Date().toISOString().split('T')[0],
          user: 'Finance Manager',
          description: 'PO was approved'
        }
      ]);
    }
  };

  // Handler for receiving goods
  const handleReceiveGoods = () => {
    if (order && (order.status === 'approved' || order.status === 'partial')) {
      navigate(`/purchasing/goods-receive/new?poId=${order.id}`);
    }
  };

  if (!order) {
    return <div>Purchase Order not found</div>;
  }

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
            {order.poNumber}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Purchase Order Detail</h1>
        <div className="flex gap-2">
          {order.status === 'draft' && (
            <Button onClick={() => navigate(`/purchasing/orders/${id}/edit`)}>
              Edit
            </Button>
          )}
          {order.status === 'draft' && (
            <Button onClick={handleSubmit}>
              Submit
            </Button>
          )}
          {order.status === 'submitted' && (
            <Button onClick={handleApprove}>
              Approve
            </Button>
          )}
          {(order.status === 'approved' || order.status === 'partial') && (
            <Button onClick={handleReceiveGoods} variant="default">
              <Truck className="h-4 w-4 mr-2" />
              Receive Goods
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/purchasing/orders')}>
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
                  <CardTitle>Purchase Order Information</CardTitle>
                  <CardDescription>Details of the purchase order</CardDescription>
                </div>
                <StatusBadge status={order.status} className="ml-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">PO Number</h3>
                  <p>{order.poNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p>{order.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Vendor</h3>
                  <p>{order.vendor}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Delivery Date</h3>
                  <p>{order.deliveryDate}</p>
                </div>
                {order.terms && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Terms</h3>
                    <p>{order.terms}</p>
                  </div>
                )}
              </div>
              
              {order.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              )}
              
              {order.requestId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Source Request</h3>
                  <Link to={`/purchasing/request/${order.requestId}`} className="text-blue-600 hover:underline">
                    View Purchase Request
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Item</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-right py-3 px-4">Quantity</th>
                      <th className="text-right py-3 px-4">Unit Price</th>
                      <th className="text-right py-3 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4 text-right">{item.quantity} {item.uom}</td>
                        <td className="py-3 px-4 text-right">RM {item.unitPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">RM {item.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="text-right py-3 px-4 font-medium">Total:</td>
                      <td className="py-3 px-4 text-right font-medium">RM {order.totalCost.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {order.attachments && order.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {order.attachments.map(attachment => (
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
          
          {relatedGR.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Goods Receipt</CardTitle>
                <CardDescription>Records of goods received against this PO</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">GR Number</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Received By</th>
                        <th className="text-right py-3 px-4">Status</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatedGR.map(gr => (
                        <tr key={gr.id} className="border-b">
                          <td className="py-3 px-4">{gr.grNumber}</td>
                          <td className="py-3 px-4">{gr.deliveryDate}</td>
                          <td className="py-3 px-4">{gr.receivedBy}</td>
                          <td className="py-3 px-4 text-right">
                            <StatusBadge status={gr.status} />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="link" 
                              onClick={() => navigate(`/purchasing/goods-receive/${gr.id}`)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Order history and updates</CardDescription>
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

export default PurchaseOrderDetailPage;
