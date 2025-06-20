import { inventoryGroupsService } from "./inventoryGroupsService";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface InventoryGroupFormData {
  asset_id: number | null;
  group_type: string;
  group_name: string;
  total_inventory: string;
  component_inventory: string;
  description: string;
  equipment_volume: string;
  representative_component: string;
  is_active: boolean;
}

export class InventoryGroupValidationService {
  /**
   * Validate the complete form data
   */
  async validateForm(
    formData: InventoryGroupFormData,
    isEditMode: boolean = false,
    currentItemId?: number
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Required field validations
    this.validateRequiredFields(formData, errors);

    // Business logic validations
    this.validateBusinessRules(formData, errors);

    // Async validations (duplicate checks)
    if (formData.asset_id && formData.group_name.trim()) {
      await this.validateGroupNameUniqueness(
        formData.group_name.trim(),
        formData.asset_id,
        isEditMode ? currentItemId : undefined,
        errors
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate required fields
   */
  private validateRequiredFields(
    formData: InventoryGroupFormData,
    errors: ValidationError[]
  ): void {
    if (!formData.asset_id) {
      errors.push({
        field: "asset_id",
        message: "Asset selection is required",
      });
    }

    if (!formData.group_type.trim()) {
      errors.push({
        field: "group_type",
        message: "Group type is required",
      });
    }

    if (!formData.group_name.trim()) {
      errors.push({
        field: "group_name",
        message: "Group name is required",
      });
    }
  }

  /**
   * Validate business rules
   */
  private validateBusinessRules(
    formData: InventoryGroupFormData,
    errors: ValidationError[]
  ): void {
    // Validate numeric fields
    const totalInventory = parseInt(formData.total_inventory) || 0;
    const componentInventory = parseInt(formData.component_inventory) || 0;
    const equipmentVolume = parseFloat(formData.equipment_volume) || 0;

    // Total inventory validation
    if (formData.total_inventory && totalInventory < 0) {
      errors.push({
        field: "total_inventory",
        message: "Total inventory must be zero or positive",
      });
    }

    // Component inventory validation
    if (formData.component_inventory && componentInventory < 0) {
      errors.push({
        field: "component_inventory",
        message: "Component inventory must be zero or positive",
      });
    }

    // Component inventory cannot exceed total inventory
    if (
      formData.total_inventory &&
      formData.component_inventory &&
      componentInventory > totalInventory
    ) {
      errors.push({
        field: "component_inventory",
        message: "Component inventory cannot exceed total inventory",
      });
    }

    // Equipment volume validation
    if (formData.equipment_volume && equipmentVolume < 0) {
      errors.push({
        field: "equipment_volume",
        message: "Equipment volume must be zero or positive",
      });
    }

    // String length validations
    if (formData.group_type.length > 255) {
      errors.push({
        field: "group_type",
        message: "Group type must not exceed 255 characters",
      });
    }

    if (formData.group_name.length > 255) {
      errors.push({
        field: "group_name",
        message: "Group name must not exceed 255 characters",
      });
    }

    if (formData.representative_component.length > 255) {
      errors.push({
        field: "representative_component",
        message: "Representative component must not exceed 255 characters",
      });
    }

    if (formData.description.length > 1000) {
      errors.push({
        field: "description",
        message: "Description must not exceed 1000 characters",
      });
    }
  }

  /**
   * Check if group name already exists for the same asset
   */
  private async validateGroupNameUniqueness(
    groupName: string,
    assetId: number,
    excludeId: number | undefined,
    errors: ValidationError[]
  ): Promise<void> {
    try {
      const exists = await inventoryGroupsService.checkGroupNameExists(
        groupName,
        assetId,
        excludeId
      );

      if (exists) {
        errors.push({
          field: "group_name",
          message: `Group name "${groupName}" already exists for this asset`,
        });
      }
    } catch (error) {
      console.error("Error checking group name uniqueness:", error);
      // Don't add validation error for system errors
    }
  }

  /**
   * Validate individual field
   */
  validateField(
    fieldName: keyof InventoryGroupFormData,
    value: any,
    formData?: InventoryGroupFormData
  ): ValidationError | null {
    switch (fieldName) {
      case "asset_id":
        if (!value) {
          return { field: fieldName, message: "Asset selection is required" };
        }
        break;

      case "group_type":
        if (!value?.trim()) {
          return { field: fieldName, message: "Group type is required" };
        }
        if (value.length > 255) {
          return {
            field: fieldName,
            message: "Group type must not exceed 255 characters",
          };
        }
        break;

      case "group_name":
        if (!value?.trim()) {
          return { field: fieldName, message: "Group name is required" };
        }
        if (value.length > 255) {
          return {
            field: fieldName,
            message: "Group name must not exceed 255 characters",
          };
        }
        break;

      case "total_inventory":
        if (value && parseInt(value) < 0) {
          return {
            field: fieldName,
            message: "Total inventory must be zero or positive",
          };
        }
        break;

      case "component_inventory":
        if (value && parseInt(value) < 0) {
          return {
            field: fieldName,
            message: "Component inventory must be zero or positive",
          };
        }
        if (
          formData &&
          formData.total_inventory &&
          value &&
          parseInt(value) > parseInt(formData.total_inventory)
        ) {
          return {
            field: fieldName,
            message: "Component inventory cannot exceed total inventory",
          };
        }
        break;

      case "equipment_volume":
        if (value && parseFloat(value) < 0) {
          return {
            field: fieldName,
            message: "Equipment volume must be zero or positive",
          };
        }
        break;

      case "representative_component":
        if (value && value.length > 255) {
          return {
            field: fieldName,
            message: "Representative component must not exceed 255 characters",
          };
        }
        break;

      case "description":
        if (value && value.length > 1000) {
          return {
            field: fieldName,
            message: "Description must not exceed 1000 characters",
          };
        }
        break;

      default:
        break;
    }

    return null;
  }

  /**
   * Format validation errors for display
   */
  formatErrorsForDisplay(errors: ValidationError[]): string {
    if (errors.length === 0) return "";
    if (errors.length === 1) return errors[0].message;

    return `Multiple errors:\n${errors
      .map((e) => `• ${e.message}`)
      .join("\n")}`;
  }
}

export const inventoryGroupValidationService =
  new InventoryGroupValidationService();
