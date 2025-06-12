import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Download,
  Trash2,
  FileText,
  View,
  X,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
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
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency, isMonetaryField } from "@/utils/formatters";

export interface Column {
  id: string;
  header: string;
  accessorKey: string;
  cell?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit?: (row: any) => void;
  pageSize?: number;
  onRowClick?: (row: any) => void;
  onDelete?: (row: any) => void;
  onExport?: () => void;
  onViewDetails?: (row: any) => void;
  isLoading?: boolean;
  onIndex?: boolean; // Add this prop to enable index column
}

const DataTable: React.FC<DataTableProps> = ({
  data = [],
  columns = [],
  onEdit,
  pageSize = 10,
  onRowClick,
  onDelete,
  onExport,
  onViewDetails,
  isLoading,
  onIndex = false, // Default to false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const totalPages = Math.ceil(data.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (row: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setRowToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (rowToDelete && onDelete) {
      setIsDeleteLoading(true);
      try {
        await onDelete(rowToDelete);
      } finally {
        setIsDeleteLoading(false);
        setDeleteDialogOpen(false);
        setRowToDelete(null);
      }
    }
  };

  const handleEditClick = (row: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(row);
    }
  };

  const handleViewDetailsClick = (row: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(row);
    } else if (onRowClick) {
      // If no specific view details handler, fall back to row click
      onRowClick(row);
    }
  };

  const handleRowClickEvent = (row: any) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Default export to CSV functionality
      const headers = columns.map((col) => col.header).join(",");
      const rows = data
        .map((row) =>
          columns
            .map((col) => {
              if (!col.accessorKey) return "";
              const value = row[col.accessorKey];
              return typeof value === "string" ? `"${value}"` : value;
            })
            .join(",")
        )
        .join("\n");

      const csvContent = `${headers}\n${rows}`;
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.setAttribute("href", url);
      link.setAttribute("download", "export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export completed");
    }
  };

  // Process cell value to apply Malaysian Ringgit formatting automatically
  const formatCellValue = (column: Column, row: any): React.ReactNode => {
    const accessorKey = column.accessorKey;

    if (!accessorKey) {
      return null; // Return null if accessorKey is undefined
    }

    // Handle nested keys (e.g., "project_type.name")
    const value = accessorKey.split(".").reduce((obj, key) => obj?.[key], row);

    // If a custom cell renderer is defined, use it
    if (column.cell) {
      return column.cell(value);
    }

    // Return the value as-is for non-monetary fields
    return value;
  };

  return (
    <div className="w-full">
      <div className="rounded-lg border border-gray-100 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-100">
                {onIndex && (
                  <TableHead className="py-3 px-6 text-sm font-semibold text-gray-900">
                    No.
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className="py-3 px-6 text-sm font-semibold text-gray-900"
                  >
                    {column.header}
                  </TableHead>
                ))}
                {(onEdit || onDelete || onViewDetails) && (
                  <TableHead className="w-24 text-right px-6 text-sm font-semibold text-gray-900">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (onEdit || onDelete || onViewDetails ? 1 : 0)
                    }
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                      <span className="text-gray-500">Loading data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (onEdit || onDelete || onViewDetails ? 1 : 0)
                    }
                    className="h-24 text-center text-gray-500"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className={`border-t border-gray-100 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } ${onRowClick
                        ? "cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                        : ""
                      }`}
                    onClick={
                      onRowClick && !isLoading
                        ? () => handleRowClickEvent(row)
                        : undefined
                    }
                  >
                    {onIndex && (
                      <TableCell className="py-4 px-6 text-sm text-gray-900">
                        {startIndex + rowIndex + 1}
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={`${rowIndex}-${column.id}`}
                        className="py-4 px-6 text-sm text-gray-900"
                      >
                        {formatCellValue(column, row)}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete || onViewDetails) && (
                      <TableCell className="text-right py-2 pr-6">
                        <div className="flex space-x-2 justify-end">
                          {onViewDetails && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={(e) =>
                                      !isLoading &&
                                      handleViewDetailsClick(row, e)
                                    }
                                    disabled={isLoading}
                                  >
                                    <View className="h-4 w-4" />
                                    <span className="sr-only">
                                      View Details
                                    </span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Details</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}

                          {onEdit && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={(e) =>
                                      !isLoading && handleEditClick(row, e)
                                    }
                                    disabled={isLoading}
                                  >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}

                          {onDelete && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={(e) =>
                                      !isLoading && handleDeleteClick(row, e)
                                    }
                                    disabled={isLoading}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
            <div className="text-sm text-gray-600">
              Total {data.length} {data.length === 1 ? "item" : "items"}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-500"
                onClick={() => handleExport()}
              >
                <FileText className="h-4 w-4 mr-1" /> Export
              </Button>
              {/* <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-500"
                onClick={() => handleExport()}
              >
                <Download className="h-4 w-4 mr-1" /> Download
              </Button> */}
            </div>
          </div>
        )}
      </div>

      {data.length > pageSize && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{" "}
            {data.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0 border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 5) return true;
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis if pages are skipped
                  if (index > 0 && page > array[index - 1] + 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="px-2 text-gray-500">...</span>
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className={`h-9 w-9 p-0 ${currentPage === page
                            ? "bg-blue-600"
                            : "border-gray-200"
                            }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={`h-9 w-9 p-0 ${currentPage === page ? "bg-blue-600" : "border-gray-200"
                        }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 w-9 p-0 border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DataTable;
