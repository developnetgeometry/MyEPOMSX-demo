import React from "react";

interface MinAcceptCriteriaTabProps {
  criteria: any[];
}

const MinAcceptCriteriaTab: React.FC<MinAcceptCriteriaTabProps> = ({
  criteria,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-600 mb-4">
        Minimum Acceptance Criteria
      </h3>
      <div className="border rounded-md overflow-hidden">
        {/* Render criteria */}
      </div>
    </div>
  );
};

export default MinAcceptCriteriaTab;