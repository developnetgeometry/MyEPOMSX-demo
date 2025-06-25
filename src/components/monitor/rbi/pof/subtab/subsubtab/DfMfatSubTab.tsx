import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePreviousFailureData } from "@/hooks/lookup/lookup-previous-failure";
import { useVisibleAudioShakingData } from "@/hooks/lookup/lookup-visible-audio-shaking";
import { useShakingFrequencyData } from "@/hooks/lookup/lookup-shaking-frequency";
import { useCyclicLoadTypeData } from "@/hooks/lookup/lookup-cyclic-load-type";
import { useCorrectiveActionData } from "@/hooks/lookup/lookup-corrective-action";
import { usePipeComplexityData } from "@/hooks/lookup/lookup-pipe-complexity";
import { usePipeConditionData } from "@/hooks/lookup/lookup-pipe-condition";
import { useJointBranchDesignData } from "@/hooks/lookup/lookup-joint-branch-design";
import { useBranchDiameterData } from "@/hooks/lookup/lookup-branch-diameter";

const DfMfatSubTab: React.FC<{ formData: any; handleInputChange: any; handleSelectChange: any }> = ({ formData, handleInputChange, handleSelectChange }) => {
  const { data: previousFailures } = usePreviousFailureData();
  const { data: visibleAudioShakings } = useVisibleAudioShakingData();
  const { data: shakingFrequencies } = useShakingFrequencyData();
  const { data: cyclingLoadTypes } = useCyclicLoadTypeData();
  const { data: correctiveActions } = useCorrectiveActionData();
  const { data: pipeCompexities } = usePipeComplexityData();
  const { data: pipeConditions } = usePipeConditionData();
  const { data: jointBranchDesigns } = useJointBranchDesignData();
  const { data: branchDiameters } = useBranchDiameterData();


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="previous_failure_id_mfat">Previous Failure</Label>
          <Select
            value={formData?.previous_failure_id_mfat?.toString() || ""}
            onValueChange={(value) => handleSelectChange("previous_failure_id_mfat", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Previous Failure" />
            </SelectTrigger>
            <SelectContent>
              {previousFailures?.map((failure) => (
                <SelectItem key={failure.id} value={failure.id.toString()}>
                  {failure.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="visible_audible_shaking_id_mfat">Visible/Audible Shake</Label>
          <Select
            value={formData?.visible_audible_shaking_id_mfat?.toString() || ""}
            onValueChange={(value) => handleSelectChange("visible_audible_shaking_id_mfat", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Visible Audible Shaking" />
            </SelectTrigger>
            <SelectContent>
              {visibleAudioShakings?.map((shaking) => (
                <SelectItem key={shaking.id} value={shaking.id.toString()}>
                  {shaking.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="shaking_frequency_id_mfat">Shaking Frequency</Label>
          <Select
            value={formData?.shaking_frequency_id_mfat?.toString() || ""}
            onValueChange={(value) => handleSelectChange("shaking_frequency_id_mfat", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Shaking Frequency" />
            </SelectTrigger>
            <SelectContent>
              {shakingFrequencies?.map((frequency) => (
                <SelectItem key={frequency.id} value={frequency.id.toString()}>
                  {frequency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="cyclic_load_type_id_mfat">Cyclic Load Type</Label>
          <Select
            value={formData?.cyclic_load_type_id_mfat?.toString() || ""}
            onValueChange={(value) => handleSelectChange("cyclic_load_type_id_mfat", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Cyclic Load Type" />
            </SelectTrigger>
            <SelectContent>
              {cyclingLoadTypes?.map((loadType) => (
                <SelectItem key={loadType.id} value={loadType.id.toString()}>
                  {loadType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="corrective_action_id_mfat">Corrective Action</Label>
          <Select
            value={formData?.corrective_action_id_mfat?.toString() || ""}
            onValueChange={(value) => handleSelectChange("corrective_action_id_mfat", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Corrective Action" />
            </SelectTrigger>
            <SelectContent>
              {correctiveActions?.map((action) => (
                <SelectItem key={action.id} value={action.id.toString()}>
                  {action.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="pipe_complexity_id_mfat">Pipe Complexity</Label>
          <Select
            value={formData?.pipe_complexity_id_mfat?.toString() || ""}
            onValueChange={(value) => handleSelectChange("pipe_complexity_id_mfat", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Pipe Complexity" />
            </SelectTrigger>
            <SelectContent>
              {pipeCompexities?.map((complexity) => (
                <SelectItem key={complexity.id} value={complexity.id.toString()}>
                  {complexity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="pipe_condition_id_mfat">Pipe Condition</Label>
          <Select
            value={formData?.pipe_condition_id_mfat?.toString() || ""}
            onValueChange={(value) => handleSelectChange("pipe_condition_id_mfat", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Pipe Condition" />
            </SelectTrigger>
            <SelectContent>
              {pipeConditions?.map((condition) => (
                <SelectItem key={condition.id} value={condition.id.toString()}>
                  {condition.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <Label htmlFor="joint_branch_design_id_mfat">Joint Branch Design</Label>
          <Select
            value={formData?.joint_branch_design_id_mfat?.toString() || ""}
            onValueChange={(value) => handleSelectChange("joint_branch_design_id_mfat", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Joint Branch Design" />
            </SelectTrigger>
            <SelectContent>
              {jointBranchDesigns?.map((design) => (
                <SelectItem key={design.id} value={design.id.toString()}>
                  {design.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="brach_diameter_id_mfat">Branch Diameter</Label>
          <Select
            value={formData?.brach_diameter_id_mfat?.toString() || ""}
            onValueChange={(value) => handleSelectChange("brach_diameter_id_mfat", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Branch Diameter" />
            </SelectTrigger>
            <SelectContent>
              {branchDiameters?.map((diameter) => (
                <SelectItem key={diameter.id} value={diameter.id.toString()}>
                  {diameter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="dmfatfb_mfat">D MFAT FB</Label>
          <Input
            id="dmfatfb_mfat"
            name="dmfatfb_mfat"
            type="number"
            value={formData?.dmfatfb_mfat || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="dmfat_mfat">D MFATT</Label>
          <Input
            id="dmfat_mfat"
            name="dmfat_mfat"
            type="number"
            value={formData?.dmfat_mfat || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default DfMfatSubTab;