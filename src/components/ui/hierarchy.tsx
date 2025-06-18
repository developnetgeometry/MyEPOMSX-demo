import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { Button } from "./button";
import {
  Box,
  Building,
  ChevronDown,
  ChevronRight,
  Cpu,
  Network,
} from "lucide-react";

type HierarchyNodeProps = {
  node: any;
  level?: number;
  onSelect: (node: any) => void;
  expandedNodes: Set<string>;
  setExpandedNodes: (nodes: Set<string>) => void;
};

const HierarchyNode: React.FC<HierarchyNodeProps> = ({
  node,
  onSelect,
  expandedNodes,
  setExpandedNodes,
  level = 0,
}) => {
  const isOpen = expandedNodes.has(String(node.id));
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (eOrOpen: any) => {
    // If called from Collapsible, eOrOpen is a boolean
    if (typeof eOrOpen === "boolean") {
      const newSet = new Set(expandedNodes);
      if (eOrOpen) {
        newSet.add(String(node.id)); // Always use String
      } else {
        newSet.delete(String(node.id));
      }
      setExpandedNodes(newSet);
      return;
    }
    // If called from button click, eOrOpen is an event
    if (eOrOpen && typeof eOrOpen.stopPropagation === "function") {
      eOrOpen.stopPropagation();
      const newSet = new Set(expandedNodes);
      if (isOpen) {
        newSet.delete(String(node.id));
      } else {
        newSet.add(String(node.id));
      }
      setExpandedNodes(newSet);
    }
  };

  const handleSelect = () => {
    onSelect(node);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "facility":
        return (
          <span className="h-4 w-4 text-blue-500">
            <Building className="h-4 w-4 mr-2" />
          </span>
        );
      case "system":
        return (
          <span className="h-4 w-4 text-green-500">
            <Network className="h-4 w-4 mr-2" />
          </span>
        );
      case "package":
        return (
          <span className="h-4 w-4 text-orange-500">
            <Box className="h-4 w-4 mr-2" />
          </span>
        );
      case "asset":
        return (
          <span className="h-4 w-4 text-purple-500">
            <Cpu className="h-4 w-4 mr-2" />
          </span>
        );
      default:
        return <span className="h-4 w-4">•</span>;
    }
  };

  return (
    <div className="pl-2">
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        <div
          className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-md ${
            level === 0 ? "mt-0" : "mt-1"
          }`}
          onClick={handleSelect}
        >
          {hasChildren && (
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 mr-1"
                onClick={(e) => e.stopPropagation()} // Prevents handleSelect when clicking chevron
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          )}
          {!hasChildren && <div className="w-5 mr-1" />}
          <span className="mr-2">{getNodeIcon(node.type)}</span>
          <span className="text-sm">
            {node.type === "asset" ? node.asset_no : node.name}
          </span>
        </div>

        {hasChildren && (
          <CollapsibleContent>
            <div className="border-l-2 border-gray-200 ml-2 pl-2">
              {node.children.map((child: any, index: number) => (
                <HierarchyNode
                  key={`${child.id}-${index}`}
                  node={child}
                  level={level + 1}
                  onSelect={onSelect}
                  expandedNodes={expandedNodes} // <-- add this
                  setExpandedNodes={setExpandedNodes} // <-- and this
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

export default HierarchyNode;
