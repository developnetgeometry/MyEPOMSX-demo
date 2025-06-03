import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Probability and consequence levels - reversed to match the image layout
const probabilityLevels = [
  { id: "E", name: "E", description: "Very High", color: "#ef4444" }, // Risk levels are defined by these colors
  { id: "D", name: "D", description: "High", color: "#f97316" },
  { id: "C", name: "C", description: "Medium", color: "#f59e0b" },
  { id: "B", name: "B", description: "Low", color: "#84cc16" },
  { id: "A", name: "A", description: "Very Low", color: "#22c55e" },
];

const consequenceLevels = [
  { id: "1", name: "1", description: "Minor", color: "#22c55e" },
  { id: "2", name: "2", description: "Marginal", color: "#84cc16" },
  { id: "3", name: "3", description: "Moderate", color: "#f59e0b" },
  { id: "4", name: "4", description: "Significant", color: "#f97316" },
  { id: "5", name: "5", description: "Critical", color: "#ef4444" },
];

// Get risk color based on probability and consequence
const getRiskColor = (
  probabilityLevel: string,
  consequenceLevel: string
): string => {
  // Define the color matrix as per the image
  const colorMatrix: { [key: string]: string } = {
    // Probability level E (Very High)
    "E-1": "#FFFF00", // Yellow - Low
    "E-2": "#FFA500", // Orange - Medium
    "E-3": "#FF0000", // Red - High
    "E-4": "#FF0000", // Red - High
    "E-5": "#FF0000", // Red - High

    // Probability level D (High)
    "D-1": "#22c55e", // Green - Very Low
    "D-2": "#FFFF00", // Yellow - Low
    "D-3": "#FFA500", // Orange - Medium
    "D-4": "#FF0000", // Red - High
    "D-5": "#FF0000", // Red - High

    // Probability level C (Medium)
    "C-1": "#22c55e", // Green - Very Low
    "C-2": "#22c55e", // Green - Very Low
    "C-3": "#FFFF00", // Yellow - Low
    "C-4": "#FFA500", // Orange - Medium
    "C-5": "#FF0000", // Red - High

    // Probability level B (Low)
    "B-1": "#22c55e", // Green - Very Low
    "B-2": "#22c55e", // Green - Very Low
    "B-3": "#22c55e", // Green - Very Low
    "B-4": "#FFFF00", // Yellow - Low
    "B-5": "#FFA500", // Orange - Medium

    // Probability level A (Very Low)
    "A-1": "#22c55e", // Green - Very Low
    "A-2": "#22c55e", // Green - Very Low
    "A-3": "#22c55e", // Green - Very Low
    "A-4": "#22c55e", // Green - Very Low
    "A-5": "#FFFF00", // Yellow - Low
  };

  const key = `${probabilityLevel}-${consequenceLevel}`;
  return colorMatrix[key] || "#22c55e"; // Default to green if not found
};

// Get risk level text based on color
const getRiskLevelFromColor = (color: string): string => {
  switch (color) {
    case "#FF0000":
      return "High";
    case "#FFA500":
      return "Medium";
    case "#FFFF00":
      return "Low";
    case "#22c55e":
      return "Very Low";
    default:
      return "Very Low";
  }
};

