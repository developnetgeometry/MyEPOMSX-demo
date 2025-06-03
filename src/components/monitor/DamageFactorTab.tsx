import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RBIAssessment } from "@/types/monitoring";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DamageFactorForm from "./DamageFactorForm";

interface DamageFactorTabProps {
  assessment: RBIAssessment;
  onAssessmentChange?: (assessment: RBIAssessment) => void;
  readOnly?: boolean;
}

const DamageFactorTab: React.FC<DamageFactorTabProps> = ({
  assessment,
  onAssessmentChange,
  readOnly = false,
}) => {
  const handleAssessmentChange = (updatedAssessment: RBIAssessment) => {
    if (readOnly || !onAssessmentChange) return;
    onAssessmentChange(updatedAssessment);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Last Inspection Date */}
        <div>
          <Label htmlFor="lastInspectionDate">Last Inspection Date</Label>
          <Input
            id="lastInspectionDate"
            type="date"
            value={assessment.lastInspectionDate || ""}
            onChange={(e) =>
              onAssessmentChange &&
              onAssessmentChange({
                ...assessment,
                lastInspectionDate: e.target.value,
              })
            }
            readOnly={readOnly}
            className="w-full"
          />
        </div>

        {/* Last Coating Date */}
        <div>
          <Label htmlFor="lastCoatingDate">Last Coating Date</Label>
          <Input
            id="lastCoatingDate"
            type="date"
            value={assessment.lastCoatingDate || ""}
            onChange={(e) =>
              onAssessmentChange &&
              onAssessmentChange({
                ...assessment,
                lastCoatingDate: e.target.value,
              })
            }
            readOnly={readOnly}
            className="w-full"
          />
        </div>

        {/* Nthin A */}
        <div>
          <Label htmlFor="nthinA">Nthin A</Label>
          <Input
            id="nthinA"
            type="number"
            value={assessment.nthinA || 0}
            onChange={(e) =>
              onAssessmentChange &&
              onAssessmentChange({
                ...assessment,
                nthinA: Number(e.target.value),
              })
            }
            readOnly={readOnly}
            className="w-full"
            step="0.01"
          />
        </div>

        {/* Nthin B */}
        <div>
          <Label htmlFor="nthinB">Nthin B</Label>
          <Input
            id="nthinB"
            type="number"
            value={assessment.nthinB || 0}
            onChange={(e) =>
              onAssessmentChange &&
              onAssessmentChange({
                ...assessment,
                nthinB: Number(e.target.value),
              })
            }
            readOnly={readOnly}
            className="w-full"
            step="0.01"
          />
        </div>

        {/* FS Thin */}
        <div>
          <Label htmlFor="fsThin">FS Thin</Label>
          <Input
            id="fsThin"
            type="number"
            value={assessment.fsThin || 0}
            onChange={(e) =>
              onAssessmentChange &&
              onAssessmentChange({
                ...assessment,
                fsThin: Number(e.target.value),
              })
            }
            readOnly={readOnly}
            className="w-full"
            step="0.01"
          />
        </div>

        {/* SR Thin */}
        <div>
          <Label htmlFor="srThin">SR Thin</Label>
          <Input
            id="srThin"
            type="number"
            value={assessment.srThin || 0}
            onChange={(e) =>
              onAssessmentChange &&
              onAssessmentChange({
                ...assessment,
                srThin: Number(e.target.value),
              })
            }
            readOnly={readOnly}
            className="w-full"
            step="0.01"
          />
        </div>

        {/* DFThin1 */}
        <div>
          <Label htmlFor="dfThin1">DFThin1</Label>
          <Input
            id="dfThin1"
            type="number"
            value={assessment.dfThin1 || 0}
            onChange={(e) =>
              onAssessmentChange &&
              onAssessmentChange({
                ...assessment,
                dfThin1: Number(e.target.value),
              })
            }
            readOnly={readOnly}
            className="w-full"
            step="0.01"
          />
        </div>

        {/* DFThin2 */}
        <div>
          <Label htmlFor="dfThin2">DFThin2</Label>
          <Input
            id="dfThin2"
            type="number"
            value={assessment.dfThin2 || 0}
            onChange={(e) =>
              onAssessmentChange &&
              onAssessmentChange({
                ...assessment,
                dfThin2: Number(e.target.value),
              })
            }
            readOnly={readOnly}
            className="w-full"
            step="0.01"
          />
        </div>

        {/* Creep */}
        <div>
          <Label htmlFor="creep">Creep</Label>
          <Input
            id="creep"
            type="number"
            value={assessment.creep || 0}
            onChange={(e) =>
              onAssessmentChange &&
              onAssessmentChange({
                ...assessment,
                creep: Number(e.target.value),
              })
            }
            readOnly={readOnly}
            className="w-full"
            step="0.01"
          />
        </div>
      </div>

      {/* Additional fields in accordion sections */}
      <Accordion type="multiple" className="w-full space-y-4">
        {/* DF THIN */}
        <AccordionItem
          value="df-thin"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted">
            <span className="text-base font-medium">
              Additional DF THIN Parameters
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pothin1">POThin1</Label>
                <Input
                  id="pothin1"
                  type="number"
                  value={assessment.pothin1 || 0}
                  onChange={(e) =>
                    onAssessmentChange &&
                    onAssessmentChange({
                      ...assessment,
                      pothin1: Number(e.target.value),
                    })
                  }
                  readOnly={readOnly}
                  className="w-full"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="agerc">Age RC</Label>
                <Input
                  id="agerc"
                  type="number"
                  value={assessment.agerc || 0}
                  onChange={(e) =>
                    onAssessmentChange &&
                    onAssessmentChange({
                      ...assessment,
                      agerc: Number(e.target.value),
                    })
                  }
                  readOnly={readOnly}
                  className="w-full"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="bhthin">BHThin</Label>
                <Input
                  id="bhthin"
                  type="number"
                  value={assessment.bhthin || 0}
                  onChange={(e) =>
                    onAssessmentChange &&
                    onAssessmentChange({
                      ...assessment,
                      bhthin: Number(e.target.value),
                    })
                  }
                  readOnly={readOnly}
                  className="w-full"
                  step="0.01"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* DF EXT - Using the new DamageFactorForm */}
        <AccordionItem
          value="df-ext"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted">
            <span className="text-base font-medium">DF EXT</span>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-6">
            <DamageFactorForm
              assessment={assessment}
              onAssessmentChange={handleAssessmentChange}
              readOnly={readOnly}
              formType="ext"
            />
          </AccordionContent>
        </AccordionItem>

        {/* DF EXT.CLSCC - Using the new DamageFactorForm */}
        <AccordionItem
          value="df-ext-clscc"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted">
            <span className="text-base font-medium">DF EXT.CLSCC</span>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-6">
            <DamageFactorForm
              assessment={assessment}
              onAssessmentChange={handleAssessmentChange}
              readOnly={readOnly}
              formType="ext.clscc"
            />
          </AccordionContent>
        </AccordionItem>

        {/* For the rest of the forms, we'll use the DamageFactorForm with appropriate formType */}
        <AccordionItem
          value="df-mfat"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted">
            <span className="text-base font-medium">DF MFAT</span>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-6">
            <DamageFactorForm
              assessment={assessment}
              onAssessmentChange={handleAssessmentChange}
              readOnly={readOnly}
              formType="mfat"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="df-cui"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted">
            <span className="text-base font-medium">DF CUI</span>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-6">
            <DamageFactorForm
              assessment={assessment}
              onAssessmentChange={handleAssessmentChange}
              readOnly={readOnly}
              formType="cui"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="df-scc-ssc"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted">
            <span className="text-base font-medium">DF SCC SSC</span>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-6">
            <DamageFactorForm
              assessment={assessment}
              onAssessmentChange={handleAssessmentChange}
              readOnly={readOnly}
              formType="scc-ssc"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="df-scc-sohic"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted">
            <span className="text-base font-medium">DF SCC SOHIC</span>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-6">
            <DamageFactorForm
              assessment={assessment}
              onAssessmentChange={handleAssessmentChange}
              readOnly={readOnly}
              formType="scc-sohic"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="df-lin"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted">
            <span className="text-base font-medium">
              DF LIN (DF LIN &lt;DMG&gt;)
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-6">
            <DamageFactorForm
              assessment={assessment}
              onAssessmentChange={handleAssessmentChange}
              readOnly={readOnly}
              formType="lin"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="df-cui-clscc"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted">
            <span className="text-base font-medium">DF CUI CLSCC</span>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-6">
            <DamageFactorForm
              assessment={assessment}
              onAssessmentChange={handleAssessmentChange}
              readOnly={readOnly}
              formType="cui-clscc"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-muted-foreground">
          <p>
            Enter values for all required fields to calculate damage factors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DamageFactorTab;
