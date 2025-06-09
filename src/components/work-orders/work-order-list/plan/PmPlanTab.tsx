import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { usePmPlanLabourData } from "../hooks/pm/use-pm-plan-labour-data";
import { usePmPlanMaterialData } from "../hooks/pm/use-pm-plan-material-data";
import Loading from "@/components/shared/Loading";

interface PmPlanTabProps {
  pmWoId: number; // Passed as a prop to this page
}

const PmPlanTab: React.FC<PmPlanTabProps> = ({ pmWoId }) => {
  const { data: labourData, isLoading: isLabourLoading } = usePmPlanLabourData(pmWoId);
  const { data: materialData, isLoading: isMaterialLoading } = usePmPlanMaterialData(pmWoId);

  const labourColumns: Column[] = [
    { id: "employee_uid", header: "Employee ID", accessorKey: "employee_id.uid_employee" },
    { id: "employee_name", header: "Employee", accessorKey: "employee_id.name" },
    { id: "duration", header: "Duration", accessorKey: "duration" },
  ];

  const materialColumns: Column[] = [
    { id: "item_no", header: "Code", accessorKey: "item_id.item_no" },
    { id: "item_name", header: "Item", accessorKey: "item_id.item_name" },
    { id: "quantity", header: "Quantity", accessorKey: "quantity" },
  ];

  return (
    <div className="space-y-6 mt-6">
      <PageHeader title="Planned Labour Details" />

      {isLabourLoading ? (
        <Loading />
      ) : (
        <DataTable columns={labourColumns} data={labourData || []} />
      )}

      <PageHeader title="Planned Material Details" />

      {isMaterialLoading ? (
        <Loading />
      ) : (
        <DataTable columns={materialColumns} data={materialData || []} />
      )}
    </div>
  );
};

export default PmPlanTab;