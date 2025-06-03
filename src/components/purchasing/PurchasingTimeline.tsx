
import React from 'react';
import { Check, FileText, Mail, User, Calendar, Upload, Truck, Clock } from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'submitted' | 'converted' | 'approved' | 'delivered' | 'checked' | 'uploaded' | 'confirmed';
  date: string;
  user: string;
  description?: string;
  link?: {
    text: string;
    url: string;
  };
}

interface TimelineProps {
  events: TimelineEvent[];
}

const getIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'created': return Clock;
    case 'updated': return User;
    case 'submitted': return Check;
    case 'converted': return FileText;
    case 'approved': return Check;
    case 'delivered': return Truck;
    case 'checked': return Check;
    case 'uploaded': return Upload;
    case 'confirmed': return Check;
    default: return FileText;
  }
};

const getIconColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'created': return 'bg-blue-100 text-blue-600';
    case 'updated': return 'bg-gray-100 text-gray-600';
    case 'submitted': return 'bg-green-100 text-green-600';
    case 'converted': return 'bg-purple-100 text-purple-600';
    case 'approved': return 'bg-green-100 text-green-600';
    case 'delivered': return 'bg-amber-100 text-amber-600';
    case 'checked': return 'bg-blue-100 text-blue-600';
    case 'uploaded': return 'bg-sky-100 text-sky-600';
    case 'confirmed': return 'bg-green-100 text-green-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getTitle = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'created': return 'Created';
    case 'updated': return 'Updated';
    case 'submitted': return 'Submitted';
    case 'converted': return 'Converted to PO';
    case 'approved': return 'Approved';
    case 'delivered': return 'Goods Delivered';
    case 'checked': return 'Checked By';
    case 'uploaded': return 'Document Uploaded';
    case 'confirmed': return 'Confirmed';
    default: return 'Event';
  }
};

const PurchasingTimeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="relative space-y-6 max-h-[500px] overflow-y-auto pr-2">
      <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
      
      {events.map((event, index) => {
        const Icon = getIcon(event.type);
        const iconColorClass = getIconColor(event.type);
        const title = getTitle(event.type);
        
        return (
          <div key={event.id} className="ml-10 relative">
            <div className={`absolute -left-14 p-2 rounded-full ${iconColorClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h4 className="font-medium">{title}</h4>
              <p className="text-sm text-gray-500">
                {event.user} • {event.date}
              </p>
              {event.description && (
                <p className="mt-2 text-sm">{event.description}</p>
              )}
              {event.link && (
                <a 
                  href={event.link.url} 
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  {event.link.text} →
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PurchasingTimeline;
