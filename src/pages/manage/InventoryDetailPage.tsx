import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Package, Plus } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatters";
import TransactionModal, {
  useTransactionModal,
  createField,
} from "@/components/ui/TransactionModal";
import {
  useInventoryDetail,
  useReceiveInventory,
  useIssueInventory,
  useReturnInventory,
  useAdjustmentInventory,
  useTransferInventory,
  useTransactionInventory,
  useAddReceiveInventory,
  useAddIssueInventory,
  useAddReturnInventory,
  useAddAdjustmentInventory,
  useAddTransferInventory,
  useWorkOrderOptions,
  useAdjustmentCategoryOptions,
  useAdjustmentTypeOptions,
  useEmployeeOptions,
  useStoreOptions,
} from "@/hooks/queries/useInventory";
import { useAuth } from "@/contexts/AuthContext";

interface FieldMapping {
  [key: string]: string | ((data: any, user: any, inventoryItem: any) => any);
}

interface ModalConfig {
  fields: FieldMapping;
  hook: () => any;
  table?: string;
}

const InventoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inventory");
  const { modalState, openModal, closeModal, setLoading } =
    useTransactionModal();

  const { data: inventoryItem, isLoading: isLoadingInventoryItem } =
    useInventoryDetail(id);
  const { data: receiveData = [], isLoading: isLoadingReceive } =
    useReceiveInventory();
  const { data: issueData = [], isLoading: isLoadingIssue } =
    useIssueInventory();
  const { data: returnData = [], isLoading: isLoadingReturn } =
    useReturnInventory();
  const { data: adjustmentData = [], isLoading: isLoadingAdjustment } =
    useAdjustmentInventory();
  const { data: transferData = [], isLoading: isLoadingTransfer } =
    useTransferInventory();
  const { data: transactionData = [], isLoading: isLoadingTransaction } =
    useTransactionInventory();
  const { data: workOrderOptions = [] } = useWorkOrderOptions();
  const { data: adjustmentCategoryOptions = [] } = useAdjustmentCategoryOptions();
  const { data: adjustmentTypeOptions = [] } = useAdjustmentTypeOptions();
  const { data: employeeOptions = [] } = useEmployeeOptions();
  const { data: storeOptions = [] } = useStoreOptions();
