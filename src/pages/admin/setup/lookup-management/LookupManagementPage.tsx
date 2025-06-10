import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/shared/DataTable";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

// Type declaration for any dynamic table access
type AnySupabaseTable = any;

// Type for RPC function overrides
declare module "@supabase/supabase-js" {
  interface SupabaseClient {
    rpc<T = any>(
      fn: string,
      params?: { [key: string]: any },
      options?: {
        count?: null | "exact" | "planned" | "estimated";
        head?: boolean;
      }
    ): Promise<
      { data: T; error: null } | { data: null; error: PostgrestError }
    >;
  }
}

// Extended Profile type
interface ExtendedProfile {
  id: string;
  user_type_id?: number;
  [key: string]: any;
}
import { Column } from "@/components/shared/DataTable";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

// Table metadata interface
interface TableMetadata {
  table_name: string;
  display_name: string;
  columns: ColumnMetadata[];
}

// Column metadata interface
interface ColumnMetadata {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
}

// Define lookup tables with their user-friendly display names
const LOOKUP_TABLES = [
  { table_name: "e_adjustment_type", display_name: "Adjustment Type" },
  { table_name: "e_adjustment_category", display_name: "Adjustment Category" },
  { table_name: "e_asset_area", display_name: "Asset Area" },
  { table_name: "e_asset_category", display_name: "Asset Category" },
  {
    table_name: "e_asset_category_group",
    display_name: "Asset Category Group",
  },
  { table_name: "e_asset_class", display_name: "Asset Class" },
  { table_name: "e_asset_group", display_name: "Asset Group" },
  { table_name: "e_asset_status", display_name: "Asset Status" },
  { table_name: "e_asset_sce", display_name: "Asset SCE" },
  { table_name: "e_asset_tag", display_name: "Asset Tag" },
  { table_name: "e_asset_type", display_name: "Asset Type" },
  { table_name: "e_asset_type_group", display_name: "Asset Type Group" },
  { table_name: "e_circuit", display_name: "Circuit" },
  { table_name: "e_cm_sce", display_name: "CM SCE" },
  { table_name: "e_cm_status", display_name: "CM Status" },
  { table_name: "e_coating_quality", display_name: "Coating Quality" },
  { table_name: "e_criticality", display_name: "Criticality" },
  { table_name: "e_data_confidence", display_name: "Data Confidence" },
  { table_name: "e_design_fabrication", display_name: "Design Fabrication" },
  { table_name: "e_detection_system", display_name: "Detection System" },
  { table_name: "e_ext_env", display_name: "External Environment" },
  { table_name: "e_failure_priority", display_name: "Failure Priority" },
  { table_name: "e_fluid_phase", display_name: "Fluid Phase" },
  { table_name: "e_fluid_representive", display_name: "Fluid Representative" },
  { table_name: "e_frequency_type", display_name: "Frequency Type" },
  { table_name: "e_general_maintenance", display_name: "General Maintenance" },
  { table_name: "e_geometry", display_name: "Geometry" },
  {
    table_name: "e_ideal_gas_specific_heat_eq",
    display_name: "Ideal Gas Specific Heat Equation",
  },
  { table_name: "e_insulation_type", display_name: "Insulation Type" },
  { table_name: "e_interface", display_name: "Interface" },
  {
    table_name: "e_isolation_service_class",
    display_name: "Isolation Service Class",
  },
  { table_name: "e_isolation_system", display_name: "Isolation System" },
  { table_name: "e_item_category", display_name: "Item Category" },
  { table_name: "e_item_group", display_name: "Item Group" },
  {
    table_name: "e_item_master_attachment",
    display_name: "Item Master Attachment",
  },
  { table_name: "e_item_type", display_name: "Item Type" },
  { table_name: "e_maintenance", display_name: "Maintenance" },
  { table_name: "e_maintenance_type", display_name: "Maintenance Type" },
  { table_name: "e_manufacturer", display_name: "Manufacturer" },
  { table_name: "e_material_class", display_name: "Material Class" },
  {
    table_name: "e_material_construction",
    display_name: "Material Construction",
  },
  { table_name: "e_mitigation_system", display_name: "Mitigation System" },
  {
    table_name: "e_new_work_failure_type",
    display_name: "New Work Failure Type",
  },
  {
    table_name: "e_nominal_bore_diameter",
    display_name: "Nominal Bore Diameter",
  },
  { table_name: "e_online_monitor", display_name: "Online Monitor" },
  { table_name: "e_package_type", display_name: "Package Type" },
  { table_name: "e_pipe_schedule", display_name: "Pipe Schedule" },
  {
    table_name: "e_piping_material_construction",
    display_name: "Piping Material Construction",
  },
  { table_name: "e_pm_additional_info", display_name: "PM Additional Info" },
  { table_name: "e_pm_group", display_name: "PM Group" },
  { table_name: "e_priority", display_name: "Priority" },
  { table_name: "e_project_type", display_name: "Project Type" },
  {
    table_name: "e_pv_material_construction",
    display_name: "PV Material Construction",
  },
  { table_name: "e_rack", display_name: "Rack" },
  { table_name: "e_sensor_type", display_name: "Sensor Type" },
  { table_name: "e_shutdown_type", display_name: "Shutdown Type" },
  { table_name: "e_store", display_name: "Store" },
  { table_name: "e_task", display_name: "Task" },
  { table_name: "e_toxicity", display_name: "Toxicity" },
  { table_name: "e_unit", display_name: "Unit" },
  { table_name: "e_work_order_status", display_name: "Work Order Status" },
  { table_name: "e_work_order_type", display_name: "Work Order Type" },
  {
    table_name: "i_asme_material_lookup",
    display_name: "ASME Material Lookup",
  },
  { table_name: "i_data_confidence", display_name: "Data Confidence" },
  { table_name: "i_env_severity", display_name: "Environment Severity" },
  { table_name: "i_ims_asset_type", display_name: "IMS Asset Type" },
  { table_name: "i_ims_piping_service", display_name: "IMS Piping Service" },
  {
    table_name: "i_inspection_efficiency",
    display_name: "Inspection Efficiency",
  },
  { table_name: "i_lining_monitoring", display_name: "Lining Monitoring" },
  { table_name: "i_lining_type", display_name: "Lining Type" },
  { table_name: "i_steelscontent", display_name: "Steels Content" },
];

