import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import {
    useNewWorkFailureData
} from "@/components/work-orders/work-request/hooks/use-new-work-failure-data";

import Loading from "@/components/shared/Loading";

interface CmFailureTabProps {
    workRequestId: number;
}

const CmFailureTab: React.FC<CmFailureTabProps> = ({ workRequestId }) => {
    const { data: failures, isLoading, refetch } = useNewWorkFailureData(workRequestId);

    return (
        <div className="space-y-6 mt-6">
            <PageHeader
                title="Failure Impact Section"
            />

            {isLoading ? (
                <Loading />
            ) : (
                <div className="space-y-4">
                    {failures?.length === 0 ? (
                        <p className="text-center text-gray-500">No failure records available</p>
                    ) : (
                        failures?.map((failure: any) => (
                            <div
                                key={failure?.id}
                                className="border rounded-lg p-4 shadow-sm bg-white"
                            >
                                <div className="flex gap-6 flex-wrap md:flex-nowrap">
                                    {/* Failure Details */}
                                    <div className="w-full md:w-1/2">
                                        <h5 className="text-md font-semibold mb-2 text-xl">Failure Details</h5>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div className="font-medium text-gray-600">Safety</div>
                                            <div className="text-gray-800">{failure?.safety?.trim() ? failure.safety : "-"}</div>

                                            <div className="font-medium text-gray-600">Likelihood</div>
                                            <div className="text-gray-800">{failure?.like_hood?.trim() ? failure.like_hood : "-"}</div>

                                            <div className="font-medium text-gray-600">Action Taken</div>
                                            <div className="text-gray-800">{failure?.action_taken?.trim() ? failure.action_taken : "-"}</div>

                                            <div className="font-medium text-gray-600">Critical Rank</div>
                                            <div className="text-gray-800">{failure?.critical_rank?.trim() ? failure.critical_rank : "-"}</div>

                                            <div className="font-medium text-gray-600">Probability of Occurrence</div>
                                            <div className="text-gray-800">{failure?.provability_occurrance?.trim() ? failure.provability_occurrance : "-"}</div>

                                            <div className="font-medium text-gray-600">Environmental Consequences</div>
                                            <div className="text-gray-800">{failure?.environment_consequences?.trim() ? failure.environment_consequences : "-"}</div>

                                            <div className="font-medium text-gray-600">Has Consequence</div>
                                            <div className="text-gray-800">{failure?.has_consequence?.trim() ? failure.has_consequence : "-"}</div>

                                            <div className="font-medium text-gray-600">Corrective Action</div>
                                            <div className="text-gray-800">{failure?.corrective_action?.trim() ? failure.corrective_action : "-"}</div>
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div className="w-full md:w-1/2">
                                        <h5 className="text-md font-semibold mb-2 text-xl">Additional Details</h5>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div className="font-medium text-gray-600">Priority</div>
                                            <div className="text-gray-800">{failure?.failure_priority_id?.name?.trim() ? failure.failure_priority_id.name : "-"}</div>

                                            <div className="font-medium text-gray-600">Lost Time Incident</div>
                                            <div className="text-gray-800">{failure?.lost_time_incident ? "Yes" : "No"}</div>

                                            <div className="font-medium text-gray-600">Failure Shutdown</div>
                                            <div className="text-gray-800">{failure?.failure_shutdown ? "Yes" : "No"}</div>

                                            <div className="font-medium text-gray-600">Failure Type</div>
                                            <div className="text-gray-800">{failure?.failure_type_id?.name?.trim() ? failure.failure_type_id.name : "-"}</div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CmFailureTab;