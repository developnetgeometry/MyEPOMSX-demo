import React, { useEffect, useState } from "react";
import BlankPageTemplate from "@/components/shared/BlankPageTemplate";
import { Monitor, Activity, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import KpiCard from "@/components/shared/KpiCard";
import RiskMatrix from "@/components/monitor/RiskMatrix";
import { supabase } from "@/integrations/supabase/client";

const IMSDashboardPage: React.FC = () => {
  const [totalIntegrityAssets, setTotalIntegrityAssets] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntegrityAssets = async () => {
      try {
        const { data, error } = await supabase
          .from("e_asset")
          .select(
            `
            id,
            e_asset_detail!inner(
              is_integrity
            )
          `
          )
          .eq("e_asset_detail.is_integrity", true);

        if (error) {
          console.error("Error fetching integrity assets:", error);
          return;
        }

        setTotalIntegrityAssets(data?.length || 0);
      } catch (error) {
        console.error("Error fetching integrity assets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrityAssets();
  }, []);

  return (
    <div className="space-y-6">
      <BlankPageTemplate
        title="IMS Dashboard"
        subtitle="Integrity Management System dashboard with key metrics and alerts"
        icon={<Monitor className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Assets Monitored"
          value={loading ? "Loading..." : totalIntegrityAssets}
          icon={<Monitor className="h-5 w-5" />}
          change={2.5}
          changeDirection="up"
          changeLabel="vs last month"
        />

        <KpiCard
          title="High Risk Assets"
          value={0}
          icon={<AlertCircle className="h-5 w-5" />}
          change={0}
          changeDirection="neutral"
          changeLabel="no change"
        />

        <KpiCard
          title="Scheduled Inspections"
          value={0}
          icon={<Activity className="h-5 w-5" />}
          change={0}
          changeDirection="neutral"
          changeLabel="no scheduled"
        />

        <KpiCard
          title="Compliant Assets"
          value={0}
          icon={<CheckCircle className="h-5 w-5" />}
          change={0}
          changeDirection="neutral"
          changeLabel="no data"
        />
      </div>

      {/* Add Risk Matrix component */}
      <div className="grid grid-cols-1 gap-6">
        <RiskMatrix className="w-full" />
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium">Recent Integrity Alerts</h3>
          <div className="mt-4 space-y-4">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <div className="flex">
                <AlertCircle className="h-6 w-6 text-amber-500 mr-2" />
                <div>
                  <p className="font-medium">
                    Corrosion Rate Exceeding Threshold
                  </p>
                  <p className="text-sm text-gray-600">
                    Pressure Vessel PV-1023 showing increased corrosion rate
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                <div>
                  <p className="font-medium">Inspection Overdue</p>
                  <p className="text-sm text-gray-600">
                    Heat Exchanger E-201 inspection is 15 days overdue
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex">
                <Activity className="h-6 w-6 text-blue-500 mr-2" />
                <div>
                  <p className="font-medium">Risk Assessment Update</p>
                  <p className="text-sm text-gray-600">
                    Risk assessment for Pipeline P-109 needs review
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IMSDashboardPage;
