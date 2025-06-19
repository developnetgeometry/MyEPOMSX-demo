import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const AssetBasicInfoCard = ({
  asset,
  formData,
  isEditing,
  errors,
  handleChange,
  assetTagOptions,
  statusOptions,
  commissionDate,
}) => (
  <Card className="mb-4">
    <CardContent className="pt-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Facility Location</label>
          <Input value={asset?.facility?.location_name} readOnly />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">System</label>
          <Input value={asset?.system?.system_name} readOnly />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Package</label>
          <Input value={asset?.package?.package_name} readOnly />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Asset No</label>
          <Input
            value={formData.assetNo}
            onChange={(e) => handleChange("assetNo", e.target.value)}
            readOnly={!isEditing}
            name="assetNo"
            className={errors.assetNo ? "border-red-500" : ""}
          />
          {errors.assetNo && (
            <p className="text-sm text-red-500 mt-1">{errors.assetNo}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Asset Name</label>
          <Input
            value={formData.assetName}
            onChange={(e) => handleChange("assetName", e.target.value)}
            readOnly={!isEditing}
            name="assetName"
            className={errors.assetName ? "border-red-500" : ""}
          />
          {errors.assetName && (
            <p className="text-sm text-red-500 mt-1">{errors.assetName}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Asset Tag</label>
          {isEditing ? (
            <Select
              value={formData.assetTagId}
              onValueChange={(value) => handleChange("assetTagId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select asset tag" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(assetTagOptions) &&
                  assetTagOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={asset?.asset_tag.name} readOnly />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Asset Status</label>
          {isEditing ? (
            <Select
              value={formData.assetStatusId}
              onValueChange={(value) => handleChange("assetStatusId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={asset?.asset_status.name} readOnly />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Commissioning Date</label>
          {isEditing ? (
            <Input
              type="date"
              value={formData.commissionDate}
              onChange={(e) => handleChange("commissionDate", e.target.value)}
            />
          ) : (
            <Input value={commissionDate} readOnly />
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AssetBasicInfoCard;
