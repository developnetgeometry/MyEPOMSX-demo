import React from "react";
import BlankPageTemplate from "@/components/shared/BlankPageTemplate";
import { Shield, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const IntegrityPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <BlankPageTemplate
        title="Asset Integrity Management"
        subtitle="Monitor and manage asset integrity data and risk assessments"
        icon={<Shield className="h-6 w-6" />}
      />

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium">Integrity Management Programs</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-full">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <h4 className="font-medium">Mechanical Integrity</h4>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Equipment inspection, testing, and maintenance to prevent
                failures
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-full">
                  <Activity className="h-5 w-5 text-green-500" />
                </div>
                <h4 className="font-medium">Process Safety</h4>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Management of hazards to prevent catastrophic releases
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium">
            Asset Integrity Dashboard Access
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <h4 className="font-medium">RBI Assessment</h4>
              <p className="text-sm text-gray-600 mt-1">
                Risk-Based Inspection assessment and planning
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <h4 className="font-medium">Inspection Data</h4>
              <p className="text-sm text-gray-600 mt-1">
                View and manage inspection findings and data
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <h4 className="font-medium">Corrosion Studies</h4>
              <p className="text-sm text-gray-600 mt-1">
                Corrosion monitoring and analysis results
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrityPage;
