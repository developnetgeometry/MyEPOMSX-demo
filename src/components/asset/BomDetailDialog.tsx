// src/components/bom/BomDetailDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatDate } from "@/utils/formatters";
import { Loader2 } from "lucide-react";
import { useBomAssemblyById } from '@/hooks/queries/useBomAssembly';

interface BomDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bomId?: number;
}

const BomDetailDialog: React.FC<BomDetailDialogProps> = ({ isOpen, onClose, bomId }) => {
  const { data: bom, isLoading, error } = useBomAssemblyById(bomId);
  
  

  if (!bomId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>BOM Details</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            Error loading BOM: {error.message}
          </div>
        ) : bom ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-500">BOM Name</h3>
                <p className="text-lg">{bom.bom_name}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">BOM Code</h3>
                <p className="text-lg">{bom.bom_code}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Created On</h3>
                <p>{bom.created_at ? formatDate(bom.created_at) : '-'}</p>
              </div>
               <div>
                <h3 className="font-medium text-gray-500">Spare Part</h3>
                <p>{bom.items?.item_name}</p>
              </div>
              <div className="col-span-2">
                <h3 className="font-medium text-gray-500">Description</h3>
                <p>{bom.description || '-'}</p>
              </div>
            </div>
            
            {bom.items && bom.items?.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-3">BOM Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Part Number</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit of Measure</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bom.items?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.item_master?.item_name || '-'}</TableCell>
                          <TableCell>{item.item_master?.part_number || '-'}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unit_of_measure}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            BOM not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BomDetailDialog;