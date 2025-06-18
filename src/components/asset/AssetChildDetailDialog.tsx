import React from "react";
import TabDetailDialog from "./TabDetailDialog";
import { formatDate } from "@/utils/formatters";

// Field configuration for child asset detail view
const childAssetDetailFields = [
  { name: "asset_no", label: "Asset No" },
  { name: "asset_name", label: "Asset Name" },
  { name: "asset_tag", label: "Asset Tag" },
  { name: "status", label: "Status" },
  { name: "asset_detail.category", label: "Category" },
  { name: "asset_detail.type", label: "Type" },
  { name: "asset_detail.serial_number", label: "Serial Number" },
  { name: "asset_detail.specification", label: "Specification" },
  { name: "asset_detail.asset_class", label: "Class" },
  { name: "commission_date", label: "Commission Date", render: (value: string) => formatDate(value) },
];

export interface AssetChildDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Record<string, any> | null;
}

const AssetChildDetailDialog: React.FC<AssetChildDetailDialogProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  return (
    <TabDetailDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Child Asset Details"
      description="View details for this child asset."
      fields={childAssetDetailFields}
      data={data}
    />
  );
};

export default AssetChildDetailDialog;
