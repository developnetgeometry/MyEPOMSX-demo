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

      <Card>
        <CardContent>
          <PmScheduleDetailsCard
            pmScheduleDetail={{}} // Pass actual data
            onCreateWorkOrder={() => { }}
          />
        </CardContent>
      </Card>

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
          <h1>task detail</h1>
        </TabsContent>
        <TabsContent value="minAcceptance">
          <h1>min accept</h1>
        </TabsContent>
        <TabsContent value="checksheet">
          <h1>checksheet</h1>
        </TabsContent>
        <TabsContent value="workOrder">
          <h1>work order</h1>
        </TabsContent>
        <TabsContent value="additionalInfo">
          <h1>add info</h1>
        </TabsContent>
        <TabsContent value="maintainGroup">
          <h1>maintain</h1>
        </TabsContent>
        <TabsContent value="plan">
          <h1>plan</h1>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PMScheduleDetailPage;