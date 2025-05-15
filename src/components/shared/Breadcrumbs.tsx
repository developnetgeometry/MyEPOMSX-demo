import React from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

// Map of path segments to display names
const pathMap: Record<string, string> = {
  "admin": "Admin",
  "setup": "Setup",
  "settings": "Settings",
  "manage": "Manage",
  "maintain": "Maintain",
  "measure": "Measure",
  "monitor": "Monitor",
  "integrity": "Integrity",
  "assets": "Assets",
  "asset-hierarchy": "Asset Hierarchy",
  "asset-register": "Asset Register",
  "bom-assembly": "BOM Assembly",
  "facilities": "Facilities",
  "inventory": "Inventory",
  "items-master": "Items Master",
  "material": "Material",
  "package": "Package",
  "parts-inventory": "Parts Inventory",
  "system": "System",
  "rms-asset-list": "RMS Asset List",
  "rms-asset-detail": "RMS Asset Detail",
  "critical-assets": "Critical Assets",
  "rms-dashboard": "RMS Dashboard",
  // Add more mappings as needed
};

// Function to format segment to readable text
const formatSegment = (segment: string): string => {
  if (pathMap[segment]) return pathMap[segment];
  
  // If segment is an ID (typically in a details page)
  if (/^\d+$/.test(segment)) {
    return "Details";
  }
  
  // Convert kebab-case to Title Case
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface BreadcrumbsProps {
  showHome?: boolean;
  overrideItems?: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ showHome = true, overrideItems }) => {
  const location = useLocation();
  
  // If override items are provided, use those instead
  if (overrideItems) {
    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          {overrideItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span className="text-muted-foreground">{item.label}</span>
                )}
              </BreadcrumbItem>
              {index < overrideItems.length - 1 && <BreadcrumbSeparator className="ml-2"/>}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
  
  const pathSegments = location.pathname.split("/").filter(segment => segment);
  
  // Handle root path
  if (pathSegments.length === 0) {
    return null;
  }
  
  // Build breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSegments.length - 1;
    const displayName = formatSegment(segment);
    
    return (
      <div key={path} className="flex items-center">
        <BreadcrumbItem >
          {isLast ? (
            <span className="text-muted-foreground">{displayName}</span>
          ) : (
            <BreadcrumbLink asChild>
              <Link to={path}>{displayName}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator className="ml-2" />}
      </div>
    );
  });
  
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {showHome && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;