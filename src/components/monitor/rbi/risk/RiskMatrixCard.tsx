import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Probability and consequence levels
const probabilityLevels = [
    { id: "E", name: "E", description: "Very High" },
    { id: "D", name: "D", description: "High" },
    { id: "C", name: "C", description: "Medium" },
    { id: "B", name: "B", description: "Low" },
    { id: "A", name: "A", description: "Very Low" },
];

const consequenceLevels = [
    { id: "1", name: "1", description: "Minor" },
    { id: "2", name: "2", description: "Marginal" },
    { id: "3", name: "3", description: "Moderate" },
    { id: "4", name: "4", description: "Significant" },
    { id: "5", name: "5", description: "Critical" },
];

// Get risk color and label based on probability and consequence
const getRiskDetails = (probabilityLevel: string, consequenceLevel: string): { color: string; label: string } => {
    const riskMatrix: { [key: string]: { color: string; label: string } } = {
        "E-1": { color: "#FFFF00", label: "MEDIUM" },
        "E-2": { color: "#FFA500", label: "HIGH" },
        "E-3": { color: "#FF0000", label: "VERY HIGH" },
        "E-4": { color: "#FF0000", label: "VERY HIGH" },
        "E-5": { color: "#FF0000", label: "VERY HIGH" },
        "D-1": { color: "#22c55e", label: "LOW" },
        "D-2": { color: "#FFFF00", label: "MEDIUM" },
        "D-3": { color: "#FFA500", label: "HIGH" },
        "D-4": { color: "#FF0000", label: "VERY HIGH" },
        "D-5": { color: "#FF0000", label: "VERY HIGH" },
        "C-1": { color: "#22c55e", label: "LOW" },
        "C-2": { color: "#22c55e", label: "LOW" },
        "C-3": { color: "#FFFF00", label: "MEDIUM" },
        "C-4": { color: "#FFA500", label: "HIGH" },
        "C-5": { color: "#FF0000", label: "VERY HIGH" },
        "B-1": { color: "#22c55e", label: "LOW" },
        "B-2": { color: "#22c55e", label: "LOW" },
        "B-3": { color: "#22c55e", label: "LOW" },
        "B-4": { color: "#FFFF00", label: "MEDIUM" },
        "B-5": { color: "#FFA500", label: "HIGH" },
        "A-1": { color: "#22c55e", label: "LOW" },
        "A-2": { color: "#22c55e", label: "LOW" },
        "A-3": { color: "#22c55e", label: "LOW" },
        "A-4": { color: "#22c55e", label: "LOW" },
        "A-5": { color: "#FFFF00", label: "MEDIUM" },
    };

    const key = `${probabilityLevel}-${consequenceLevel}`;
    return riskMatrix[key] || { color: "#22c55e", label: "LOW" }; // Default to green and LOW if not found
};

interface RiskMatrixProps {
    x?: string; // Probability level to highlight
    y?: string; // Consequence level to highlight
    className?: string;
    intInspection?: string; // Internal inspection string
    extInspection?: string; // External inspection string
    envCrack?: string; // Environmental crack string
    intInspectionInterval?: string; // Internal inspection interval
    extInspectionInterval?: string; // External inspection interval
    envCrackInterval?: string; // Environmental crack interval
}

// InspectionCard component for horizontal cards
interface InspectionCardProps {
    title: string;
    content: string;
    interval?: string;
}

const InspectionCard: React.FC<InspectionCardProps> = ({ title, content, interval }) => {
    if (!content || content.trim() === "") {
        return null; // Hide the card if content is empty
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-3">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm">{content}</p>
                </div>
                {interval && (
                    <div className="ml-4 text-right">
                        <span className="text-sm font-medium text-gray-500">Interval</span>
                        <p className="text-sm font-semibold text-gray-800">{interval}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const RiskMatrix: React.FC<RiskMatrixProps> = ({ 
    x, 
    y, 
    className, 
    intInspection, 
    extInspection, 
    envCrack,
    intInspectionInterval,
    extInspectionInterval,
    envCrackInterval
}) => {
    const highlightedCell = x && y ? `${x}-${y}` : null; // Highlighted cell is fixed and cannot be changed

    return (
        <div className={className}>

            {/* Risk Matrix Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16 text-center font-bold">Probability</TableHead>
                        {consequenceLevels.map((level) => (
                            <TableHead key={level.id} className="text-center font-bold border">
                                {level.id}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {probabilityLevels.map((probLevel) => (
                        <TableRow key={probLevel.id}>
                            <TableCell className="text-center font-bold border">{probLevel.id}</TableCell>
                            {consequenceLevels.map((consLevel) => {
                                const cellKey = `${probLevel.id}-${consLevel.id}`;
                                const { color, label } = getRiskDetails(probLevel.id, consLevel.id);
                                const isHighlighted = highlightedCell === cellKey;

                                return (
                                    <TableCell
                                        key={cellKey}
                                        className={`text-center p-0 
                                                ${isHighlighted
                                                ? "border-4 border-blue-600 ring-2 ring-blue-400 font-bold"
                                                : "border"
                                            }`}
                                        style={{ backgroundColor: color }}
                                    >
                                        <div className="h-12 flex flex-col items-center justify-center">
                                            {isHighlighted ? (
                                                <>
                                                    <span className="text-sm">★</span>
                                                    <span className="text-sm font-bold">{label}</span>
                                                </>
                                            ) : (
                                                <span className="text-sm">{label}</span>
                                            )}
                                        </div>
                                    </TableCell>

                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Inspection Cards */}
            <div className="mb-6 mt-6 space-y-3">
                <InspectionCard 
                    title="Internal Inspection" 
                    content={intInspection || ""} 
                    interval={intInspectionInterval}
                />
                <InspectionCard 
                    title="External Inspection" 
                    content={extInspection || ""} 
                    interval={extInspectionInterval}
                />
                <InspectionCard 
                    title="Environmental Crack" 
                    content={envCrack || ""} 
                    interval={envCrackInterval}
                />
            </div>
        </div>
    );
};

export default RiskMatrix;