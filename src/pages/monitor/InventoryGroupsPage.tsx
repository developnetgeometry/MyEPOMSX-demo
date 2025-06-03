import React from "react";
import BlankPageTemplate from "@/components/shared/BlankPageTemplate";
import { Box } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const InventoryGroupsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <BlankPageTemplate
        title="Inventory Groups"
        subtitle="Manage and view grouped inventory items and their relationships"
        icon={<Box className="h-6 w-6" />}
      />

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium">Equipment Groups</h3>
          <div className="mt-4 space-y-4">
            {/* Sample inventory groups content */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium">Pressure Vessels Group A</h4>
              <p className="text-sm text-gray-600 mt-1">
                12 vessels with similar service conditions
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium">Heat Exchangers - Process Area 2</h4>
              <p className="text-sm text-gray-600 mt-1">
                8 exchangers in high-temperature service
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium">Critical Piping Systems</h4>
              <p className="text-sm text-gray-600 mt-1">
                24 piping circuits in corrosive service
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryGroupsPage;