// Sample risk data for the matrix
const sampleRiskData = [
  // Major risks for Probability = E (Very High)
  {
    id: "1",
    name: "Pressure Transmitter PT-305",
    probability: "E",
    consequence: "5",
    system: "Pressure Monitoring",
    facility: "Central Processing",
  },
  {
    id: "2",
    name: "Flow Control Valve FCV-201",
    probability: "E",
    consequence: "4",
    system: "Flow Control",
    facility: "Pipeline Junction B",
  },

  // Other risks distributed through the matrix
  {
    id: "3",
    name: "Pump Motor Temperature Sensor",
    probability: "D",
    consequence: "5",
    system: "Temperature Monitoring",
    facility: "Pump Station 2",
  },
  {
    id: "4",
    name: "Cooling Tower Fan Motor",
    probability: "C",
    consequence: "3",
    system: "Cooling System",
    facility: "North Field",
  },
  {
    id: "5",
    name: "Compressor Station Alpha",
    probability: "B",
    consequence: "4",
    system: "Gas Compression",
    facility: "North Field",
  },
  {
    id: "6",
    name: "Storage Tank Level Sensor",
    probability: "B",
    consequence: "2",
    system: "Level Monitoring",
    facility: "Tank Farm",
  },
  {
    id: "7",
    name: "Separator Vessel SV-101",
    probability: "C",
    consequence: "4",
    system: "Separator System",
    facility: "Central Processing",
  },
  {
    id: "8",
    name: "Air Cooling Unit ACU-05",
    probability: "A",
    consequence: "2",
    system: "Cooling System",
    facility: "South Plant",
  },
  {
    id: "9",
    name: "Temperature Transmitter TT-203",
    probability: "C",
    consequence: "2",
    system: "Temperature Monitoring",
    facility: "Pipeline Junction B",
  },
  {
    id: "10",
    name: "Pressure Safety Valve PSV-42",
    probability: "B",
    consequence: "5",
    system: "Pressure Safety",
    facility: "North Field",
  },
];

