
// This is a helper function to simulate sending email notifications
// In a real app, this would connect to a backend service

import { toast } from '@/hooks/use-toast';

export interface EmailNotificationData {
  to: string;
  subject: string;
  message: string;
  module: 'Purchase Request' | 'Purchase Order' | 'Goods Receive';
  action: string;
  timestamp: string;
  link?: string;
}

export const sendEmailNotification = (data: EmailNotificationData): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log('Sending email notification:', data);
    
    // In a real app, this would make an API call to a backend service
    setTimeout(() => {
      // Show a toast notification to simulate email being sent
      toast({
        title: `Email notification sent`,
        description: `${data.subject} - to ${data.to}`,
      });
      resolve(true);
    }, 1000);
  });
};

export const createSubject = (
  module: 'Purchase Request' | 'Purchase Order' | 'Goods Receive', 
  id: string, 
  action: string
): string => {
  return `${module} #${id} ${action}`;
};
