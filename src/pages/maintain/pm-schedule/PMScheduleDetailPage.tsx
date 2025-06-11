import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from '@/hooks/use-toast';
import PmScheduleDetailsCard from "@/components/maintain/pm-schedule/workOrder/PmScheduleDetailsCard";
import { usePmScheduleDataById } from "../hooks/use-pm-schedule-data";
import TaskDetailTab from "@/components/maintain/pm-schedule/task-detail/TaskDetailTab";
import MinAcceptCriteriaTab from "@/components/maintain/pm-schedule/minAcceptCriteria/MinAcceptCriteriaTab";
import ChecksheetTab from "@/components/maintain/pm-schedule/checksheet/ChecksheetTab";
import AdditionalInfoTab from "@/components/maintain/pm-schedule/additionalInfo/AdditionalInfoTab";
import MaintainGroupTab from "@/components/maintain/pm-schedule/maintainGroup/MaintainGroupTab";
import PlanTab from "@/components/maintain/pm-schedule/plan/PlanTab";
import RelatedWoTab from "@/components/work-orders/work-order-list/relatedWo/RelatedWoTab";

const PMScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: pmSchedule, isLoading, refetch } = usePmScheduleDataById(Number(id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="PM Schedule Detail" />
        <Button
          variant="outline"
          onClick={() => navigate("/maintain/pm-schedule")}
        >
          Back to PM Schedule
        </Button>
      </div>

      {/* <pre>{JSON.stringify(pmSchedule, null, 2)}</pre> */}

      <PmScheduleDetailsCard
        pmScheduleDetail={pmSchedule} // Pass actual data
        isLoading={isLoading}
        onEditClick={null}
        onDeleteClick={null}
      />

      <Card>
        <CardContent className="pt-6">
          {!isLoading && pmSchedule && (
            <Tabs defaultValue="taskDetail">
              <TabsList>
                <TabsTrigger value="taskDetail">Task Detail</TabsTrigger>
                <TabsTrigger value="minAcceptance">Min Acceptance Citeria</TabsTrigger>
                <TabsTrigger value="checksheet">Checksheet</TabsTrigger>
                <TabsTrigger value="workOrder">Work Order</TabsTrigger>
                <TabsTrigger value="additionalInfo">Additional Info</TabsTrigger>
                <TabsTrigger value="maintainGroup">Maintanable Group</TabsTrigger>
                <TabsTrigger value="plan">Plan</TabsTrigger>
              </TabsList>

              <TabsContent value="taskDetail">
                {id && <TaskDetailTab pmScheduleId={Number(pmSchedule.id)} />}
              </TabsContent>
              <TabsContent value="minAcceptance">
                {id && <MinAcceptCriteriaTab pmScheduleId={Number(pmSchedule.id)} />}
              </TabsContent>
              <TabsContent value="checksheet">
                {id && <ChecksheetTab pmScheduleId={Number(pmSchedule.id)} />}
              </TabsContent>
              <TabsContent value="workOrder">
                {id && <RelatedWoTab assetId={Number(pmSchedule.asset_id.id)} />}
              </TabsContent>
              <TabsContent value="additionalInfo">
                {id && <AdditionalInfoTab pmScheduleId={Number(pmSchedule.id)} />}
              </TabsContent>
              <TabsContent value="maintainGroup">
                {id && <MaintainGroupTab pmScheduleId={Number(pmSchedule.id)} />}
              </TabsContent>
              <TabsContent value="plan">
                {id && <PlanTab pmScheduleId={Number(pmSchedule.id)} workCenterId={pmSchedule.work_center_id.id} />}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PMScheduleDetailPage;