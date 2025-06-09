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
          parent_asset_no: number | null
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
          parent_asset_no?: number | null
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
          parent_asset_no?: number | null
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
          {
            foreignKeyName: "e_asset_parent_asset_no_fkey"
            columns: ["parent_asset_no"]
            isOneToOne: false
            referencedRelation: "e_asset"
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
      e_asset_attachment: {
        Row: {
          asset_id: number | null
          created_at: string
          created_by: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: number
          notes: string | null
          type: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_id?: number | null
          created_at?: string
          created_by?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: number
          notes?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_id?: number | null
          created_at?: string
          created_by?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: number
          notes?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_asset_attachment_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
        ]
      }
      e_asset_category: {
        Row: {
          asset_category_group_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_category_group_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_category_group_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_asset_category_e_asset_category_group_fk"
            columns: ["asset_category_group_id"]
            isOneToOne: false
            referencedRelation: "e_asset_category_group"
            referencedColumns: ["id"]
          },
        ]
      }
      e_asset_category_group: {
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
          id?: number
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
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
          asset_image_path: string | null
          bom_id: number | null
          category_id: number | null
          created_at: string | null
          created_by: string | null
          drawing_no: string | null
          ex_certificate: string | null
          ex_class: string | null
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
          asset_image_path?: string | null
          bom_id?: number | null
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          drawing_no?: string | null
          ex_certificate?: string | null
          ex_class?: string | null
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
          asset_image_path?: string | null
          bom_id?: number | null
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          drawing_no?: string | null
          ex_certificate?: string | null
          ex_class?: string | null
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
            foreignKeyName: "e_asset_detail_bom_id_fkey"
            columns: ["bom_id"]
            isOneToOne: false
            referencedRelation: "e_bom_assembly"
            referencedColumns: ["id"]
          },
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
          asset_type_group_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_category_id?: number | null
          asset_type_group_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_category_id?: number | null
          asset_type_group_id?: number | null
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
          {
            foreignKeyName: "e_asset_type_e_asset_type_group_fk"
            columns: ["asset_type_group_id"]
            isOneToOne: false
            referencedRelation: "e_asset_type_group"
            referencedColumns: ["id"]
          },
        ]
      }
      e_asset_type_group: {
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
          id?: number
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
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
          cm_general_id: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          file_path: string | null
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          cm_general_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          cm_general_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_cm_attachment_cm_general_id_fkey"
            columns: ["cm_general_id"]
            isOneToOne: false
            referencedRelation: "e_cm_general"
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
          work_request_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_cm_general_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
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
          cm_general_id: number | null
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
        }
        Insert: {
          alarm_trigger?: string | null
          cm_general_id?: number | null
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
        }
        Update: {
          alarm_trigger?: string | null
          cm_general_id?: number | null
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
        }
        Relationships: [
          {
            foreignKeyName: "e_cm_report_e_cm_general_fk"
            columns: ["cm_general_id"]
            isOneToOne: false
            referencedRelation: "e_cm_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_cm_report_e_material_class_fk"
            columns: ["material_class_id"]
            isOneToOne: false
            referencedRelation: "e_material_class"
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
          id: number
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
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
          work_center_code: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          uid_employee: string
          updated_at?: string | null
          updated_by?: string | null
          work_center_code?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          uid_employee?: string
          updated_at?: string | null
          updated_by?: string | null
          work_center_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_employee_work_center_code_fkey"
            columns: ["work_center_code"]
            isOneToOne: false
            referencedRelation: "e_work_center"
            referencedColumns: ["id"]
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
      e_failure_priority: {
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
          created_at: string | null
          created_by: string | null
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
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
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
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
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
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          id: number
          inventory_id: number | null
          quantity: number | null
          remark: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          adjustment_category_id?: number | null
          adjustment_date?: string | null
          adjustment_type_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          inventory_id?: number | null
          quantity?: number | null
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          adjustment_category_id?: number | null
          adjustment_date?: string | null
          adjustment_type_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          inventory_id?: number | null
          quantity?: number | null
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          id: number
          inventory_id: number | null
          issue_date: string | null
          quantity: number | null
          remark: string | null
          updated_at: string | null
          updated_by: string | null
          work_order_no: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          inventory_id?: number | null
          issue_date?: string | null
          quantity?: number | null
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
          work_order_no?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          inventory_id?: number | null
          issue_date?: string | null
          quantity?: number | null
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          id: number
          inventory_id: number | null
          po_receive_no: string | null
          received_quantity: number | null
          remark: string | null
          total_price: number | null
          unit_price: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          inventory_id?: number | null
          po_receive_no?: string | null
          received_quantity?: number | null
          remark?: string | null
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          inventory_id?: number | null
          po_receive_no?: string | null
          received_quantity?: number | null
          remark?: string | null
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          id: number
          inventory_id: number | null
          quantity: number | null
          remark: string | null
          return_by: string | null
          return_date: string | null
          return_reason: string | null
          updated_at: string | null
          updated_by: string | null
          work_order_no: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          inventory_id?: number | null
          quantity?: number | null
          remark?: string | null
          return_by?: string | null
          return_date?: string | null
          return_reason?: string | null
          updated_at?: string | null
          updated_by?: string | null
          work_order_no?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          inventory_id?: number | null
          quantity?: number | null
          remark?: string | null
          return_by?: string | null
          return_date?: string | null
          return_reason?: string | null
          updated_at?: string | null
          updated_by?: string | null
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
      e_inventory_transfer: {
        Row: {
          created_at: string | null
          created_by: string | null
          employee_id: number | null
          id: number
          inventory_id: number | null
          quantity: number | null
          remark: string | null
          store_id: number | null
          transfer_date: string | null
          transfer_reason: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          employee_id?: number | null
          id?: number
          inventory_id?: number | null
          quantity?: number | null
          remark?: string | null
          store_id?: number | null
          transfer_date?: string | null
          transfer_reason?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          employee_id?: number | null
          id?: number
          inventory_id?: number | null
          quantity?: number | null
          remark?: string | null
          store_id?: number | null
          transfer_date?: string | null
          transfer_reason?: string | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          manufacturer_id: number | null
          model: string | null
          name: string | null
          sensor_type_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          calibration_date?: string | null
          client_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          manufacturer_id?: number | null
          model?: string | null
          name?: string | null
          sensor_type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          calibration_date?: string | null
          client_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          manufacturer_id?: number | null
          model?: string | null
          name?: string | null
          sensor_type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
      e_isolation_system: {
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
      e_item_category: {
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
      e_item_group: {
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
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          item_master_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          item_master_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          item_master_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
      e_maintenance: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          id: number
          maintenance_type_id: number | null
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          id?: number
          maintenance_type_id?: number | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          id?: number
          maintenance_type_id?: number | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
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
      e_manufacturer: {
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
      e_material_class: {
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
      e_mitigation_system: {
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
          created_at: string | null
          created_by: string | null
          critical_rank: number | null
          environment_consequences: string | null
          failure_priority_id: number | null
          failure_shutdown: boolean | null
          failure_type_id: number | null
          has_consequence: string | null
          id: number
          like_hood: string | null
          lost_time_incident: boolean | null
          provability_occurrance: number | null
          safety: string | null
          updated_at: string | null
          updated_by: string | null
          work_request_id: number | null
        }
        Insert: {
          action_taken?: string | null
          corrective_action?: string | null
          created_at?: string | null
          created_by?: string | null
          critical_rank?: number | null
          environment_consequences?: string | null
          failure_priority_id?: number | null
          failure_shutdown?: boolean | null
          failure_type_id?: number | null
          has_consequence?: string | null
          id?: number
          like_hood?: string | null
          lost_time_incident?: boolean | null
          provability_occurrance?: number | null
          safety?: string | null
          updated_at?: string | null
          updated_by?: string | null
          work_request_id?: number | null
        }
        Update: {
          action_taken?: string | null
          corrective_action?: string | null
          created_at?: string | null
          created_by?: string | null
          critical_rank?: number | null
          environment_consequences?: string | null
          failure_priority_id?: number | null
          failure_shutdown?: boolean | null
          failure_type_id?: number | null
          has_consequence?: string | null
          id?: number
          like_hood?: string | null
          lost_time_incident?: boolean | null
          provability_occurrance?: number | null
          safety?: string | null
          updated_at?: string | null
          updated_by?: string | null
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
            foreignKeyName: "e_new_work_failure_failure_priority_id_fkey"
            columns: ["failure_priority_id"]
            isOneToOne: false
            referencedRelation: "e_failure_priority"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "new_work_failure_e_new_work_failure_type_fk"
            columns: ["failure_type_id"]
            isOneToOne: false
            referencedRelation: "e_new_work_failure_type"
            referencedColumns: ["id"]
          },
        ]
      }
      e_new_work_failure_type: {
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
      e_new_work_request: {
        Row: {
          anomaly_report: boolean | null
          asset_id: number | null
          cm_sce_code: number | null
          cm_status_id: number | null
          created_at: string | null
          created_by: string | null
          date_finding: string | null
          description: string | null
          facility_id: number | null
          finding_detail: string | null
          id: number
          is_work_order_created: boolean | null
          maintenance_type: number | null
          package_id: number | null
          priority_id: number | null
          quick_incident_report: boolean | null
          requested_by: string | null
          system_id: number | null
          target_due_date: string | null
          updated_at: string | null
          updated_by: string | null
          work_center_id: number | null
          work_request_date: string | null
          work_request_no: string | null
        }
        Insert: {
          anomaly_report?: boolean | null
          asset_id?: number | null
          cm_sce_code?: number | null
          cm_status_id?: number | null
          created_at?: string | null
          created_by?: string | null
          date_finding?: string | null
          description?: string | null
          facility_id?: number | null
          finding_detail?: string | null
          id?: number
          is_work_order_created?: boolean | null
          maintenance_type?: number | null
          package_id?: number | null
          priority_id?: number | null
          quick_incident_report?: boolean | null
          requested_by?: string | null
          system_id?: number | null
          target_due_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
          work_center_id?: number | null
          work_request_date?: string | null
          work_request_no?: string | null
        }
        Update: {
          anomaly_report?: boolean | null
          asset_id?: number | null
          cm_sce_code?: number | null
          cm_status_id?: number | null
          created_at?: string | null
          created_by?: string | null
          date_finding?: string | null
          description?: string | null
          facility_id?: number | null
          finding_detail?: string | null
          id?: number
          is_work_order_created?: boolean | null
          maintenance_type?: number | null
          package_id?: number | null
          priority_id?: number | null
          quick_incident_report?: boolean | null
          requested_by?: string | null
          system_id?: number | null
          target_due_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
          work_center_id?: number | null
          work_request_date?: string | null
          work_request_no?: string | null
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
            foreignKeyName: "e_new_work_request_priority_id_fkey"
            columns: ["priority_id"]
            isOneToOne: false
            referencedRelation: "e_priority"
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
          created_at: string | null
          created_by: string | null
          id: number
          new_work_request_id: number | null
          task_list: string | null
          task_sequence: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          new_work_request_id?: number | null
          task_list?: string | null
          task_sequence?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          new_work_request_id?: number | null
          task_list?: string | null
          task_sequence?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
      e_online_monitor: {
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
      e_package: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean | null
          package_name: string | null
          package_no: string | null
          package_tag: string | null
          package_type_id: number | null
          system_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          package_name?: string | null
          package_no?: string | null
          package_tag?: string | null
          package_type_id?: number | null
          system_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          package_name?: string | null
          package_no?: string | null
          package_tag?: string | null
          package_type_id?: number | null
          system_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
          abbreviation_name: string | null
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          abbreviation_name?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          abbreviation_name?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_pipe_schedule: {
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
      e_piping_material_construction: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          identification: string
          metals: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          identification: string
          metals?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          identification?: string
          metals?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_pm_actual_labour: {
        Row: {
          created_at: string | null
          created_by: string | null
          duration: number | null
          employee_id: number | null
          id: number
          pm_wo_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          employee_id?: number | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          employee_id?: number | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          id: number
          item_id: number | null
          pm_wo_id: number | null
          quantity: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          item_id?: number | null
          pm_wo_id?: number | null
          quantity?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          item_id?: number | null
          pm_wo_id?: number | null
          quantity?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          pm_wo_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_additional_info_pm_wo_id_fkey"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          file_path: string | null
          id: number
          pm_wo_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          description: string | null
          file_path: string | null
          id: number
          pm_wo_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          id: number
          new_due_date: string | null
          pm_wo_id: number | null
          previous_due_date: string | null
          remarks: string | null
          requested_by: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          new_due_date?: string | null
          pm_wo_id?: number | null
          previous_due_date?: string | null
          remarks?: string | null
          requested_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          new_due_date?: string | null
          pm_wo_id?: number | null
          previous_due_date?: string | null
          remarks?: string | null
          requested_by?: string | null
          updated_at?: string | null
          updated_by?: string | null
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
      e_pm_maintainable_group: {
        Row: {
          asset_id: number | null
          created_at: string | null
          created_by: string | null
          group_id: number | null
          id: number
          pm_wo_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_id?: number | null
          created_at?: string | null
          created_by?: string | null
          group_id?: number | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_id?: number | null
          created_at?: string | null
          created_by?: string | null
          group_id?: number | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_maintainable_group_pm_wo_id_fkey"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
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
          created_at: string | null
          created_by: string | null
          criteria: string | null
          field_name: string | null
          id: number
          pm_wo_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          criteria?: string | null
          field_name?: string | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          criteria?: string | null
          field_name?: string | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          duration: number | null
          employee_id: number | null
          id: number
          pm_wo_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          employee_id?: number | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          employee_id?: number | null
          id?: number
          pm_wo_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          id: number
          item_id: number | null
          pm_wo_id: number | null
          quantity: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          item_id?: number | null
          pm_wo_id?: number | null
          quantity?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          item_id?: number | null
          pm_wo_id?: number | null
          quantity?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          detail_description: string | null
          equipment_status: string | null
          general_maintainence_id: number | null
          id: number
          pm_wo_id: number | null
          sce_result: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          detail_description?: string | null
          equipment_status?: string | null
          general_maintainence_id?: number | null
          id?: number
          pm_wo_id?: number | null
          sce_result?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          detail_description?: string | null
          equipment_status?: string | null
          general_maintainence_id?: number | null
          id?: number
          pm_wo_id?: number | null
          sce_result?: string | null
          updated_at?: string | null
          updated_by?: string | null
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
          additional_info: string | null
          asset_id: number | null
          checksheet_attachment: string | null
          checksheet_notes: string | null
          created_at: string | null
          created_by: string | null
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
          service_notes: string | null
          system_id: number | null
          task_id: number | null
          updated_at: string | null
          updated_by: string | null
          work_center_id: number | null
        }
        Insert: {
          additional_info?: string | null
          asset_id?: number | null
          checksheet_attachment?: string | null
          checksheet_notes?: string | null
          created_at?: string | null
          created_by?: string | null
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
          service_notes?: string | null
          system_id?: number | null
          task_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_center_id?: number | null
        }
        Update: {
          additional_info?: string | null
          asset_id?: number | null
          checksheet_attachment?: string | null
          checksheet_notes?: string | null
          created_at?: string | null
          created_by?: string | null
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
          service_notes?: string | null
          system_id?: number | null
          task_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          id: number
          is_custom: boolean
          is_deleted: boolean
          is_template_copy: boolean
          original_task_detail_id: number | null
          pm_schedule_id: number | null
          pm_wo_id: number | null
          sequence: number | null
          task_list: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_custom?: boolean
          is_deleted?: boolean
          is_template_copy?: boolean
          original_task_detail_id?: number | null
          pm_schedule_id?: number | null
          pm_wo_id?: number | null
          sequence?: number | null
          task_list?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_custom?: boolean
          is_deleted?: boolean
          is_template_copy?: boolean
          original_task_detail_id?: number | null
          pm_schedule_id?: number | null
          pm_wo_id?: number | null
          sequence?: number | null
          task_list?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_task_detail_e_pm_work_order_fk"
            columns: ["pm_wo_id"]
            isOneToOne: false
            referencedRelation: "e_pm_work_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_task_detail_original_fk"
            columns: ["original_task_detail_id"]
            isOneToOne: false
            referencedRelation: "e_task_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_task_detail_schedule_fk"
            columns: ["pm_schedule_id"]
            isOneToOne: false
            referencedRelation: "e_pm_schedule"
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
          created_at: string | null
          created_by: string | null
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
          updated_at: string | null
          updated_by: string | null
          work_center_id: number | null
          work_order_no: string
        }
        Insert: {
          asset_id?: number | null
          asset_sce_code_id?: number | null
          closed_by?: string | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
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
          updated_at?: string | null
          updated_by?: string | null
          work_center_id?: number | null
          work_order_no: string
        }
        Update: {
          asset_id?: number | null
          asset_sce_code_id?: number | null
          closed_by?: string | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
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
          updated_at?: string | null
          updated_by?: string | null
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
      e_project: {
        Row: {
          client_id: number | null
          created_at: string | null
          created_by: string | null
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
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          created_by?: string | null
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
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          created_by?: string | null
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
          updated_at?: string | null
          updated_by?: string | null
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
      e_pv_material_construction: {
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
      e_rack: {
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
      e_sensor_type: {
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
      e_shutdown_type: {
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
      e_spare_parts: {
        Row: {
          bom_id: number
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          item_master_id: number
          quantity: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          bom_id: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          item_master_id: number
          quantity?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          bom_id?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          item_master_id?: number
          quantity?: number
          updated_at?: string | null
          updated_by?: string | null
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
      e_system: {
        Row: {
          created_at: string | null
          created_by: string | null
          facility_id: number | null
          id: number
          is_active: boolean | null
          system_code: string
          system_name: string | null
          system_no: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          facility_id?: number | null
          id?: number
          is_active?: boolean | null
          system_code: string
          system_name?: string | null
          system_no?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          facility_id?: number | null
          id?: number
          is_active?: boolean | null
          system_code?: string
          system_name?: string | null
          system_no?: string | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          discipline_id: number | null
          id: number
          is_active: boolean | null
          task_code: string
          task_name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          discipline_id?: number | null
          id?: number
          is_active?: boolean | null
          task_code: string
          task_name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          discipline_id?: number | null
          id?: number
          is_active?: boolean | null
          task_code?: string
          task_name?: string | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
          id: number
          seq: number | null
          task_id: number
          task_list: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          seq?: number | null
          task_id: number
          task_list?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          seq?: number | null
          task_id?: number
          task_list?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_task_detail_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "e_task"
            referencedColumns: ["id"]
          },
        ]
      }
      e_toxicity: {
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
      e_unit: {
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
      e_work_center: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          effective_date: string | null
          id: number
          is_active: boolean | null
          name: string | null
          remark: string | null
          type: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          effective_date?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          remark?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          effective_date?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          remark?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_work_order: {
        Row: {
          asset_id: number | null
          cm_work_order_id: number | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: number
          pm_work_order_id: number | null
          task_id: number | null
          updated_at: string | null
          updated_by: string | null
          work_order_no: string | null
          work_order_status_id: number | null
          work_order_type: number | null
        }
        Insert: {
          asset_id?: number | null
          cm_work_order_id?: number | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          pm_work_order_id?: number | null
          task_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_order_no?: string | null
          work_order_status_id?: number | null
          work_order_type?: number | null
        }
        Update: {
          asset_id?: number | null
          cm_work_order_id?: number | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          pm_work_order_id?: number | null
          task_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_order_no?: string | null
          work_order_status_id?: number | null
          work_order_type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_work_order_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
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
          {
            foreignKeyName: "e_work_order_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "e_task"
            referencedColumns: ["id"]
          },
        ]
      }
      e_work_order_status: {
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
          id?: number
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      e_work_order_type: {
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
      e_work_request_report: {
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
      i_asme_material_lookup: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          material_code_id: number | null
          temperature: number | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          material_code_id?: number | null
          temperature?: number | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          material_code_id?: number | null
          temperature?: number | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Relationships: []
      }
      i_data_confidence: {
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
      i_df_cui: {
        Row: {
          age: number | null
          agecoat_yr: number | null
          agetk: number | null
          art: number | null
          bcuif1: number | null
          bcuif2: number | null
          bcuif3: number | null
          coatadj: number | null
          created_at: string | null
          created_by: string | null
          crexp: number | null
          dfcuiff: number | null
          fscuif: number | null
          icuif2: number | null
          icuif3: number | null
          id: number
          ims_pof_assessment_id: number | null
          last_coating_date_cui: string | null
          last_inspection_date_cui: string | null
          lcuif1: number | null
          pocuifp1: number | null
          pocuifp2: number | null
          pocuifp3: number | null
          srcuif: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          age?: number | null
          agecoat_yr?: number | null
          agetk?: number | null
          art?: number | null
          bcuif1?: number | null
          bcuif2?: number | null
          bcuif3?: number | null
          coatadj?: number | null
          created_at?: string | null
          created_by?: string | null
          crexp?: number | null
          dfcuiff?: number | null
          fscuif?: number | null
          icuif2?: number | null
          icuif3?: number | null
          id?: number
          ims_pof_assessment_id?: number | null
          last_coating_date_cui?: string | null
          last_inspection_date_cui?: string | null
          lcuif1?: number | null
          pocuifp1?: number | null
          pocuifp2?: number | null
          pocuifp3?: number | null
          srcuif?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          age?: number | null
          agecoat_yr?: number | null
          agetk?: number | null
          art?: number | null
          bcuif1?: number | null
          bcuif2?: number | null
          bcuif3?: number | null
          coatadj?: number | null
          created_at?: string | null
          created_by?: string | null
          crexp?: number | null
          dfcuiff?: number | null
          fscuif?: number | null
          icuif2?: number | null
          icuif3?: number | null
          id?: number
          ims_pof_assessment_id?: number | null
          last_coating_date_cui?: string | null
          last_inspection_date_cui?: string | null
          lcuif1?: number | null
          pocuifp1?: number | null
          pocuifp2?: number | null
          pocuifp3?: number | null
          srcuif?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
          created_at: string | null
          created_by: string | null
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
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          agecoat_year?: number | null
          agetk?: number | null
          art?: number | null
          bext_corrp1?: number | null
          bext_corrp2?: number | null
          bext_corrp3?: number | null
          cract_year?: number | null
          created_at?: string | null
          created_by?: string | null
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
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          agecoat_year?: number | null
          agetk?: number | null
          art?: number | null
          bext_corrp1?: number | null
          bext_corrp2?: number | null
          bext_corrp3?: number | null
          cract_year?: number | null
          created_at?: string | null
          created_by?: string | null
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
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      i_df_ext_clscc: {
        Row: {
          age: number | null
          age_coat: number | null
          age_crack: number | null
          coat_adj: number | null
          created_at: string | null
          created_by: string | null
          dfextcisc: number | null
          dfextcisccfb: number | null
          ext_scc_susc: number | null
          id: number
          ims_pof_asessment_id: number | null
          inspection_efficiency: number | null
          last_coating_date: string | null
          last_inspection_date: string | null
          svi: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          age?: number | null
          age_coat?: number | null
          age_crack?: number | null
          coat_adj?: number | null
          created_at?: string | null
          created_by?: string | null
          dfextcisc?: number | null
          dfextcisccfb?: number | null
          ext_scc_susc?: number | null
          id?: number
          ims_pof_asessment_id?: number | null
          inspection_efficiency?: number | null
          last_coating_date?: string | null
          last_inspection_date?: string | null
          svi?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          age?: number | null
          age_coat?: number | null
          age_crack?: number | null
          coat_adj?: number | null
          created_at?: string | null
          created_by?: string | null
          dfextcisc?: number | null
          dfextcisccfb?: number | null
          ext_scc_susc?: number | null
          id?: number
          ims_pof_asessment_id?: number | null
          inspection_efficiency?: number | null
          last_coating_date?: string | null
          last_inspection_date?: string | null
          svi?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      i_df_mfat: {
        Row: {
          brach_diameter: number | null
          corrective_action: number | null
          created_at: string | null
          created_by: string | null
          cyclic_load_type: number | null
          dmfat: number | null
          dmfatfb: number | null
          id: number
          ims_pof_assessment_id: number | null
          joint_branch_design: number | null
          pipe_complexity: number | null
          pipe_condition: number | null
          previous_failure: number | null
          shaking_frequency: number | null
          updated_at: string | null
          updated_by: string | null
          visible_audible_shaking: number | null
        }
        Insert: {
          brach_diameter?: number | null
          corrective_action?: number | null
          created_at?: string | null
          created_by?: string | null
          cyclic_load_type?: number | null
          dmfat?: number | null
          dmfatfb?: number | null
          id?: number
          ims_pof_assessment_id?: number | null
          joint_branch_design?: number | null
          pipe_complexity?: number | null
          pipe_condition?: number | null
          previous_failure?: number | null
          shaking_frequency?: number | null
          updated_at?: string | null
          updated_by?: string | null
          visible_audible_shaking?: number | null
        }
        Update: {
          brach_diameter?: number | null
          corrective_action?: number | null
          created_at?: string | null
          created_by?: string | null
          cyclic_load_type?: number | null
          dmfat?: number | null
          dmfatfb?: number | null
          id?: number
          ims_pof_assessment_id?: number | null
          joint_branch_design?: number | null
          pipe_complexity?: number | null
          pipe_condition?: number | null
          previous_failure?: number | null
          shaking_frequency?: number | null
          updated_at?: string | null
          updated_by?: string | null
          visible_audible_shaking?: number | null
        }
        Relationships: []
      }
      i_df_scc_scc: {
        Row: {
          created_at: string | null
          created_by: string | null
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
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
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
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
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
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      i_df_scc_sohic: {
        Row: {
          created_at: string | null
          created_by: string | null
          df_sohic_fb: number | null
          dfscc_sohic: number | null
          env_severity: number | null
          harness_brinnel: number | null
          id: number
          ims_pof_assessment_id: number | null
          inspection_efficiency_id: number | null
          steelscontent_id: number | null
          susc_crack_id: number | null
          susceptibility_id: number | null
          svi: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          df_sohic_fb?: number | null
          dfscc_sohic?: number | null
          env_severity?: number | null
          harness_brinnel?: number | null
          id?: number
          ims_pof_assessment_id?: number | null
          inspection_efficiency_id?: number | null
          steelscontent_id?: number | null
          susc_crack_id?: number | null
          susceptibility_id?: number | null
          svi?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          df_sohic_fb?: number | null
          dfscc_sohic?: number | null
          env_severity?: number | null
          harness_brinnel?: number | null
          id?: number
          ims_pof_assessment_id?: number | null
          inspection_efficiency_id?: number | null
          steelscontent_id?: number | null
          susc_crack_id?: number | null
          susceptibility_id?: number | null
          svi?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
      i_ims_cof_assessment_cof_prod: {
        Row: {
          asset_detail_id: number | null
          created_at: string | null
          created_by: string | null
          dcaffa: number | null
          envcost: number | null
          fc: number | null
          fccmd: number | null
          fcenviron: number | null
          fcinj: number | null
          fcprod: number | null
          fracevap: number | null
          id: number
          injcost: number | null
          lraprod: number | null
          outageaffa: number | null
          outagemult: number | null
          propdens: number | null
          updated_at: string | null
          updated_by: string | null
          volenv: number | null
        }
        Insert: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          dcaffa?: number | null
          envcost?: number | null
          fc?: number | null
          fccmd?: number | null
          fcenviron?: number | null
          fcinj?: number | null
          fcprod?: number | null
          fracevap?: number | null
          id?: number
          injcost?: number | null
          lraprod?: number | null
          outageaffa?: number | null
          outagemult?: number | null
          propdens?: number | null
          updated_at?: string | null
          updated_by?: string | null
          volenv?: number | null
        }
        Update: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          dcaffa?: number | null
          envcost?: number | null
          fc?: number | null
          fccmd?: number | null
          fcenviron?: number | null
          fcinj?: number | null
          fcprod?: number | null
          fracevap?: number | null
          id?: number
          injcost?: number | null
          lraprod?: number | null
          outageaffa?: number | null
          outagemult?: number | null
          propdens?: number | null
          updated_at?: string | null
          updated_by?: string | null
          volenv?: number | null
        }
        Relationships: []
      }
      i_ims_cof_asssessment_cof_area: {
        Row: {
          ca_cmdail: number | null
          ca_cmdail_cont: number | null
          ca_cmdail_insl: number | null
          ca_cmdainl: number | null
          ca_cmdainl_cont: number | null
          ca_cmdainl_inst: number | null
          ca_cmdflam: number | null
          ca_injail: number | null
          ca_injail_cont: number | null
          ca_injail_inst: number | null
          ca_injainl: number | null
          ca_injainl_inst: number | null
          ca_injflam: number | null
          cp: number | null
          created_at: string | null
          created_by: string | null
          det_sys: number | null
          eneff: number | null
          factait: number | null
          factdi: number | null
          factic: number | null
          id: number
          id_: number | null
          ideal_gas_specific_heat_eq: number | null
          idmax: number | null
          inventory_kg: number | null
          iso_sys: number | null
          k: number | null
          mitigation_system: number | null
          mrelease_kg: number | null
          op_temp_k: number | null
          ps_kpa: number | null
          ptrans_kpa: number | null
          raten: number | null
          release_type: string | null
          timeempty: number | null
          updated_at: string | null
          updated_by: string | null
          w1_kg: number | null
        }
        Insert: {
          ca_cmdail?: number | null
          ca_cmdail_cont?: number | null
          ca_cmdail_insl?: number | null
          ca_cmdainl?: number | null
          ca_cmdainl_cont?: number | null
          ca_cmdainl_inst?: number | null
          ca_cmdflam?: number | null
          ca_injail?: number | null
          ca_injail_cont?: number | null
          ca_injail_inst?: number | null
          ca_injainl?: number | null
          ca_injainl_inst?: number | null
          ca_injflam?: number | null
          cp?: number | null
          created_at?: string | null
          created_by?: string | null
          det_sys?: number | null
          eneff?: number | null
          factait?: number | null
          factdi?: number | null
          factic?: number | null
          id?: number
          id_?: number | null
          ideal_gas_specific_heat_eq?: number | null
          idmax?: number | null
          inventory_kg?: number | null
          iso_sys?: number | null
          k?: number | null
          mitigation_system?: number | null
          mrelease_kg?: number | null
          op_temp_k?: number | null
          ps_kpa?: number | null
          ptrans_kpa?: number | null
          raten?: number | null
          release_type?: string | null
          timeempty?: number | null
          updated_at?: string | null
          updated_by?: string | null
          w1_kg?: number | null
        }
        Update: {
          ca_cmdail?: number | null
          ca_cmdail_cont?: number | null
          ca_cmdail_insl?: number | null
          ca_cmdainl?: number | null
          ca_cmdainl_cont?: number | null
          ca_cmdainl_inst?: number | null
          ca_cmdflam?: number | null
          ca_injail?: number | null
          ca_injail_cont?: number | null
          ca_injail_inst?: number | null
          ca_injainl?: number | null
          ca_injainl_inst?: number | null
          ca_injflam?: number | null
          cp?: number | null
          created_at?: string | null
          created_by?: string | null
          det_sys?: number | null
          eneff?: number | null
          factait?: number | null
          factdi?: number | null
          factic?: number | null
          id?: number
          id_?: number | null
          ideal_gas_specific_heat_eq?: number | null
          idmax?: number | null
          inventory_kg?: number | null
          iso_sys?: number | null
          k?: number | null
          mitigation_system?: number | null
          mrelease_kg?: number | null
          op_temp_k?: number | null
          ps_kpa?: number | null
          ptrans_kpa?: number | null
          raten?: number | null
          release_type?: string | null
          timeempty?: number | null
          updated_at?: string | null
          updated_by?: string | null
          w1_kg?: number | null
        }
        Relationships: []
      }
      i_ims_piping_design: {
        Row: {
          allowable_stress_mpa: number | null
          asset_detail_id: number | null
          corrosion_allowance: number | null
          created_at: string | null
          created_by: string | null
          dead_legs: boolean | null
          design_pressure_mpa: number | null
          design_temperature: number | null
          ext_env: number | null
          geometry: number | null
          id: number
          internal_diameter: number | null
          length: string | null
          mix_point: boolean | null
          operating_pressure_mpa: number | null
          operating_temperature: number | null
          outer_diameter: number | null
          pipe_support: boolean | null
          soil_water_interface: boolean | null
          updated_at: string | null
          updated_by: string | null
          welding_efficiency: number | null
        }
        Insert: {
          allowable_stress_mpa?: number | null
          asset_detail_id?: number | null
          corrosion_allowance?: number | null
          created_at?: string | null
          created_by?: string | null
          dead_legs?: boolean | null
          design_pressure_mpa?: number | null
          design_temperature?: number | null
          ext_env?: number | null
          geometry?: number | null
          id?: number
          internal_diameter?: number | null
          length?: string | null
          mix_point?: boolean | null
          operating_pressure_mpa?: number | null
          operating_temperature?: number | null
          outer_diameter?: number | null
          pipe_support?: boolean | null
          soil_water_interface?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          welding_efficiency?: number | null
        }
        Update: {
          allowable_stress_mpa?: number | null
          asset_detail_id?: number | null
          corrosion_allowance?: number | null
          created_at?: string | null
          created_by?: string | null
          dead_legs?: boolean | null
          design_pressure_mpa?: number | null
          design_temperature?: number | null
          ext_env?: number | null
          geometry?: number | null
          id?: number
          internal_diameter?: number | null
          length?: string | null
          mix_point?: boolean | null
          operating_pressure_mpa?: number | null
          operating_temperature?: number | null
          outer_diameter?: number | null
          pipe_support?: boolean | null
          soil_water_interface?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          welding_efficiency?: number | null
        }
        Relationships: []
      }
      i_ims_piping_general: {
        Row: {
          area: string | null
          asset_detail_id: number | null
          circuit_id: number | null
          cladding: boolean | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          insulation: boolean | null
          internal_lining: boolean | null
          line_h2s: boolean | null
          line_no: string | null
          material_construction: number | null
          nominal_bore_diameter: number | null
          normal_wall_thickness: number | null
          pipe_schedule: number | null
          pressure_railing: string | null
          pwht: boolean | null
          system: string | null
          tmin: string | null
          updated_at: string | null
          updated_by: string | null
          year_in_service: string | null
        }
        Insert: {
          area?: string | null
          asset_detail_id?: number | null
          circuit_id?: number | null
          cladding?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          insulation?: boolean | null
          internal_lining?: boolean | null
          line_h2s?: boolean | null
          line_no?: string | null
          material_construction?: number | null
          nominal_bore_diameter?: number | null
          normal_wall_thickness?: number | null
          pipe_schedule?: number | null
          pressure_railing?: string | null
          pwht?: boolean | null
          system?: string | null
          tmin?: string | null
          updated_at?: string | null
          updated_by?: string | null
          year_in_service?: string | null
        }
        Update: {
          area?: string | null
          asset_detail_id?: number | null
          circuit_id?: number | null
          cladding?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          insulation?: boolean | null
          internal_lining?: boolean | null
          line_h2s?: boolean | null
          line_no?: string | null
          material_construction?: number | null
          nominal_bore_diameter?: number | null
          normal_wall_thickness?: number | null
          pipe_schedule?: number | null
          pressure_railing?: string | null
          pwht?: boolean | null
          system?: string | null
          tmin?: string | null
          updated_at?: string | null
          updated_by?: string | null
          year_in_service?: string | null
        }
        Relationships: []
      }
      i_ims_piping_protection: {
        Row: {
          asset_detail_id: number | null
          coating_quality: number | null
          cr_exp: string | null
          created_at: string | null
          created_by: string | null
          detection_system: number | null
          fsext_corr: string | null
          id: number
          isolation_system: number | null
          line_description: string | null
          minimum_thickness: number | null
          mitigation_system: number | null
          online_monitor: number | null
          post_weld_heat_treatment: number | null
          replacement_line: string | null
          srext_corr: string | null
          trd_mm: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          coating_quality?: number | null
          cr_exp?: string | null
          created_at?: string | null
          created_by?: string | null
          detection_system?: number | null
          fsext_corr?: string | null
          id?: number
          isolation_system?: number | null
          line_description?: string | null
          minimum_thickness?: number | null
          mitigation_system?: number | null
          online_monitor?: number | null
          post_weld_heat_treatment?: number | null
          replacement_line?: string | null
          srext_corr?: string | null
          trd_mm?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          coating_quality?: number | null
          cr_exp?: string | null
          created_at?: string | null
          created_by?: string | null
          detection_system?: number | null
          fsext_corr?: string | null
          id?: number
          isolation_system?: number | null
          line_description?: string | null
          minimum_thickness?: number | null
          mitigation_system?: number | null
          online_monitor?: number | null
          post_weld_heat_treatment?: number | null
          replacement_line?: string | null
          srext_corr?: string | null
          trd_mm?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      i_ims_piping_service: {
        Row: {
          asset_detail_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          toxic_mass_fraction: number | null
          toxicity: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          toxic_mass_fraction?: number | null
          toxicity?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          toxic_mass_fraction?: number | null
          toxicity?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      i_ims_pof_assessment_general: {
        Row: {
          asset_detail_id: number | null
          cladding: boolean | null
          coating_quality: number | null
          created_at: string | null
          created_by: string | null
          current_thickness: number | null
          data_confidence: number | null
          description: string | null
          id: number
          nominal_thickness: number | null
          tmin: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          cladding?: boolean | null
          coating_quality?: number | null
          created_at?: string | null
          created_by?: string | null
          current_thickness?: number | null
          data_confidence?: number | null
          description?: string | null
          id?: number
          nominal_thickness?: number | null
          tmin?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          cladding?: boolean | null
          coating_quality?: number | null
          created_at?: string | null
          created_by?: string | null
          current_thickness?: number | null
          data_confidence?: number | null
          description?: string | null
          id?: number
          nominal_thickness?: number | null
          tmin?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      i_ims_pv_attachment: {
        Row: {
          asset_detail_id: number | null
          attachment_file: string | null
          created_at: string | null
          created_by: string | null
          id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          attachment_file?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          attachment_file?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      i_ims_pv_design: {
        Row: {
          allowable_stress_mpa: number | null
          asset_detail_id: number | null
          corrosion_allowance: number | null
          created_at: string | null
          created_by: string | null
          deadleg: boolean | null
          design_pressure: number | null
          design_temperature: number | null
          ext_env: number | null
          geometry: number | null
          id: number
          inner_diameter: number | null
          length: number | null
          mixpoint: boolean | null
          operating_temperature: number | null
          outer_diameter: number | null
          pipe_support: boolean | null
          soil_water_interface: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          allowable_stress_mpa?: number | null
          asset_detail_id?: number | null
          corrosion_allowance?: number | null
          created_at?: string | null
          created_by?: string | null
          deadleg?: boolean | null
          design_pressure?: number | null
          design_temperature?: number | null
          ext_env?: number | null
          geometry?: number | null
          id?: number
          inner_diameter?: number | null
          length?: number | null
          mixpoint?: boolean | null
          operating_temperature?: number | null
          outer_diameter?: number | null
          pipe_support?: boolean | null
          soil_water_interface?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          allowable_stress_mpa?: number | null
          asset_detail_id?: number | null
          corrosion_allowance?: number | null
          created_at?: string | null
          created_by?: string | null
          deadleg?: boolean | null
          design_pressure?: number | null
          design_temperature?: number | null
          ext_env?: number | null
          geometry?: number | null
          id?: number
          inner_diameter?: number | null
          length?: number | null
          mixpoint?: boolean | null
          operating_temperature?: number | null
          outer_diameter?: number | null
          pipe_support?: boolean | null
          soil_water_interface?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      i_ims_pv_general: {
        Row: {
          area: string | null
          asset_detail_id: number | null
          clad_thickness: number | null
          cladding: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          equipment_tag: string | null
          equipment_type: string | null
          h25: boolean | null
          id: number
          inner_diameter: number | null
          insulation: boolean | null
          internal_lining: boolean | null
          material_construction: number | null
          nominal_thickness: number | null
          pwht: boolean | null
          updated_at: string | null
          updated_by: string | null
          year_in_service: string | null
        }
        Insert: {
          area?: string | null
          asset_detail_id?: number | null
          clad_thickness?: number | null
          cladding?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          equipment_tag?: string | null
          equipment_type?: string | null
          h25?: boolean | null
          id?: number
          inner_diameter?: number | null
          insulation?: boolean | null
          internal_lining?: boolean | null
          material_construction?: number | null
          nominal_thickness?: number | null
          pwht?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          year_in_service?: string | null
        }
        Update: {
          area?: string | null
          asset_detail_id?: number | null
          clad_thickness?: number | null
          cladding?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          equipment_tag?: string | null
          equipment_type?: string | null
          h25?: boolean | null
          id?: number
          inner_diameter?: number | null
          insulation?: boolean | null
          internal_lining?: boolean | null
          material_construction?: number | null
          nominal_thickness?: number | null
          pwht?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          year_in_service?: string | null
        }
        Relationships: []
      }
      i_ims_pv_inspection: {
        Row: {
          asset_detail_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          inspection_plan: string | null
          report_attachment: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          inspection_plan?: string | null
          report_attachment?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          inspection_plan?: string | null
          report_attachment?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      i_ims_pv_protection: {
        Row: {
          asset_detail_id: number | null
          coating_quality: number | null
          created_at: string | null
          created_by: string | null
          design_fabrication: number | null
          id: number
          insulation_complexity: string | null
          insulation_condition: string | null
          insulation_type_id: number | null
          interface: number | null
          lining_condition: string | null
          lining_monitoring: number | null
          lining_type: number | null
          online_monitor: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          coating_quality?: number | null
          created_at?: string | null
          created_by?: string | null
          design_fabrication?: number | null
          id?: number
          insulation_complexity?: string | null
          insulation_condition?: string | null
          insulation_type_id?: number | null
          interface?: number | null
          lining_condition?: string | null
          lining_monitoring?: number | null
          lining_type?: number | null
          online_monitor?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          coating_quality?: number | null
          created_at?: string | null
          created_by?: string | null
          design_fabrication?: number | null
          id?: number
          insulation_complexity?: string | null
          insulation_condition?: string | null
          insulation_type_id?: number | null
          interface?: number | null
          lining_condition?: string | null
          lining_monitoring?: number | null
          lining_type?: number | null
          online_monitor?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      i_ims_pv_risk: {
        Row: {
          asset_detail_id: number | null
          cof$: number | null
          cofm2: number | null
          created_at: string | null
          created_by: string | null
          dbrit: number | null
          dextd: number | null
          dhtha: number | null
          dmfat: number | null
          dscc: number | null
          dthin: number | null
          f1: number | null
          id: number
          pof: number | null
          risk_level: number | null
          risk_ranking: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          cof$?: number | null
          cofm2?: number | null
          created_at?: string | null
          created_by?: string | null
          dbrit?: number | null
          dextd?: number | null
          dhtha?: number | null
          dmfat?: number | null
          dscc?: number | null
          dthin?: number | null
          f1?: number | null
          id?: number
          pof?: number | null
          risk_level?: number | null
          risk_ranking?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          cof$?: number | null
          cofm2?: number | null
          created_at?: string | null
          created_by?: string | null
          dbrit?: number | null
          dextd?: number | null
          dhtha?: number | null
          dmfat?: number | null
          dscc?: number | null
          dthin?: number | null
          f1?: number | null
          id?: number
          pof?: number | null
          risk_level?: number | null
          risk_ranking?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      i_ims_pv_service: {
        Row: {
          asset_detail_id: number | null
          created_at: string | null
          created_by: string | null
          fluid_phase: number | null
          fluid_representive: number | null
          id: number
          toxic_mass_fraction: number | null
          toxicity: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          fluid_phase?: number | null
          fluid_representive?: number | null
          id?: number
          toxic_mass_fraction?: number | null
          toxicity?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          fluid_phase?: number | null
          fluid_representive?: number | null
          id?: number
          toxic_mass_fraction?: number | null
          toxicity?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      "i_ims_risk_&_irp": {
        Row: {
          asset_detail_id: number | null
          cof_area: number | null
          cof_financial: number | null
          created_at: string | null
          created_by: string | null
          dbrit: number | null
          dextd: number | null
          dhtha: number | null
          dmfat: number | null
          dscc: number | null
          dthin: number | null
          id: number
          pof: number | null
          pof_value: number | null
          risk_level: number | null
          risk_ranking: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          cof_area?: number | null
          cof_financial?: number | null
          created_at?: string | null
          created_by?: string | null
          dbrit?: number | null
          dextd?: number | null
          dhtha?: number | null
          dmfat?: number | null
          dscc?: number | null
          dthin?: number | null
          id?: number
          pof?: number | null
          pof_value?: number | null
          risk_level?: number | null
          risk_ranking?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          cof_area?: number | null
          cof_financial?: number | null
          created_at?: string | null
          created_by?: string | null
          dbrit?: number | null
          dextd?: number | null
          dhtha?: number | null
          dmfat?: number | null
          dscc?: number | null
          dthin?: number | null
          id?: number
          pof?: number | null
          pof_value?: number | null
          risk_level?: number | null
          risk_ranking?: number | null
          updated_at?: string | null
          updated_by?: string | null
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
      i_lining_monitoring: {
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
          id: number
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
      i_lining_type: {
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
          id: number
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
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
      work_order_sequence: {
        Row: {
          current_number: number
          year: number
        }
        Insert: {
          current_number?: number
          year: number
        }
        Update: {
          current_number?: number
          year?: number
        }
        Relationships: []
      }
      work_request_sequence: {
        Row: {
          current_number: number
          year: number
        }
        Insert: {
          current_number?: number
          year: number
        }
        Update: {
          current_number?: number
          year?: number
        }
        Relationships: []
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
