import React from "react";

interface ChecksheetTabProps {
  checksheetNotes: string;
  onChecksheetChange: (value: string) => void;
}

const ChecksheetTab: React.FC<ChecksheetTabProps> = ({
  checksheetNotes,
  onChecksheetChange,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-600 mb-4">Checksheet</h3>
      <textarea
        value={checksheetNotes}
        onChange={(e) => onChecksheetChange(e.target.value)}
        className="w-full border rounded-md p-2"
      />
    </div>
  );
};

export default ChecksheetTab;