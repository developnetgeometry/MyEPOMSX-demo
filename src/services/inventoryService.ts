import { supabase } from "@/lib/supabaseClient";
import { formatDate } from "@/utils/formatters";

export const inventoryService = {
  // Update in services/inventoryService.ts

  async getInventoryList(params?: {
  storeId?: string;
  page?: number;
  pageSize?: number;
  // searchQuery?: string; // Remove from backend filtering
}) {
  let query = supabase
    .from("e_inventory")
    .select(
      "*, item_master:item_master_id(*, manu:manufacturer(*), type:type_id(*), category:category_id(*), unit:unit_id(*)), rack:rack_id(*)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  // Apply store filter
  if (params?.storeId) {
    query = query.eq("store_id", Number(params.storeId));
  }

  // Always fetch a large page for frontend filtering
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 1000;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`Error fetching inventories: ${error.message}`);
  }

  return {
    items: data || [],
    totalCount: count || 0,
  };
},

  async createReceiveInventory(payload: any) {
    const { data, error } = await supabase.rpc("handle_receive_inventory", {
      p_inventory_id: payload.inventory_id,
      p_received_quantity: payload.received_quantity,
      p_unit_price: payload.unit_price,
      p_po_receive_no: payload.po_receive_no,
      p_created_by: payload.created_by,
      p_remark: payload.remark,
      p_created_at: payload.created_at,
    });

    if (error) throw new Error(`Error creating receive: ${error.message}`);
    return data;
  },

  async createIssueInventory(payload: any) {
    const { data, error } = await supabase.rpc("handle_issue_inventory", {
      p_inventory_id: payload.inventory_id,
      p_quantity: payload.quantity,
      p_work_order_no: payload.work_order_no,
      p_created_by: payload.created_by,
      p_remark: payload.remark,
      p_created_at: payload.created_at,
    });

    if (error) {
      throw new Error(`Error creating issue: ${error.message}`);
    }
    return data;
  },

  async createReturnInventory(payload: any) {
    const { data, error } = await supabase.rpc("handle_return_inventory", {
      p_inventory_id: payload.inventory_id,
      p_quantity: payload.quantity,
      p_work_order_no: payload.work_order_no,
      p_created_by: payload.created_by,
      p_remark: payload.remark,
      p_created_at: payload.created_at,
    });

    if (error) {
      throw new Error(`Error creating return: ${error.message}`);
    }
    return data;
  },

  async createAdjustmentInventory(payload: any) {
    const { data, error } = await supabase.rpc("handle_adjustment_inventory", {
      p_inventory_id: payload.inventory_id,
      p_quantity: payload.quantity,
      p_adjustment_type_id: payload.adjustment_type_id,
      p_adjustment_category_id: payload.adjustment_category_id,
      p_created_by: payload.created_by,
      p_remark: payload.remark,
      p_created_at: payload.created_at,
    });

    if (error) {
      throw new Error(`Error creating adjustment: ${error.message}`);
    }
    return data;
  },

  async createTransferInventory(payload: any) {
    const { data, error } = await supabase.rpc("handle_transfer_inventory", {
      p_source_inventory_id: payload.inventory_id,
      p_destination_store_id: payload.store_id,
      p_quantity: payload.quantity,
      p_transfer_reason: payload.transfer_reason,
      p_employee_id: payload.employee_id,
      p_created_by: payload.created_by,
      p_remark: payload.remark,
      p_created_at: payload.created_at,
    });

    if (error) {
      throw new Error(`Error creating transfer: ${error.message}`);
    }
    return data;
  },

  async getInventoryById(id: number) {
    const { data, error } = await supabase
      .from("e_inventory")
      .select(
        "*, open_balance_date, rack:rack_id(*), store:store_id(*), item_master:item_master_id(*, manu:manufacturer(*), type:type_id(*), category:category_id(*), unit:unit_id(*))"
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching inventory: ${error.message}`);
    }

    // Map the raw data to the desired shape
    const mappedData = {
      id: data.id?.toString() || "",
      itemName: data.item_master?.item_name || "",
      description: data.item_master?.specification || "",
      store: data.store?.name || "",
      balance: data.open_balance || 0,
      balanceDate: data.open_balance_date
        ? formatDate(data.open_balance_date.split("T")[0])
        : "",
      currentBalance: data.current_balance || 0,
      minLevel: data.min_level || 0,
      maxLevel: data.max_level || 0,
      reorderLevel: data.reorder_table || 0,
      unitPrice: data.unit_price || 0,
      totalPrice: data.total_price || 0,
      rackNo: data.rack?.name || "",
    };

    return mappedData;
  },

  async createInventory(payload: any) {
    const { data, error } = await supabase
      .from("e_inventory")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating inventory: ${error.message}`);
    }

    return data;
  },

  async updateInventory(id: number, payload: any) {
    const { data, error } = await supabase
      .from("e_inventory")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating inventory: ${error.message}`);
    }

    return data;
  },

  async deleteInventory(id: number) {
    const { error } = await supabase.from("e_inventory").delete().eq("id", id);

    if (error) {
      throw new Error(`Error deleting inventory: ${error.message}`);
    }
  },

  async getSparePartsOptions() {
    const { data, error } = await supabase
      .from("e_spare_parts")
      .select("*, item_master: item_master_id(*)")
      .order("item_master_id");

    if (error) {
      console.error("Error fetching spare parts:", error);
      throw error;
    }

    return data || [];
  },

  async getStoreOptions() {
    const { data, error } = await supabase
      .from("e_store")
      .select("id, name")
      .order("id");

    if (error) {
      console.error("Error fetching stores:", error);
      throw error;
    }

    return data || [];
  },

  async getRackNoOptions() {
    const { data, error } = await supabase
      .from("e_rack")
      .select("id, name")
      .order("id");

    if (error) {
      console.error("Error fetching rack:", error);
      throw error;
    }

    return data || [];
  },

  async getWorkOrderOptions() {
    const { data, error } = await supabase
      .from("e_work_order")
      .select("id, work_order_no")
      .order("id");

    if (error) {
      console.error("Error fetching work orders:", error);
      throw error;
    }

    return data || [];
  },

  async getAdjustmentCategoryOptions() {
    const { data, error } = await supabase
      .from("e_adjustment_category")
      .select("id, name")
      .order("id");

    if (error) {
      console.error("Error fetching adjustment categories:", error);
      throw error;
    }

    return data || [];
  },

  async getAdjustmentTypeOptions() {
    const { data, error } = await supabase
      .from("e_adjustment_type")
      .select("id, name")
      .order("id");

    if (error) {
      console.error("Error fetching adjustment types:", error);
      throw error;
    }

    return data || [];
  },

  async getEmployeeOptions() {
    const { data, error } = await supabase
      .from("e_employee")
      .select("id, name")
      .order("id");

    if (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }

    return data || [];
  },

  // Helper to fetch and map user profiles for created_by fields
  async mapWithProfiles(data, mapFn) {
    const userIds = [
      ...new Set(data.map((item) => item.created_by).filter(Boolean)),
    ];

    let profileMap = {};
    if (userIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds as string[]);
      if (profileError) {
        console.error("Error fetching profiles:", profileError);
      }
      profileMap = (profiles || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});
    }
    return (data || []).map((item) => mapFn(item, profileMap));
  },

  async getReceiveInventoryByInventoryId(inventoryId: number) {
    const { data, error } = await supabase
      .from("e_inventory_receive")
      .select("*")
      .eq("inventory_id", inventoryId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching receive inventory by project ID:", error);
      throw error;
    }

    return await this.mapWithProfiles(data, (item, profileMap) => ({
      id: item.id?.toString() || "",
      receiveDate: item.created_at
        ? formatDate(item.created_at.split("T")[0])
        : "",
      po: item.po_receive_no || "",
      quantity: item.received_quantity || 0,
      totalPrice: item.total_price || 0,
      receiveBy: profileMap[item.created_by]?.full_name || "",
    }));
  },

  async getIssueInventoryByInventoryId(inventoryId: number) {
    const { data, error } = await supabase
      .from("e_inventory_issue")
      .select(
        "id, issue_date, work_order:work_order_no(work_order_no), quantity, created_by, remark, inventory:inventory_id(unit_price, store:store_id(name))"
      )
      .eq("inventory_id", inventoryId)
      .order("id");

    if (error) {
      console.error("Error fetching issue inventory by inventory ID:", error);
      throw error;
    }

    return await this.mapWithProfiles(data, (item, profileMap) => ({
      id: item.id?.toString() || "",
      issueDate: item.issue_date
        ? formatDate(item.issue_date.split("T")[0])
        : "",
      workOrderNo: item.work_order?.work_order_no || "",
      quantity: item.quantity || 0,
      unitPrice: item.inventory?.unit_price || 0,
      total: (item.quantity || 0) * (item.inventory?.unit_price || 0),
      store: item.inventory?.store?.name || "",
      issuanceName: profileMap[item.created_by]?.full_name || "",
      remarks: item.remark || "",
    }));
  },
  async getReturnInventoryByInventoryId(inventoryId: number) {
    const { data, error } = await supabase
      .from("e_inventory_return")
      .select(
        "id, return_date, work_order:work_order_no(work_order_no), quantity, inventory:inventory_id(unit_price), created_by, remark"
      )
      .eq("inventory_id", inventoryId)
      .order("id");

    if (error) {
      console.error("Error fetching return inventory by inventory ID:", error);
      throw error;
    }

    return await this.mapWithProfiles(data, (item, profileMap) => ({
      id: item.id?.toString() || "",
      returnDate: item.return_date
        ? formatDate(item.return_date.split("T")[0])
        : "",
      workOrder: item.work_order?.work_order_no || "",
      quantity: item.quantity || 0,
      price: item.inventory?.unit_price || 0,
      total: (item.quantity || 0) * (item.inventory?.unit_price || 0),
      returnName: profileMap[item.created_by]?.full_name || "",
      remarks: item.remark || "",
    }));
  },
  async getAdjustmentInventoryByInventoryId(inventoryId: number) {
    const { data, error } = await supabase
      .from("e_inventory_adjustment")
      .select(
        "id, adjustment_date, quantity, inventory:inventory_id(unit_price, current_balance), created_by, remark"
      )
      .eq("inventory_id", inventoryId)
      .order("id");

    if (error) {
      console.error(
        "Error fetching adjustment inventory by inventory ID:",
        error
      );
      throw error;
    }

    return await this.mapWithProfiles(data, (item, profileMap) => ({
      id: item.id?.toString() || "",
      adjustmentDate: item.adjustment_date
        ? formatDate(item.adjustment_date.split("T")[0])
        : "",
      quantity: item.quantity || 0,
      totalQuantity: item.inventory?.current_balance || 0,
      price: item.inventory?.unit_price || 0,
      total: (item.quantity || 0) * (item.inventory?.unit_price || 0),
      authorizedEmployee: profileMap[item.created_by]?.full_name || "",
      remarks: item.remark || "",
    }));
  },
  async getTransferInventoryByInventoryId(inventoryId: number) {
    const { data, error } = await supabase
      .from("e_inventory_transfer")
      .select(
        `
      id,
      transfer_date,
      quantity,
      remark,
      created_by,
      store_id (
        name
      ),
      employee:employee_id (
        name
      ),
      inventory_id (
        unit_price,
        store_id (
          name
        )
      )
    `
      )
      .eq("inventory_id", inventoryId)
      .order("id");

    if (error) {
      console.error(
        "Error fetching transfer inventory by inventory ID:",
        error
      );
      throw error;
    }

    // Map the raw data to the desired shape
    const mappedData = (data || []).map((item) => ({
      id: item.id?.toString() || "",
      fromStore: item.inventory_id?.store_id?.name || "",
      toStore: item.store_id?.name || "",
      quantity: item.quantity || 0,
      price: item.inventory_id?.unit_price || 0,
      employee: item.employee?.name || "",
      remarks: item.remark || "",
      transferDate: item.transfer_date
        ? formatDate(item.transfer_date.split("T")[0])
        : "",
    }));

    return mappedData;
  },

  async getTransactionInventoryByInventoryId(inventoryId: number) {
    try {
      // Fetch all transaction types in parallel
      const [receiveData, issueData, returnData, adjustmentData, transferData] =
        await Promise.all([
          // Receive transactions
          supabase
            .from("e_inventory_receive")
            .select(
              "id, created_at, po_receive_no, received_quantity, total_price, created_by, inventory:inventory_id(store:store_id(name))"
            )
            .eq("inventory_id", inventoryId)
            .order("created_at"),

          // Issue transactions
          supabase
            .from("e_inventory_issue")
            .select(
              "id, issue_date, work_order_no, quantity, created_by, remark, inventory:inventory_id(unit_price, store:store_id(name))"
            )
            .eq("inventory_id", inventoryId)
            .order("issue_date"),

          // Return transactions
          supabase
            .from("e_inventory_return")
            .select(
              "id, return_date, work_order:work_order_no(work_order_no), quantity, inventory:inventory_id(unit_price, store:store_id(name)), created_by, remark"
            )
            .eq("inventory_id", inventoryId)
            .order("return_date"),

          // Adjustment transactions
          supabase
            .from("e_inventory_adjustment")
            .select(
              "id, adjustment_date, quantity, inventory:inventory_id(unit_price, store:store_id(name)), created_by, remark"
            )
            .eq("inventory_id", inventoryId)
            .order("adjustment_date"),

          // Transfer transactions
          supabase
            .from("e_inventory_transfer")
            .select(
              "id, transfer_date, quantity, inventory:inventory_id(unit_price, store:store_id(name)), created_by, remark, to_store:store_id(name)"
            )
            .eq("inventory_id", inventoryId)
            .order("transfer_date"),
        ]);

      // Check for errors
      if (receiveData.error) throw receiveData.error;
      if (issueData.error) throw issueData.error;
      if (returnData.error) throw returnData.error;
      if (adjustmentData.error) throw adjustmentData.error;
      if (transferData.error) throw transferData.error;

      // Collect all unique created_by user IDs from all transaction types
      const allUserIds = [
        ...(receiveData.data || []),
        ...(issueData.data || []),
        ...(returnData.data || []),
        ...(adjustmentData.data || []),
        ...(transferData.data || []),
      ]
        .map((item) => item.created_by)
        .filter(Boolean);

      const uniqueUserIds = [...new Set(allUserIds)];

      // Fetch user profiles and build profileMap
      let profileMap: Record<string, any> = {};
      if (uniqueUserIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", uniqueUserIds as string[]);
        if (profileError) {
          console.error("Error fetching profiles:", profileError);
        }
        profileMap = (profiles || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);
      }

      const transactions = [];

      // Map receive transactions
      (receiveData.data || []).forEach((item) => {
        transactions.push({
          id: `RCV-${item.id}`,
          particulars: "Inventory Receive",
          transactionDate: item.created_at
            ? formatDate(item.created_at.split("T")[0])
            : "",
          transactionNo: item.po_receive_no || "",
          quantity: item.received_quantity || 0,
          price:
            item.total_price && item.received_quantity
              ? item.total_price / item.received_quantity
              : 0,
          total: item.total_price || 0,
          store: item.inventory?.store?.name || "",
          transactionUser: profileMap[item.created_by]?.full_name || "",
          remarks: `PO: ${item.po_receive_no || ""}`,
          type: "RECEIVE",
        });
      });

      // Map issue transactions
      (issueData.data || []).forEach((item) => {
        transactions.push({
          id: `ISS-${item.id}`,
          particulars: "Inventory Issue",
          transactionDate: item.issue_date
            ? formatDate(item.issue_date.split("T")[0])
            : "",
          transactionNo: item.work_order_no || "",
          quantity: -(item.quantity || 0), // Negative for issues
          price: item.inventory?.unit_price || 0,
          total: -((item.quantity || 0) * (item.inventory?.unit_price || 0)), // Negative total
          store: item.inventory?.store?.name || "",
          transactionUser: profileMap[item.created_by]?.full_name || "",
          remarks: item.remark || `Work Order: ${item.work_order_no || ""}`,
          type: "ISSUE",
        });
      });

      // Map return transactions
      (returnData.data || []).forEach((item) => {
        transactions.push({
          id: `RTN-${item.id}`,
          particulars: "Inventory Return",
          transactionDate: item.return_date
            ? formatDate(item.return_date.split("T")[0])
            : "",
          transactionNo: item.work_order?.work_order_no || "",
          quantity: item.quantity || 0, // Positive for returns
          price: item.inventory?.unit_price || 0,
          total: (item.quantity || 0) * (item.inventory?.unit_price || 0),
          store: item.inventory?.store?.name || "",
          transactionUser: profileMap[item.created_by]?.full_name || "",
          remarks:
            item.remark ||
            `Return from WO: ${item.work_order?.work_order_no || ""}`,
          type: "RETURN",
        });
      });

      // Map adjustment transactions
      (adjustmentData.data || []).forEach((item) => {
        transactions.push({
          id: `ADJ-${item.id}`,
          particulars: "Inventory Adjustment",
          transactionDate: item.adjustment_date
            ? formatDate(item.adjustment_date.split("T")[0])
            : "",
          transactionNo: `ADJ-${item.id}`,
          quantity: item.quantity || 0, // Can be positive or negative
          price: item.inventory?.unit_price || 0,
          total: (item.quantity || 0) * (item.inventory?.unit_price || 0),
          store: item.inventory?.store?.name || "",
          transactionUser: profileMap[item.created_by]?.full_name || "",
          remarks: item.remark || "Stock adjustment",
          type: "ADJUSTMENT",
        });
      });

      // Map transfer transactions (create two entries: OUT and IN)
      (transferData.data || []).forEach((item) => {
        // Transfer OUT from source store
        transactions.push({
          id: `TRF-OUT-${item.id}`,
          particulars: "Inventory Transfer Out",
          transactionDate: item.transfer_date
            ? formatDate(item.transfer_date.split("T")[0])
            : "",
          transactionNo: `TRF-${item.id}`,
          quantity: -(item.quantity || 0), // Negative for outgoing
          price: item.inventory?.unit_price || 0,
          total: -((item.quantity || 0) * (item.inventory?.unit_price || 0)),
          store: item.inventory?.store?.name || "",
          transactionUser: profileMap[item.created_by]?.full_name || "",
          remarks: item.remark || `Transfer to ${item.to_store?.name || ""}`,
          type: "TRANSFER_OUT",
        });

        // Transfer IN to destination store
        transactions.push({
          id: `TRF-IN-${item.id}`,
          particulars: "Inventory Transfer In",
          transactionDate: item.transfer_date
            ? formatDate(item.transfer_date.split("T")[0])
            : "",
          transactionNo: `TRF-${item.id}`,
          quantity: item.quantity || 0, // Positive for incoming
          price: item.inventory?.unit_price || 0,
          total: (item.quantity || 0) * (item.inventory?.unit_price || 0),
          store: item.to_store?.name || "",
          transactionUser: profileMap[item.created_by]?.full_name || "",
          remarks:
            item.remark || `Transfer from ${item.inventory?.store?.name || ""}`,
          type: "TRANSFER_IN",
        });
      });

      // Sort all transactions by date (most recent first)
      transactions.sort(
        (a, b) =>
          new Date(b.transactionDate).getTime() -
          new Date(a.transactionDate).getTime()
      );

      return transactions;
    } catch (error) {
      console.error("Error fetching transaction inventory:", error);
      throw error;
    }
  },
};
