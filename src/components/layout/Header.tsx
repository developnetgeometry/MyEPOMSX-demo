
import React, { useState } from 'react';
import { Bell, Settings, User, Search, Menu, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  title?: string;
  isSidebarOpen: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Work order WO-2023-4582 is overdue', time: '10 min ago' },
    { id: 2, text: 'Asset PM-102 requires maintenance', time: '1 hour ago' },
    { id: 3, text: 'New task assigned by John Doe', time: '3 hours ago' },
  ]);

  const [currentProject, setCurrentProject] = useState('Project Alpha');
  const projects = [
    { id: 1, name: 'Project Alpha', route: '/admin/setup/project/1' },
    { id: 2, name: 'Project Beta', route: '/admin/setup/project/2' },
    { id: 3, name: 'Project Gamma', route: '/admin/setup/project/3' },
  ];

  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects.find(p => p.id.toString() === projectId);
    if (selectedProject) {
      setCurrentProject(selectedProject.name);
      navigate(selectedProject.route);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center px-4 transition-all duration-300">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {title && (
            <h1 className="text-xl font-semibold text-gray-800 ml-2">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <Building className="h-5 w-5 text-gray-500" />
            <Select onValueChange={handleProjectChange} defaultValue="1">
              <SelectTrigger className="w-[180px] h-9 border-none focus-visible:ring-0 focus-visible:ring-offset-0">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="hidden md:block relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search..." 
              className="pl-8 h-9 focus-visible:ring-epomsx-primary" 
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map(notification => (
                <DropdownMenuItem key={notification.id} className="cursor-pointer py-3">
                  <div className="flex flex-col">
                    <span>{notification.text}</span>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
              <DropdownMenuItem>System Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Help Center</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden md:inline-block text-sm font-medium">John Doe</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Activity Log</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
