
/**
 * Utility functions for formatting data in tables and forms
 */

/**
 * Format a number as Malaysian Ringgit (RM)
 * @param value The number value to format
 * @returns Formatted string (e.g. RM 1,234.56)
 */
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-';
  return `RM ${value.toLocaleString('en-MY', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

/**
 * Check if a field name or label represents a monetary value
 * @param fieldName The field name or label to check
 * @returns True if the field represents a monetary value
 */
export const isMonetaryField = (fieldName: string): boolean => {
  const monetaryTerms = [
    'price', 'cost', 'amount', 'value', 'penalty', 'budget', 'fee', 
    'charge', 'payment', 'salary', 'wage', 'bonus', 'commission'
  ];
  
  const lowerFieldName = fieldName.toLowerCase();
  return monetaryTerms.some(term => lowerFieldName.includes(term));
};

/**
 * Format a health status with appropriate styling class
 * @param status The status string to format
 * @returns CSS class name for styling
 */
export const getHealthStatusClass = (status: string): string => {
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus === 'good') return 'bg-green-500';
  if (lowerStatus === 'fair') return 'bg-yellow-500';
  if (lowerStatus === 'poor') return 'bg-orange-500';
  if (lowerStatus === 'critical') return 'bg-red-500';
  
  return 'bg-gray-500'; // Default
};

/**
 * Format an alert level with appropriate styling class
 * @param level The alert level string to format
 * @returns CSS class name for styling
 */
export const getAlertLevelClass = (level: string): string => {
  const lowerLevel = level.toLowerCase();
  
  if (lowerLevel === 'normal') return 'bg-green-500';
  if (lowerLevel === 'warning') return 'bg-yellow-500';
  if (lowerLevel === 'critical') return 'bg-red-500';
  
  return 'bg-gray-500'; // Default
};

/**
 * Format a date for display
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Format a date with time for display
 * @param date The date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a percentage value
 * @param value The percentage value to format
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(1)}%`;
};

/**
 * Extracts the filename from a file path
 * @param filePath The full file path (e.g., 'public/images/you.jpg')
 * @returns Just the filename with extension (e.g., 'you.jpg')
 */
export const getFileNameFromPath = (filePath: string): string => {
  // Handle cases where path uses forward slashes or backslashes
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // Extract everything after the last slash
  const lastSlashIndex = normalizedPath.lastIndexOf('/');
  
  // If no slash found, return the original string
  if (lastSlashIndex === -1) return filePath;
  
  // Return the substring after the last slash
  return normalizedPath.substring(lastSlashIndex + 1);
};