import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { Button } from "./button";
import { ChevronDown, ChevronRight } from "lucide-react";

type HierarchyNodeProps = {
  node: any;
  level?: number;
  onSelect: (node: any) => void;
};

const HierarchyNode: React.FC<HierarchyNodeProps> = ({ node, level = 0, onSelect }) => {
  const [isOpen, setIsOpen] = useState(level === 0);
  const hasChildren = node.children && node.children.length > 0;
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  
  const handleSelect = () => {
    onSelect(node);
  };
  
  const getNodeIcon = (type: string) => {
    switch(type) {
      case 'facility': return <span className="h-4 w-4 text-blue-500">🏢</span>;
      case 'system': return <span className="h-4 w-4 text-green-500">⚙️</span>;
      case 'package': return <span className="h-4 w-4 text-orange-500">📦</span>;
      case 'asset': return <span className="h-4 w-4 text-purple-500">🔧</span>;
      default: return <span className="h-4 w-4">•</span>;
    }
  };
  
  return (
    <div className="pl-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div 
          className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-md ${level === 0 ? 'mt-0' : 'mt-1'}`}
          onClick={handleSelect}
        >
          {hasChildren && (
            <CollapsibleTrigger asChild onClick={handleToggle}>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 mr-1">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          )}
          {!hasChildren && <div className="w-5 mr-1" />}
          <span className="mr-2">{getNodeIcon(node.type)}</span>
          <span className="text-sm">{node.name}</span>
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