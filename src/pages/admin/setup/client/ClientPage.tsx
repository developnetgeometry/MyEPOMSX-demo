import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { useClientData, insertClientData, updateClientData, deleteClientData } from "../hooks/use-client-data";
import ClientDialogForm from "./ClientDialogForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/shared/Loading";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ClientPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: clients, isLoading, refetch } = useClientData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const { toast } = useToast();

  const handleRowClick = (row: any) => {
    navigate(`/admin/setup/client/${row.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddNew = () => {
    setEditingClient(null);
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleDeleteClient = async (client: any) => {
    try {
      await deleteClientData(client.id);
      toast({
        title: "Success",
        description: "Client deleted successfully!",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete client data:", error);
      toast({
        title: "Error",
        description: "Failed to delete client data.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingClient) {
        await updateClientData(editingClient.id, formData);
        toast({
          title: "Success",
          description: "Client updated successfully!",
          variant: "default",
        });
      } else {
        await insertClientData(formData);
        toast({
          title: "Success",
          description: "Client added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to save client data:", error);
      toast({
        title: "Error",
        description: "Failed to save client data.",
        variant: "destructive",
      });
    }
  };

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!searchQuery) return clients;
    const lower = searchQuery.toLowerCase();
    return clients.filter(
      (client: any) =>
        client.code?.toLowerCase().includes(lower) ||
        client.name?.toLowerCase().includes(lower) ||
        client.email?.toLowerCase().includes(lower) ||
        client.office_no?.toLowerCase().includes(lower) ||
        client.onboard_date?.toLowerCase().includes(lower) ||
        client.type?.toLowerCase().includes(lower)
    );
  }, [clients, searchQuery]);

  const columns: Column[] = [
    { id: "code", header: "Client Code", accessorKey: "code" },
    { id: "name", header: "Client Name", accessorKey: "name" },
    { id: "email", header: "Email", accessorKey: "email" },
    { id: "office_no", header: "Office No.", accessorKey: "office_no" },
    { id: "onboard_date", header: "Onboard Date", accessorKey: "onboard_date", cell: (value: any) => formatDate(value) },
    { id: "type", header: "Type", accessorKey: "type" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Setup"
        onAddNew={handleAddNew}
        addNewLabel="New Client"
        onSearch={handleSearch}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={filteredClients}
          onRowClick={handleRowClick}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
          onIndex={true}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
                <DialogDescription>
                  {editingClient
                    ? "Update the details of the client."
                    : "Fill in the details to add a new client."}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <ClientDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingClient}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientPage;