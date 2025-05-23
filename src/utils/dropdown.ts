export const createUniqueOptions = (
  data: any[] | undefined,
  accessor: string,
  labelPath?: string // Optional parameter for custom label path
) => {
  if (!data) return [];
  
  // Handle nested path like "group.name" with split and reduce
  const getValue = (item: any, path: string) => {
    return path
      .split(".")
      .reduce(
        (obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined),
        item
      );
  };
  
  // Create array of unique options with proper value/label pairs
  const options: { value: string; label: string }[] = []; // Changed type to ensure string values
  const uniqueValues = new Map(); // Use Map to track unique IDs
  
  data.forEach(item => {
    // Get the base object by accessing all but the last part of the path
    const pathParts = accessor.split(".");
    const basePath = pathParts.slice(0, -1).join(".");
    const lastKey = pathParts[pathParts.length - 1];
    
    // If it's a direct path like 'group' (not 'group.name')
    if (pathParts.length === 1) {
      const obj = getValue(item, accessor);
      
      // For objects with id and name properties
      if (obj && typeof obj === 'object' && obj.id !== undefined && obj.name !== undefined) {
        const stringValue = String(obj.id); // Convert id to string
        
        if (!uniqueValues.has(stringValue)) {
          uniqueValues.set(stringValue, true);
          options.push({
            value: stringValue, // Store as string
            label: obj.name
          });
        }
      }
      // For simple values
      else if (obj !== undefined && obj !== null) {
        const stringValue = String(obj); // Convert value to string
        
        if (!uniqueValues.has(stringValue)) {
          uniqueValues.set(stringValue, true);
          options.push({
            value: stringValue, // Store as string
            label: String(obj)
          });
        }
      }
    }
    // For nested paths like "group.name"
    else {
      const baseObj = getValue(item, basePath);
      const value = baseObj && baseObj.id;
      const label = baseObj && baseObj.name;
      
      if (value !== undefined && label !== undefined) {
        const stringValue = String(value); // Convert id to string
        
        if (!uniqueValues.has(stringValue)) {
          uniqueValues.set(stringValue, true);
          options.push({
            value: stringValue, // Store as string
            label
          });
        }
      }
    }
  });
  
  return options;
};