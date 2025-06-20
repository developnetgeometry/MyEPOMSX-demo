import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DfExtSubTab: React.FC<{ formData: any; handleInputChange: any }> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="last_inspection_date_ext">Last Inspection Date</Label>
          <Input
            id="last_inspection_date_ext"
            name="last_inspection_date_ext"
            type="date"
            value={formData?.last_inspection_date_ext || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="new_coating_date_ext">New Coating Date</Label>
          <Input
            id="new_coating_date_ext"
            name="new_coating_date_ext"
            type="date"
            value={formData?.new_coating_date_ext || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="agetk_ext">AgeTK</Label>
          <Input
            id="agetk_ext"
            name="agetk_ext"
            type="number"
            value={formData?.agetk_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="agecoat_year_ext">Agecoat Year</Label>
          <Input
            id="agecoat_year_ext"
            name="agecoat_year_ext"
            type="number"
            value={formData?.agecoat_year_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div>
          <Label htmlFor="nextcorra_ext">Nextcorr A</Label>
          <Input
            id="nextcorra_ext"
            name="nextcorra_ext"
            type="number"
            value={formData?.nextcorra_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nextcorrb_ext">Nextcorr B</Label>
          <Input
            id="nextcorrb_ext"
            name="nextcorrb_ext"
            type="number"
            value={formData?.nextcorrb_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nextcorrc_ext">Nextcorr C</Label>
          <Input
            id="nextcorrc_ext"
            name="nextcorrc_ext"
            type="number"
            value={formData?.nextcorrc_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nextcorrd_ext">Nextcorr D</Label>
          <Input
            id="nextcorrd_ext"
            name="nextcorrd_ext"
            type="number"
            value={formData?.nextcorrd_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div>
          <Label htmlFor="cract_year_ext">CRACT_YEAR</Label>
          <Input
            id="cract_year_ext"
            name="cract_year_ext"
            type="number"
            value={formData?.cract_year_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="art_ext">ART</Label>
          <Input
            id="art_ext"
            name="art_ext"
            type="number"
            value={formData?.art_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="fsextcorr_ext">FSEXTCORR</Label>
          <Input
            id="fsextcorr_ext"
            name="fsextcorr_ext"
            type="number"
            value={formData?.fsextcorr_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="srextcorr_ext">SREXTCORR</Label>
          <Input
            id="srextcorr_ext"
            name="srextcorr_ext"
            type="number"
            value={formData?.srextcorr_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label htmlFor="lextcorr1_ext">Lext Corr1</Label>
          <Input
            id="lextcorr1_ext"
            name="lextcorr1_ext"
            type="number"
            value={formData?.lextcorr1_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="lextcorr2_ext">Lext Corr2</Label>
          <Input
            id="lextcorr2_ext"
            name="lextcorr2_ext"
            type="number"
            value={formData?.lextcorr2_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="lextcorr3_ext">Lext Corr3</Label>
          <Input
            id="lextcorr3_ext"
            name="lextcorr3_ext"
            type="number"
            value={formData?.lextcorr3_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label htmlFor="poextcorrp1_ext">Poext Corrp1</Label>
          <Input
            id="poextcorrp1_ext"
            name="poextcorrp1_ext"
            type="number"
            value={formData?.poextcorrp1_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="poextcorrp2_ext">Poext Corrp2</Label>
          <Input
            id="poextcorrp2_ext"
            name="poextcorrp2_ext"
            type="number"
            value={formData?.poextcorrp2_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="poextcorrp3_ext">Poext Corrp3</Label>
          <Input
            id="poextcorrp3_ext"
            name="poextcorrp3_ext"
            type="number"
            value={formData?.poextcorrp3_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label htmlFor="bextcorpp1_ext">Bext Corrp1</Label>
          <Input
            id="bextcorpp1_ext"
            name="bextcorpp1_ext"
            type="number"
            value={formData?.bextcorpp1_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="bextcorpp2_ext">Bext Corrp2</Label>
          <Input
            id="bextcorpp2_ext"
            name="bextcorpp2_ext"
            type="number"
            value={formData?.bextcorpp2_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="bextcorpp3_ext">Bext Corrp3</Label>
          <Input
            id="bextcorpp3_ext"
            name="bextcorpp3_ext"
            type="number"
            value={formData?.bextcorpp3_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="crexp_ext">Crexp</Label>
          <Input
            id="crexp_ext"
            name="crexp_ext"
            type="number"
            value={formData?.crexp_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
                <div>
          <Label htmlFor="dfextcorrf_ext">Dfextcorrf</Label>
          <Input
            id="dfextcorrf_ext"
            name="dfextcorrf_ext"
            type="number"
            value={formData?.dfextcorrf_ext || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default DfExtSubTab;