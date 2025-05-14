
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import Header from './Header';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const getPageTitle = (pathname: string): string => {
  const paths = pathname.split('/').filter(Boolean);
  
  if (paths.length === 0) return 'Dashboard';
  
  const lastSegment = paths[paths.length - 1];
  const isIdPattern = /^\d+$/.test(lastSegment) || lastSegment.match(/^[a-f0-9-]{8,}$/i);
  
  const titleSegment = isIdPattern && paths.length > 1 
    ? paths[paths.length - 2] 
    : lastSegment;
  
  return titleSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    setIsSidebarCollapsed(isMobile);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        isMobile={isMobile} 
      />
      
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        isMobile ? "ml-0" : (isSidebarCollapsed ? "ml-16" : "ml-60")
      )}>
        <Header 
          title={pageTitle} 
          isSidebarOpen={!isSidebarCollapsed} 
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <main className="p-4 md:p-6 flex-1 animate-fade-in">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
