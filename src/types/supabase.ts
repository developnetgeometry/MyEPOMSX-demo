export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      e_adjustment_category: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_adjustment_type: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_asset: {
        Row: {
          asset_detail_id: number | null
          asset_group_id: number | null
          asset_name: string | null
          asset_no: string
          asset_sce_id: number | null
          asset_tag_id: number | null
          commission_date: string | null
          created_at: string | null
          created_by: string | null
          facility_id: number | null
          id: number
          package_id: number | null
          status_id: number | null
          system_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          asset_group_id?: number | null
          asset_name?: string | null
          asset_no: string
          asset_sce_id?: number | null
          asset_tag_id?: number | null
          commission_date?: string | null
          created_at?: string | null
          created_by?: string | null
          facility_id?: number | null
          id?: number
          package_id?: number | null
          status_id?: number | null
          system_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          asset_group_id?: number | null
          asset_name?: string | null
          asset_no?: string
          asset_sce_id?: number | null
          asset_tag_id?: number | null
          commission_date?: string | null
          created_at?: string | null
          created_by?: string | null
          facility_id?: number | null
          id?: number
          package_id?: number | null
          status_id?: number | null
          system_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_asset_asset_detail_id_fkey"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_asset_group_id_fkey"
            columns: ["asset_group_id"]
            isOneToOne: false
            referencedRelation: "e_asset_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_asset_sce_id_fkey"
            columns: ["asset_sce_id"]
            isOneToOne: false
            referencedRelation: "e_asset_sce"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_e_asset_status_fk"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "e_asset_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_e_asset_tag_fk"
            columns: ["asset_tag_id"]
            isOneToOne: false
            referencedRelation: "e_asset_tag"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_e_facility_fk"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "e_facility"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_e_package_fk"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "e_package"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_e_system_fk"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "e_system"
            referencedColumns: ["id"]
          },
        ]
      }
      e_asset_area: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_asset_category: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_asset_class: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_asset_detail: {
        Row: {
          area_id: number | null
          asset_class_id: number | null
          category_id: number | null
          created_at: string | null
          created_by: string | null
          hs_code: string | null
          id: number
          iot_sensor_id: number | null
          is_active: boolean | null
          is_integrity: boolean | null
          is_reliability: boolean | null
          maker_no: string | null
          manufacturer_id: number | null
          model: string | null
          parent_asset_id: number | null
          serial_number: string | null
          specification: string | null
          type_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          area_id?: number | null
          asset_class_id?: number | null
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          hs_code?: string | null
          id?: number
          iot_sensor_id?: number | null
          is_active?: boolean | null
          is_integrity?: boolean | null
          is_reliability?: boolean | null
          maker_no?: string | null
          manufacturer_id?: number | null
          model?: string | null
          parent_asset_id?: number | null
          serial_number?: string | null
          specification?: string | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          area_id?: number | null
          asset_class_id?: number | null
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          hs_code?: string | null
          id?: number
          iot_sensor_id?: number | null
          is_active?: boolean | null
          is_integrity?: boolean | null
          is_reliability?: boolean | null
          maker_no?: string | null
          manufacturer_id?: number | null
          model?: string | null
          parent_asset_id?: number | null
          serial_number?: string | null
          specification?: string | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_asset_detail_e_asset_area_fk"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "e_asset_area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_detail_e_asset_category_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "e_asset_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_detail_e_asset_class_fk"
            columns: ["asset_class_id"]
            isOneToOne: false
            referencedRelation: "e_asset_class"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_detail_e_asset_type_fk"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "e_asset_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_detail_e_iot_sensor_fk"
            columns: ["iot_sensor_id"]
            isOneToOne: false
            referencedRelation: "e_iot_sensor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_detail_e_manufacturer_fk"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "e_manufacturer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_detail_parent_asset_id_fkey"
            columns: ["parent_asset_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
        ]
      }
      e_asset_group: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean | null
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_asset_image: {
        Row: {
          asset_detail_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          image_file_path: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          image_file_path?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          image_file_path?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_asset_image_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
        ]
      }
      e_asset_installation: {
        Row: {
          actual_installation_date: string | null
          actual_startup_date: string | null
          asset_id: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          detection_service_class_id: number | null
          detection_system_desc: string | null
          drawing_no: string | null
          ex_certificate: string | null
          ex_class: string | null
          id: number
          intermittent_service: string | null
          isolation_service_class_id: number | null
          isolation_system_desc: string | null
          orientation: string | null
          overall_height: number | null
          overall_length: number | null
          overall_width: number | null
          updated_at: string | null
          updated_by: string | null
          warranty_date: string | null
        }
        Insert: {
          actual_installation_date?: string | null
          actual_startup_date?: string | null
          asset_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          detection_service_class_id?: number | null
          detection_system_desc?: string | null
          drawing_no?: string | null
          ex_certificate?: string | null
          ex_class?: string | null
          id?: number
          intermittent_service?: string | null
          isolation_service_class_id?: number | null
          isolation_system_desc?: string | null
          orientation?: string | null
          overall_height?: number | null
          overall_length?: number | null
          overall_width?: number | null
          updated_at?: string | null
          updated_by?: string | null
          warranty_date?: string | null
        }
        Update: {
          actual_installation_date?: string | null
          actual_startup_date?: string | null
          asset_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          detection_service_class_id?: number | null
          detection_system_desc?: string | null
          drawing_no?: string | null
          ex_certificate?: string | null
          ex_class?: string | null
          id?: number
          intermittent_service?: string | null
          isolation_service_class_id?: number | null
          isolation_system_desc?: string | null
          orientation?: string | null
          overall_height?: number | null
          overall_length?: number | null
          overall_width?: number | null
          updated_at?: string | null
          updated_by?: string | null
          warranty_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_asset_installation_e_asset_fk"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_installation_e_detection_service_class_fk"
            columns: ["detection_service_class_id"]
            isOneToOne: false
            referencedRelation: "e_detection_service_class"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_installation_e_isolation_service_class_fk"
            columns: ["isolation_service_class_id"]
            isOneToOne: false
            referencedRelation: "e_isolation_service_class"
            referencedColumns: ["id"]
          },
        ]
      }
      e_asset_sce: {
        Row: {
          asset_detail_id: number | null
          created_at: string | null
          created_by: string | null
          group_name: string | null
          id: number
          sce_code: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          group_name?: string | null
          id?: number
          sce_code: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          group_name?: string | null
          id?: number
          sce_code?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_asset_sce_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
        ]
      }
      e_asset_status: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          is_active: boolean
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          is_active?: boolean
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_asset_tag: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          is_active: boolean
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          is_active?: boolean
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_asset_type: {
        Row: {
          asset_category_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_asset_type_e_asset_category_fk"
            columns: ["asset_category_id"]
            isOneToOne: false
            referencedRelation: "e_asset_category"
            referencedColumns: ["id"]
          },
        ]
      }
      e_bom_assembly: {
        Row: {
          bom_code: string
          bom_name: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          item_master_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          bom_code: string
          bom_name?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          item_master_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          bom_code?: string
          bom_name?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          item_master_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_bom_assembly_e_item_master_fk"
            columns: ["item_master_id"]
            isOneToOne: false
            referencedRelation: "e_item_master"
            referencedColumns: ["id"]
          },
        ]
      }
      e_circuit_id: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_client: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          email: string | null
          id: number
          name: string | null
          office_no: string | null
          onboard_date: string | null
          type: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: number
          name?: string | null
          office_no?: string | null
          onboard_date?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: number
          name?: string | null
          office_no?: string | null
          onboard_date?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_cm_actual_labour: {
        Row: {
          cm_general_id: number | null
          created_at: string | null
          created_by: string | null
          duration: number | null
          employee_id: number | null
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          cm_general_id?: number | null
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          employee_id?: number | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          cm_general_id?: number | null
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          employee_id?: number | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_cm_actual_labour_e_cm_general_fk"
            columns: ["cm_general_id"]
            isOneToOne: false
            referencedRelation: "e_cm_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_cm_actual_labour_e_employee_fk"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "e_employee"
            referencedColumns: ["id"]
          },
        ]
      }
      e_cm_actual_material: {
        Row: {
          cm_general_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          item_id: number | null
          quantity: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          cm_general_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          item_id?: number | null
          quantity?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          cm_general_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          item_id?: number | null
          quantity?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_cm_actual_material_e_cm_general_fk"
            columns: ["cm_general_id"]
            isOneToOne: false
            referencedRelation: "e_cm_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_cm_actual_material_e_item_master_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "e_item_master"
            referencedColumns: ["id"]
          },
        ]
      }
      e_cm_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          file_path: string | null
          id: number
          updated_at: string | null
          updated_by: string | null
          work_request_attachment_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
          work_request_attachment_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
          work_request_attachment_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_cm_attachment_e_new_work_attachment_fk"
            columns: ["work_request_attachment_id"]
            isOneToOne: false
            referencedRelation: "e_new_work_attachment"
            referencedColumns: ["id"]
          },
        ]
      }
      e_cm_defer: {
        Row: {
          cm_general_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          new_due_date: string | null
          previous_due_date: string | null
          remarks: string | null
          requested_by: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          cm_general_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          new_due_date?: string | null
          previous_due_date?: string | null
          remarks?: string | null
          requested_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          cm_general_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          new_due_date?: string | null
          previous_due_date?: string | null
          remarks?: string | null
          requested_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_cm_defer_e_cm_general_fk"
            columns: ["cm_general_id"]
            isOneToOne: false
            referencedRelation: "e_cm_general"
            referencedColumns: ["id"]
          },
        ]
      }
      e_cm_finding: {
        Row: {
          action_taken: string | null
          cm_general_id: number | null
          corrective_action: string | null
          created_at: string | null
          created_by: string | null
          id: number
          updated_at: string | null
          updated_by: string | null
          wo_finding_failure: string | null
        }
        Insert: {
          action_taken?: string | null
          cm_general_id?: number | null
          corrective_action?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
          wo_finding_failure?: string | null
        }
        Update: {
          action_taken?: string | null
          cm_general_id?: number | null
          corrective_action?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
          wo_finding_failure?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_cm_finding_e_cm_general_fk"
            columns: ["cm_general_id"]
            isOneToOne: false
            referencedRelation: "e_cm_general"
            referencedColumns: ["id"]
          },
        ]
      }
      e_cm_general: {
        Row: {
          approved_by: string | null
          asset_available_time: string | null
          asset_id: number | null
          closed_by: string | null
          cm_sce_code: number | null
          completed_by: string | null
          created_at: string | null
          created_by: string | null
          date_finding: string | null
          downtime: number | null
          due_date: string | null
          facility_id: number | null
          id: number
          package_id: number | null
          priority_id: number | null
          requested_by: string | null
          system_id: number | null
          target_end_date: string | null
          target_start_date: string | null
          updated_at: string | null
          updated_by: string | null
          work_center_id: number | null
          work_order_no: string | null
          work_request_id: number | null
        }
        Insert: {
          approved_by?: string | null
          asset_available_time?: string | null
          asset_id?: number | null
          closed_by?: string | null
          cm_sce_code?: number | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          date_finding?: string | null
          downtime?: number | null
          due_date?: string | null
          facility_id?: number | null
          id?: number
          package_id?: number | null
          priority_id?: number | null
          requested_by?: string | null
          system_id?: number | null
          target_end_date?: string | null
          target_start_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
          work_center_id?: number | null
          work_order_no?: string | null
          work_request_id?: number | null
        }
        Update: {
          approved_by?: string | null
          asset_available_time?: string | null
          asset_id?: number | null
          closed_by?: string | null
          cm_sce_code?: number | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          date_finding?: string | null
          downtime?: number | null
          due_date?: string | null
          facility_id?: number | null
          id?: number
          package_id?: number | null
          priority_id?: number | null
          requested_by?: string | null
          system_id?: number | null
          target_end_date?: string | null
          target_start_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
          work_center_id?: number | null
          work_order_no?: string | null
          work_request_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_cm_general_e_asset_fk"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_cm_general_e_cm_sce_fk"
            columns: ["cm_sce_code"]
            isOneToOne: false
            referencedRelation: "e_cm_sce"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_cm_general_e_facility_fk"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "e_facility"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_cm_general_e_new_work_request_fk"
            columns: ["work_request_id"]
            isOneToOne: false
            referencedRelation: "e_new_work_request"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_cm_general_e_package_fk"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "e_package"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_cm_general_e_priority_fk"
            columns: ["priority_id"]
            isOneToOne: false
            referencedRelation: "e_priority"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_cm_general_e_system_fk"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "e_system"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_cm_general_e_work_center_fk"
            columns: ["work_center_id"]
            isOneToOne: false
            referencedRelation: "e_work_center"
            referencedColumns: ["id"]
          },
        ]
      }
      e_cm_report: {
        Row: {
          alarm_trigger: string | null
          created_at: string | null
          created_by: string | null
          design_code: string | null
          id: number
          material_class_id: number | null
          operating_history: number | null
          other_detail: string | null
          pressure: number | null
          redundant: string | null
          sea_well: string | null
          service_asset: string | null
          shift: string | null
          shutdown_type_id: number | null
          temp: number | null
          time_failed: string | null
          time_in_servicehr: number | null
          time_resume: string | null
          updated_at: string | null
          updated_by: string | null
          visibility: string | null
          weather_condition: string | null
          wind_speed_direction: string | null
          work_request_id: number | null
        }
        Insert: {
          alarm_trigger?: string | null
          created_at?: string | null
          created_by?: string | null
          design_code?: string | null
          id?: number
          material_class_id?: number | null
          operating_history?: number | null
          other_detail?: string | null
          pressure?: number | null
          redundant?: string | null
          sea_well?: string | null
          service_asset?: string | null
          shift?: string | null
          shutdown_type_id?: number | null
          temp?: number | null
          time_failed?: string | null
          time_in_servicehr?: number | null
          time_resume?: string | null
          updated_at?: string | null
          updated_by?: string | null
          visibility?: string | null
          weather_condition?: string | null
          wind_speed_direction?: string | null
          work_request_id?: number | null
        }
        Update: {
          alarm_trigger?: string | null
          created_at?: string | null
          created_by?: string | null
          design_code?: string | null
          id?: number
          material_class_id?: number | null
          operating_history?: number | null
          other_detail?: string | null
          pressure?: number | null
          redundant?: string | null
          sea_well?: string | null
          service_asset?: string | null
          shift?: string | null
          shutdown_type_id?: number | null
          temp?: number | null
          time_failed?: string | null
          time_in_servicehr?: number | null
          time_resume?: string | null
          updated_at?: string | null
          updated_by?: string | null
          visibility?: string | null
          weather_condition?: string | null
          wind_speed_direction?: string | null
          work_request_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_cm_report_e_material_class_fk"
            columns: ["material_class_id"]
            isOneToOne: false
            referencedRelation: "e_material_class"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_cm_report_e_new_work_request_fk"
            columns: ["work_request_id"]
            isOneToOne: false
            referencedRelation: "e_new_work_request"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_cm_report_e_shutdown_type_fk"
            columns: ["shutdown_type_id"]
            isOneToOne: false
            referencedRelation: "e_shutdown_type"
            referencedColumns: ["id"]
          },
        ]
      }
      e_cm_sce: {
        Row: {
          cm_group_name: string | null
          cm_sce_code: string
          created_at: string | null
          created_by: string | null
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          cm_group_name?: string | null
          cm_sce_code: string
          created_at?: string | null
          created_by?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          cm_group_name?: string | null
          cm_sce_code?: string
          created_at?: string | null
          created_by?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_cm_status: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_cm_task_detail: {
        Row: {
          cm_general_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          task_list: string | null
          task_sequence: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          cm_general_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          task_list?: string | null
          task_sequence?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          cm_general_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          task_list?: string | null
          task_sequence?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_cm_task_detail_e_cm_general_fk"
            columns: ["cm_general_id"]
            isOneToOne: false
            referencedRelation: "e_cm_general"
            referencedColumns: ["id"]
          },
        ]
      }
      e_coating_quality: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_criticality: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_data_confidence: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_design_fabrication: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_detection_service_class: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_detection_system: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_discipline: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          name: string | null
          type: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          name?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          name?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_employee: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          uid_employee: string
          updated_at: string | null
          updated_by: string | null
          work_center_code: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          uid_employee: string
          updated_at?: string | null
          updated_by?: string | null
          work_center_code?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          uid_employee?: string
          updated_at?: string | null
          updated_by?: string | null
          work_center_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_employee_e_work_center_fk"
            columns: ["work_center_code"]
            isOneToOne: false
            referencedRelation: "e_work_center"
            referencedColumns: ["code"]
          },
        ]
      }
      e_ext_env: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_facility: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean | null
          location_code: string
          location_name: string | null
          project_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          location_code: string
          location_name?: string | null
          project_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          location_code?: string
          location_name?: string | null
          project_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_facility_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "e_project"
            referencedColumns: ["id"]
          },
        ]
      }
      e_fluid_phase: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_fluid_representive: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_frequency: {
        Row: {
          created_at: string | null
          created_by: string | null
          frequency_code: string
          frequency_type_id: number | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          frequency_code: string
          frequency_type_id?: number | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          frequency_code?: string
          frequency_type_id?: number | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_frequency_e_frequency_type_fk"
            columns: ["frequency_type_id"]
            isOneToOne: false
            referencedRelation: "e_frequency_type"
            referencedColumns: ["id"]
          },
        ]
      }
      e_frequency_type: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_general_maintenance: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_geometry: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_ideal_gas_specific_heat_eq: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_insulation_type: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_interface: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_inventory: {
        Row: {
          current_balance: number | null
          id: number
          item_master_id: number | null
          max_level: number | null
          min_level: number | null
          open_balance: number | null
          open_balance_date: string | null
          rack_id: number | null
          reorder_table: number | null
          store_id: number | null
          total_price: number | null
          unit_price: number | null
        }
        Insert: {
          current_balance?: number | null
          id?: number
          item_master_id?: number | null
          max_level?: number | null
          min_level?: number | null
          open_balance?: number | null
          open_balance_date?: string | null
          rack_id?: number | null
          reorder_table?: number | null
          store_id?: number | null
          total_price?: number | null
          unit_price?: number | null
        }
        Update: {
          current_balance?: number | null
          id?: number
          item_master_id?: number | null
          max_level?: number | null
          min_level?: number | null
          open_balance?: number | null
          open_balance_date?: string | null
          rack_id?: number | null
          reorder_table?: number | null
          store_id?: number | null
          total_price?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_inventory_e_item_master_fk"
            columns: ["item_master_id"]
            isOneToOne: false
            referencedRelation: "e_item_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_inventory_e_store_fk"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "e_store"
            referencedColumns: ["id"]
          },
        ]
      }
      e_inventory_adjustment: {
        Row: {
          adjustment_category_id: number | null
          adjustment_date: string | null
          adjustment_type_id: number | null
          id: number
          inventory_id: number | null
          quantity: number | null
          remark: string | null
        }
        Insert: {
          adjustment_category_id?: number | null
          adjustment_date?: string | null
          adjustment_type_id?: number | null
          id?: number
          inventory_id?: number | null
          quantity?: number | null
          remark?: string | null
        }
        Update: {
          adjustment_category_id?: number | null
          adjustment_date?: string | null
          adjustment_type_id?: number | null
          id?: number
          inventory_id?: number | null
          quantity?: number | null
          remark?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_inventory_adjustment_e_adjustment_category_fk"
            columns: ["adjustment_category_id"]
            isOneToOne: false
            referencedRelation: "e_adjustment_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_inventory_adjustment_e_adjustment_type_fk"
            columns: ["adjustment_type_id"]
            isOneToOne: false
            referencedRelation: "e_adjustment_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_inventory_adjustment_e_inventory_fk"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "e_inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      e_inventory_issue: {
        Row: {
          id: number
          inventory_id: number | null
          issue_date: string | null
          quantity: number | null
          remark: string | null
          work_order_no: number | null
        }
        Insert: {
          id?: number
          inventory_id?: number | null
          issue_date?: string | null
          quantity?: number | null
          remark?: string | null
          work_order_no?: number | null
        }
        Update: {
          id?: number
          inventory_id?: number | null
          issue_date?: string | null
          quantity?: number | null
          remark?: string | null
          work_order_no?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_inventory_issue_e_inventory_fk"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "e_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_inventory_issue_e_work_order_fk"
            columns: ["work_order_no"]
            isOneToOne: false
            referencedRelation: "e_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_inventory_receive: {
        Row: {
          id: number
          inventory_id: number | null
          po_receive_no: string | null
          received_quantity: number | null
          remark: string | null
          total_price: number | null
          unit_price: number | null
        }
        Insert: {
          id?: number
          inventory_id?: number | null
          po_receive_no?: string | null
          received_quantity?: number | null
          remark?: string | null
          total_price?: number | null
          unit_price?: number | null
        }
        Update: {
          id?: number
          inventory_id?: number | null
          po_receive_no?: string | null
          received_quantity?: number | null
          remark?: string | null
          total_price?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_inventory_receive_e_inventory_fk"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "e_inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      e_inventory_return: {
        Row: {
          id: number
          inventory_id: number | null
          quantity: number | null
          remark: string | null
          return_by: string | null
          return_date: string | null
          return_reason: string | null
          work_order_no: number | null
        }
        Insert: {
          id?: number
          inventory_id?: number | null
          quantity?: number | null
          remark?: string | null
          return_by?: string | null
          return_date?: string | null
          return_reason?: string | null
          work_order_no?: number | null
        }
        Update: {
          id?: number
          inventory_id?: number | null
          quantity?: number | null
          remark?: string | null
          return_by?: string | null
          return_date?: string | null
          return_reason?: string | null
          work_order_no?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_inventory_return_e_inventory_fk"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "e_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_inventory_return_e_work_order_fk"
            columns: ["work_order_no"]
            isOneToOne: false
            referencedRelation: "e_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_inventory_tansfer: {
        Row: {
          employee_id: number | null
          id: number
          inventory_id: number | null
          quantity: number | null
          remark: string | null
          store_id: number | null
          transfer_date: string | null
          transfer_reason: string | null
        }
        Insert: {
          employee_id?: number | null
          id?: number
          inventory_id?: number | null
          quantity?: number | null
          remark?: string | null
          store_id?: number | null
          transfer_date?: string | null
          transfer_reason?: string | null
        }
        Update: {
          employee_id?: number | null
          id?: number
          inventory_id?: number | null
          quantity?: number | null
          remark?: string | null
          store_id?: number | null
          transfer_date?: string | null
          transfer_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_inventory_tansfer_e_employee_fk"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "e_employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_inventory_tansfer_e_inventory_fk"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "e_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_inventory_tansfer_e_store_fk"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "e_store"
            referencedColumns: ["id"]
          },
        ]
      }
      e_iot_sensor: {
        Row: {
          calibration_date: string | null
          client_id: number | null
          description: string | null
          id: number
          manufacturer_id: number | null
          model: string | null
          name: string | null
          sensor_type_id: number | null
        }
        Insert: {
          calibration_date?: string | null
          client_id?: number | null
          description?: string | null
          id?: number
          manufacturer_id?: number | null
          model?: string | null
          name?: string | null
          sensor_type_id?: number | null
        }
        Update: {
          calibration_date?: string | null
          client_id?: number | null
          description?: string | null
          id?: number
          manufacturer_id?: number | null
          model?: string | null
          name?: string | null
          sensor_type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_iot_sensor_e_client_fk"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "e_client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_iot_sensor_e_manufacturer_fk"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "e_manufacturer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_iot_sensor_e_sensor_type_fk"
            columns: ["sensor_type_id"]
            isOneToOne: false
            referencedRelation: "e_sensor_type"
            referencedColumns: ["id"]
          },
        ]
      }
      e_isolation_service_class: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_isolation_system: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_item_category: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_item_group: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_item_master: {
        Row: {
          category_id: number | null
          criticality_id: number | null
          id: number
          is_active: boolean | null
          item_group: number | null
          item_name: string | null
          item_no: string
          manufacturer: number | null
          manufacturer_part_no: string | null
          model_no: string | null
          specification: string | null
          type_id: number | null
          unit_id: number | null
        }
        Insert: {
          category_id?: number | null
          criticality_id?: number | null
          id?: number
          is_active?: boolean | null
          item_group?: number | null
          item_name?: string | null
          item_no: string
          manufacturer?: number | null
          manufacturer_part_no?: string | null
          model_no?: string | null
          specification?: string | null
          type_id?: number | null
          unit_id?: number | null
        }
        Update: {
          category_id?: number | null
          criticality_id?: number | null
          id?: number
          is_active?: boolean | null
          item_group?: number | null
          item_name?: string | null
          item_no?: string
          manufacturer?: number | null
          manufacturer_part_no?: string | null
          model_no?: string | null
          specification?: string | null
          type_id?: number | null
          unit_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_item_master_e_criticality_fk"
            columns: ["criticality_id"]
            isOneToOne: false
            referencedRelation: "e_criticality"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_item_master_e_item_category_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "e_item_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_item_master_e_item_group_fk"
            columns: ["item_group"]
            isOneToOne: false
            referencedRelation: "e_item_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_item_master_e_item_type_fk"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "e_item_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_item_master_e_manufacturer_fk"
            columns: ["manufacturer"]
            isOneToOne: false
            referencedRelation: "e_manufacturer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_item_master_e_unit_fk"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "e_unit"
            referencedColumns: ["id"]
          },
        ]
      }
      e_item_master_attachment: {
        Row: {
          file_path: string | null
          id: number
          item_master_id: number | null
        }
        Insert: {
          file_path?: string | null
          id?: number
          item_master_id?: number | null
        }
        Update: {
          file_path?: string | null
          id?: number
          item_master_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_item_master_attachment_e_item_master_fk"
            columns: ["item_master_id"]
            isOneToOne: false
            referencedRelation: "e_item_master"
            referencedColumns: ["id"]
          },
        ]
      }
      e_item_type: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_maintenance: {
        Row: {
          code: string
          id: number
          maintenance_type_id: number | null
          name: string | null
        }
        Insert: {
          code: string
          id?: number
          maintenance_type_id?: number | null
          name?: string | null
        }
        Update: {
          code?: string
          id?: number
          maintenance_type_id?: number | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_maintenance_e_maintenance_type_fk"
            columns: ["maintenance_type_id"]
            isOneToOne: false
            referencedRelation: "e_maintenance_type"
            referencedColumns: ["id"]
          },
        ]
      }
      e_maintenance_type: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_manufacturer: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_material_class: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_material_construction: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_mitigation_system: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_new_work_attachment: {
        Row: {
          description: string | null
          file_path: string | null
          id: number
          work_request_id: number | null
        }
        Insert: {
          description?: string | null
          file_path?: string | null
          id?: number
          work_request_id?: number | null
        }
        Update: {
          description?: string | null
          file_path?: string | null
          id?: number
          work_request_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_new_work_attachment_e_new_work_request_fk"
            columns: ["work_request_id"]
            isOneToOne: false
            referencedRelation: "e_new_work_request"
            referencedColumns: ["id"]
          },
        ]
      }
      e_new_work_failure: {
        Row: {
          action_taken: string | null
          corrective_action: string | null
          critical_rank: number | null
          environment_consequences: string | null
          failure_shutdown: boolean | null
          failure_type_id: number | null
          has_consequence: string | null
          id: number
          like_hood: string | null
          lost_time_incident: boolean | null
          priority_id: number | null
          provability_occurrance: number | null
          safety: string | null
          work_request_id: number | null
        }
        Insert: {
          action_taken?: string | null
          corrective_action?: string | null
          critical_rank?: number | null
          environment_consequences?: string | null
          failure_shutdown?: boolean | null
          failure_type_id?: number | null
          has_consequence?: string | null
          id?: number
          like_hood?: string | null
          lost_time_incident?: boolean | null
          priority_id?: number | null
          provability_occurrance?: number | null
          safety?: string | null
          work_request_id?: number | null
        }
        Update: {
          action_taken?: string | null
          corrective_action?: string | null
          critical_rank?: number | null
          environment_consequences?: string | null
          failure_shutdown?: boolean | null
          failure_type_id?: number | null
          has_consequence?: string | null
          id?: number
          like_hood?: string | null
          lost_time_incident?: boolean | null
          priority_id?: number | null
          provability_occurrance?: number | null
          safety?: string | null
          work_request_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_new_work_failure_e_new_work_request_fk"
            columns: ["work_request_id"]
            isOneToOne: false
            referencedRelation: "e_new_work_request"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "new_work_failure_e_new_work_failure_type_fk"
            columns: ["failure_type_id"]
            isOneToOne: false
            referencedRelation: "e_new_work_failure_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "new_work_failure_e_priority_fk"
            columns: ["priority_id"]
            isOneToOne: false
            referencedRelation: "e_priority"
            referencedColumns: ["id"]
          },
        ]
      }
      e_new_work_failure_type: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_new_work_request: {
        Row: {
          anomaly_report: boolean | null
          asset_id: number | null
          cm_sce_code: number | null
          cm_status_id: number | null
          criticality_id: number | null
          date_finding: string | null
          description: string | null
          facility_id: number | null
          finding_detail: string | null
          id: number
          maintenance_type: number | null
          package_id: number | null
          quick_incident_report: boolean | null
          requested_by: string | null
          system_id: number | null
          target_due_date: string | null
          work_center_id: number | null
          work_request_date: string | null
          work_request_no: string | null
          work_request_prefix: string | null
        }
        Insert: {
          anomaly_report?: boolean | null
          asset_id?: number | null
          cm_sce_code?: number | null
          cm_status_id?: number | null
          criticality_id?: number | null
          date_finding?: string | null
          description?: string | null
          facility_id?: number | null
          finding_detail?: string | null
          id?: number
          maintenance_type?: number | null
          package_id?: number | null
          quick_incident_report?: boolean | null
          requested_by?: string | null
          system_id?: number | null
          target_due_date?: string | null
          work_center_id?: number | null
          work_request_date?: string | null
          work_request_no?: string | null
          work_request_prefix?: string | null
        }
        Update: {
          anomaly_report?: boolean | null
          asset_id?: number | null
          cm_sce_code?: number | null
          cm_status_id?: number | null
          criticality_id?: number | null
          date_finding?: string | null
          description?: string | null
          facility_id?: number | null
          finding_detail?: string | null
          id?: number
          maintenance_type?: number | null
          package_id?: number | null
          quick_incident_report?: boolean | null
          requested_by?: string | null
          system_id?: number | null
          target_due_date?: string | null
          work_center_id?: number | null
          work_request_date?: string | null
          work_request_no?: string | null
          work_request_prefix?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_new_work_request_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_new_work_request_cm_sce_code_fkey"
            columns: ["cm_sce_code"]
            isOneToOne: false
            referencedRelation: "e_cm_sce"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_new_work_request_cm_status_id_fkey"
            columns: ["cm_status_id"]
            isOneToOne: false
            referencedRelation: "e_cm_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_new_work_request_criticality_id_fkey"
            columns: ["criticality_id"]
            isOneToOne: false
            referencedRelation: "e_criticality"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_new_work_request_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "e_facility"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_new_work_request_maintenance_type_fkey"
            columns: ["maintenance_type"]
            isOneToOne: false
            referencedRelation: "e_maintenance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_new_work_request_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "e_package"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_new_work_request_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "e_system"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_new_work_request_work_center_id_fkey"
            columns: ["work_center_id"]
            isOneToOne: false
            referencedRelation: "e_work_center"
            referencedColumns: ["id"]
          },
        ]
      }
      e_new_work_task_detail: {
        Row: {
          id: number
          new_work_request_id: number | null
          task_list: string | null
          task_sequence: number | null
        }
        Insert: {
          id?: number
          new_work_request_id?: number | null
          task_list?: string | null
          task_sequence?: number | null
        }
        Update: {
          id?: number
          new_work_request_id?: number | null
          task_list?: string | null
          task_sequence?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_new_work_task_detail_e_new_work_request_fk"
            columns: ["new_work_request_id"]
            isOneToOne: false
            referencedRelation: "e_new_work_request"
            referencedColumns: ["id"]
          },
        ]
      }
      e_nominal_bore_diameter: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_online_monitor: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_package: {
        Row: {
          id: number
          is_active: boolean | null
          package_name: string | null
          package_no: string | null
          package_tag: string | null
          package_type_id: number | null
          system_id: number | null
        }
        Insert: {
          id?: number
          is_active?: boolean | null
          package_name?: string | null
          package_no?: string | null
          package_tag?: string | null
          package_type_id?: number | null
          system_id?: number | null
        }
        Update: {
          id?: number
          is_active?: boolean | null
          package_name?: string | null
          package_no?: string | null
          package_tag?: string | null
          package_type_id?: number | null
          system_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_package_e_package_type_fk"
            columns: ["package_type_id"]
            isOneToOne: false
            referencedRelation: "e_package_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_package_e_system_fk"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "e_system"
            referencedColumns: ["id"]
          },
        ]
      }
      e_package_type: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_pipe_schedule: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_pm_actual_labour: {
        Row: {
          duration: number | null
          employee_id: number | null
          id: number
          pm_wo_id: number | null
        }
        Insert: {
          duration?: number | null
          employee_id?: number | null
          id?: number
          pm_wo_id?: number | null
        }
        Update: {
          duration?: number | null
          employee_id?: number | null
          id?: number
          pm_wo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_actual_labour_e_employee_fk"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "e_employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_actual_labour_e_pm_work_order_fk"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_actual_material: {
        Row: {
          id: number
          item_id: number | null
          pm_wo_id: number | null
          quantity: number | null
        }
        Insert: {
          id?: number
          item_id?: number | null
          pm_wo_id?: number | null
          quantity?: number | null
        }
        Update: {
          id?: number
          item_id?: number | null
          pm_wo_id?: number | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_actual_material_e_item_master_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "e_item_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_actual_material_e_pm_work_order_fk"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_additional_info: {
        Row: {
          description: string | null
          id: number
          pm_wo_id: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          pm_wo_id?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          pm_wo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_additional_info_e_pm_work_order_fk"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_attachment: {
        Row: {
          description: string | null
          file_path: string | null
          id: number
          pm_wo_id: number | null
        }
        Insert: {
          description?: string | null
          file_path?: string | null
          id?: number
          pm_wo_id?: number | null
        }
        Update: {
          description?: string | null
          file_path?: string | null
          id?: number
          pm_wo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_attachment_e_pm_work_order_fk"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_checksheet: {
        Row: {
          description: string | null
          id: number
          pm_wo_id: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          pm_wo_id?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          pm_wo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_checksheet_e_pm_work_order_fk"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_defer: {
        Row: {
          id: number
          new_due_date: string | null
          pm_wo_id: number | null
          previous_due_date: string | null
          remarks: string | null
          requested_by: string | null
        }
        Insert: {
          id?: number
          new_due_date?: string | null
          pm_wo_id?: number | null
          previous_due_date?: string | null
          remarks?: string | null
          requested_by?: string | null
        }
        Update: {
          id?: number
          new_due_date?: string | null
          pm_wo_id?: number | null
          previous_due_date?: string | null
          remarks?: string | null
          requested_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_defer_e_pm_work_order_fk"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_group: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_pm_maintainable_group: {
        Row: {
          asset_id: number | null
          group_id: number | null
          id: number
          pm_wo_id: number | null
        }
        Insert: {
          asset_id?: number | null
          group_id?: number | null
          id?: number
          pm_wo_id?: number | null
        }
        Update: {
          asset_id?: number | null
          group_id?: number | null
          id?: number
          pm_wo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pm_maintainable_group_e_asset_fk"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pm_maintainable_group_e_asset_group_fk"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "e_asset_group"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_min_acceptance_criteria: {
        Row: {
          description: string | null
          id: number
          pm_wo_id: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          pm_wo_id?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          pm_wo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_min_acceptance_criteria_e_pm_work_order_fk"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_plan_labour: {
        Row: {
          duration: number | null
          employee_id: number | null
          id: number
          pm_wo_id: number | null
        }
        Insert: {
          duration?: number | null
          employee_id?: number | null
          id?: number
          pm_wo_id?: number | null
        }
        Update: {
          duration?: number | null
          employee_id?: number | null
          id?: number
          pm_wo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_plan_labour_e_employee_fk"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "e_employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_plan_labour_e_pm_work_order_fk"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_plan_material: {
        Row: {
          id: number
          item_id: number | null
          pm_wo_id: number | null
          quantity: number | null
        }
        Insert: {
          id?: number
          item_id?: number | null
          pm_wo_id?: number | null
          quantity?: number | null
        }
        Update: {
          id?: number
          item_id?: number | null
          pm_wo_id?: number | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_plan_material_e_item_master_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "e_item_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_plan_material_e_pm_work_order_fk"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_report: {
        Row: {
          detail_description: string | null
          equipment_status: string | null
          general_maintainence_id: number | null
          id: number
          pm_wo_id: number | null
          sce_result: string | null
        }
        Insert: {
          detail_description?: string | null
          equipment_status?: string | null
          general_maintainence_id?: number | null
          id?: number
          pm_wo_id?: number | null
          sce_result?: string | null
        }
        Update: {
          detail_description?: string | null
          equipment_status?: string | null
          general_maintainence_id?: number | null
          id?: number
          pm_wo_id?: number | null
          sce_result?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_report_e_general_maintenance_fk"
            columns: ["general_maintainence_id"]
            isOneToOne: false
            referencedRelation: "e_general_maintenance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_report_e_pm_work_order_fk"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_schedule: {
        Row: {
          asset_id: number | null
          discipline_id: number | null
          due_date: string | null
          facility_id: number | null
          frequency_id: number | null
          id: number
          is_active: boolean | null
          maintenance_id: number | null
          package_id: number | null
          pm_description: string | null
          pm_group_id: number | null
          pm_no: string
          pm_sce_group_id: number | null
          priority_id: number | null
          system_id: number | null
          task_id: number | null
          work_center_id: number | null
        }
        Insert: {
          asset_id?: number | null
          discipline_id?: number | null
          due_date?: string | null
          facility_id?: number | null
          frequency_id?: number | null
          id?: number
          is_active?: boolean | null
          maintenance_id?: number | null
          package_id?: number | null
          pm_description?: string | null
          pm_group_id?: number | null
          pm_no: string
          pm_sce_group_id?: number | null
          priority_id?: number | null
          system_id?: number | null
          task_id?: number | null
          work_center_id?: number | null
        }
        Update: {
          asset_id?: number | null
          discipline_id?: number | null
          due_date?: string | null
          facility_id?: number | null
          frequency_id?: number | null
          id?: number
          is_active?: boolean | null
          maintenance_id?: number | null
          package_id?: number | null
          pm_description?: string | null
          pm_group_id?: number | null
          pm_no?: string
          pm_sce_group_id?: number | null
          priority_id?: number | null
          system_id?: number | null
          task_id?: number | null
          work_center_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_schedule_e_asset_fk"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_e_asset_sce_fk"
            columns: ["pm_sce_group_id"]
            isOneToOne: false
            referencedRelation: "e_asset_sce"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_e_discipline_fk"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "e_discipline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_e_facility_fk"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "e_facility"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_e_frequency_fk"
            columns: ["frequency_id"]
            isOneToOne: false
            referencedRelation: "e_frequency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_e_maintenance_fk"
            columns: ["maintenance_id"]
            isOneToOne: false
            referencedRelation: "e_maintenance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_e_package_fk"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "e_package"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_e_pm_group_fk"
            columns: ["pm_group_id"]
            isOneToOne: false
            referencedRelation: "e_pm_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_e_priority_fk"
            columns: ["priority_id"]
            isOneToOne: false
            referencedRelation: "e_priority"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_e_system_fk"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "e_system"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_e_task_fk"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "e_task"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_e_work_center_fk"
            columns: ["work_center_id"]
            isOneToOne: false
            referencedRelation: "e_work_center"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_task_detail: {
        Row: {
          id: number
          pm_wo_id: number | null
          sequence: number | null
          task_list: string | null
        }
        Insert: {
          id?: number
          pm_wo_id?: number | null
          sequence?: number | null
          task_list?: string | null
        }
        Update: {
          id?: number
          pm_wo_id?: number | null
          sequence?: number | null
          task_list?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_task_detail_e_pm_work_order_fk"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_work_order: {
        Row: {
          asset_id: number | null
          asset_sce_code_id: number | null
          closed_by: string | null
          completed_by: string | null
          discipline_id: number | null
          due_date: string | null
          facility_id: number | null
          frequency_id: number | null
          id: number
          is_active: boolean | null
          maintenance_id: number | null
          package_id: number | null
          pm_description: string | null
          pm_group_id: number | null
          pm_schedule_id: number | null
          priority_id: number | null
          system_id: number | null
          task_id: number | null
          work_center_id: number | null
          work_order_no: string
        }
        Insert: {
          asset_id?: number | null
          asset_sce_code_id?: number | null
          closed_by?: string | null
          completed_by?: string | null
          discipline_id?: number | null
          due_date?: string | null
          facility_id?: number | null
          frequency_id?: number | null
          id?: number
          is_active?: boolean | null
          maintenance_id?: number | null
          package_id?: number | null
          pm_description?: string | null
          pm_group_id?: number | null
          pm_schedule_id?: number | null
          priority_id?: number | null
          system_id?: number | null
          task_id?: number | null
          work_center_id?: number | null
          work_order_no: string
        }
        Update: {
          asset_id?: number | null
          asset_sce_code_id?: number | null
          closed_by?: string | null
          completed_by?: string | null
          discipline_id?: number | null
          due_date?: string | null
          facility_id?: number | null
          frequency_id?: number | null
          id?: number
          is_active?: boolean | null
          maintenance_id?: number | null
          package_id?: number | null
          pm_description?: string | null
          pm_group_id?: number | null
          pm_schedule_id?: number | null
          priority_id?: number | null
          system_id?: number | null
          task_id?: number | null
          work_center_id?: number | null
          work_order_no?: string
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_work_order_e_asset_fk"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_work_order_e_asset_sce_fk"
            columns: ["asset_sce_code_id"]
            isOneToOne: false
            referencedRelation: "e_asset_sce"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_work_order_e_discipline_fk"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "e_discipline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_work_order_e_facility_fk"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "e_facility"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_work_order_e_frequency_fk"
            columns: ["frequency_id"]
            isOneToOne: false
            referencedRelation: "e_frequency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_work_order_e_maintenance_fk"
            columns: ["maintenance_id"]
            isOneToOne: false
            referencedRelation: "e_maintenance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_work_order_e_package_fk"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "e_package"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_work_order_e_pm_group_fk"
            columns: ["pm_group_id"]
            isOneToOne: false
            referencedRelation: "e_pm_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_work_order_e_pm_schedule_fk"
            columns: ["pm_schedule_id"]
            isOneToOne: false
            referencedRelation: "e_pm_schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_work_order_e_priority_fk"
            columns: ["priority_id"]
            isOneToOne: false
            referencedRelation: "e_priority"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_work_order_e_system_fk"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "e_system"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_work_order_e_task_fk"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "e_task"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_work_order_e_work_center_fk"
            columns: ["work_center_id"]
            isOneToOne: false
            referencedRelation: "e_work_center"
            referencedColumns: ["id"]
          },
        ]
      }
      e_priority: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_priority_type: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_project: {
        Row: {
          client_id: number | null
          end_date: string | null
          fund_code: string | null
          id: number
          latitude: string | null
          longitude: string | null
          project_code: string
          project_name: string | null
          project_purpose: string | null
          project_type: number | null
          remark: string | null
          short_name: string | null
          start_date: string | null
        }
        Insert: {
          client_id?: number | null
          end_date?: string | null
          fund_code?: string | null
          id?: number
          latitude?: string | null
          longitude?: string | null
          project_code: string
          project_name?: string | null
          project_purpose?: string | null
          project_type?: number | null
          remark?: string | null
          short_name?: string | null
          start_date?: string | null
        }
        Update: {
          client_id?: number | null
          end_date?: string | null
          fund_code?: string | null
          id?: number
          latitude?: string | null
          longitude?: string | null
          project_code?: string
          project_name?: string | null
          project_purpose?: string | null
          project_type?: number | null
          remark?: string | null
          short_name?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_project_e_client_fk"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "e_client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_project_e_project_type_fk"
            columns: ["project_type"]
            isOneToOne: false
            referencedRelation: "e_project_type"
            referencedColumns: ["id"]
          },
        ]
      }
      e_project_type: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_rack: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      e_sensor_type: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_shutdown_type: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_spare_parts: {
        Row: {
          bom_id: number
          description: string | null
          id: number
          item_master_id: number
        }
        Insert: {
          bom_id: number
          description?: string | null
          id?: number
          item_master_id: number
        }
        Update: {
          bom_id?: number
          description?: string | null
          id?: number
          item_master_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "e_spare_parts_bom_id_fkey"
            columns: ["bom_id"]
            isOneToOne: false
            referencedRelation: "e_bom_assembly"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_spare_parts_item_master_id_fkey"
            columns: ["item_master_id"]
            isOneToOne: false
            referencedRelation: "e_item_master"
            referencedColumns: ["id"]
          },
        ]
      }
      e_store: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_system: {
        Row: {
          facility_id: number | null
          id: number
          is_active: boolean | null
          system_code: string
          system_name: string | null
          system_no: string | null
        }
        Insert: {
          facility_id?: number | null
          id?: number
          is_active?: boolean | null
          system_code: string
          system_name?: string | null
          system_no?: string | null
        }
        Update: {
          facility_id?: number | null
          id?: number
          is_active?: boolean | null
          system_code?: string
          system_name?: string | null
          system_no?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_system_e_facility_fk"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "e_facility"
            referencedColumns: ["id"]
          },
        ]
      }
      e_task: {
        Row: {
          discipline_id: number | null
          id: number
          is_active: boolean | null
          task_code: string
          task_name: string | null
        }
        Insert: {
          discipline_id?: number | null
          id?: number
          is_active?: boolean | null
          task_code: string
          task_name?: string | null
        }
        Update: {
          discipline_id?: number | null
          id?: number
          is_active?: boolean | null
          task_code?: string
          task_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_task_e_discipline_fk"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "e_discipline"
            referencedColumns: ["id"]
          },
        ]
      }
      e_task_detail: {
        Row: {
          id: number
          seq: number | null
          task_id: number | null
          task_list: string | null
        }
        Insert: {
          id?: number
          seq?: number | null
          task_id?: number | null
          task_list?: string | null
        }
        Update: {
          id?: number
          seq?: number | null
          task_id?: number | null
          task_list?: string | null
        }
        Relationships: []
      }
      e_toxicity: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_unit: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_work_center: {
        Row: {
          code: string
          effective_date: string | null
          id: number
          is_active: boolean | null
          name: string | null
          remark: string | null
          type: string | null
        }
        Insert: {
          code: string
          effective_date?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          remark?: string | null
          type?: string | null
        }
        Update: {
          code?: string
          effective_date?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          remark?: string | null
          type?: string | null
        }
        Relationships: []
      }
      e_work_order: {
        Row: {
          cm_work_order_id: number | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: number
          pm_work_order_id: number | null
          work_order_no: string | null
          work_order_status_id: number | null
          work_order_type: number | null
        }
        Insert: {
          cm_work_order_id?: number | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          pm_work_order_id?: number | null
          work_order_no?: string | null
          work_order_status_id?: number | null
          work_order_type?: number | null
        }
        Update: {
          cm_work_order_id?: number | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          pm_work_order_id?: number | null
          work_order_no?: string | null
          work_order_status_id?: number | null
          work_order_type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_work_order_e_cm_general_fk"
            columns: ["cm_work_order_id"]
            isOneToOne: false
            referencedRelation: "e_cm_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_work_order_e_pm_work_order_fk"
            columns: ["pm_work_order_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_work_order_e_work_order_status_fk"
            columns: ["work_order_status_id"]
            isOneToOne: false
            referencedRelation: "e_work_order_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_work_order_e_work_order_type_fk"
            columns: ["work_order_type"]
            isOneToOne: false
            referencedRelation: "e_work_order_type"
            referencedColumns: ["id"]
          },
        ]
      }
      e_work_order_status: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      e_work_order_type: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      e_work_request_report: {
        Row: {
          alarm_trigger: string | null
          design_code: string | null
          id: number
          material_class_id: number | null
          operating_history: number | null
          other_detail: string | null
          pressure: number | null
          redundant: string | null
          sea_well: string | null
          service_asset: string | null
          shift: string | null
          shutdown_type_id: number | null
          temp: number | null
          time_failed: string | null
          time_in_servicehr: number | null
          time_resume: string | null
          visibility: string | null
          weather_condition: string | null
          wind_speed_direction: string | null
          work_request_id: number | null
        }
        Insert: {
          alarm_trigger?: string | null
          design_code?: string | null
          id?: number
          material_class_id?: number | null
          operating_history?: number | null
          other_detail?: string | null
          pressure?: number | null
          redundant?: string | null
          sea_well?: string | null
          service_asset?: string | null
          shift?: string | null
          shutdown_type_id?: number | null
          temp?: number | null
          time_failed?: string | null
          time_in_servicehr?: number | null
          time_resume?: string | null
          visibility?: string | null
          weather_condition?: string | null
          wind_speed_direction?: string | null
          work_request_id?: number | null
        }
        Update: {
          alarm_trigger?: string | null
          design_code?: string | null
          id?: number
          material_class_id?: number | null
          operating_history?: number | null
          other_detail?: string | null
          pressure?: number | null
          redundant?: string | null
          sea_well?: string | null
          service_asset?: string | null
          shift?: string | null
          shutdown_type_id?: number | null
          temp?: number | null
          time_failed?: string | null
          time_in_servicehr?: number | null
          time_resume?: string | null
          visibility?: string | null
          weather_condition?: string | null
          wind_speed_direction?: string | null
          work_request_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_work_request_report_e_material_class_fk"
            columns: ["material_class_id"]
            isOneToOne: false
            referencedRelation: "e_material_class"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_work_request_report_e_new_work_request_fk"
            columns: ["work_request_id"]
            isOneToOne: false
            referencedRelation: "e_new_work_request"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_work_request_report_e_shutdown_type_fk"
            columns: ["shutdown_type_id"]
            isOneToOne: false
            referencedRelation: "e_shutdown_type"
            referencedColumns: ["id"]
          },
        ]
      }
      i_data_confidence: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      i_df_ext: {
        Row: {
          agecoat_year: number | null
          agetk: number | null
          art: number | null
          bext_corrp1: number | null
          bext_corrp2: number | null
          bext_corrp3: number | null
          cract_year: number | null
          crexp: number | null
          data_confidence_id: number | null
          dfextcorrf: number | null
          fsextcorr: number | null
          id: number
          ims_por_assessment_id: number | null
          last_coating_date: string | null
          last_inspection_date: string | null
          lext_corr1: number | null
          lext_corr2: number | null
          lext_corr3: number | null
          poext_corrp1: number | null
          poext_corrp2: number | null
          poext_corrp3: number | null
          srextcorr: number | null
        }
        Insert: {
          agecoat_year?: number | null
          agetk?: number | null
          art?: number | null
          bext_corrp1?: number | null
          bext_corrp2?: number | null
          bext_corrp3?: number | null
          cract_year?: number | null
          crexp?: number | null
          data_confidence_id?: number | null
          dfextcorrf?: number | null
          fsextcorr?: number | null
          id?: number
          ims_por_assessment_id?: number | null
          last_coating_date?: string | null
          last_inspection_date?: string | null
          lext_corr1?: number | null
          lext_corr2?: number | null
          lext_corr3?: number | null
          poext_corrp1?: number | null
          poext_corrp2?: number | null
          poext_corrp3?: number | null
          srextcorr?: number | null
        }
        Update: {
          agecoat_year?: number | null
          agetk?: number | null
          art?: number | null
          bext_corrp1?: number | null
          bext_corrp2?: number | null
          bext_corrp3?: number | null
          cract_year?: number | null
          crexp?: number | null
          data_confidence_id?: number | null
          dfextcorrf?: number | null
          fsextcorr?: number | null
          id?: number
          ims_por_assessment_id?: number | null
          last_coating_date?: string | null
          last_inspection_date?: string | null
          lext_corr1?: number | null
          lext_corr2?: number | null
          lext_corr3?: number | null
          poext_corrp1?: number | null
          poext_corrp2?: number | null
          poext_corrp3?: number | null
          srextcorr?: number | null
        }
        Relationships: []
      }
      i_df_scc_scc: {
        Row: {
          df_scc_scc: number | null
          dfsccfb: number | null
          env_severity_id: number | null
          hardness_brinnel: number | null
          id: number
          inspection_efficiency_id: number | null
          scsuch_f_h: number | null
          steelcontent_id: number | null
          susceptibility_id: number | null
          svi: number | null
        }
        Insert: {
          df_scc_scc?: number | null
          dfsccfb?: number | null
          env_severity_id?: number | null
          hardness_brinnel?: number | null
          id?: number
          inspection_efficiency_id?: number | null
          scsuch_f_h?: number | null
          steelcontent_id?: number | null
          susceptibility_id?: number | null
          svi?: number | null
        }
        Update: {
          df_scc_scc?: number | null
          dfsccfb?: number | null
          env_severity_id?: number | null
          hardness_brinnel?: number | null
          id?: number
          inspection_efficiency_id?: number | null
          scsuch_f_h?: number | null
          steelcontent_id?: number | null
          susceptibility_id?: number | null
          svi?: number | null
        }
        Relationships: []
      }
      i_df_thin: {
        Row: {
          agerc: string | null
          agetk: number | null
          art: number | null
          bthin1: number | null
          bthin2: number | null
          bthin3: number | null
          cr_act: number | null
          crcm: number | null
          crexp: number | null
          data_confidence_id: number | null
          dfthin_fb: number | null
          dthinf: number | null
          fs_thin: number | null
          id: number
          ims_pof_assessment_id: number | null
          ithin1: number | null
          ithin2: number | null
          ithin3: number | null
          last_coating_date: string | null
          last_inspection_date: string | null
          nthin_a: number | null
          nthin_b: number | null
          nthin_c: number | null
          nthin_d: number | null
          pothin1: number | null
          pothin2: number | null
          pothin3: number | null
          sr_thin: number | null
        }
        Insert: {
          agerc?: string | null
          agetk?: number | null
          art?: number | null
          bthin1?: number | null
          bthin2?: number | null
          bthin3?: number | null
          cr_act?: number | null
          crcm?: number | null
          crexp?: number | null
          data_confidence_id?: number | null
          dfthin_fb?: number | null
          dthinf?: number | null
          fs_thin?: number | null
          id?: number
          ims_pof_assessment_id?: number | null
          ithin1?: number | null
          ithin2?: number | null
          ithin3?: number | null
          last_coating_date?: string | null
          last_inspection_date?: string | null
          nthin_a?: number | null
          nthin_b?: number | null
          nthin_c?: number | null
          nthin_d?: number | null
          pothin1?: number | null
          pothin2?: number | null
          pothin3?: number | null
          sr_thin?: number | null
        }
        Update: {
          agerc?: string | null
          agetk?: number | null
          art?: number | null
          bthin1?: number | null
          bthin2?: number | null
          bthin3?: number | null
          cr_act?: number | null
          crcm?: number | null
          crexp?: number | null
          data_confidence_id?: number | null
          dfthin_fb?: number | null
          dthinf?: number | null
          fs_thin?: number | null
          id?: number
          ims_pof_assessment_id?: number | null
          ithin1?: number | null
          ithin2?: number | null
          ithin3?: number | null
          last_coating_date?: string | null
          last_inspection_date?: string | null
          nthin_a?: number | null
          nthin_b?: number | null
          nthin_c?: number | null
          nthin_d?: number | null
          pothin1?: number | null
          pothin2?: number | null
          pothin3?: number | null
          sr_thin?: number | null
        }
        Relationships: []
      }
      i_env_severity: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      i_ims_pv_general: {
        Row: {
          id: number
        }
        Insert: {
          id?: number
        }
        Update: {
          id?: number
        }
        Relationships: []
      }
      i_inspection_efficiency: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      i_steelscontent: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      r_rms_uptime: {
        Row: {
          asset_id: number | null
          code: string | null
          date: string | null
          id: number
          planned_shutdown: number | null
          sum_running_hour: number | null
          unplanned_shutdown: number | null
          uptime: number | null
        }
        Insert: {
          asset_id?: number | null
          code?: string | null
          date?: string | null
          id?: number
          planned_shutdown?: number | null
          sum_running_hour?: number | null
          unplanned_shutdown?: number | null
          uptime?: number | null
        }
        Update: {
          asset_id?: number | null
          code?: string | null
          date?: string | null
          id?: number
          planned_shutdown?: number | null
          sum_running_hour?: number | null
          unplanned_shutdown?: number | null
          uptime?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "r_rms_uptime_e_asset_fk"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
