import React from "react";

interface AdditionalInfoTabProps {
  additionalInfo: string;
  onAdditionalInfoChange: (value: string) => void;
}

const AdditionalInfoTab: React.FC<AdditionalInfoTabProps> = ({
  additionalInfo,
  onAdditionalInfoChange,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-600 mb-4">
        Additional Information
      </h3>
      <textarea
        value={additionalInfo}
        onChange={(e) => onAdditionalInfoChange(e.target.value)}
        className="w-full border rounded-md p-2"
      />
    </div>
  );
};

export default AdditionalInfoTab;