import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Printer, Edit } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { assets } from "@/data/sampleData";
import { Separator } from "@/components/ui/separator";

const AssetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find asset by ID - in a real app this would be a DB or API call
  const asset = assets.find((a) => a.id === id);

  if (!asset) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Asset Codet Found</h2>
        <p className="text-gray-500 mb-4">
          The requested asset could not be found.
        </p>
        <Button onClick={() => navigate("/manage/assets")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Asset List
        </Button>
      </div>
    );
  }

  // Status badges styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge variant="solid-success">Active</Badge>;
      case "inactive":
        return <Badge variant="solid-warning">Inactive</Badge>;
      case "maintenance":
        return <Badge variant="solid-info">In Maintenance</Badge>;
      case "decommissioned":
        return <Badge variant="solid-danger">Decommissioned</Badge>;
      default:
        return <StatusBadge status={status} />;
    }
  };

  const getCriticalityBadge = (code: string) => {
    switch (code) {
      case "A":
        return <Badge variant="solid-danger">A - Critical</Badge>;
      case "B":
        return <Badge variant="solid-warning">B - Important</Badge>;
      case "C":
        return <Badge variant="solid-success">C - Standard</Badge>;
      default:
        return <Badge>{code}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-600"
            onClick={() => navigate("/manage/assets")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Asset List
          </Button>

          <div className="text-sm text-gray-500 flex items-center">
            <span className="mx-2">Home</span> &gt;
            <span className="mx-2">Assets</span> &gt;
            <span className="mx-2 font-medium">{asset.assetNo}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="indigo" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Asset Title and Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
          <div className="flex items-center mt-2 text-gray-500">
            <span>Asset ID: {asset.assetNo}</span>
          </div>
        </div>

        <div className="flex flex-col md:items-end space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Status:</span>
            {getStatusBadge(asset.status)}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Criticality:</span>
            {getCriticalityBadge(asset.criticalityCode)}
          </div>
        </div>
      </div>

      {/* Asset Details */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="border-b border-gray-200 w-full rounded-none bg-transparent justify-start px-6 h-14">
              <TabsTrigger
                value="details"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent rounded-none"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent rounded-none"
              >
                Files & Attachments
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent rounded-none"
              >
                Comments
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent rounded-none"
              >
                History
              </TabsTrigger>
              <TabsTrigger
                value="related"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent rounded-none"
              >
                Related
              </TabsTrigger>
              <TabsTrigger
                value="safety"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent rounded-none"
              >
                Safety
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent rounded-none"
              >
                Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-4">
                      Asset Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Asset ID:
                          </span>
                          <span className="font-medium">{asset.assetNo}</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Asset Name:
                          </span>
                          <span className="font-medium">{asset.name}</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Asset Tag:
                          </span>
                          <span className="font-medium">{asset.assetTag}</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Model:</span>
                          <span className="font-medium">{asset.model}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-gray-800 mb-4">
                      Technical Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Status:</span>
                          <div>{getStatusBadge(asset.status)}</div>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            SCE Code:
                          </span>
                          <span className="font-medium">{asset.sceCode}</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Criticality Code:
                          </span>
                          <div>
                            {getCriticalityBadge(asset.criticalityCode)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-4">
                      Location Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Facility:
                          </span>
                          <span className="font-medium">{asset.facility}</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">System:</span>
                          <span className="font-medium">{asset.system}</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Package:
                          </span>
                          <span className="font-medium">{asset.package}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-gray-800 mb-4">
                      Maintenance Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Last Maintenance:
                          </span>
                          <span className="font-medium">April 15, 2025</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Next Scheduled:
                          </span>
                          <span className="font-medium">October 15, 2025</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Maintenance Interval:
                          </span>
                          <span className="font-medium">6 months</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="files" className="p-6">
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No attachments</h3>
                <p className="mt-1 text-gray-500">
                  No files or attachments have been added to this asset.
                </p>
                <Button className="mt-4" variant="outline">
                  Upload Files
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">No comments</h3>
                <p className="mt-1 text-gray-500">
                  Be the first to add a comment to this asset.
                </p>
                <Button className="mt-4" variant="outline">
                  Add Comment
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="history" className="p-6">
              <div className="space-y-6">
                <h3 className="font-medium text-gray-800">Asset History</h3>
                <div className="border-l-2 border-gray-200 pl-4 ml-4 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[1.25rem] mt-1.5 h-3 w-3 rounded-full bg-indigo-500"></div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">Preventive Maintenance</h4>
                        <Badge variant="outline-indigo" className="ml-2">
                          Completed
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        April 15, 2025
                      </p>
                      <p className="text-sm mt-2">
                        Routine maintenance performed - replaced filters and
                        checked oil levels.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[1.25rem] mt-1.5 h-3 w-3 rounded-full bg-amber-500"></div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">Repair Work</h4>
                        <Badge variant="outline-amber" className="ml-2">
                          Completed
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        February 23, 2025
                      </p>
                      <p className="text-sm mt-2">
                        Replaced faulty pressure gauge and calibrated system.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[1.25rem] mt-1.5 h-3 w-3 rounded-full bg-green-500"></div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">Installation</h4>
                        <Badge variant="outline-success" className="ml-2">
                          Completed
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        October 10, 2024
                      </p>
                      <p className="text-sm mt-2">
                        Initial installation and commissioning of the asset.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="related" className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">No related items</h3>
                <p className="mt-1 text-gray-500">
                  No related items have been linked to this asset.
                </p>
                <Button className="mt-4" variant="outline">
                  Add Related Item
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="safety" className="p-6">
              <div className="space-y-6">
                <h3 className="font-medium text-gray-800">
                  Safety Information
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <h4 className="font-medium text-yellow-800">
                    Safety Precautions
                  </h4>
                  <ul className="list-disc pl-5 mt-2 text-sm text-yellow-700 space-y-1">
                    <li>
                      Always wear appropriate PPE when servicing this equipment
                    </li>
                    <li>Follow lockout/tagout procedures before maintenance</li>
                    <li>Check for high voltage warnings</li>
                    <li>Ensure proper ventilation during operation</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h4 className="font-medium text-green-800">
                    Environmental Considerations
                  </h4>
                  <ul className="list-disc pl-5 mt-2 text-sm text-green-700 space-y-1">
                    <li>
                      Contains refrigerant - handle according to regulations
                    </li>
                    <li>Dispose of used oil properly</li>
                    <li>Check for leaks regularly</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="font-medium">Documentation</h3>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-500 mr-2" />
                        <a href="#" className="text-indigo-600 hover:underline">
                          User Manual.pdf
                        </a>
                      </li>
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-500 mr-2" />
                        <a href="#" className="text-indigo-600 hover:underline">
                          Installation Guide.pdf
                        </a>
                      </li>
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-500 mr-2" />
                        <a href="#" className="text-indigo-600 hover:underline">
                          Maintenance Schedule.xlsx
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="font-medium">Contact Information</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500 block">
                          Manufacturer
                        </span>
                        <span className="font-medium">ABB Power Systems</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block">
                          Support Contact
                        </span>
                        <span className="font-medium">+1 (555) 123-4567</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block">
                          Technical Support Email
                        </span>
                        <a
                          href="mailto:support@abbpower.com"
                          className="text-indigo-600 hover:underline"
                        >
                          support@abbpower.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetDetailsPage;
