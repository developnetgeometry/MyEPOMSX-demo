// src/components/asset/AddBomDialog.tsx
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

interface AddBomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: number;
  onBomAdded: () => void;
  onNewBomRequest: () => void;
}

export const AddBomDialog: React.FC<AddBomDialogProps> = ({
  isOpen,
  onClose,
  assetId,
  onBomAdded,
  onNewBomRequest,
}) => {
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBom, setSelectedBom] = useState<number | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Query to fetch available BOMs
  const { data: availableBoms, isLoading } = useQuery({
    queryKey: ["availableBoms", assetId, searchTerm],
    queryFn: async () => {
      // Get current asset's BOM ID if exists
    //   @ts-ignore
      const { data: assetDetail, error: assetDetailError } = await supabase
        .from("e_asset_detail")
        .select("bom_id")
        .eq("asset_id", assetId)
        .single();

      if (assetDetailError && assetDetailError.code !== "PGRST116") { // Ignore no rows found
        throw assetDetailError;
      }

      const currentBomId = assetDetail?.bom_id;

      // Fetch BOMs that are not the current one
      let query = supabase
        .from("e_bom_assembly")
        .select("id, bom_name, bom_code, description")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`bom_name.ilike.%${searchTerm}%,bom_code.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter out current BOM if exists
      return currentBomId 
        ? data.filter(bom => bom.id !== currentBomId)
        : data;
    },
    enabled: isOpen && activeTab === "existing",
  });

  const handleAssignExisting = async () => {
    if (!selectedBom) return;

    setIsAssigning(true);
    try {
      // Check if asset_detail exists
      const { data: assetDetail, error: assetDetailError } = await supabase
        .from("e_asset_detail")
        .select("id")
        .eq("asset_id", assetId)
        .single();

      if (assetDetailError && assetDetailError.code !== "PGRST116") {
        throw assetDetailError;
      }

      if (assetDetail) {
        // Update existing asset_detail
        const { error } = await supabase
          .from("e_asset_detail")
          .update({ bom_id: selectedBom })
          .eq("id", assetDetail.id);

        if (error) throw error;
      } else {
        // Create new asset_detail with BOM
        const { error } = await supabase
          .from("e_asset_detail")
          .insert({
            asset_id: assetId,
            bom_id: selectedBom,
            is_active: true
          });

        if (error) throw error;
      }

      onBomAdded();
      onClose();
    } catch (error) {
      console.error("Error assigning BOM:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bill of Materials</DialogTitle>
          <DialogDescription>
            Select an existing BOM or create a new one to assign to this asset.
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
                  placeholder="Search BOMs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : availableBoms && availableBoms.length > 0 ? (
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {availableBoms.map((bom) => (
                    <div
                      key={bom.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedBom === bom.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                      }`}
                      onClick={() => setSelectedBom(bom.id)}
                    >
                      <div className="font-medium">{bom.bom_name}</div>
                      <div className="text-sm text-gray-500">Code: {bom.bom_code}</div>
                      {bom.description && (
                        <div className="text-sm text-gray-500 truncate">{bom.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="text-gray-500 mb-2">No BOMs found</div>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setActiveTab("new");
                      setSearchTerm("");
                    }}
                  >
                    Create New BOM
                  </Button>
                </div>
              )}
              
              <Button
                onClick={handleAssignExisting}
                disabled={!selectedBom || isAssigning}
                className="w-full"
              >
                {isAssigning ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Assign Selected BOM
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Create a new Bill of Materials that will be assigned to this asset.
              </p>
              <Button 
                onClick={() => {
                  onNewBomRequest();
                  onClose();
                }}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New BOM
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};