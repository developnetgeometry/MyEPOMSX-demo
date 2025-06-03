import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Settings,
  ClipboardList,
  Wrench,
  LineChart,
  Gauge,
  ChevronRight,
  Menu,
  X,
  Home,
  Database,
  Box,
  ListOrdered,
  Calendar,
  Users,
  ChevronLeft,
  Monitor,
  Shield,
  ShoppingCart,
  FileText,
  Truck,
  Layers,
  Package,
} from "lucide-react";
import {
  IMSIcon,
  IntegrityIcon,
  RBIAssessmentIcon,
  CorrosionStudiesIcon,
  InspectionDataIcon,
  InventoryGroupsIcon,
  RMSIcon,
  RMSAssetListIcon,
  CriticalAssetsIcon,
  RMSDashboardIcon,
} from "@/components/ui/custom-icons";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type SidebarItemType = {
  name: string;
  icon: React.ElementType;
  path?: string;
  children?: {
    name: string;
    path?: string;
    icon: React.ElementType;
    children?: {
      name: string;
      path: string;
      icon: React.ElementType;
    }[];
  }[];
};

// Sidebar structure
const sidebarItems: SidebarItemType[] = [
  {
    name: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    name: "Asset Management",
    icon: Database,
    children: [
      {
        name: "Facilities",
        path: "/manage/facilities",
        icon: Package,
      },
      {
        name: "System",
        path: "/manage/system",
        icon: Layers,
      },
      {
        name: "Package",
        path: "/manage/package",
        icon: Box,
      },
      {
        name: "Assets",
        path: "/manage/assets",
        icon: Database,
      },
    ],
  },
  {
    name: "Material",
    icon: Box,
    children: [
      {
        name: "Items Master",
        path: "/manage/items-master",
        icon: ListOrdered,
      },
      {
        name: "Inventory",
        path: "/manage/inventory",
        icon: Package,
      },
      {
        name: "BOM Assembly",
        path: "/manage/bom-assembly",
        icon: Layers,
      },
    ],
  },
  {
    name: "Work Orders",
    icon: ListOrdered,
    children: [
      {
        name: "Work Request",
        path: "/work-orders/work-request",
        icon: ClipboardList,
      },
      {
        name: "Work Order List",
        path: "/work-orders/work-order-list",
        icon: ListOrdered,
      },
      {
        name: "WO History",
        path: "/work-orders/wo-history",
        icon: Calendar,
      },
    ],
  },
  {
    name: "Maintenance Planning",
    icon: Calendar,
    children: [
      {
        name: "PM Schedule",
        path: "/maintain/pm-schedule",
        icon: Calendar,
      },
      {
        name: "Task Library",
        path: "/maintain/task-library",
        icon: Wrench,
      },
    ],
  },
  // Updated Monitor section with IMS and RMS as children
  {
    name: "Monitor",
    icon: Monitor,
    children: [
      {
        name: "IMS",
        icon: IMSIcon,
        children: [
          {
            name: "IMS Dashboard",
            path: "/monitor/ims-dashboard",
            icon: IMSIcon,
          },
          {
            name: "Integrity",
            path: "/monitor/integrity",
            icon: IntegrityIcon,
          },
          {
            name: "RBI Assessment",
            path: "/monitor/rbi-assessment",
            icon: RBIAssessmentIcon,
          },
          {
            name: "Corrosion Studies",
            path: "/monitor/corrosion-studies",
            icon: CorrosionStudiesIcon,
          },
          {
            name: "Inspection Data Management",
            path: "/monitor/inspection-data",
            icon: InspectionDataIcon,
          },
          {
            name: "Inventory Groups",
            path: "/monitor/inventory-groups",
            icon: InventoryGroupsIcon,
          },
        ],
      },
      {
        name: "RMS",
        icon: RMSIcon,
        children: [
          {
            name: "RMS Asset List",
            path: "/monitor/rms-asset-list",
            icon: RMSAssetListIcon,
          },
          {
            name: "Critical Assets Tracking",
            path: "/monitor/critical-assets",
            icon: CriticalAssetsIcon,
          },
          {
            name: "RMS Dashboard",
            path: "/monitor/rms-dashboard",
            icon: RMSDashboardIcon,
          },
        ],
      },
    ],
  },
  // New Purchasing module
  {
    name: "Purchasing",
    icon: ShoppingCart,
    children: [
      {
        name: "Purchase Request",
        path: "/purchasing/request",
        icon: ClipboardList,
      },
      // {
      // name: 'Purchase Order',
      // path: '/purchasing/orders',
      // icon: FileText
      // },
      // {
      // name: 'Goods Receive',
      // path: '/purchasing/goods-receive',
      // icon: Truck
      // }
    ],
  },
  // Combined Admin module with Setup and Settings as submodules
  {
    name: "Admin",
    icon: Shield,
    children: [
      // Setup submodule
      {
        name: "Setup",
        icon: Wrench,
        children: [
          {
            name: "Client",
            path: "/admin/setup/client",
            icon: () => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h9"></path>
                <circle cx="13" cy="7" r="3"></circle>
                <path d="M22 10c0 4-3.5 7-8 8"></path>
              </svg>
            ),
          },
          {
            name: "Project",
            path: "/admin/setup/project",
            icon: () => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8"></path>
                <path d="M16 12h-5a2 2 0 1 0 0 4h5"></path>
                <path d="M22 15h-5a2 2 0 1 0 0 4h5"></path>
              </svg>
            ),
          },
          {
            name: "Sensor",
            path: "/admin/setup/sensor",
            icon: () => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="16" height="8" x="4" y="8" rx="2"></rect>
                <path d="M8 8v8"></path>
                <path d="M16 8v8"></path>
              </svg>
            ),
          },
          {
            name: "Work Center",
            path: "/admin/setup/work-center",
            icon: Wrench,
          },
        ],
      },
      // Settings submodule
      {
        name: "Settings",
        icon: Settings,
        children: [
          {
            name: "Data Category",
            path: "/admin/settings/data-category",
            icon: Database,
          },
          {
            name: "Asset Tag",
            path: "/admin/settings/asset-tag",
            icon: Package,
          },
          {
            name: "Asset Class",
            path: "/admin/settings/asset-class",
            icon: Database,
          },
          {
            name: "Discipline",
            path: "/admin/settings/discipline",
            icon: Wrench,
          },
          {
            name: "Maintenance Type",
            path: "/admin/settings/maintenance-type",
            icon: Wrench,
          },
          {
            name: "Frequency Setup",
            path: "/admin/settings/frequency-setup",
            icon: Calendar,
          },
          {
            name: "Average UARS",
            path: "/admin/settings/average-uars",
            icon: LineChart,
          },
          {
            name: "Corrosion Group",
            path: "/admin/settings/corrosion-group",
            icon: CorrosionStudiesIcon,
          },
          {
            name: "Users",
            path: "/admin/settings/users",
            icon: Users,
          },
        ],
      },
    ],
  },
];

type SidebarItemProps = {
  item: SidebarItemType;
  isCollapsed: boolean;
  activeItem: string;
  onActiveItemChange: (item: string) => void;
  depth?: number;
  isSetupChild?: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCollapsed,
  activeItem,
  onActiveItemChange,
  depth = 0,
  isSetupChild = false,
}) => {
  const location = useLocation();
  const isActive =
    activeItem === item.name ||
    location.pathname === item.path ||
    item.children?.some(
      (child) =>
        location.pathname === child.path ||
        child.children?.some(
          (grandchild) => location.pathname === grandchild.path
        )
    );
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(isActive);

  React.useEffect(() => {
    // Only auto-expand menus when sidebar is not collapsed
    if (isActive && !isCollapsed) {
      setIsSubmenuOpen(true);
    } else if (isCollapsed) {
      setIsSubmenuOpen(false);
    }
  }, [isActive, isCollapsed]);

  const handleClick = () => {
    if (item.children) {
      if (!isCollapsed) {
        setIsSubmenuOpen(!isSubmenuOpen);
      }
      onActiveItemChange(item.name);
    } else if (item.path) {
      onActiveItemChange(item.name);
    }
  };

  // Special styling for IMS and RMS sections
  const isSpecialSection =
    item.name === "IMS" ||
    item.name === "RMS" ||
    item.name === "Setup" ||
    item.name === "Settings";
  const specialSectionClass = isSpecialSection
    ? "bg-[#1A1F2C] hover:bg-[#2a314a]"
    : "";

  // Special styling for Setup child items based on the image provided
  const setupChildClass = isSetupChild ? "pl-12 py-2.5 text-sm text-white" : "";

  // Admin module with nested structure
  const isAdminSubmodule =
    depth === 1 && (item.name === "Setup" || item.name === "Settings");

  return (
    <li className="w-full">
      {item.path ? (
        <Link
          to={item.path}
          className={cn(
            "flex items-center py-3 px-4 text-white hover:bg-[#2a314a] w-full transition-colors duration-200",
            {
              "bg-[#2a314a]": isActive,
              "justify-center": isCollapsed,
              "pl-8": depth === 1 && !isSetupChild && !isAdminSubmodule,
              "pl-12": depth === 2 && !isSetupChild,
              "pl-16": depth === 3 && !isSetupChild,
            },
            specialSectionClass,
            setupChildClass
          )}
          onClick={handleClick}
          title={isCollapsed ? item.name : undefined}
        >
          <item.icon
            size={isSetupChild ? 16 : 20}
            className={cn("flex-shrink-0 mr-3", {
              "mr-0": isCollapsed,
            })}
          />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-sm">{item.name}</span>
              {item.children && (
                <div className="ml-auto">
                  <ChevronRight size={16} />
                </div>
              )}
            </>
          )}
        </Link>
      ) : (
        <button
          className={cn(
            "flex w-full items-center py-3 px-4 text-white hover:bg-[#2a314a] transition-colors duration-200",
            {
              "bg-[#2a314a]": isActive,
              "justify-center": isCollapsed,
              "pl-8": depth === 1 && !isSetupChild && !isAdminSubmodule,
              "pl-12": depth === 2 && !isSetupChild,
              "pl-16": depth === 3 && !isSetupChild,
            },
            specialSectionClass,
            setupChildClass
          )}
          onClick={handleClick}
          title={isCollapsed ? item.name : undefined}
        >
          <item.icon
            size={isSetupChild ? 16 : 20}
            className={cn("flex-shrink-0 mr-3", {
              "mr-0": isCollapsed,
            })}
          />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-sm">{item.name}</span>
              {item.children && (
                <div className="ml-auto">
                  <ChevronRight
                    size={16}
                    className={cn("transition-transform duration-200", {
                      "rotate-90": isSubmenuOpen,
                    })}
                  />
                </div>
              )}
            </>
          )}
        </button>
      )}

      {isSubmenuOpen && item.children && !isCollapsed && (
        <ul
          className={cn("bg-[#242b3d] bg-opacity-50 py-1", {
            "bg-[#1A1F2C]": isSpecialSection,
            "bg-[#2a314a]": depth === 1 && !isSpecialSection,
          })}
        >
          {item.children.map((child) => {
            // Fix for the type error: We need to check if child.children exists before using it
            return (
              <SidebarItem
                key={child.name}
                item={child}
                isCollapsed={isCollapsed}
                activeItem={activeItem}
                onActiveItemChange={onActiveItemChange}
                depth={depth + 1}
                isSetupChild={false}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};

type AppSidebarProps = {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
};

const AppSidebar: React.FC<AppSidebarProps> = ({
  isCollapsed,
  onToggle,
  isMobile,
}) => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const handleActiveItemChange = (item: string) => {
    setActiveItem(item);
    if (isMobile) {
      onToggle();
    }
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 bg-[#1A1F2C] rounded-md text-white hover:bg-[#2a314a] transition-colors duration-200"
        >
          {!isCollapsed ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-[#1A1F2C] transition-all duration-300 ease-in-out transform",
          {
            "w-60": !isCollapsed,
            "w-16": isCollapsed && !isMobile,
            "translate-x-0": !isCollapsed || !isMobile,
            "-translate-x-full": isCollapsed && isMobile,
          }
        )}
      >
        <div className="h-full flex flex-col">
          <div
            className={cn(
              "flex items-center h-16 px-4 border-b border-white/10",
              {
                "justify-center": isCollapsed,
              }
            )}
          >
            <div
              className={cn("flex items-center", {
                "justify-center": isCollapsed,
              })}
            >
              <img
                src="/epoms-navbar-logo.png"
                alt="MyEPOMSX Logo"
                className={cn("h-14", { "sr-only": isCollapsed })}
              />
              {isCollapsed && <span></span>}
            </div>

            {!isMobile && (
              <button
                onClick={onToggle}
                className={cn(
                  "ml-auto p-1 rounded-md text-white hover:bg-[#2a314a] focus:outline-none transition-colors duration-200",
                  {
                    "mr-auto ml-0": isCollapsed,
                  }
                )}
              >
                {isCollapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronLeft size={20} />
                )}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <ul className="space-y-0.5">
              {sidebarItems.map((item) => (
                <SidebarItem
                  key={item.name}
                  item={item}
                  isCollapsed={isCollapsed}
                  activeItem={activeItem}
                  onActiveItemChange={handleActiveItemChange}
                  isSetupChild={false}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppSidebar;
