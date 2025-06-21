import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssetGroupData } from "@/hooks/lookup/lookup-asset-group";
import { useAssetData } from "@/pages/work-orders/hooks/use-apsf-by-project-data";

interface MaintainGroupDialogFormProps {
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
}

const MaintainGroupDialogForm: React.FC<MaintainGroupDialogFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const { data: assets, isLoading: isAssetsLoading } = useAssetData();
  const { data: assetGroups, isLoading: isAssetGroupsLoading } = useAssetGroupData();

  const [formData, setFormData] = useState({
    asset_id: initialData?.asset_id?.id || null,
    group_id: initialData?.group_id?.id  || null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold">Maintain Group Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="asset_id">Asset</Label>
                <Select
                  value={formData.asset_id?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, asset_id: parseInt(value) }))
                  }
                >
                  <SelectTrigger id="asset_id" className="w-full">
                    <SelectValue
                      placeholder="Select Asset"
                      defaultValue={
                        assets?.find((asset) => asset.id === formData.asset_id)?.asset_name || ""
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {assets?.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id.toString()}>
                        {asset.asset_no} - {asset.asset_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="group_id">Asset Group</Label>
                <Select
                  value={formData.group_id?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, group_id: parseInt(value) }))
                  }
                >
                  <SelectTrigger id="group_id" className="w-full">
                    <SelectValue
                      placeholder="Select Asset Group"
                      defaultValue={
                        assetGroups?.find((group) => group.id === formData.group_id)?.name || ""
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {assetGroups?.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </>
      )}
    </form>
  );
};

export default MaintainGroupDialogForm;