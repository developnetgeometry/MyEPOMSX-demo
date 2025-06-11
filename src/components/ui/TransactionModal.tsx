import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';

// Define field types - UPDATED with radio
export type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'currency' | 'readonly' | 'radio';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readonly?: boolean;
  calculate?: (formData: Record<string, any>) => number | string;
}

export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  title: string;
  fields: FieldConfig[];
  initialData?: Record<string, any>;
  submitButtonText?: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  initialData = {},
  submitButtonText = 'Save',
  isLoading = false,
  size = 'md'
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset initialization flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsInitialized(false);
      setFormData({});
      setErrors({});
    }
  }, [isOpen]);

  // Initialize form data when modal opens - FIXED VERSION
  useEffect(() => {
    if (isOpen && !isInitialized) {
      
      const defaultData: Record<string, any> = {};
      
      fields.forEach(field => {
        // Prioritize initialData, then fall back to default value
        if (initialData.hasOwnProperty(field.key)) {
          defaultData[field.key] = initialData[field.key];
        } else {
          defaultData[field.key] = getDefaultValue(field.type);
        }
      });
      
      setFormData(defaultData);
      setErrors({});
      setIsInitialized(true);
    }
  }, [isOpen, initialData, fields, isInitialized]);

  // Calculate computed fields when form data changes - IMPROVED VERSION
  useEffect(() => {
    if (!isInitialized) return; // Don't calculate during initialization
    
    const updatedData = { ...formData };
    let hasChanges = false;

    fields.forEach(field => {
      if (field.calculate) {
        try {
          const calculatedValue = field.calculate(formData);
          // Ensure we're comparing the right types and handling numbers properly
          const currentValue = updatedData[field.key];
          const newValue = typeof calculatedValue === 'number' ? 
            Number(calculatedValue.toFixed(2)) : calculatedValue;
          
          if (currentValue !== newValue) {
            updatedData[field.key] = newValue;
            hasChanges = true;
          }
        } catch (error) {
          console.error(`Error calculating field ${field.key}:`, error);
        }
      }
    });

    if (hasChanges) {
      setFormData(updatedData);
    }
  }, [formData, fields, isInitialized]);

  const getDefaultValue = (type: FieldType) => {
    switch (type) {
      case 'number':
      case 'currency':
      case 'date':
      case 'radio':
      default:
        return '';
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [key]: value
      };
      
      // Immediately trigger calculation for dependent fields
      const updatedData = { ...newData };
      fields.forEach(field => {
        if (field.calculate) {
          try {
            const calculatedValue = field.calculate(newData);
            const newValue = typeof calculatedValue === 'number' ? 
              Number(calculatedValue.toFixed(2)) : calculatedValue;
            updatedData[field.key] = newValue;
          } catch (error) {
            console.error(`Error calculating field ${field.key}:`, error);
          }
        }
      });
      
      return updatedData;
    });

    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      if (field.required && !formData[field.key] && !field.disabled && !field.readonly) {
        newErrors[field.key] = `${field.label} is required`;
      }

      // Additional validations
      if ((field.type === 'number' || field.type === 'currency') && !field.disabled && !field.readonly) {
        const value = Number(formData[field.key]);
        if (field.min !== undefined && value < field.min) {
          newErrors[field.key] = `${field.label} must be at least ${field.min}`;
        }
        if (field.max !== undefined && value > field.max) {
          newErrors[field.key] = `${field.label} must not exceed ${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
      toast.success(`${title} saved successfully!`);
    } catch (error) {
      toast.error(`Failed to save ${title.toLowerCase()}. Please try again.`);
    }
  };

  const renderField = (field: FieldConfig) => {
    const value = formData[field.key] ?? '';
    const hasError = errors[field.key];
    const isDisabled = field.disabled || field.readonly || false;

    // For readonly/calculated fields, show formatted value
    if (field.type === 'readonly' || field.readonly) {
      let displayValue = value;
      
      // Format currency fields
      if (field.type === 'currency' || field.key.toLowerCase().includes('price') || field.key.toLowerCase().includes('total')) {
        displayValue = formatCurrency(value || 0);
      }
      
      // If it's a select field with options, show the label
      if (field.options) {
        const selectedOption = field.options.find(opt => opt.value === value);
        displayValue = selectedOption ? selectedOption.label : value;
      }
      
      return (
        <Input
          id={field.key}
          value={displayValue}
          className="bg-gray-50 text-gray-600"
          readOnly
          disabled
        />
      );
    }

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.key}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={hasError ? 'border-red-500' : ''}
            rows={3}
            disabled={isDisabled}
          />
        );

      case 'select':
        return (
          <Select 
            value={value} 
            onValueChange={(val) => handleInputChange(field.key, val)}
            disabled={isDisabled}
          >
            <SelectTrigger className={hasError ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => handleInputChange(field.key, val)}
            disabled={isDisabled}
            className={`flex flex-wrap gap-4 ${hasError ? 'border border-red-500 rounded p-2' : ''}`}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.key}-${option.value}`}
                  disabled={isDisabled}
                />
                <Label 
                  htmlFor={`${field.key}-${option.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'number':
        return (
          <Input
            id={field.key}
            type="number"
            value={value}
            onChange={(e) => {
              const numValue = e.target.value === '' ? 0 : Number(e.target.value);
              handleInputChange(field.key, numValue);
            }}
            placeholder={field.placeholder}
            className={hasError ? 'border-red-500' : ''}
            min={field.min}
            max={field.max}
            step={field.step || 1}
            disabled={isDisabled}
          />
        );

      case 'currency':
        return (
          <Input
            id={field.key}
            type="number"
            value={value}
            onChange={(e) => {
              const numValue = e.target.value === '' ? 0 : Number(e.target.value);
              handleInputChange(field.key, numValue);
            }}
            placeholder={field.placeholder}
            className={hasError ? 'border-red-500' : ''}
            min={field.min || 0}
            max={field.max}
            step={field.step || 0.01}
            disabled={isDisabled}
          />
        );

      case 'date':
        return (
          <Input
            id={field.key}
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={hasError ? 'border-red-500' : ''}
            disabled={isDisabled}
          />
        );

      default: // text
        return (
          <Input
            id={field.key}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={hasError ? 'border-red-500' : ''}
            disabled={isDisabled}
          />
        );
    }
  };

  // Determine modal size
  const sizeClasses = {
    sm: 'max-w-[30vw]',
    md: 'max-w-[40vw]',
    lg: 'max-w-[50vw]',
    xl: 'max-w-[60vw]'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className={field.type === 'textarea' ? 'col-span-full' : ''}>
                <Label htmlFor={field.key} className="text-sm font-medium">
                  {field.label}
                  {field.required && !field.disabled && !field.readonly && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <div className="mt-1">
                  {renderField(field)}
                  {errors[field.key] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Saving...' : submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;

// Helper function to create field configurations
export const createField = (
  key: string,
  label: string,
  type: FieldType,
  options?: {
    required?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    readonly?: boolean;
    options?: { value: string; label: string }[];
    calculate?: (formData: Record<string, any>) => number | string;
  }
): FieldConfig => {
  return {
    key,
    label,
    type,
    ...options
  };
};

// Updated field configurations with better calculation functions and radio examples
export const TRANSACTION_CONFIGS = {
  issue: [
    createField('issueDate', 'Issue Date', 'date', { required: true }),
    createField('workOrderNo', 'Work Order No', 'text', { 
      required: true, 
      placeholder: 'e.g., WO-2025-001' 
    }),
    createField('priority', 'Priority', 'radio', { 
      required: true, 
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]
    }),
    createField('quantity', 'Quantity', 'number', { required: true, min: 1, placeholder: '0' }),
    createField('unitPrice', 'Unit Price', 'currency', { required: true, min: 0, placeholder: '0.00' }),
    createField('total', 'Total', 'currency', { 
      readonly: true, 
      calculate: (data) => {
        const qty = Number(data.quantity) || 0;
        const price = Number(data.unitPrice) || 0;
        return qty * price;
      }
    }),
    createField('store', 'Store', 'select', { 
      required: true, 
      options: [
        { value: 'main', label: 'Main Store' },
        { value: 'secondary', label: 'Secondary Store' },
        { value: 'warehouse', label: 'Warehouse' }
      ]
    }),
    createField('issuanceName', 'Issuance Name', 'text', { required: true }),
    createField('remarks', 'Remarks', 'textarea', { placeholder: 'Additional notes...' })
  ],

  receive: [
    createField('receiveDate', 'Receive Date', 'date', { required: true }),
    createField('po', 'Purchase Order', 'text', { 
      required: true, 
      placeholder: 'e.g., PO-2025-001' 
    }),
    createField('condition', 'Item Condition', 'radio', { 
      required: true, 
      options: [
        { value: 'new', label: 'New' },
        { value: 'good', label: 'Good' },
        { value: 'damaged', label: 'Damaged' }
      ]
    }),
    createField('quantity', 'Received Quantity', 'number', { required: true, min: 1 }),
    createField('unitPrice', 'Unit Price', 'currency', { required: true, min: 0 }),
    createField('totalPrice', 'Total Price', 'currency', { 
      readonly: true, 
      calculate: (data) => {
        const qty = Number(data.quantity) || 0;
        const price = Number(data.unitPrice) || 0;
        return qty * price;
      }
    }),
    createField('receiveBy', 'Received By', 'text', { required: true }),
    createField('remarks', 'Remarks', 'textarea', { placeholder: 'Delivery notes, condition, etc...' })
  ],

  return: [
    createField('returnDate', 'Return Date', 'date', { required: true }),
    createField('workOrder', 'Work Order', 'text', { 
      required: true, 
      placeholder: 'e.g., WO-2025-001' 
    }),
    createField('returnReason', 'Return Reason', 'radio', { 
      required: true, 
      options: [
        { value: 'defective', label: 'Defective' },
        { value: 'surplus', label: 'Surplus' },
        { value: 'wrong_item', label: 'Wrong Item' },
        { value: 'other', label: 'Other' }
      ]
    }),
    createField('quantity', 'Return Quantity', 'number', { required: true, min: 1 }),
    createField('price', 'Unit Price', 'currency', { required: true, min: 0 }),
    createField('total', 'Total', 'currency', { 
      readonly: true, 
      calculate: (data) => {
        const qty = Number(data.quantity) || 0;
        const price = Number(data.price) || 0;
        return qty * price;
      }
    }),
    createField('returnName', 'Returned By', 'text', { required: true }),
    createField('remarks', 'Remarks', 'textarea', { placeholder: 'Reason for return...' })
  ],

  adjustment: [
    createField('adjustmentDate', 'Adjustment Date', 'date', { required: true }),
    createField('adjustmentType', 'Adjustment Type', 'select', { 
      required: true, 
      options: [
        { value: 'increase', label: 'Stock Increase' },
        { value: 'decrease', label: 'Stock Decrease' },
        { value: 'correction', label: 'Count Correction' }
      ]
    }),
    createField('approvalStatus', 'Approval Status', 'radio', { 
      required: true, 
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' }
      ]
    }),
    createField('quantity', 'Adjustment Quantity', 'number', { required: true }),
    createField('totalQuantity', 'Total Quantity After Adjustment', 'number', { required: true }),
    createField('price', 'Unit Price', 'currency', { required: true, min: 0 }),
    createField('total', 'Total Value', 'currency', { 
      readonly: true, 
      calculate: (data) => {
        const qty = Number(data.quantity) || 0;
        const price = Number(data.price) || 0;
        return qty * price;
      }
    }),
    createField('authorizedEmployee', 'Authorized Employee', 'text', { required: true }),
    createField('remarks', 'Remarks', 'textarea', { required: true, placeholder: 'Reason for adjustment...' })
  ],

  transfer: [
    createField('transferDate', 'Transfer Date', 'date', { required: true }),
    createField('fromStore', 'From Store', 'select', { 
      required: true, 
      options: [
        { value: 'main', label: 'Main Store' },
        { value: 'secondary', label: 'Secondary Store' },
        { value: 'warehouse', label: 'Warehouse' }
      ]
    }),
    createField('toStore', 'To Store', 'select', { 
      required: true, 
      options: [
        { value: 'main', label: 'Main Store' },
        { value: 'secondary', label: 'Secondary Store' },
        { value: 'warehouse', label: 'Warehouse' }
      ]
    }),
    createField('urgency', 'Transfer Urgency', 'radio', { 
      required: true, 
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'emergency', label: 'Emergency' }
      ]
    }),
    createField('quantity', 'Transfer Quantity', 'number', { required: true, min: 1 }),
    createField('price', 'Unit Price', 'currency', { required: true, min: 0 }),
    createField('totalValue', 'Total Value', 'currency', { 
      readonly: true, 
      calculate: (data) => {
        const qty = Number(data.quantity) || 0;
        const price = Number(data.price) || 0;
        return qty * price;
      }
    }),
    createField('employee', 'Transfer Employee', 'text', { required: true }),
    createField('remarks', 'Remarks', 'textarea', { placeholder: 'Transfer notes...' })
  ],
};

// Hook to manage modal state
export const useTransactionModal = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    title: "",
    isLoading: false,
    initialData: {},
  });

  const openModal = (type: string, title: string, initialData = {}) => {
    setModalState({
      isOpen: true,
      type,
      title,
      isLoading: false,
      initialData,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const setLoading = (loading: boolean) => {
    setModalState((prev) => ({
      ...prev,
      isLoading: loading,
    }));
  };

  return {
    modalState,
    openModal,
    closeModal,
    setLoading,
  };
};