const LookupManagementPage: React.FC = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableMetadata, setTableMetadata] = useState<TableMetadata | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicColumns, setDynamicColumns] = useState<Column[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentItem, setCurrentItem] = useState<any | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // State for user type
  const [userType, setUserType] = useState<{ name: string } | null>(null);

  // Fetch user type information
  useEffect(() => {
    const fetchUserType = async () => {
      // Cast profile to ExtendedProfile to access user_type_id
      const extendedProfile = profile as unknown as ExtendedProfile;

      if (extendedProfile && extendedProfile.user_type_id) {
        const { data } = await supabase
          .from("user_type")
          .select("id, name")
          .eq("id", extendedProfile.user_type_id.toString())
          .single();

        setUserType(data);
      }
    };

    fetchUserType();
  }, [profile]);

  // Check if user is super admin
  const isSuperAdmin = React.useMemo(() => {
    return userType?.name?.toLowerCase() === "super admin";
  }, [userType]);

  useEffect(() => {
    // If not super admin, show toast message
    if (!isSuperAdmin && !initialLoad) {
      toast({
        title: "Access Denied",
        description: "You need Super Admin privileges to access this page.",
        variant: "destructive",
      });
    }
    setInitialLoad(false);
  }, [isSuperAdmin, initialLoad, toast]);

  // Get table metadata when a table is selected
  useEffect(() => {
    if (selectedTable) {
      fetchTableMetadata(selectedTable);
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  // Fetch table metadata (columns, data types, etc.)
  const fetchTableMetadata = async (tableName: string) => {
    setIsLoading(true);
    try {
      let columns: any[];

      try {
        // First approach: Try to get table info using the RPC function
        const { data, error } = await supabase.rpc("get_table_columns", {
          param_table_name: tableName,
        });

        if (error) throw error;
        columns = data || [];

        // If no columns were returned (even though the function didn't error),
        // this might be because the table exists but has no data or columns
        if (!columns || columns.length === 0) {
          throw new Error("No columns returned from RPC function");
        }
      } catch (rpcError: any) {
        console.warn(
          "Error using RPC function, falling back to alternative methods:",
          rpcError.message
        );
        try {
          // Second approach: Use direct SQL query via RPC
          const { data: schemaData, error: schemaError } = await supabase.rpc(
            "direct_query",
            {
              query_text: `
              SELECT column_name, data_type, 
                CASE WHEN is_nullable = 'YES' THEN true ELSE false END as is_nullable
              FROM information_schema.columns 
              WHERE table_schema = 'public' AND table_name = '${tableName}'
              ORDER BY ordinal_position
            `,
            }
          );

          if (schemaError) throw schemaError;

          // Transform the data into our expected format
          if (
            schemaData &&
            Array.isArray(schemaData) &&
            schemaData.length > 0
          ) {
            columns = schemaData.map((col: any) => ({
              column_name: col.column_name,
              data_type: col.data_type,
              is_nullable: col.is_nullable,
            }));
          } else {
            throw new Error("No schema information found via direct query");
          }
        } catch (schemaError: any) {
          console.warn(
            "Error querying information_schema, trying another approach:",
            schemaError.message
          );

          try {
            // Third approach: Try direct SQL query via RPC
            const { data: directData, error: directError } = await supabase.rpc(
              "direct_query",
              {
                query_text: `
                SELECT column_name, data_type, 
                  CASE WHEN is_nullable = 'YES' THEN true ELSE false END as is_nullable
                FROM information_schema.columns 
                WHERE table_schema = 'public' AND table_name = '${tableName}'
                ORDER BY ordinal_position
              `,
              }
            );

            if (directError) throw directError;
            if (directData && directData.length > 0) {
              columns = directData;
            } else {
              throw new Error("No schema information from direct query");
            }
          } catch (directQueryError: any) {
            console.warn(
              "Error with direct query, falling back to common columns:",
              directQueryError.message
            );

            // Fourth approach: Use our predefined column patterns based on table naming
            columns = getCommonColumnsForTable(tableName);

            // Log that we're using a fallback for this table
            console.log(`Using common column fallback for table: ${tableName}`);
          }
        }
      }

      if (columns && columns.length > 0) {
        // Filter out system columns and standardize column metadata
        const filteredColumns = columns.filter(
          (col: any) =>
            !["created_at", "created_by", "updated_at", "updated_by"].includes(
              col.column_name
            )
        );

        setTableMetadata({
          table_name: tableName,
          display_name:
            LOOKUP_TABLES.find((t) => t.table_name === tableName)
              ?.display_name || tableName,
          columns: filteredColumns,
        });

        // Generate dynamic columns for the data table
        const dynamicCols: Column[] = filteredColumns.map(
          (col: ColumnMetadata) => ({
            id: col.column_name, // Add unique id
            header: formatColumnName(col.column_name),
            accessorKey: col.column_name,
          })
        );

        setDynamicColumns(dynamicCols);
      } else {
        // If we still have no columns at this point, use a minimal default set
        const defaultColumns = [
          { column_name: "id", data_type: "integer", is_nullable: false },
          { column_name: "name", data_type: "text", is_nullable: false },
          { column_name: "description", data_type: "text", is_nullable: true },
        ];

        setTableMetadata({
          table_name: tableName,
          display_name:
            LOOKUP_TABLES.find((t) => t.table_name === tableName)
              ?.display_name || tableName,
          columns: defaultColumns,
        });

        // Generate default columns for the data table
        const defaultDynamicCols: Column[] = defaultColumns.map((col) => ({
          id: col.column_name,
          header: formatColumnName(col.column_name),
          accessorKey: col.column_name,
        }));

        setDynamicColumns(defaultDynamicCols);

        // Show warning toast
        toast({
          title: "Limited information available",
          description:
            "Using default fields for this table. Some fields may be missing.",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Error in fetchTableMetadata:", error);
      toast({
        title: "Error fetching table metadata",
        description: error.message,
        variant: "destructive",
      });

      // Set up default fallback columns as a last resort
      const fallbackColumns = getCommonColumnsForTable(tableName);

      setTableMetadata({
        table_name: tableName,
        display_name:
          LOOKUP_TABLES.find((t) => t.table_name === tableName)?.display_name ||
          tableName,
        columns: fallbackColumns,
      });

      // Generate fallback columns for the data table
      const fallbackDynamicCols: Column[] = fallbackColumns.map((col) => ({
        id: col.column_name,
        header: formatColumnName(col.column_name),
        accessorKey: col.column_name,
      }));

      setDynamicColumns(fallbackDynamicCols);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch actual data from the selected table
  const fetchTableData = async (tableName: string) => {
    setIsLoading(true);
    try {
      // Use RPC to safely query any table dynamically
      const { data, error } = await supabase.rpc("direct_query", {
        query_text: `SELECT * FROM ${tableName} ORDER BY id ASC`,
      });

      if (error) throw error;

      // Ensure each row has an id property
      const processedData = (Array.isArray(data) ? data : []).map(
        (item: any, index) => {
          // If the item doesn't have an id (unlikely but possible), add one based on index
          if (!item.id) {
            return { ...item, id: `row-${index}` };
          }
          return item;
        }
      );

      setTableData(processedData);
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive",
      });
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format column name for display (convert snake_case to Title Case)
  const formatColumnName = (columnName: string): string => {
    return columnName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Helper function to provide common columns for empty tables based on table naming patterns
  const getCommonColumnsForTable = (
    tableName: string
  ): { column_name: string; data_type: string; is_nullable: boolean }[] => {
    // Common base columns that most lookup tables have
    const baseColumns = [
      { column_name: "id", data_type: "integer", is_nullable: false },
      { column_name: "name", data_type: "text", is_nullable: false },
    ];

    // Add typical columns based on table name patterns
    if (tableName.includes("type")) {
      return [
        ...baseColumns,
        { column_name: "description", data_type: "text", is_nullable: true },
      ];
    }

    if (tableName.includes("category")) {
      return [
        ...baseColumns,
        { column_name: "description", data_type: "text", is_nullable: true },
        { column_name: "parent_id", data_type: "integer", is_nullable: true },
      ];
    }

    if (tableName.includes("lining") || tableName.includes("coating")) {
      return [
        ...baseColumns,
        { column_name: "code", data_type: "text", is_nullable: true },
        { column_name: "description", data_type: "text", is_nullable: true },
      ];
    }

    if (tableName.includes("class")) {
      return [
        ...baseColumns,
        { column_name: "code", data_type: "text", is_nullable: true },
        { column_name: "description", data_type: "text", is_nullable: true },
      ];
    }

    // Default set of columns for unknown table patterns
    return [
      ...baseColumns,
      { column_name: "description", data_type: "text", is_nullable: true },
      { column_name: "is_active", data_type: "boolean", is_nullable: true },
    ];
  };

  // Handle table selection change
  const handleTableChange = (value: string) => {
    setSelectedTable(value);
    setTableData([]);
    setFormData({});
  };

  // Handle add button click
  const handleAddClick = () => {
    // Initialize form data with empty values for all columns
    if (tableMetadata) {
      const initialFormData: Record<string, any> = {};
      tableMetadata.columns.forEach((col) => {
        if (col.column_name !== "id") {
          initialFormData[col.column_name] = "";
        }
      });
      setFormData(initialFormData);
      setIsAddDialogOpen(true);
    }
  };

  // Handle edit button click
  const handleEditClick = (item: any) => {
    setCurrentItem(item);
    setFormData({ ...item });
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (item: any) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new item
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return;

    setIsLoading(true);
    try {
      // Add audit fields
      const dataToInsert = {
        ...formData,
        created_at: new Date().toISOString(),
        created_by: user?.id || null,
      };

      // Extract columns and values for the SQL query
      const columns = Object.keys(dataToInsert);
      const values = Object.values(dataToInsert).map((val) =>
        val === null
          ? "NULL"
          : typeof val === "string"
          ? `'${val.replace(/'/g, "''")}'`
          : typeof val === "boolean"
          ? val
            ? "TRUE"
            : "FALSE"
          : val
      );

      // Build a SQL query that works with our direct_query function
      const sql = `
        INSERT INTO ${selectedTable} (${columns.join(", ")}) 
        VALUES (${values.join(", ")})
        RETURNING *;
      `;

      const { data, error } = await supabase.rpc("direct_query", {
        query_text: sql,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item added successfully",
      });

      setIsAddDialogOpen(false);
      fetchTableData(selectedTable);
    } catch (error: any) {
      toast({
        title: "Error adding item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing item
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable || !currentItem) return;

    setIsLoading(true);
    try {
      // Add audit fields
      const dataToUpdate = {
        ...formData,
        updated_at: new Date().toISOString(),
        updated_by: user?.id || null,
      };

      // Build SET clause for SQL update
      const setClause = Object.entries(dataToUpdate)
        .map(
          ([key, val]) =>
            `${key} = ${
              val === null
                ? "NULL"
                : typeof val === "string"
                ? `'${val.replace(/'/g, "''")}'`
                : typeof val === "boolean"
                ? val
                  ? "TRUE"
                  : "FALSE"
                : val
            }`
        )
        .join(", ");

      // Build a SQL query that works with our direct_query function
      const sql = `
        UPDATE ${selectedTable}
        SET ${setClause}
        WHERE id = ${currentItem.id}
        RETURNING *;
      `;

      const { error } = await supabase.rpc("direct_query", {
        query_text: sql,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully",
      });

      setIsEditDialogOpen(false);
      fetchTableData(selectedTable);
    } catch (error: any) {
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete item
  const handleDeleteConfirm = async () => {
    if (!selectedTable || !currentItem) return;

    setIsLoading(true);
    try {
      // Build a SQL query that works with our direct_query function
      const sql = `
        DELETE FROM ${selectedTable}
        WHERE id = ${currentItem.id}
        RETURNING id;
      `;

      const { error } = await supabase.rpc("direct_query", {
        query_text: sql,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });

      setIsDeleteDialogOpen(false);
      fetchTableData(selectedTable);
    } catch (error: any) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {isSuperAdmin ? (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Lookup Data Management
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={!selectedTable || isLoading}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleAddClick}
                  disabled={!selectedTable || isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="table-select">Select Table</Label>
                <Select
                  onValueChange={handleTableChange}
                  value={selectedTable || undefined}
                >
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOOKUP_TABLES.map((table) => (
                      <SelectItem
                        key={table.table_name}
                        value={table.table_name}
                      >
                        {table.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTable && (
                <DataTable
                  columns={dynamicColumns}
                  data={tableData}
                  isLoading={isLoading}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              )}
            </CardContent>
          </Card>

          {/* Add Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Add New {tableMetadata?.display_name || "Item"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit}>
                <div className="grid gap-4 py-4">
                  {tableMetadata?.columns.map(
                    (col) =>
                      col.column_name !== "id" && (
                        <div
                          key={col.column_name}
                          className="grid grid-cols-4 items-center gap-4"
                        >
                          <Label
                            className="text-right"
                            htmlFor={col.column_name}
                          >
                            {formatColumnName(col.column_name)}
                          </Label>
                          <Input
                            id={col.column_name}
                            name={col.column_name}
                            className="col-span-3"
                            value={formData[col.column_name] || ""}
                            onChange={handleFormChange}
                            required={!col.is_nullable}
                          />
                        </div>
                      )
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Edit {tableMetadata?.display_name || "Item"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit}>
                <div className="grid gap-4 py-4">
                  {tableMetadata?.columns.map(
                    (col) =>
                      col.column_name !== "id" && (
                        <div
                          key={col.column_name}
                          className="grid grid-cols-4 items-center gap-4"
                        >
                          <Label
                            className="text-right"
                            htmlFor={`edit-${col.column_name}`}
                          >
                            {formatColumnName(col.column_name)}
                          </Label>
                          <Input
                            id={`edit-${col.column_name}`}
                            name={col.column_name}
                            className="col-span-3"
                            value={formData[col.column_name] || ""}
                            onChange={handleFormChange}
                            required={!col.is_nullable}
                          />
                        </div>
                      )
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this item? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <Card>
          <CardContent className="mt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p>You need Super Admin privileges to access this page.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LookupManagementPage;
