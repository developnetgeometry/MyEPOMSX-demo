// src/components/asset/AddChildAssetDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Plus, Search } from "lucide-react";

interface AddChildAssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  parentAssetId: number;
  childAssets: { id: number }[]; // <-- add this
  onChildAdded: () => void;
  onNewAssetRequest: () => void;
}

const AddChildAssetDialog: React.FC<AddChildAssetDialogProps> = ({
  isOpen,
  onClose,
  parentAssetId,
  childAssets,
  onChildAdded,
  onNewAssetRequest,
}) => {
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const exclusionIds = [
    parentAssetId,
    ...childAssets.map((a) => a.id),
  ];

  // Query to fetch assets that are not already children
  const { data: availableAssets, isLoading } = useQuery({
    queryKey: ["availableAssetsForParent", parentAssetId, exclusionIds, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("e_asset")
        .select("id, asset_no, asset_name, status_id");

      if (exclusionIds.length > 0) {
        query = query.not("id", "in", `(${exclusionIds.join(",")})`);
      }

      if (searchTerm) {
        query = query.or(`asset_no.ilike.%${searchTerm}%,asset_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: isOpen && activeTab === "existing",
  });

  const handleAssignExisting = async () => {
  if (!selectedAsset) return;

  setIsAssigning(true);
  try {
    const { error } = await supabase
      .from('e_asset')
      .update({ parent_asset_id: parentAssetId })
      .eq('id', selectedAsset);

    if (error) throw error;

    onChildAdded();
    onClose();
  } catch (error) {
    console.error("Error assigning child asset:", error);
  } finally {
    setIsAssigning(false);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Child Asset</DialogTitle>
          <DialogDescription>
            Select an existing asset or create a new one to add as a child.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Select Existing</TabsTrigger>
            <TabsTrigger value="new">Create New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : availableAssets && availableAssets.length > 0 ? (
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {availableAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedAsset === asset.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                      }`}
                      onClick={() => setSelectedAsset(asset.id)}
                    >
                      <div className="font-medium">{asset.asset_name}</div>
                      <div className="text-sm text-gray-500">Asset No: {asset.asset_no}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="text-gray-500 mb-2">No assets found</div>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setActiveTab("new");
                      setSearchTerm("");
                    }}
                  >
                    Create New Asset
                  </Button>
                </div>
              )}
              
              <Button
                onClick={handleAssignExisting}
                disabled={!selectedAsset || isAssigning}
                className="w-full"
              >
                {isAssigning ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Assign Selected Asset
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Create a new asset that will be automatically added as a child of this asset.
              </p>
              <Button 
                onClick={() => {
                  onNewAssetRequest();
                  onClose();
                }}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Asset
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddChildAssetDialog;