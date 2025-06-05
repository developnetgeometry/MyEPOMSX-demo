import React from "react";
import BlankPageTemplate from "@/components/shared/BlankPageTemplate";
import { Users, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import KpiCard from "@/components/shared/KpiCard";

const VendorDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <BlankPageTemplate
        title="Vendor Dashboard"
        subtitle="Overview of vendor performance, contracts, and work status"
        icon={<Users className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Vendors"
          value={24}
          icon={<Users className="h-5 w-5" />}
          change={2}
          changeDirection="up"
          changeLabel="vs last month"
        />

        <KpiCard
          title="Open Work Orders"
          value={42}
          icon={<Clock className="h-5 w-5" />}
          change={-5}
          changeDirection="down"
          positiveChange="down"
          changeLabel="vs last month"
        />

        <KpiCard
          title="Completed Work"
          value={156}
          icon={<CheckCircle className="h-5 w-5" />}
          change={12.5}
          changeDirection="up"
          changeLabel="this quarter"
        />

        <KpiCard
          title="Quality Issues"
          value={7}
          icon={<AlertTriangle className="h-5 w-5" />}
          change={-2}
          changeDirection="down"
          positiveChange="down"
          changeLabel="vs last quarter"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium">Top Vendors by Performance</h3>
          <div className="mt-4 space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Integrity Solutions Inc.</h4>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  96% Rating
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                24 completed work orders this quarter
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Advanced Inspection Services</h4>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  94% Rating
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                18 completed work orders this quarter
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Reliable Maintenance Co.</h4>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
                  88% Rating
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                32 completed work orders this quarter
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboardPage;
