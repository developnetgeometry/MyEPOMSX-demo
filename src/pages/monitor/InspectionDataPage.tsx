import React from "react";
import BlankPageTemplate from "@/components/shared/BlankPageTemplate";
import { ClipboardList } from "lucide-react";

const InspectionDataPage: React.FC = () => {
  return (
    <BlankPageTemplate
      title="Inspection Data"
      subtitle="View and manage asset inspection records and findings"
      icon={<ClipboardList className="h-6 w-6" />}
    />
  );
};

export default InspectionDataPage;
