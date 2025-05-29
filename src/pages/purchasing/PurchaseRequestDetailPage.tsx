import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { purchaseRequests, purchaseOrders } from '@/data/purchasingSampleData';
import { PaperclipIcon, FileText, Clock, User, CheckCircle, ArrowRightCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge, { PurchasingStatus } from '@/components/purchasing/StatusBadge';
import PurchasingTimeline from '@/components/purchasing/PurchasingTimeline';
import { sendEmailNotification, createSubject } from '@/components/purchasing/EmailNotification';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

// Define PurchaseRequestData type with the correct status values
type PurchaseRequestData = {
  id: string;
  requestNumber: string;
  date: string;
  department: string;
  requestedBy: string;
  requesterEmail: string;
  priority: "low" | "medium" | "high";
  items: any[];
  notes?: string;
  poNumber?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled' | 'converted';
};

interface TimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'submitted' | 'converted';
  date: string;
  user: string;
  description?: string;
  link?: {
    text: string;
    url: string;
  };
}

const PurchaseRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<PurchaseRequestData | undefined>(
    purchaseRequests.find(req => req.id === id) as PurchaseRequestData | undefined
  );
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  // Generate timeline events
  useEffect(() => {
    if (request) {
      const events: TimelineEvent[] = [
        {
          id: '1',
          type: 'created',
          date: request.date,
          user: request.requestedBy,
          description: `Request #${request.requestNumber} was created`
        }
      ];

      // Add status changes
      if (request.status === 'submitted') {
        events.push({
          id: '2',
          type: 'submitted',
          date: new Date(new Date(request.date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          user: request.requestedBy,
          description: 'Request was submitted for approval'
        });
      }

      // Add conversion to PO if applicable
      if (request.status === 'converted' && request.poNumber) {
        const po = purchaseOrders.find(po => po.poNumber === request.poNumber);
        events.push({
          id: '3',
          type: 'submitted',
          date: new Date(new Date(request.date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          user: request.requestedBy,
          description: 'Request was submitted for approval'
        });
        
        events.push({
          id: '4',
          type: 'converted',
          date: po?.date || new Date().toISOString().split('T')[0],
          user: 'System',
          description: `Request was converted to Purchase Order`,
          link: {
            text: `View PO #${request.poNumber}`,
            url: `/purchasing/orders/${po?.id || ''}`
          }
        });
      }

      setTimelineEvents(events);
    }
  }, [request]);

  // Handler for converting to PO
  const handleConvertToPO = () => {
    if (request) {
      // Simulating creating a new PO
      const newPONumber = `PO-2025-${String(purchaseOrders.length + 1).padStart(3, '0')}`;
      
      // Update the request status
      const updatedRequest = { 
        ...request, 
        status: 'converted' as 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled' | 'converted', 
        poNumber: newPONumber 
      };
      setRequest(updatedRequest);
      
      // Send notification
      sendEmailNotification({
        to: request.requesterEmail,
        subject: createSubject('Purchase Request', request.requestNumber, 'Converted to PO'),
        message: `Your purchase request ${request.requestNumber} has been converted to PO ${newPONumber}.`,
        module: 'Purchase Request',
        action: 'Converted to PO',
        timestamp: new Date().toISOString(),
        link: `/purchasing/request/${request.id}`
      });

      // Navigate to the new PO
      navigate(`/purchasing/orders/new?fromRequest=${request.id}`);
    }
  };

  // Handler for submitting the request
  const handleSubmit = () => {
    if (request && request.status === 'draft') {
      // Update the request status
      const updatedRequest = { 
        ...request, 
        status: 'submitted' as 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled' | 'converted'
      };
      setRequest(updatedRequest);
      
      // Send notification
      sendEmailNotification({
        to: 'approver@example.com', // In a real app, this would be dynamic
        subject: createSubject('Purchase Request', request.requestNumber, 'Submitted for Approval'),
        message: `A new purchase request ${request.requestNumber} has been submitted for your approval.`,
        module: 'Purchase Request',
        action: 'Submitted',
        timestamp: new Date().toISOString(),
        link: `/purchasing/request/${request.id}`
      });
      
      // Update timeline events
      setTimelineEvents([
        ...timelineEvents,
        {
          id: String(timelineEvents.length + 1),
          type: 'submitted',
          date: new Date().toISOString().split('T')[0],
          user: request.requestedBy,
          description: 'Request was submitted for approval'
        }
      ]);
    }
  };

  if (!request) {
    return <div>Purchase Request not found</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/purchasing/request">Purchase Request</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {request.requestNumber}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Purchase Request Detail</h1>
        <div className="flex gap-2">
          {request.status === 'draft' && (
            <Button onClick={() => navigate(`/purchasing/request/${id}/edit`)}>
              Edit Request
            </Button>
          )}
          {request.status === 'draft' && (
            <Button onClick={handleSubmit}>
              Submit
            </Button>
          )}
          {request.status === 'submitted' && (
            <Button onClick={handleConvertToPO}>
              Convert to PO
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/purchasing/request')}>
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
                  <CardTitle>Request Information</CardTitle>
                  <CardDescription>Details of the purchase request</CardDescription>
                </div>
                <StatusBadge status={request.status} className="ml-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Request Number</h3>
                  <p>{request.requestNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p>{request.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Requested By</h3>
                  <p>{request.requestedBy}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p>{request.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                  <p className={
                    request.priority === 'high' ? 'text-red-600' : 
                    request.priority === 'medium' ? 'text-amber-600' : 
                    'text-green-600'
                  }>
                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                  </p>
                </div>
                {request.poNumber && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">PO Number</h3>
                    <Link to={`/purchasing/orders/${purchaseOrders.find(po => po.poNumber === request.poNumber)?.id || ''}`} className="text-blue-600 hover:underline">
                      {request.poNumber}
                    </Link>
                  </div>
                )}
              </div>
              
              {request.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="text-gray-700">{request.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Requested Items</CardTitle>
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
                    {request.items.map(item => (
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
                      <td className="py-3 px-4 text-right font-medium">
                        RM {request.items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Request history and updates</CardDescription>
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

export default PurchaseRequestDetailPage;
