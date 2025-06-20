import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DfThinSubTab: React.FC<{ formData: any; handleInputChange: any }> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
        <div>
          <Label htmlFor="last_inspection_date_thin">Last Inspection Date</Label>
          <Input
            id="last_inspection_date_thin"
            name="last_inspection_date_thin"
            type="date"
            value={formData?.last_inspection_date_thin || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <div>
          <Label htmlFor="nthin_a_thin">Nthin A</Label>
          <Input
            id="nthin_a_thin"
            name="nthin_a_thin"
            type="number"
            value={formData?.nthin_a_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nthin_b_thin">Nthin B</Label>
          <Input
            id="nthin_b_thin"
            name="nthin_b_thin"
            type="number"
            value={formData?.nthin_b_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nthin_c_thin">Nthin C</Label>
          <Input
            id="nthin_c_thin"
            name="nthin_c_thin"
            type="number"
            value={formData?.nthin_c_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nthin_d_thin">Nthin D</Label>
          <Input
            id="nthin_d_thin"
            name="nthin_d_thin"
            type="number"
            value={formData?.nthin_d_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="manual_cr_act_thin">Manual Cr Act</Label>
          <Input
            id="manual_cr_act_thin"
            name="manual_cr_act_thin"
            type="number"
            value={formData?.manual_cr_act_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cr_act_thin">Cr Act</Label>
          <Input
            id="cr_act_thin"
            name="cr_act_thin"
            type="number"
            value={formData?.cr_act_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <div>
          <Label htmlFor="fc_thin_thin">FS Thin</Label>
          <Input
            id="fc_thin_thin"
            name="fc_thin_thin"
            type="number"
            value={formData?.fc_thin_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="sr_thin_thin">SR Thin</Label>
          <Input
            id="sr_thin_thin"
            name="sr_thin_thin"
            type="number"
            value={formData?.sr_thin_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="dthinf_thin">Dthinf</Label>
          <Input
            id="dthinf_thin"
            name="dthinf_thin"
            type="number"
            value={formData?.dthinf_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="agerc_thin">Agerc</Label>
          <Input
            id="agerc_thin"
            name="agerc_thin"
            type="date"
            value={formData?.agerc_thin || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="agetk_thin">Agetk</Label>
          <Input
            id="agetk_thin"
            name="agetk_thin"
            type="number"
            value={formData?.agetk_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="ithin1_thin">Ithin1</Label>
          <Input
            id="ithin1_thin"
            name="ithin1_thin"
            type="number"
            value={formData?.ithin1_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <div>
          <Label htmlFor="fc_thin_thin">Crexp</Label>
          <Input
            id="crexp_thin"
            name="crexp_thin"
            type="number"
            value={formData?.crexp_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="ithin2_thin">Ithin2</Label>
          <Input
            id="ithin2_thin"
            name="ithin2_thin"
            type="number"
            value={formData?.ithin2_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="crcm_thin">Crcm</Label>
          <Input
            id="crcm_thin"
            name="crcm_thin"
            type="number"
            value={formData?.crcm_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="ithin3_thin">Ithin3</Label>
          <Input
            id="ithin3_thin"
            name="ithin3_thin"
            type="number"
            value={formData?.ithin3_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="art_thin">ART</Label>
          <Input
            id="art_thin"
            name="art_thin"
            type="number"
            value={formData?.art_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="pothin1_thin">Pothin1</Label>
          <Input
            id="pothin1_thin"
            name="pothin1_thin"
            type="number"
            value={formData?.pothin1_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <div>
          <Label htmlFor="pothin2_thin">Pothin2</Label>
          <Input
            id="pothin2_thin"
            name="pothin2_thin"
            type="number"
            value={formData?.pothin2_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="pothin3_thin">Pothin3</Label>
          <Input
            id="pothin3_thin"
            name="pothin3_thin"
            type="number"
            value={formData?.pothin3_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="bthin1_thin">Bthin1</Label>
          <Input
            id="bthin1_thin"
            name="bthin1_thin"
            type="number"
            value={formData?.bthin1_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="bthin2_thins">Bthin2</Label>
          <Input
            id="bthin2_thins"
            name="bthin2_thins"
            type="number"
            value={formData?.bthin2_thins || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="bthin3_thin">Bthin3</Label>
          <Input
            id="bthin3_thin"
            name="bthin3_thin"
            type="number"
            value={formData?.bthin3_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="dfthinfb_thin">DF Thin FB</Label>
          <Input
            id="dfthinfb_thin"
            name="dfthinfb_thin"
            type="number"
            value={formData?.dfthinfb_thin || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>

    </div>
  );
};

export default DfThinSubTab;