console.log(transferData);

  const receiveMutation = useAddReceiveInventory();
  const issueMutation = useAddIssueInventory();
  const returnMutation = useAddReturnInventory();
  const adjustmentMutation = useAddAdjustmentInventory();
  const transferMutation = useAddTransferInventory();

  const submitMap = {
    receive: (data: Record<string, any>, user: any, inventoryItem: any) => ({
      po_receive_no: data.po,
      received_quantity: data.quantity,
      unit_price: data.unitPrice,
      total_price: data.totalPrice,
      created_by: user.id,
      remark: data.remarks,
      inventory_id: Number(inventoryItem.id),
      created_at: new Date().toISOString(),
    }),
    issue: (data: Record<string, any>, user: any, inventoryItem: any) => ({
      issue_date: data.issueDate,
      quantity: data.quantity,
      work_order_no: data.workOrderNo,
      created_by: user.id,
      remark: data.remarks,
      inventory_id: Number(inventoryItem.id),
      created_at: new Date().toISOString(),
    }),
    return: (data: Record<string, any>, user: any, inventoryItem: any) => ({
      return_date: data.returnDate,
      quantity: data.quantity,
      return_reason: data.returnReason,
      return_by: user.id,
      created_by: user.id,
      work_order_no: data.workOrderNo,
      remark: data.remarks,
      inventory_id: Number(inventoryItem.id),
      created_at: new Date().toISOString(),
    }),
    adjustment: (data: Record<string, any>, user: any, inventoryItem: any) => ({
      adjustment_date: data.adjustmentDate,
      quantity: data.quantity,
      inventory_id: Number(inventoryItem.id),
      remark: data.remarks,
      adjustment_type_id: data.adjustmentType,
      adjustment_category_id: data.adjustmentCategory,
      created_by: user.id,
      created_at: new Date().toISOString(),
    }),
    transfer: (data: Record<string, any>, user: any, inventoryItem: any) => ({
      inventory_id: Number(inventoryItem.id),
      transfer_date: data.transferDate,
      transfer_reason: data.transferReason,
      store_id: data.destinationStore,
      remark: data.remarks,
      quantity: data.quantity,
      employee_id: data.employee,
      created_by: user.id,
      created_at: new Date().toISOString(),
    })
  };

  const mutationMap = {
    receive: receiveMutation,
    issue: issueMutation,
    return: returnMutation,
    adjustment: adjustmentMutation,
    transfer: transferMutation
  };

  // Custom field configurations
  const customFieldConfigs = useMemo(
    () => ({
      issue: [
        createField("store", "Store", "select", {
          required: true,
          // Default to readonly if store value is provided
          readonly: !!inventoryItem?.store,
          disabled: !!inventoryItem?.store,
        }),
        createField("issueDate", "Issue Date", "date", { required: true }),
        createField("quantity", "Quantity", "number", {
          required: true,
          min: 1,
          placeholder: "1",
        }),
        createField("workOrderNo", "Work Order No", "select", {
          required: true,
          placeholder: "Select Work Order",
          options: workOrderOptions.map((wo) => ({
            value: String(wo.id),
            label: wo.work_order_no,
          })),
        }),
        createField("remarks", "Remarks", "textarea", {
          placeholder: "Additional notes...",
        }),
      ],

      // Other configs can be similarly customized
      receive: [
        createField("po", "PO Receive No.", "text", {
          required: true,
          placeholder: "e.g., PO-2025-001",
        }),
        createField("store", "Store", "text", {
          required: true,
          readonly: true,
          disabled: true,
        }),
        createField("receiveDate", "Receive Date", "date", { required: true }),
        createField("quantity", "Received Quantity", "number", {
          required: true,
          min: 1,
          placeholder: "1",
        }),
        createField("unitPrice", "Unit Price", "currency", {
          required: true,
          min: 0,
          placeholder: "0.00",
        }),
        createField("totalPrice", "Total Price", "currency", {
          readonly: true,
          disabled: true,
          calculate: (data) => (data.quantity || 0) * (data.unitPrice || 0),
        }),
        createField("receiveBy", "Received By", "text", {
          required: true,
          readonly: true,
          disabled: true,
        }),
        createField("remarks", "Remarks", "textarea", {
          placeholder: "Delivery notes, condition, etc...",
        }),
      ],
      return: [
        createField("returnDate", "Return Date", "date", { required: true }),
        createField("returnReason", "Return Reason", "text", {
          required: true,
          placeholder: "Item Return Reason",
        }),
        createField("returnedBy", "Returned By", "text", {
          required: true,
          readonly: true,
          disabled: true,
        }),
        createField("workOrderNo", "Work Order No", "select", {
          required: true,
          placeholder: "Select Work Order",
          options: workOrderOptions.map((wo) => ({
            value: String(wo.id),
            label: wo.work_order_no,
          })),
        }),
        createField("store", "Store", "select", {
          required: true,
          // Default to readonly if store value is provided
          readonly: !!inventoryItem?.store,
          disabled: !!inventoryItem?.store,
        }),
        createField("quantity", "Returned Quantity", "number", {
          required: true,
        }),
        createField("remarks", "Remarks", "textarea", {
          placeholder: "Return notes, condition, etc...",
        }),
      ],
      adjustment: [
        createField("adjustmentType", "Adjustment Type", "radio", {
          required: true,
          options: adjustmentTypeOptions.map((type) => ({
            value: String(type.id),
            label: type.name,
          })),
        }),
        createField("adjustmentCategory", "Adjustment Category", "radio", {
          required: true,
          options: adjustmentCategoryOptions.map((category) => ({
            value: String(category.id),
            label: category.name,
          })),
        }),
        createField("adjustmentDate", "Adjustment Date", "date", {
          required: true,
        }),
        createField("quantity", "Adjustment Quantity", "number", {
          required: true,
        }),
        createField("remarks", "Adjustment Reason", "textarea", {
          required: true,
          placeholder: "Adjustment Reason",
        }),
      ],
      transfer: [
        createField("employee", "Employee", "select", {
          required: true,
          options: employeeOptions.map((emp) => ({
            value: String(emp.id),
            label: emp.name,
          })),
        }),
        createField("transferDate", "Transfer Date", "date", {
          required: true,
        }),
        createField("transferReason", "Transfer Reason", "text", {
          required: true,
          placeholder: "Transfer Reason",
        }),
        createField("sourceStore", "Source Store", "select", {
          required: true,
          readonly: !!inventoryItem?.store,
          disabled: !!inventoryItem?.store,
        }),
        createField("destinationStore", "Destination Store", "select", {
          required: true,
          options: storeOptions.map((store) => ({
            value: String(store.id),
            label: store.name,
          }))
        }),
        createField("quantity", "Transfer Quantity", "number", {
          required: true,
        }),
        createField("remarks", "Transfer Notes", "textarea", {
          placeholder: "Transfer notes, condition, etc...",
        }),
      ],
    }),
    [inventoryItem]
  );

  if (!inventoryItem) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Inventory Item Not Found"
          icon={<Package className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate("/manage/inventory")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Inventory
        </Button>
      </div>
    );
  }

  // Function to handle adding new entries
  const handleAddNew = (tabName: string) => {
    const modalConfigs = {
      receive: {
        title: "Add New Receive Record",
        type: "receive",
        initialData: { store: inventoryItem.store, receiveBy: user?.email },
      },
      issue: {
        title: "Add New Issue Record",
        type: "issue",
        initialData: {
          store: inventoryItem.store,
          workOrderNo: workOrderOptions,
        },
      },
      return: {
        title: "Add New Return Record",
        type: "return",
        initialData: { store: inventoryItem.store, returnedBy: user?.email },
      },
      adjustment: {
        title: "Add New Adjustment Record",
        type: "adjustment",
        initialData: {},
      },
      transfer: {
        title: "Add New Transfer Record",
        type: "transfer",
        initialData: { sourceStore: inventoryItem.store, },
      },
      transaction: {
        title: "Add New Transaction Record",
        type: "transaction",
        initialData: {},
      },
    };

    const config = modalConfigs[tabName as keyof typeof modalConfigs];
    if (config) {
      openModal(config.type, config.title, config.initialData || {});
    }
  };

  const handleModalSubmit = async (data: Record<string, any>) => {
    setLoading(true);

    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const submitFunction =
        submitMap[modalState.type as keyof typeof submitMap];

      if (!submitFunction) {
        throw new Error("Invalid modal type");
      }

      const transformedData = submitFunction(data, user, inventoryItem);

      console.log(transformedData);

      const mutation = mutationMap[modalState.type];
      await mutation.mutateAsync(transformedData);

      toast.success(`${modalState.title} saved successfully!`);
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        `Failed to save ${modalState.title.toLowerCase()}. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const columnMapping = {
    receive: [
      { header: "Receive Date", key: "receiveDate" },
      { header: "PO", key: "po" },
      { header: "Quantity", key: "quantity" },
      { header: "Total Price", key: "totalPrice", format: "currency" },
      { header: "Receive By", key: "receiveBy" },
    ],
    issue: [
      { header: "Date", key: "issueDate" },
      { header: "Work Order No", key: "workOrderNo" },
      { header: "Quantity", key: "quantity" },
      { header: "Unit Price", key: "unitPrice", format: "currency" },
      { header: "Total", key: "total", format: "currency" },
      { header: "Store", key: "store" },
      { header: "Issuance Name", key: "issuanceName" },
      { header: "Remarks", key: "remarks" },
    ],
    return: [
      { header: "Date", key: "returnDate" },
      { header: "Work Order", key: "workOrder" },
      { header: "Quantity", key: "quantity" },
      { header: "Price", key: "price", format: "currency" },
      { header: "Total", key: "total", format: "currency" },
      { header: "Return Name", key: "returnName" },
      { header: "Remarks", key: "remarks" },
    ],
    adjustment: [
      { header: "Date", key: "adjustmentDate" },
      { header: "Quantity", key: "quantity" },
      { header: "Total Quantity", key: "totalQuantity" },
      { header: "Price", key: "price", format: "currency" },
      { header: "Total", key: "total", format: "currency" },
      { header: "Authorized Employee", key: "authorizedEmployee" },
      { header: "Adjustment Reason", key: "remarks" },
    ],
    transfer: [
      { header: "From Store", key: "fromStore" },
      { header: "To Store", key: "toStore" },
      { header: "Quantity", key: "quantity" },
      { header: "Price", key: "price", format: "currency" },
      { header: "Employee", key: "employee" },
      { header: "Remarks", key: "remarks" },
      { header: "Transfer Date", key: "transferDate" },
    ],
    transaction: [
      { header: "Particulars", key: "particulars" },
      { header: "Transaction Date", key: "transactionDate" },
      { header: "Transaction No", key: "transactionNo" },
      { header: "Quantity", key: "quantity" },
      { header: "Price", key: "price", format: "currency" },
      { header: "Total", key: "total", format: "currency" },
      { header: "Store", key: "store" },
      { header: "Transaction User", key: "transactionUser" },
      { header: "Remarks", key: "remarks" },
    ],
  };

  const renderTabContent = (
    data: any[],
    columnMapping: any[],
    tabName: string
  ) => (
    <>
      {tabName !== "transaction" && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">
            {tabName.charAt(0).toUpperCase() + tabName.slice(1)} Records
          </h3>
          <Button
            onClick={() => handleAddNew(tabName)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </div>
      )}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columnMapping.map((col) => (
                <TableHead key={col.key}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columnMapping.length}
                  className="h-24 text-gray-500 text-center"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
            {data.map((item) => (
              <TableRow key={item.id}>
                {columnMapping.map((col) => (
                  <TableCell key={`${item.id}-${col.key}`}>
                    {col.format === "currency"
                      ? formatCurrency(item[col.key])
                      : item[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Inventory Details: ${inventoryItem.itemName}`}
          icon={<Package className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate("/manage/inventory")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Inventory
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs
            defaultValue="inventory"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="receive">Receive</TabsTrigger>
              <TabsTrigger value="issue">Issue</TabsTrigger>
              <TabsTrigger value="return">Return</TabsTrigger>
              <TabsTrigger value="adjustment">Adjustment</TabsTrigger>
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
              <TabsTrigger value="transaction">Transaction</TabsTrigger>
            </TabsList>

            {/* Inventory Tab */}
            <TabsContent value="inventory">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Spare Part Name
                  </h3>
                  <p className="text-base">{inventoryItem.itemName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Store
                  </h3>
                  <p className="text-base">{inventoryItem.store}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Opening Balance Quantity
                  </h3>
                  <p className="text-base">{inventoryItem.balance}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Opening Balance Date
                  </h3>
                  <p className="text-base">2025-01-01</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Min Level
                  </h3>
                  <p className="text-base">{inventoryItem.minLevel}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Max Level
                  </h3>
                  <p className="text-base">{inventoryItem.maxLevel}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Reorder Level
                  </h3>
                  <p className="text-base">{inventoryItem.reorderLevel}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Current Balance Quantity
                  </h3>
                  <p className="text-base">{inventoryItem.balance}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Unit Price
                  </h3>
                  <p className="text-base">
                    {formatCurrency(inventoryItem.unitPrice)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Total Price
                  </h3>
                  <p className="text-base">
                    {formatCurrency(inventoryItem.totalPrice)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Rack No
                  </h3>
                  <p className="text-base">{inventoryItem.rackNo}</p>
                </div>
              </div>
            </TabsContent>

            {/* Receive Tab */}
            <TabsContent value="receive">
              {renderTabContent(receiveData, columnMapping.receive, "receive")}
            </TabsContent>

            {/* Issue Tab */}
            <TabsContent value="issue">
              {renderTabContent(issueData, columnMapping.issue, "issue")}
            </TabsContent>

            {/* Return Tab */}
            <TabsContent value="return">
              {renderTabContent(returnData, columnMapping.return, "return")}
            </TabsContent>

            {/* Adjustment Tab */}
            <TabsContent value="adjustment">
              {renderTabContent(
                adjustmentData,
                columnMapping.adjustment,
                "adjustment"
              )}
            </TabsContent>

            {/* Transfer Tab */}
            <TabsContent value="transfer">
              {renderTabContent(
                transferData,
                columnMapping.transfer,
                "transfer"
              )}
            </TabsContent>

            {/* Transaction Tab */}
            <TabsContent value="transaction">
              {renderTabContent(
                transactionData,
                columnMapping.transaction,
                "transaction"
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <TransactionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        title={modalState.title}
        fields={
          customFieldConfigs[
            modalState.type as keyof typeof customFieldConfigs
          ] || []
        }
        initialData={modalState.initialData}
        isLoading={modalState.isLoading}
        size="lg"
      />
    </div>
  );
};

export default InventoryDetailPage;
