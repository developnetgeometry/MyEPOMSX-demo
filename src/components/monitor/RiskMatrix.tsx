import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

// Probability and consequence levels
const probabilityLevels = [
  { id: 5, name: 'Very High', color: '#ef4444' }, // Risk levels are defined by these colors
  { id: 4, name: 'High', color: '#f97316' },
  { id: 3, name: 'Medium', color: '#f59e0b' },
  { id: 2, name: 'Low', color: '#84cc16' },
  { id: 1, name: 'Very Low', color: '#22c55e' },
];

const consequenceLevels = [
  { id: 1, name: 'Minor', color: '#22c55e' },
  { id: 2, name: 'Marginal', color: '#84cc16' },
  { id: 3, name: 'Moderate', color: '#f59e0b' },
  { id: 4, name: 'Significant', color: '#f97316' },
  { id: 5, name: 'Critical', color: '#ef4444' },
];

// Calculate risk level based on probability and consequence
const getRiskLevel = (probability: number, consequence: number): string => {
  const riskScore = probability * consequence;
  
  if (riskScore >= 20) return 'Very High';
  if (riskScore >= 10) return 'High';
  if (riskScore >= 4) return 'Medium';
  if (riskScore >= 2) return 'Low';
  return 'Very Low';
};

// Get color based on risk level
const getRiskColor = (probability: number, consequence: number): string => {
  const riskLevel = getRiskLevel(probability, consequence);
  
  switch (riskLevel) {
    case 'Very High': return '#ef4444'; // Red
    case 'High': return '#f97316';      // Orange
    case 'Medium': return '#f59e0b';    // Amber
    case 'Low': return '#84cc16';       // Light green
    case 'Very Low': return '#22c55e';  // Green
    default: return '#22c55e';
  }
};

// Sample risk data for the matrix
const sampleRiskData = [
  // Major risks for Probability = 5 (Very High)
  { id: '1', name: 'Pressure Transmitter PT-305', probability: 5, consequence: 5, system: 'Pressure Monitoring', facility: 'Central Processing' },
  { id: '2', name: 'Flow Control Valve FCV-201', probability: 5, consequence: 4, system: 'Flow Control', facility: 'Pipeline Junction B' },
  
  // Other risks distributed through the matrix
  { id: '3', name: 'Pump Motor Temperature Sensor', probability: 4, consequence: 5, system: 'Temperature Monitoring', facility: 'Pump Station 2' },
  { id: '4', name: 'Cooling Tower Fan Motor', probability: 3, consequence: 3, system: 'Cooling System', facility: 'North Field' },
  { id: '5', name: 'Compressor Station Alpha', probability: 2, consequence: 4, system: 'Gas Compression', facility: 'North Field' },
  { id: '6', name: 'Storage Tank Level Sensor', probability: 2, consequence: 2, system: 'Level Monitoring', facility: 'Tank Farm' },
  { id: '7', name: 'Separator Vessel SV-101', probability: 3, consequence: 4, system: 'Separator System', facility: 'Central Processing' },
  { id: '8', name: 'Air Cooling Unit ACU-05', probability: 1, consequence: 2, system: 'Cooling System', facility: 'South Plant' },
  { id: '9', name: 'Temperature Transmitter TT-203', probability: 3, consequence: 2, system: 'Temperature Monitoring', facility: 'Pipeline Junction B' },
  { id: '10', name: 'Pressure Safety Valve PSV-42', probability: 2, consequence: 5, system: 'Pressure Safety', facility: 'North Field' },
];

// Calculate the count of assets in each cell
const calculateCellCounts = () => {
  const counts: { [key: string]: number } = {};
  
  // Initialize all cells with 0
  probabilityLevels.forEach(p => {
    consequenceLevels.forEach(c => {
      counts[`${p.id}-${c.id}`] = 0;
    });
  });
  
  // Count assets in each cell
  sampleRiskData.forEach(risk => {
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
  
  // Get assets for a selected cell
  const getAssetsForCell = (probability: number, consequence: number) => {
    return sampleRiskData.filter(
      risk => risk.probability === probability && risk.consequence === consequence
    );
  };
  
  // Handle cell click to show assets
  const handleCellClick = (probability: number, consequence: number) => {
    const key = `${probability}-${consequence}`;
    setSelectedCell(key);
    setIsDialogOpen(true);
  };
  
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Matrix</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex mb-4">
            <div className="w-40 flex items-center justify-center">
              <h3 className="font-bold transform -rotate-90">Probability</h3>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-5 gap-1">
                {/* X-axis labels (Consequence) */}
                <div className="col-span-5 flex justify-between mb-2">
                  {consequenceLevels.map((level) => (
                    <div 
                      key={level.id} 
                      className="flex-1 text-center text-sm font-medium" 
                      style={{ color: level.color }}
                    >
                      {level.name}
                    </div>
                  ))}
                </div>
                
                {/* Risk matrix cells */}
                {probabilityLevels.map((probLevel) => (
                  <div key={probLevel.id}>
                    {/* Y-axis label (Probability) */}
                    <div className="col-span-1 flex items-center pr-2 mb-1">
                      <span 
                        className="w-full text-right text-sm font-medium" 
                        style={{ color: probLevel.color }}
                      >
                        {probLevel.name}
                      </span>
                    </div>
                    
                    {/* Risk cells for current probability level */}
                    {consequenceLevels.map((consLevel) => {
                      const riskLevel = getRiskLevel(probLevel.id, consLevel.id);
                      const cellKey = `${probLevel.id}-${consLevel.id}`;
                      const count = cellCounts[cellKey] || 0;
                      
                      return (
                        <div 
                          key={cellKey}
                          className="flex-1 aspect-square flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ 
                            backgroundColor: getRiskColor(probLevel.id, consLevel.id),
                            borderColor: 'rgba(0,0,0,0.1)'
                          }}
                          onClick={() => handleCellClick(probLevel.id, consLevel.id)}
                        >
                          <div className="text-white font-bold text-sm">
                            {riskLevel}
                          </div>
                          <div className="text-white mt-1 font-bold">
                            {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-2">
                <h3 className="font-bold">Consequence</h3>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Risk Legend</h4>
            <div className="flex gap-4">
              {['Very Low', 'Low', 'Medium', 'High', 'Very High'].map((level, index) => (
                <div key={level} className="flex items-center">
                  <div 
                    className="w-4 h-4 mr-1 rounded-sm" 
                    style={{ 
                      backgroundColor: [
                        '#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444'
                      ][index] 
                    }}
                  ></div>
                  <span className="text-xs">{level}</span>
                </div>
              ))}
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
                {selectedCell && (() => {
                  const [p, c] = selectedCell.split('-').map(Number);
                  const probText = probabilityLevels.find(l => l.id === p)?.name || '';
                  const consText = consequenceLevels.find(l => l.id === c)?.name || '';
                  const riskLevel = getRiskLevel(p, c);
                  
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
                  {selectedCell && (() => {
                    const [p, c] = selectedCell.split('-').map(Number);
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
                    
                    return assets.map(asset => {
                      const riskLevel = getRiskLevel(asset.probability, asset.consequence);
                      const riskColor = getRiskColor(asset.probability, asset.consequence);
                      
                      return (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">{asset.name}</TableCell>
                          <TableCell>{asset.system}</TableCell>
                          <TableCell>{asset.facility}</TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: riskColor }}>
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
