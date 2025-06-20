import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import Loading from "@/components/shared/Loading";
import { usePmMaintainableGroupData } from "../hooks/pm/use-pm-maintanable-group-data";

interface PmMaintainGroupTabProps {
  pmWoId: number; // Passed as a prop to this page
}

const PmMaintainGroupTab: React.FC<PmMaintainGroupTabProps> = ({ pmWoId }) => {
  const { data: maintainableGroups, isLoading } = usePmMaintainableGroupData(pmWoId);

  const columns: Column[] = [
    {
      id: "asset_no",
      header: "Asset Code",
      accessorKey: "asset_id.asset_no",
    },
    {
      id: "asset_name",
      header: "Asset Name",
      accessorKey: "asset_id.asset_name",
    },
    {
      id: "group_id",
      header: "Group",
      accessorKey: "group_id.name",
    },
  ];

  return (
    <div className="space-y-6 mt-6">
      <PageHeader title="Maintainable Groups" />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable columns={columns} data={maintainableGroups || []} />
      )}
    </div>
  );
};

export default PmMaintainGroupTab;