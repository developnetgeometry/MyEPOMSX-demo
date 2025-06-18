import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { AlertCircle, ArrowLeft, Check, Edit, FileText, FileUp, Loader2, Save, X } from "lucide-react";
import { getFileNameFromPath } from "@/utils/formatters";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

const AssetDetailsCard = ({
  assetDetails,
  formData,
  isEditing,
  errors,
  handleChange,
  categoryOptions,
  typeOptions,
  manufacturerOptions,
  areaOptions,
  assetClassOptions,
  assetSensorOptions,
  criticalityOptions,
  sceOptions,
  attachments,
  fileInputRef,
  selectedFile,
  fileUploadError,
  setZoomedImage,
  isPrinting,
  handleFileChange,
  formSubmissionError,
  formSubmissionSuccess,
  isSubmitting,
  handleCancel,
  handleApplyChanges,
  navigate,
  handleWorkRequest,
  toggleEditMode,
}) => (
  <Card className="mb-4">
    <CardHeader className="bg-blue-500 text-white p-2">
      <CardTitle className="text-base">Asset Details</CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Category</label>
          {isEditing ? (
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleChange("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={assetDetails?.category?.name || ""} readOnly />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Type</label>
          {isEditing ? (
            <Select
              value={formData.typeId}
              onValueChange={(value) => handleChange("typeId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={assetDetails?.type?.name || ""} readOnly />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Manufacturer</label>
          {isEditing ? (
            <Select
              value={formData.manufacturerId}
              onValueChange={(value) => handleChange("manufacturerId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(manufacturerOptions) &&
                  manufacturerOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={assetDetails?.manufacturer?.name || ""} readOnly />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Maker No</label>
          <Input
            value={formData.makerNo}
            onChange={(e) => handleChange("makerNo", e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Model</label>
          <Input
            value={formData.model}
            onChange={(e) => handleChange("model", e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Serial Number</label>
          <Input
            value={formData.serialNumber}
            onChange={(e) => handleChange("serialNumber", e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Area</label>
          {isEditing ? (
            <Select
              value={formData.areaId}
              onValueChange={(value) => handleChange("areaId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(areaOptions) &&
                  areaOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={assetDetails?.area?.name || ""} readOnly />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Asset Class</label>
          {isEditing ? (
            <Select
              value={formData.assetClassId}
              onValueChange={(value) => handleChange("assetClassId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select asset class" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(assetClassOptions) &&
                  assetClassOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={assetDetails?.asset_class?.name || ""} readOnly />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">HCode</label>
          <Input
            value={formData.hsCode}
            onChange={(e) => handleChange("hsCode", e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Specification</label>
          <Input
            value={formData.specification}
            onChange={(e) => handleChange("specification", e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Sensor</label>
          {isEditing ? (
            <Select
              value={formData.iotSensorId}
              onValueChange={(value) => handleChange("iotSensorId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sensor" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(assetSensorOptions) &&
                  assetSensorOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={assetDetails?.iot_sensor?.sensor_type?.name || ""}
              readOnly
            />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">EX Class</label>
          <Input
            value={formData.exClass}
            onChange={(e) => handleChange("exClass", e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">EX Certificate</label>
          <Input
            value={formData.exCertificate}
            onChange={(e) => handleChange("exCertificate", e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Drawing No</label>
          <Input
            value={formData.drawingNo}
            onChange={(e) => handleChange("drawingNo", e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-4 pt-2">
          {/* Criticality Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="criticality"
                checked={formData.isCriticality}
                onCheckedChange={(checked) =>
                  handleChange("isCriticality", !!checked)
                }
                disabled={!isEditing}
              />
              <label htmlFor="criticality" className="text-sm font-medium">
                Criticality
              </label>
            </div>

            {/* Show criticality dropdown if checkbox is checked */}
            {formData.isCriticality && (
              <div className="mt-2">
                {isEditing ? (
                  <Select
                    value={formData.criticalityId}
                    onValueChange={(value) =>
                      handleChange("criticalityId", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Criticality Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(criticalityOptions) &&
                        criticalityOptions.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={String(option.value)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-gray-600">
                    {criticalityOptions.find(
                      (opt) => opt.value === formData.criticalityId
                    )?.label || "Not selected"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SCE Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sce"
                checked={formData.isSce}
                onCheckedChange={(checked) => handleChange("isSce", !!checked)}
                disabled={!isEditing}
              />
              <label htmlFor="sce" className="text-sm font-medium">
                SCE Code
              </label>
            </div>

            {/* Show SCE dropdown if checkbox is checked */}
            {formData.isSce && (
              <div className="mt-2">
                {isEditing ? (
                  <Select
                    value={formData.sceId}
                    onValueChange={(value) => handleChange("sceId", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select SCE Code" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(sceOptions) &&
                        sceOptions.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={String(option.value)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-gray-600">
                    {sceOptions.find((opt) => opt.value === formData.sceId)
                      ?.label || "Not selected"}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange("isActive", !!checked)}
              disabled={!isEditing}
            />
            <label htmlFor="active" className="text-sm font-medium">
              Active
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="integrity"
              checked={formData.isIntegrity}
              onCheckedChange={(checked) =>
                handleChange("isIntegrity", !!checked)
              }
              disabled={!isEditing}
            />
            <label htmlFor="integrity" className="text-sm font-medium">
              Integrity
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="reliability"
              checked={formData.isReliability}
              onCheckedChange={(checked) =>
                handleChange("isReliability", !!checked)
              }
              disabled={!isEditing}
            />
            <label htmlFor="reliability" className="text-sm font-medium">
              Reliability
            </label>
          </div>
        </div>

        <div className="col-span-2 space-y-1.5">
          <label className="text-sm font-medium">Asset Image</label>
          <div className="flex flex-col gap-2 mt-1">
            {isEditing ? (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileUp className="h-4 w-4" /> Choose file
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </span>
                </div>
                {fileUploadError && (
                  <p className="text-sm text-red-500">{fileUploadError}</p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled
                >
                  <FileUp className="h-4 w-4" /> Choose file
                </Button>
                <span className="text-sm text-muted-foreground">
                  {attachments.length > 0
                    ? `${attachments.length} file(s) uploaded`
                    : "No file chosen"}
                </span>
              </div>
            )}

            {/* Display existing attachments */}
            {attachments.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {attachments.slice(0, 3).map((attachment) => (
                  <div
                    key={attachment.id}
                    className="relative border rounded-md p-2"
                  >
                    {attachment.file_path &&
                    attachment.file_path.match(
                      /\.(jpeg|jpg|png|gif|webp)$/i
                    ) ? (
                      <img
                        src={attachment.file_path}
                        alt={attachment.file_name || "Asset image"}
                        className="w-full h-24 object-cover rounded cursor-pointer"
                        onClick={() => setZoomedImage(attachment.file_path)}
                        style={{ transition: "transform 0.2s" }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-24 bg-muted rounded">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <p className="text-xs mt-1 truncate">
                      {attachment.file_name ||
                        getFileNameFromPath(attachment.file_path)}
                    </p>
                  </div>
                ))}
                {attachments.length > 3 && (
                  <div className="flex items-center justify-center border rounded-md p-2 h-24">
                    <p className="text-sm text-muted-foreground">
                      +{attachments.length - 3} more
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form validation and submission status */}
      {(formSubmissionError || Object.keys(errors).length > 0) && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {formSubmissionError ||
              "Please correct the errors in the form before submitting."}
            {Object.keys(errors).length > 0 && (
              <ul className="mt-2 list-disc pl-5">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{String(message)}</li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}

      {formSubmissionSuccess && !formSubmissionError && (
        <Alert className="mt-6 bg-green-50 border-green-500 text-green-800">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Asset updated successfully.</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-8">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleApplyChanges}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Apply Changes
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => navigate("/manage/assets")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Assets
            </Button>
            <Button
              variant="destructive"
              onClick={handleWorkRequest}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Work Request
            </Button>
            <Button
              onClick={toggleEditMode}
              className="flex items-center gap-2"
              variant="default"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </>
        )}
      </div>
    </CardContent>
  </Card>
);

export default AssetDetailsCard;