// Calculate the count of assets in each cell
const calculateCellCounts = () => {
  const counts: { [key: string]: number } = {};

  // Initialize all cells with 0
  probabilityLevels.forEach((p) => {
    consequenceLevels.forEach((c) => {
      counts[`${p.id}-${c.id}`] = 0;
    });
  });

  // Count assets in each cell
  sampleRiskData.forEach((risk) => {
    const key = `${risk.probability}-${risk.consequence}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  return counts;
};

interface RiskMatrixProps {
  className?: string;
}

const RiskMatrix: React.FC<RiskMatrixProps> = ({ className }) => {
  const cellCounts = calculateCellCounts();
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("pv");

  // Get assets for a selected cell
  const getAssetsForCell = (probability: string, consequence: string) => {
    return sampleRiskData.filter(
      (risk) =>
        risk.probability === probability && risk.consequence === consequence
    );
  };

  // Handle cell click to show assets
  const handleCellClick = (probability: string, consequence: string) => {
    const key = `${probability}-${consequence}`;
    setSelectedCell(key);
    setIsDialogOpen(true);
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Risk Assessment Matrix</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs
            defaultValue="pv"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pv">PV Risk Ranking</TabsTrigger>
              <TabsTrigger value="piping">Piping Risk Ranking</TabsTrigger>
              <TabsTrigger value="total">Total Risk Ranking</TabsTrigger>
            </TabsList>

            <TabsContent value="pv" className="mt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center font-bold">
                        Probability
                      </TableHead>
                      {consequenceLevels.map((level) => (
                        <TableHead
                          key={level.id}
                          className="text-center font-bold border"
                        >
                          {level.id}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {probabilityLevels.map((probLevel) => (
                      <TableRow key={probLevel.id}>
                        <TableCell className="text-center font-bold border">
                          {probLevel.id}
                        </TableCell>
                        {consequenceLevels.map((consLevel) => {
                          const cellKey = `${probLevel.id}-${consLevel.id}`;
                          const count = cellCounts[cellKey] || 0;
                          const riskColor = getRiskColor(
                            probLevel.id,
                            consLevel.id
                          );

                          return (
                            <TableCell
                              key={cellKey}
                              className="text-center border cursor-pointer hover:opacity-80 p-0"
                              style={{ backgroundColor: riskColor }}
                              onClick={() =>
                                handleCellClick(probLevel.id, consLevel.id)
                              }
                            >
                              <div className="h-12 flex items-center justify-center">
                                <span>{count}</span>
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="piping" className="mt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center font-bold">
                        Probability
                      </TableHead>
                      {consequenceLevels.map((level) => (
                        <TableHead
                          key={level.id}
                          className="text-center font-bold border"
                        >
                          {level.id}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {probabilityLevels.map((probLevel) => (
                      <TableRow key={probLevel.id}>
                        <TableCell className="text-center font-bold border">
                          {probLevel.id}
                        </TableCell>
                        {consequenceLevels.map((consLevel) => {
                          const cellKey = `${probLevel.id}-${consLevel.id}`;
                          const count = cellCounts[cellKey] || 0;
                          const riskColor = getRiskColor(
                            probLevel.id,
                            consLevel.id
                          );

                          return (
                            <TableCell
                              key={cellKey}
                              className="text-center border cursor-pointer hover:opacity-80 p-0"
                              style={{ backgroundColor: riskColor }}
                              onClick={() =>
                                handleCellClick(probLevel.id, consLevel.id)
                              }
                            >
                              <div className="h-12 flex items-center justify-center">
                                <span>{count}</span>
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="total" className="mt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center font-bold">
                        Probability
                      </TableHead>
                      {consequenceLevels.map((level) => (
                        <TableHead
                          key={level.id}
                          className="text-center font-bold border"
                        >
                          {level.id}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {probabilityLevels.map((probLevel) => (
                      <TableRow key={probLevel.id}>
                        <TableCell className="text-center font-bold border">
                          {probLevel.id}
                        </TableCell>
                        {consequenceLevels.map((consLevel) => {
                          const cellKey = `${probLevel.id}-${consLevel.id}`;
                          const count = cellCounts[cellKey] || 0;
                          const riskColor = getRiskColor(
                            probLevel.id,
                            consLevel.id
                          );

                          return (
                            <TableCell
                              key={cellKey}
                              className="text-center border cursor-pointer hover:opacity-80 p-0"
                              style={{ backgroundColor: riskColor }}
                              onClick={() =>
                                handleCellClick(probLevel.id, consLevel.id)
                              }
                            >
                              <div className="h-12 flex items-center justify-center">
                                <span>{count}</span>
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="flex gap-4 justify-center">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-1 rounded-sm"
                  style={{ backgroundColor: "#FF0000" }}
                ></div>
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-1 rounded-sm"
                  style={{ backgroundColor: "#FFA500" }}
                ></div>
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-1 rounded-sm"
                  style={{ backgroundColor: "#FFFF00" }}
                ></div>
                <span className="text-xs">Low</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-1 rounded-sm"
                  style={{ backgroundColor: "#22c55e" }}
                ></div>
                <span className="text-xs">Very Low</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset list dialog */}
      {selectedCell && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Assets in Risk Category</DialogTitle>
              <DialogDescription>
                {selectedCell &&
                  (() => {
                    const [p, c] = selectedCell.split("-");
                    const probText =
                      probabilityLevels.find((l) => l.id === p)?.description ||
                      "";
                    const consText =
                      consequenceLevels.find((l) => l.id === c)?.description ||
                      "";
                    const riskColor = getRiskColor(p, c);
                    const riskLevel = getRiskLevelFromColor(riskColor);

                    return `Probability: ${probText} | Consequence: ${consText} | Risk Level: ${riskLevel}`;
                  })()}
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCell &&
                    (() => {
                      const [p, c] = selectedCell.split("-");
                      const assets = getAssetsForCell(p, c);

                      if (assets.length === 0) {
                        return (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              No assets in this risk category
                            </TableCell>
                          </TableRow>
                        );
                      }

                      return assets.map((asset) => {
                        const riskColor = getRiskColor(
                          asset.probability,
                          asset.consequence
                        );
                        const riskLevel = getRiskLevelFromColor(riskColor);

                        return (
                          <TableRow key={asset.id}>
                            <TableCell className="font-medium">
                              {asset.name}
                            </TableCell>
                            <TableCell>{asset.system}</TableCell>
                            <TableCell>{asset.facility}</TableCell>
                            <TableCell>
                              <Badge
                                style={{
                                  backgroundColor: riskColor,
                                  color:
                                    riskColor === "#FFFF00" ? "black" : "white",
                                }}
                              >
                                {riskLevel}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      });
                    })()}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RiskMatrix;
