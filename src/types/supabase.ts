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
          ims_used: boolean | null
          is_active: boolean | null
          package_id: number | null
          parent_asset_id: number | null
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
          ims_used?: boolean | null
          is_active?: boolean | null
          package_id?: number | null
          parent_asset_id?: number | null
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
          ims_used?: boolean | null
          is_active?: boolean | null
          package_id?: number | null
          parent_asset_id?: number | null
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
      e_asset_detail: {
        Row: {
          area_id: number | null
          asset_class_id: number | null
          asset_id: number | null
          asset_image_path: string | null
          bom_id: number | null
          category_id: number | null
          created_at: string | null
          created_by: string | null
          criticality_id: number | null
          drawing_no: string | null
          ex_certificate: string | null
          ex_class: string | null
          hs_code: string | null
          id: number
          iot_sensor_id: number | null
          is_active: boolean | null
          is_criticality: boolean | null
          is_integrity: boolean | null
          is_reliability: boolean | null
          is_sce: boolean | null
          maker_no: string | null
          manufacturer_id: number | null
          model: string | null
          sce_id: number | null
          serial_number: string | null
          specification: string | null
          type_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          area_id?: number | null
          asset_class_id?: number | null
          asset_id?: number | null
          asset_image_path?: string | null
          bom_id?: number | null
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          criticality_id?: number | null
          drawing_no?: string | null
          ex_certificate?: string | null
          ex_class?: string | null
          hs_code?: string | null
          id?: number
          iot_sensor_id?: number | null
          is_active?: boolean | null
          is_criticality?: boolean | null
          is_integrity?: boolean | null
          is_reliability?: boolean | null
          is_sce?: boolean | null
          maker_no?: string | null
          manufacturer_id?: number | null
          model?: string | null
          sce_id?: number | null
          serial_number?: string | null
          specification?: string | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          area_id?: number | null
          asset_class_id?: number | null
          asset_id?: number | null
          asset_image_path?: string | null
          bom_id?: number | null
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          criticality_id?: number | null
          drawing_no?: string | null
          ex_certificate?: string | null
          ex_class?: string | null
          hs_code?: string | null
          id?: number
          iot_sensor_id?: number | null
          is_active?: boolean | null
          is_criticality?: boolean | null
          is_integrity?: boolean | null
          is_reliability?: boolean | null
          is_sce?: boolean | null
          maker_no?: string | null
          manufacturer_id?: number | null
          model?: string | null
          sce_id?: number | null
          serial_number?: string | null
          specification?: string | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_asset_detail_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: true
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_detail_asset_sce_id_fkey"
            columns: ["sce_id"]
            isOneToOne: false
            referencedRelation: "e_asset_sce"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_detail_bom_id_fkey"
            columns: ["bom_id"]
            isOneToOne: false
            referencedRelation: "e_bom_assembly"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_asset_detail_criticality_id_fkey"
            columns: ["criticality_id"]
            isOneToOne: false
            referencedRelation: "e_criticality"
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
          detection_system_class_id: number | null
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
          detection_system_class_id?: number | null
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
          detection_system_class_id?: number | null
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
            foreignKeyName: "e_asset_installation_e_detection_system_fk"
            columns: ["detection_system_class_id"]
            isOneToOne: false
            referencedRelation: "e_detection_system"
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
          id?: number
          is_active: boolean
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
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
          id?: number
          is_active: boolean
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
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
      e_circuit: {
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
          is_from_new_work_attachment: boolean | null
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
          is_from_new_work_attachment?: boolean | null
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
          is_from_new_work_attachment?: boolean | null
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
          {
            foreignKeyName: "e_cm_defer_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
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
      e_design_fabrication: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Relationships: []
      }
      e_detection_system: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          remark: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          remark: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          remark?: string
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
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
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
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
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
          {
            foreignKeyName: "e_inventory_rack_id_fkey"
            columns: ["rack_id"]
            isOneToOne: false
            referencedRelation: "e_rack"
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
            foreignKeyName: "e_inventory_receive_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          created_at: string | null
          created_by: string | null
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
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
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
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
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
          updated_at?: string | null
          updated_by?: string | null
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
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: number
          item_master_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: number
          item_master_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
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
      e_material_construction: {
        Row: {
          composition: string | null
          created_at: string | null
          created_by: string | null
          id: number
          material_construction_type: number | null
          mts_mpa: number | null
          mys_mpa: number | null
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          composition?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          material_construction_type?: number | null
          mts_mpa?: number | null
          mys_mpa?: number | null
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          composition?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          material_construction_type?: number | null
          mts_mpa?: number | null
          mys_mpa?: number | null
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
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name: string
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Relationships: []
      }
      e_new_work_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          file_path: string | null
          id: number
          is_from_new_work_attachment: boolean | null
          updated_at: string | null
          updated_by: string | null
          work_request_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          is_from_new_work_attachment?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          work_request_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          is_from_new_work_attachment?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
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
          wo_id: number | null
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
          wo_id?: number | null
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
          wo_id?: number | null
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
            foreignKeyName: "e_new_work_request_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
            foreignKeyName: "e_new_work_request_wo_id_fkey"
            columns: ["wo_id"]
            isOneToOne: false
            referencedRelation: "e_work_order"
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
      e_online_monitor_df_scc_sohic: {
        Row: {
          created_at: string
          id: number
          name: string | null
          value: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          value?: number | null
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
      e_pipe_class: {
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
          is_from_pm_schedule: boolean | null
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
          is_from_pm_schedule?: boolean | null
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
          is_from_pm_schedule?: boolean | null
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
          {
            foreignKeyName: "e_pm_defer_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_group: {
        Row: {
          asset_detail_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: never
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: never
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_group_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
        ]
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
          general_maintenances: string[] | null
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
          general_maintenances?: string[] | null
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
          general_maintenances?: string[] | null
          id?: number
          pm_wo_id?: number | null
          sce_result?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
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
          created_at: string | null
          created_by: string | null
          discipline_id: number | null
          due_date: string
          facility_id: number | null
          frequency_id: number
          id: number
          is_active: boolean | null
          is_deleted: boolean | null
          maintenance_id: number | null
          package_id: number | null
          pm_description: string | null
          pm_group_id: number | null
          pm_no: string | null
          pm_sce_group_id: number | null
          priority_id: number | null
          system_id: number | null
          task_id: number | null
          updated_at: string | null
          updated_by: string | null
          work_center_id: number | null
        }
        Insert: {
          asset_id?: number | null
          created_at?: string | null
          created_by?: string | null
          discipline_id?: number | null
          due_date: string
          facility_id?: number | null
          frequency_id: number
          id?: number
          is_active?: boolean | null
          is_deleted?: boolean | null
          maintenance_id?: number | null
          package_id?: number | null
          pm_description?: string | null
          pm_group_id?: number | null
          pm_no?: string | null
          pm_sce_group_id?: number | null
          priority_id?: number | null
          system_id?: number | null
          task_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_center_id?: number | null
        }
        Update: {
          asset_id?: number | null
          created_at?: string | null
          created_by?: string | null
          discipline_id?: number | null
          due_date?: string
          facility_id?: number | null
          frequency_id?: number
          id?: number
          is_active?: boolean | null
          is_deleted?: boolean | null
          maintenance_id?: number | null
          package_id?: number | null
          pm_description?: string | null
          pm_group_id?: number | null
          pm_no?: string | null
          pm_sce_group_id?: number | null
          priority_id?: number | null
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
      e_pm_schedule_additional_info: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          pm_schedule_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          pm_schedule_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          pm_schedule_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_schedule_additional_info_pm_schedule_id_fkey"
            columns: ["pm_schedule_id"]
            isOneToOne: false
            referencedRelation: "e_pm_schedule"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_schedule_checksheet: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          file_path: string | null
          id: number
          is_from_pm_schedule: boolean | null
          pm_schedule_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          is_from_pm_schedule?: boolean | null
          pm_schedule_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          is_from_pm_schedule?: boolean | null
          pm_schedule_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_schedule_checksheet_schedule_fk"
            columns: ["pm_schedule_id"]
            isOneToOne: false
            referencedRelation: "e_pm_schedule"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_schedule_maintainable_group: {
        Row: {
          asset_id: number | null
          created_at: string | null
          created_by: string | null
          group_id: number | null
          id: number
          pm_schedule_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_id?: number | null
          created_at?: string | null
          created_by?: string | null
          group_id?: number | null
          id?: number
          pm_schedule_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_id?: number | null
          created_at?: string | null
          created_by?: string | null
          group_id?: number | null
          id?: number
          pm_schedule_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_schedule_maintainable_group_pm_schedule_id_fkey"
            columns: ["pm_schedule_id"]
            isOneToOne: false
            referencedRelation: "e_pm_schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pm_schedule_maintainable_group_e_asset_fk"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pm_schedule_maintainable_group_e_asset_group_fk"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "e_asset_group"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_schedule_min_acceptance_criteria: {
        Row: {
          created_at: string | null
          created_by: string | null
          criteria: string | null
          field_name: string | null
          id: number
          pm_schedule_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          criteria?: string | null
          field_name?: string | null
          id?: number
          pm_schedule_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          criteria?: string | null
          field_name?: string | null
          id?: number
          pm_schedule_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_schedule_min_acceptance_criteria_schedule_fk"
            columns: ["pm_schedule_id"]
            isOneToOne: false
            referencedRelation: "e_pm_schedule"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_schedule_plan_labour: {
        Row: {
          created_at: string | null
          created_by: string | null
          duration: number | null
          employee_id: number | null
          id: number
          pm_schedule_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          employee_id?: number | null
          id?: number
          pm_schedule_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          employee_id?: number | null
          id?: number
          pm_schedule_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_schedule_plan_labour_employee_fk"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "e_employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_plan_labour_schedule_fk"
            columns: ["pm_schedule_id"]
            isOneToOne: false
            referencedRelation: "e_pm_schedule"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_schedule_plan_material: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          item_id: number | null
          pm_schedule_id: number | null
          quantity: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          item_id?: number | null
          pm_schedule_id?: number | null
          quantity?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          item_id?: number | null
          pm_schedule_id?: number | null
          quantity?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_schedule_plan_material_item_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "e_item_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_plan_material_schedule_fk"
            columns: ["pm_schedule_id"]
            isOneToOne: false
            referencedRelation: "e_pm_schedule"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_schedule_task_detail: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_custom: boolean
          is_deleted: boolean
          is_template_copy: boolean
          original_task_detail_id: number | null
          pm_schedule_id: number | null
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
          sequence?: number | null
          task_list?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_schedule_task_detail_original_fk"
            columns: ["original_task_detail_id"]
            isOneToOne: false
            referencedRelation: "e_task_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_schedule_task_detail_schedule_fk"
            columns: ["pm_schedule_id"]
            isOneToOne: false
            referencedRelation: "e_pm_schedule"
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
      e_pm_wo_generate: {
        Row: {
          created_at: string
          created_by: string | null
          end_date: string | null
          id: number
          is_individual: boolean | null
          pm_schedule_id: number | null
          start_date: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: number
          is_individual?: boolean | null
          pm_schedule_id?: number | null
          start_date?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: number
          is_individual?: boolean | null
          pm_schedule_id?: number | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_wo_generate_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_wo_generate_pm_schedule_id_fkey"
            columns: ["pm_schedule_id"]
            isOneToOne: false
            referencedRelation: "e_pm_schedule"
            referencedColumns: ["id"]
          },
        ]
      }
      e_pm_wo_multiple_generate: {
        Row: {
          created_by: string | null
          due_date: string | null
          end_date: string | null
          frequency_id: number | null
          id: number
          pm_schedule_id: number | null
          start_date: string | null
        }
        Insert: {
          created_by?: string | null
          due_date?: string | null
          end_date?: string | null
          frequency_id?: number | null
          id?: number
          pm_schedule_id?: number | null
          start_date?: string | null
        }
        Update: {
          created_by?: string | null
          due_date?: string | null
          end_date?: string | null
          frequency_id?: number | null
          id?: number
          pm_schedule_id?: number | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_pm_wo_multiple_generate_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_wo_multiple_generate_frequency_id_fkey"
            columns: ["frequency_id"]
            isOneToOne: false
            referencedRelation: "e_frequency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_pm_wo_multiple_generate_pm_schedule_id_fkey"
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
      e_wo_pm_schedule: {
        Row: {
          created_at: string
          created_by: string | null
          due_date: string | null
          id: number
          pm_schedule_id: number | null
          pm_wo_generate: number | null
          wo_id: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: number
          pm_schedule_id?: number | null
          pm_wo_generate?: number | null
          wo_id?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: number
          pm_schedule_id?: number | null
          pm_wo_generate?: number | null
          wo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "e_wo_pm_schedule_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_wo_pm_schedule_pm_schedule_id_fkey"
            columns: ["pm_schedule_id"]
            isOneToOne: false
            referencedRelation: "e_pm_schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_wo_pm_schedule_pm_wo_generate_fkey"
            columns: ["pm_wo_generate"]
            isOneToOne: false
            referencedRelation: "e_pm_wo_generate"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_wo_pm_schedule_wo_id_fkey"
            columns: ["wo_id"]
            isOneToOne: false
            referencedRelation: "e_work_order"
            referencedColumns: ["id"]
          },
        ]
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
          facility_id: number | null
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
          facility_id?: number | null
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
          facility_id?: number | null
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
            foreignKeyName: "e_work_order_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
            foreignKeyName: "e_work_order_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "e_facility"
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
      i_branch_diameter: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Relationships: []
      }
      i_code_sheet: {
        Row: {
          description: string | null
          id: number
          ims_asset_type_id: number
          sheet_name: string
        }
        Insert: {
          description?: string | null
          id?: number
          ims_asset_type_id: number
          sheet_name: string
        }
        Update: {
          description?: string | null
          id?: number
          ims_asset_type_id?: number
          sheet_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "i_code_sheet_ims_asset_type_id_fkey"
            columns: ["ims_asset_type_id"]
            isOneToOne: false
            referencedRelation: "i_ims_asset_type"
            referencedColumns: ["id"]
          },
        ]
      }
      i_corrective_action: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Relationships: []
      }
      i_corrosion_factor: {
        Row: {
          base_material_id: number | null
          co2_concentration: number | null
          created_at: string | null
          fluid_velocity: number | null
          h2s_concentration: number | null
          id: number
          pressure: number | null
          temperature: number | null
          updated_at: string | null
        }
        Insert: {
          base_material_id?: number | null
          co2_concentration?: number | null
          created_at?: string | null
          fluid_velocity?: number | null
          h2s_concentration?: number | null
          id?: number
          pressure?: number | null
          temperature?: number | null
          updated_at?: string | null
        }
        Update: {
          base_material_id?: number | null
          co2_concentration?: number | null
          created_at?: string | null
          fluid_velocity?: number | null
          h2s_concentration?: number | null
          id?: number
          pressure?: number | null
          temperature?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_corrosion_factor_base_material_id_fkey"
            columns: ["base_material_id"]
            isOneToOne: false
            referencedRelation: "i_material_construction"
            referencedColumns: ["id"]
          },
        ]
      }
      i_corrosion_group: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      i_corrosion_monitoring: {
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
      i_corrosion_study: {
        Row: {
          asset_id: number
          co2_presence: boolean | null
          corrosion_factor_id: number | null
          corrosion_group_id: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          expected_external_corrosion_rate: number | null
          expected_internal_corrosion_rate: number | null
          external_damage_mechanism: string | null
          external_environment_id: number | null
          h2s_presence: boolean | null
          id: number
          internal_damage_mechanism: string | null
          material_construction_id: number | null
          monitoring_method_id: number | null
          ph: number | null
          study_code: string | null
          study_name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_id: number
          co2_presence?: boolean | null
          corrosion_factor_id?: number | null
          corrosion_group_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expected_external_corrosion_rate?: number | null
          expected_internal_corrosion_rate?: number | null
          external_damage_mechanism?: string | null
          external_environment_id?: number | null
          h2s_presence?: boolean | null
          id?: number
          internal_damage_mechanism?: string | null
          material_construction_id?: number | null
          monitoring_method_id?: number | null
          ph?: number | null
          study_code?: string | null
          study_name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_id?: number
          co2_presence?: boolean | null
          corrosion_factor_id?: number | null
          corrosion_group_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expected_external_corrosion_rate?: number | null
          expected_internal_corrosion_rate?: number | null
          external_damage_mechanism?: string | null
          external_environment_id?: number | null
          h2s_presence?: boolean | null
          id?: number
          internal_damage_mechanism?: string | null
          material_construction_id?: number | null
          monitoring_method_id?: number | null
          ph?: number | null
          study_code?: string | null
          study_name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_corrosion_study_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_corrosion_study_corrosion_factor_id_fkey"
            columns: ["corrosion_factor_id"]
            isOneToOne: false
            referencedRelation: "i_corrosion_factor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_corrosion_study_corrosion_group_id_fkey"
            columns: ["corrosion_group_id"]
            isOneToOne: false
            referencedRelation: "i_corrosion_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_corrosion_study_external_environment_id_fkey"
            columns: ["external_environment_id"]
            isOneToOne: false
            referencedRelation: "e_ext_env"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_corrosion_study_material_construction_id_fkey"
            columns: ["material_construction_id"]
            isOneToOne: false
            referencedRelation: "i_spec_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_corrosion_study_monitoring_method_id_fkey"
            columns: ["monitoring_method_id"]
            isOneToOne: false
            referencedRelation: "i_corrosion_monitoring"
            referencedColumns: ["id"]
          },
        ]
      }
      i_cyclic_load_type: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
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
          cr_act: number | null
          created_at: string | null
          created_by: string | null
          data_confidence_id: number | null
          dfcuiff: number | null
          i_ims_design_id: number | null
          i_ims_protection_id: number | null
          id: number
          ims_general_id: number | null
          ims_pof_assessment_id: number | null
          ims_rbi_general_id: number | null
          last_inspection_date: string | null
          ncuifa: number | null
          ncuifb: number | null
          ncuifc: number | null
          ncuifd: number | null
          new_coating_date: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          cr_act?: number | null
          created_at?: string | null
          created_by?: string | null
          data_confidence_id?: number | null
          dfcuiff?: number | null
          i_ims_design_id?: number | null
          i_ims_protection_id?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_assessment_id?: number | null
          ims_rbi_general_id?: number | null
          last_inspection_date?: string | null
          ncuifa?: number | null
          ncuifb?: number | null
          ncuifc?: number | null
          ncuifd?: number | null
          new_coating_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          cr_act?: number | null
          created_at?: string | null
          created_by?: string | null
          data_confidence_id?: number | null
          dfcuiff?: number | null
          i_ims_design_id?: number | null
          i_ims_protection_id?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_assessment_id?: number | null
          ims_rbi_general_id?: number | null
          last_inspection_date?: string | null
          ncuifa?: number | null
          ncuifb?: number | null
          ncuifc?: number | null
          ncuifd?: number | null
          new_coating_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_df_cui_i_data_confidence_fk"
            columns: ["data_confidence_id"]
            isOneToOne: false
            referencedRelation: "i_data_confidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_cui_i_ims_design_fk"
            columns: ["i_ims_design_id"]
            isOneToOne: false
            referencedRelation: "i_ims_design"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_cui_i_ims_pof_assessment_general_fk"
            columns: ["ims_pof_assessment_id"]
            isOneToOne: false
            referencedRelation: "i_ims_pof_assessment_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_cui_i_ims_protection_fk"
            columns: ["i_ims_protection_id"]
            isOneToOne: false
            referencedRelation: "i_ims_protection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_cui_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_cui_ims_rbi_general_id_fkey"
            columns: ["ims_rbi_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_rbi_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_df_ext: {
        Row: {
          created_at: string | null
          created_by: string | null
          data_confidence_id: number | null
          dfextcorrf: number | null
          i_ims_design_id: number | null
          i_ims_protection_id: number | null
          id: number
          ims_general_id: number | null
          ims_pof_assessment_id: number | null
          ims_rbi_general_id: number | null
          last_inspection_date: string | null
          new_coating_date: string | null
          nextcorra: number | null
          nextcorrb: number | null
          nextcorrc: number | null
          nextcorrd: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          data_confidence_id?: number | null
          dfextcorrf?: number | null
          i_ims_design_id?: number | null
          i_ims_protection_id?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_assessment_id?: number | null
          ims_rbi_general_id?: number | null
          last_inspection_date?: string | null
          new_coating_date?: string | null
          nextcorra?: number | null
          nextcorrb?: number | null
          nextcorrc?: number | null
          nextcorrd?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          data_confidence_id?: number | null
          dfextcorrf?: number | null
          i_ims_design_id?: number | null
          i_ims_protection_id?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_assessment_id?: number | null
          ims_rbi_general_id?: number | null
          last_inspection_date?: string | null
          new_coating_date?: string | null
          nextcorra?: number | null
          nextcorrb?: number | null
          nextcorrc?: number | null
          nextcorrd?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_df_ext_i_data_confidence_fk"
            columns: ["data_confidence_id"]
            isOneToOne: false
            referencedRelation: "i_data_confidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_ext_i_ims_design_fk"
            columns: ["i_ims_design_id"]
            isOneToOne: false
            referencedRelation: "i_ims_design"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_ext_i_ims_protection_fk"
            columns: ["i_ims_protection_id"]
            isOneToOne: false
            referencedRelation: "i_ims_protection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_ext_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_ext_ims_pof_assessment_id_fkey"
            columns: ["ims_pof_assessment_id"]
            isOneToOne: false
            referencedRelation: "i_ims_pof_assessment_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_ext_ims_rbi_general_id_fkey"
            columns: ["ims_rbi_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_rbi_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_df_ext_clscc: {
        Row: {
          created_at: string | null
          created_by: string | null
          data_confidence_id: number | null
          df_ext_cl_scc: number | null
          i_ims_design_id: number | null
          i_ims_protection_id: number | null
          id: number
          ims_general_id: number | null
          ims_pof_asessment_id: number | null
          ims_rbi_general_id: number | null
          inspection_efficiency_id: number | null
          last_inspection_date: string | null
          new_coating_date: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          data_confidence_id?: number | null
          df_ext_cl_scc?: number | null
          i_ims_design_id?: number | null
          i_ims_protection_id?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_asessment_id?: number | null
          ims_rbi_general_id?: number | null
          inspection_efficiency_id?: number | null
          last_inspection_date?: string | null
          new_coating_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          data_confidence_id?: number | null
          df_ext_cl_scc?: number | null
          i_ims_design_id?: number | null
          i_ims_protection_id?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_asessment_id?: number | null
          ims_rbi_general_id?: number | null
          inspection_efficiency_id?: number | null
          last_inspection_date?: string | null
          new_coating_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_df_ext_clscc_i_data_confidence_fk"
            columns: ["data_confidence_id"]
            isOneToOne: false
            referencedRelation: "i_data_confidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_ext_clscc_i_ims_design_fk"
            columns: ["i_ims_design_id"]
            isOneToOne: false
            referencedRelation: "i_ims_design"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_ext_clscc_i_ims_pof_assessment_general_fk"
            columns: ["ims_pof_asessment_id"]
            isOneToOne: false
            referencedRelation: "i_ims_pof_assessment_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_ext_clscc_i_ims_protection_fk"
            columns: ["i_ims_protection_id"]
            isOneToOne: false
            referencedRelation: "i_ims_protection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_ext_clscc_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_ext_clscc_ims_rbi_general_id_fkey"
            columns: ["ims_rbi_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_rbi_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_ext_clscc_inspection_efficiency_id_fkey"
            columns: ["inspection_efficiency_id"]
            isOneToOne: false
            referencedRelation: "i_inspection_efficiency"
            referencedColumns: ["id"]
          },
        ]
      }
      i_df_mfat: {
        Row: {
          brach_diameter_id: number | null
          corrective_action_id: number | null
          created_at: string | null
          created_by: string | null
          cyclic_load_type_id: number | null
          data_confidence_id: number | null
          dmfatfb: number | null
          id: number
          ims_general_id: number | null
          ims_pof_assessment_id: number | null
          ims_rbi_general_id: number | null
          joint_branch_design_id: number | null
          pipe_complexity_id: number | null
          pipe_condition_id: number | null
          previous_failure_id: number | null
          shaking_frequency_id: number | null
          updated_at: string | null
          updated_by: string | null
          visible_audible_shaking_id: number | null
        }
        Insert: {
          brach_diameter_id?: number | null
          corrective_action_id?: number | null
          created_at?: string | null
          created_by?: string | null
          cyclic_load_type_id?: number | null
          data_confidence_id?: number | null
          dmfatfb?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_assessment_id?: number | null
          ims_rbi_general_id?: number | null
          joint_branch_design_id?: number | null
          pipe_complexity_id?: number | null
          pipe_condition_id?: number | null
          previous_failure_id?: number | null
          shaking_frequency_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          visible_audible_shaking_id?: number | null
        }
        Update: {
          brach_diameter_id?: number | null
          corrective_action_id?: number | null
          created_at?: string | null
          created_by?: string | null
          cyclic_load_type_id?: number | null
          data_confidence_id?: number | null
          dmfatfb?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_assessment_id?: number | null
          ims_rbi_general_id?: number | null
          joint_branch_design_id?: number | null
          pipe_complexity_id?: number | null
          pipe_condition_id?: number | null
          previous_failure_id?: number | null
          shaking_frequency_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          visible_audible_shaking_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "i_df_mfat_i_branch_diameter_fk"
            columns: ["brach_diameter_id"]
            isOneToOne: false
            referencedRelation: "i_branch_diameter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_mfat_i_corrective_action_fk"
            columns: ["corrective_action_id"]
            isOneToOne: false
            referencedRelation: "i_corrective_action"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_mfat_i_cyclic_load_type_fk"
            columns: ["cyclic_load_type_id"]
            isOneToOne: false
            referencedRelation: "i_cyclic_load_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_mfat_i_data_confidence_fk"
            columns: ["data_confidence_id"]
            isOneToOne: false
            referencedRelation: "i_data_confidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_mfat_i_ims_pof_assessment_general_fk"
            columns: ["ims_pof_assessment_id"]
            isOneToOne: false
            referencedRelation: "i_ims_pof_assessment_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_mfat_i_joint_branch_design_fk"
            columns: ["joint_branch_design_id"]
            isOneToOne: false
            referencedRelation: "i_joint_branch_design"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_mfat_i_pipe_complexity_fk"
            columns: ["pipe_complexity_id"]
            isOneToOne: false
            referencedRelation: "i_pipe_complexity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_mfat_i_pipe_condition_fk"
            columns: ["pipe_condition_id"]
            isOneToOne: false
            referencedRelation: "i_pipe_condition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_mfat_i_previous_failure_fk"
            columns: ["previous_failure_id"]
            isOneToOne: false
            referencedRelation: "i_previous_failure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_mfat_i_shaking_frequency_fk"
            columns: ["shaking_frequency_id"]
            isOneToOne: false
            referencedRelation: "i_shaking_frequency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_mfat_i_visible_audio_shaking_fk"
            columns: ["visible_audible_shaking_id"]
            isOneToOne: false
            referencedRelation: "i_visible_audio_shaking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_mfat_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_mfat_ims_rbi_general_id_fkey"
            columns: ["ims_rbi_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_rbi_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_df_scc_scc: {
        Row: {
          created_at: string | null
          created_by: string | null
          df_scc_scc: number | null
          dfsccfb: number | null
          h2s_in_water: number | null
          hardness_brinnel: number | null
          id: number
          ims_general_id: number | null
          ims_pof_assessment_id: number | null
          ims_rbi_general_id: number | null
          inspection_efficiency_id: number | null
          last_inspection_date: string | null
          ph: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          df_scc_scc?: number | null
          dfsccfb?: number | null
          h2s_in_water?: number | null
          hardness_brinnel?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_assessment_id?: number | null
          ims_rbi_general_id?: number | null
          inspection_efficiency_id?: number | null
          last_inspection_date?: string | null
          ph?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          df_scc_scc?: number | null
          dfsccfb?: number | null
          h2s_in_water?: number | null
          hardness_brinnel?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_assessment_id?: number | null
          ims_rbi_general_id?: number | null
          inspection_efficiency_id?: number | null
          last_inspection_date?: string | null
          ph?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_df_scc_scc_i_inspection_efficiency_fk"
            columns: ["inspection_efficiency_id"]
            isOneToOne: false
            referencedRelation: "i_inspection_efficiency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_scc_scc_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_scc_scc_ims_pof_assessment_id_fkey"
            columns: ["ims_pof_assessment_id"]
            isOneToOne: false
            referencedRelation: "i_ims_pof_assessment_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_scc_scc_ims_rbi_general_id_fkey"
            columns: ["ims_rbi_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_rbi_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_df_scc_sohic: {
        Row: {
          created_at: string | null
          created_by: string | null
          dfscc_sohic: number | null
          h2s_in_water: number | null
          harness_brinnel: number | null
          i_ims_protection_id: number | null
          id: number
          ims_general_id: number | null
          ims_pof_assessment_id: number | null
          ims_rbi_general_id: number | null
          inspection_efficiency_id: number | null
          last_inspection_date: string | null
          ph: number | null
          steelscontent_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          dfscc_sohic?: number | null
          h2s_in_water?: number | null
          harness_brinnel?: number | null
          i_ims_protection_id?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_assessment_id?: number | null
          ims_rbi_general_id?: number | null
          inspection_efficiency_id?: number | null
          last_inspection_date?: string | null
          ph?: number | null
          steelscontent_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          dfscc_sohic?: number | null
          h2s_in_water?: number | null
          harness_brinnel?: number | null
          i_ims_protection_id?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_assessment_id?: number | null
          ims_rbi_general_id?: number | null
          inspection_efficiency_id?: number | null
          last_inspection_date?: string | null
          ph?: number | null
          steelscontent_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_df_scc_sohic_i_ims_pof_assessment_general_fk"
            columns: ["ims_pof_assessment_id"]
            isOneToOne: false
            referencedRelation: "i_ims_pof_assessment_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_scc_sohic_i_ims_protection_fk"
            columns: ["i_ims_protection_id"]
            isOneToOne: false
            referencedRelation: "i_ims_protection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_scc_sohic_i_inspection_efficiency_fk"
            columns: ["inspection_efficiency_id"]
            isOneToOne: false
            referencedRelation: "i_inspection_efficiency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_scc_sohic_i_steelscontent_fk"
            columns: ["steelscontent_id"]
            isOneToOne: false
            referencedRelation: "i_steelscontent"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_scc_sohic_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_scc_sohic_ims_rbi_general_id_fkey"
            columns: ["ims_rbi_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_rbi_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_df_thin: {
        Row: {
          agerc: string | null
          cr_act: number | null
          data_confidence_id: number | null
          dfthinfb: number | null
          i_ims_design_id: number | null
          id: number
          ims_general_id: number | null
          ims_pof_assessment_id: number | null
          ims_rbi_general_id: number | null
          last_inspection_date: string | null
          nthin_a: number | null
          nthin_b: number | null
          nthin_c: number | null
          nthin_d: number | null
        }
        Insert: {
          agerc?: string | null
          cr_act?: number | null
          data_confidence_id?: number | null
          dfthinfb?: number | null
          i_ims_design_id?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_assessment_id?: number | null
          ims_rbi_general_id?: number | null
          last_inspection_date?: string | null
          nthin_a?: number | null
          nthin_b?: number | null
          nthin_c?: number | null
          nthin_d?: number | null
        }
        Update: {
          agerc?: string | null
          cr_act?: number | null
          data_confidence_id?: number | null
          dfthinfb?: number | null
          i_ims_design_id?: number | null
          id?: number
          ims_general_id?: number | null
          ims_pof_assessment_id?: number | null
          ims_rbi_general_id?: number | null
          last_inspection_date?: string | null
          nthin_a?: number | null
          nthin_b?: number | null
          nthin_c?: number | null
          nthin_d?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "i_df_thin_i_data_confidence_fk"
            columns: ["data_confidence_id"]
            isOneToOne: false
            referencedRelation: "i_data_confidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_thin_i_ims_design_id_fkey"
            columns: ["i_ims_design_id"]
            isOneToOne: false
            referencedRelation: "i_ims_design"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_thin_i_ims_pof_assessment_general_fk"
            columns: ["ims_pof_assessment_id"]
            isOneToOne: false
            referencedRelation: "i_ims_pof_assessment_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_thin_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_df_thin_ims_rbi_general_id_fkey"
            columns: ["ims_rbi_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_rbi_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_env_severity: {
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
      i_header_master: {
        Row: {
          code_sheet_id: number
          header_label: string
          header_value: number
          id: number
        }
        Insert: {
          code_sheet_id: number
          header_label: string
          header_value: number
          id?: number
        }
        Update: {
          code_sheet_id?: number
          header_label?: string
          header_value?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "i_header_master_code_sheet_id_fkey"
            columns: ["code_sheet_id"]
            isOneToOne: false
            referencedRelation: "i_code_sheet"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_asset_type: {
        Row: {
          code: string | null
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      i_ims_attachment: {
        Row: {
          asset_detail_id: number | null
          attachment_path: string | null
          created_at: string | null
          created_by: string | null
          id: number
          remark: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          attachment_path?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          attachment_path?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_ims_pv_attachment_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_cof_assessment_cof_area: {
        Row: {
          asset_detail_id: number | null
          ca_cmdflam: number | null
          ca_injflam: number | null
          created_at: string | null
          created_by: string | null
          det_sys_id: number | null
          id: number
          ideal_gas_specific_heat_eq: number | null
          ims_general_id: number | null
          ims_rbi_general_id: number | null
          ims_service_id: number | null
          iso_sys_id: number | null
          mitigation_system_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          ca_cmdflam?: number | null
          ca_injflam?: number | null
          created_at?: string | null
          created_by?: string | null
          det_sys_id?: number | null
          id?: number
          ideal_gas_specific_heat_eq?: number | null
          ims_general_id?: number | null
          ims_rbi_general_id?: number | null
          ims_service_id?: number | null
          iso_sys_id?: number | null
          mitigation_system_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          ca_cmdflam?: number | null
          ca_injflam?: number | null
          created_at?: string | null
          created_by?: string | null
          det_sys_id?: number | null
          id?: number
          ideal_gas_specific_heat_eq?: number | null
          ims_general_id?: number | null
          ims_rbi_general_id?: number | null
          ims_service_id?: number | null
          iso_sys_id?: number | null
          mitigation_system_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_ims_cof_assessment_cof_area_ims_rbi_general_id_fkey"
            columns: ["ims_rbi_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_rbi_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_cof_asssessment_cof_area_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_cof_asssessment_cof_area_e_detection_system_fk"
            columns: ["det_sys_id"]
            isOneToOne: false
            referencedRelation: "e_detection_system"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_cof_asssessment_cof_area_e_isolation_system_fk"
            columns: ["iso_sys_id"]
            isOneToOne: false
            referencedRelation: "e_isolation_system"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_cof_asssessment_cof_area_e_mitigation_system_fk"
            columns: ["mitigation_system_id"]
            isOneToOne: false
            referencedRelation: "e_mitigation_system"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_cof_asssessment_cof_area_i_ims_service_fk"
            columns: ["ims_service_id"]
            isOneToOne: false
            referencedRelation: "i_ims_service"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_cof_asssessment_cof_area_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_cof_assessment_cof_prod: {
        Row: {
          asset_detail_id: number | null
          created_at: string | null
          created_by: string | null
          envcost: number | null
          fc: number | null
          fcenviron: number | null
          fracevap: number | null
          id: number
          ims_general_id: number | null
          ims_rbi_general_id: number | null
          injcost: number | null
          outagemult: number | null
          updated_at: string | null
          updated_by: string | null
          volenv: number | null
        }
        Insert: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          envcost?: number | null
          fc?: number | null
          fcenviron?: number | null
          fracevap?: number | null
          id?: number
          ims_general_id?: number | null
          ims_rbi_general_id?: number | null
          injcost?: number | null
          outagemult?: number | null
          updated_at?: string | null
          updated_by?: string | null
          volenv?: number | null
        }
        Update: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          envcost?: number | null
          fc?: number | null
          fcenviron?: number | null
          fracevap?: number | null
          id?: number
          ims_general_id?: number | null
          ims_rbi_general_id?: number | null
          injcost?: number | null
          outagemult?: number | null
          updated_at?: string | null
          updated_by?: string | null
          volenv?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "i_ims_cof_assessment_cof_prod_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_cof_assessment_cof_prod_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_cof_assessment_cof_prod_ims_rbi_general_id_fkey"
            columns: ["ims_rbi_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_rbi_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_design: {
        Row: {
          allowable_stress_mpa: number | null
          asset_detail_id: number | null
          corrosion_allowance: number | null
          created_at: string | null
          created_by: string | null
          dead_legs: boolean | null
          design_pressure: number | null
          design_temperature: number | null
          ext_env_id: number | null
          geometry_id: number | null
          id: number
          ims_asset_type_id: number | null
          ims_general_id: number | null
          internal_diameter: number | null
          length: number | null
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
          design_pressure?: number | null
          design_temperature?: number | null
          ext_env_id?: number | null
          geometry_id?: number | null
          id?: number
          ims_asset_type_id?: number | null
          ims_general_id?: number | null
          internal_diameter?: number | null
          length?: number | null
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
          design_pressure?: number | null
          design_temperature?: number | null
          ext_env_id?: number | null
          geometry_id?: number | null
          id?: number
          ims_asset_type_id?: number | null
          ims_general_id?: number | null
          internal_diameter?: number | null
          length?: number | null
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
        Relationships: [
          {
            foreignKeyName: "i_ims_design_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_design_e_ext_env_fk"
            columns: ["ext_env_id"]
            isOneToOne: false
            referencedRelation: "e_ext_env"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_design_e_geometry_fk"
            columns: ["geometry_id"]
            isOneToOne: false
            referencedRelation: "e_geometry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_design_ims_asset_type_id_fkey"
            columns: ["ims_asset_type_id"]
            isOneToOne: false
            referencedRelation: "i_ims_asset_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_design_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_general: {
        Row: {
          asset_detail_id: number | null
          circuit_id: number | null
          clad_thickness: number | null
          cladding: boolean | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          ims_asset_type_id: number | null
          inner_diameter: number | null
          insulation: boolean | null
          internal_lining: boolean | null
          line_h2s: boolean | null
          line_no: string | null
          material_construction_id: number | null
          nominal_bore_diameter: number | null
          normal_wall_thickness: number | null
          outer_diameter: number | null
          pipe_class_id: number | null
          pipe_schedule_id: number | null
          pressure_rating: number | null
          pwht: boolean | null
          tmin: string | null
          updated_at: string | null
          updated_by: string | null
          year_in_service: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          circuit_id?: number | null
          clad_thickness?: number | null
          cladding?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          ims_asset_type_id?: number | null
          inner_diameter?: number | null
          insulation?: boolean | null
          internal_lining?: boolean | null
          line_h2s?: boolean | null
          line_no?: string | null
          material_construction_id?: number | null
          nominal_bore_diameter?: number | null
          normal_wall_thickness?: number | null
          outer_diameter?: number | null
          pipe_class_id?: number | null
          pipe_schedule_id?: number | null
          pressure_rating?: number | null
          pwht?: boolean | null
          tmin?: string | null
          updated_at?: string | null
          updated_by?: string | null
          year_in_service?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          circuit_id?: number | null
          clad_thickness?: number | null
          cladding?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          ims_asset_type_id?: number | null
          inner_diameter?: number | null
          insulation?: boolean | null
          internal_lining?: boolean | null
          line_h2s?: boolean | null
          line_no?: string | null
          material_construction_id?: number | null
          nominal_bore_diameter?: number | null
          normal_wall_thickness?: number | null
          outer_diameter?: number | null
          pipe_class_id?: number | null
          pipe_schedule_id?: number | null
          pressure_rating?: number | null
          pwht?: boolean | null
          tmin?: string | null
          updated_at?: string | null
          updated_by?: string | null
          year_in_service?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_ims_general_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_general_e_circuit_id_fk"
            columns: ["circuit_id"]
            isOneToOne: false
            referencedRelation: "e_circuit"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_general_e_pipe_class_fk"
            columns: ["pipe_class_id"]
            isOneToOne: false
            referencedRelation: "e_pipe_class"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_general_e_pipe_schedule_fk"
            columns: ["pipe_schedule_id"]
            isOneToOne: false
            referencedRelation: "e_pipe_schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_general_i_ims_asset_type_fk"
            columns: ["ims_asset_type_id"]
            isOneToOne: false
            referencedRelation: "i_ims_asset_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_general_material_construction_id_fkey"
            columns: ["material_construction_id"]
            isOneToOne: false
            referencedRelation: "i_spec_master"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_inspection: {
        Row: {
          asset_detail_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          ims_general_id: number | null
          inspection_plan: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          ims_general_id?: number | null
          inspection_plan?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          ims_general_id?: number | null
          inspection_plan?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_ims_inspection_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_inspection_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_inspection_attachment: {
        Row: {
          asset_detail_id: number | null
          attachment_path: string | null
          created_at: string | null
          created_by: string | null
          id: number
          ims_inspection_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          attachment_path?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          ims_inspection_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          attachment_path?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          ims_inspection_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_ims_inspection_attachment_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_inspection_attachment_i_ims_inspection_fk"
            columns: ["ims_inspection_id"]
            isOneToOne: false
            referencedRelation: "i_ims_inspection"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_pof_assessment_general: {
        Row: {
          asset_detail_id: number | null
          cladding: boolean | null
          coating_quality_id: number | null
          created_at: string | null
          created_by: string | null
          current_thickness: number | null
          data_confidence_id: number | null
          description: string | null
          id: number
          ims_general_id: number | null
          ims_rbi_general_id: number | null
          nominal_thickness: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          cladding?: boolean | null
          coating_quality_id?: number | null
          created_at?: string | null
          created_by?: string | null
          current_thickness?: number | null
          data_confidence_id?: number | null
          description?: string | null
          id?: number
          ims_general_id?: number | null
          ims_rbi_general_id?: number | null
          nominal_thickness?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          cladding?: boolean | null
          coating_quality_id?: number | null
          created_at?: string | null
          created_by?: string | null
          current_thickness?: number | null
          data_confidence_id?: number | null
          description?: string | null
          id?: number
          ims_general_id?: number | null
          ims_rbi_general_id?: number | null
          nominal_thickness?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_ims_pof_assessment_general_data_confidence_id_fkey"
            columns: ["data_confidence_id"]
            isOneToOne: false
            referencedRelation: "i_data_confidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_pof_assessment_general_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_pof_assessment_general_e_coating_quality_fk"
            columns: ["coating_quality_id"]
            isOneToOne: false
            referencedRelation: "e_coating_quality"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_pof_assessment_general_i_ims_general_fk"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_pof_assessment_general_ims_rbi_general_id_fkey"
            columns: ["ims_rbi_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_rbi_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_protection: {
        Row: {
          asset_detail_id: number | null
          coating_quality_id: number | null
          created_at: string | null
          created_by: string | null
          design_fabrication_id: number | null
          detection_system_id: number | null
          id: number
          ims_asset_type_id: number | null
          ims_general_id: number | null
          insulation_complexity_id: number | null
          insulation_condition_id: number | null
          insulation_type_id: number | null
          interface_id: number | null
          isolation_system_id: number | null
          line_description: string | null
          lining_condition: string | null
          lining_monitoring: string | null
          lining_type: string | null
          minimum_thickness: number | null
          mitigation_system_id: number | null
          online_monitor: number | null
          post_weld_heat_treatment: number | null
          replacement_line: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          coating_quality_id?: number | null
          created_at?: string | null
          created_by?: string | null
          design_fabrication_id?: number | null
          detection_system_id?: number | null
          id?: number
          ims_asset_type_id?: number | null
          ims_general_id?: number | null
          insulation_complexity_id?: number | null
          insulation_condition_id?: number | null
          insulation_type_id?: number | null
          interface_id?: number | null
          isolation_system_id?: number | null
          line_description?: string | null
          lining_condition?: string | null
          lining_monitoring?: string | null
          lining_type?: string | null
          minimum_thickness?: number | null
          mitigation_system_id?: number | null
          online_monitor?: number | null
          post_weld_heat_treatment?: number | null
          replacement_line?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          coating_quality_id?: number | null
          created_at?: string | null
          created_by?: string | null
          design_fabrication_id?: number | null
          detection_system_id?: number | null
          id?: number
          ims_asset_type_id?: number | null
          ims_general_id?: number | null
          insulation_complexity_id?: number | null
          insulation_condition_id?: number | null
          insulation_type_id?: number | null
          interface_id?: number | null
          isolation_system_id?: number | null
          line_description?: string | null
          lining_condition?: string | null
          lining_monitoring?: string | null
          lining_type?: string | null
          minimum_thickness?: number | null
          mitigation_system_id?: number | null
          online_monitor?: number | null
          post_weld_heat_treatment?: number | null
          replacement_line?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_ims_protection_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_protection_e_coating_quality_fk"
            columns: ["coating_quality_id"]
            isOneToOne: false
            referencedRelation: "e_coating_quality"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_protection_e_design_fabrication_fk"
            columns: ["design_fabrication_id"]
            isOneToOne: false
            referencedRelation: "e_design_fabrication"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_protection_e_detection_system_fk"
            columns: ["detection_system_id"]
            isOneToOne: false
            referencedRelation: "e_detection_system"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_protection_e_insulation_type_fk"
            columns: ["insulation_type_id"]
            isOneToOne: false
            referencedRelation: "e_insulation_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_protection_e_interface_fk"
            columns: ["interface_id"]
            isOneToOne: false
            referencedRelation: "e_interface"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_protection_e_isolation_system_fk"
            columns: ["isolation_system_id"]
            isOneToOne: false
            referencedRelation: "e_isolation_system"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_protection_e_mitigation_system_fk"
            columns: ["mitigation_system_id"]
            isOneToOne: false
            referencedRelation: "e_mitigation_system"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_protection_e_online_monitor_fk"
            columns: ["online_monitor"]
            isOneToOne: false
            referencedRelation: "e_online_monitor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_protection_i_insulation_complexity_fk"
            columns: ["insulation_complexity_id"]
            isOneToOne: false
            referencedRelation: "i_insulation_complexity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_protection_ims_asset_type_id_fkey"
            columns: ["ims_asset_type_id"]
            isOneToOne: false
            referencedRelation: "i_ims_asset_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_protection_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_protection_insulation_condition_id_fkey"
            columns: ["insulation_condition_id"]
            isOneToOne: false
            referencedRelation: "i_insulation_condition"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_rbi_general: {
        Row: {
          asset_detail_id: number | null
          created_at: string
          i_ims_design: number | null
          i_ims_general_id: number | null
          id: number
          rbi_no: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          created_at?: string
          i_ims_design?: number | null
          i_ims_general_id?: number | null
          id?: number
          rbi_no?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          created_at?: string
          i_ims_design?: number | null
          i_ims_general_id?: number | null
          id?: number
          rbi_no?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_ims_rbi_general_asset_detail_id_fkey"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_rbi_general_i_ims_design_fkey"
            columns: ["i_ims_design"]
            isOneToOne: false
            referencedRelation: "i_ims_design"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_rbi_general_i_ims_general_id_fkey"
            columns: ["i_ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_rbi_risk_irp: {
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
          ims_general_id: number | null
          ims_rbi_general_id: number | null
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
          ims_general_id?: number | null
          ims_rbi_general_id?: number | null
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
          ims_general_id?: number | null
          ims_rbi_general_id?: number | null
          pof?: number | null
          pof_value?: number | null
          risk_level?: number | null
          risk_ranking?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_ims_rbi_risk_irp_asset_detail_id_fkey"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_rbi_risk_irp_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_rbi_risk_irp_ims_rbi_general_id_fkey"
            columns: ["ims_rbi_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_rbi_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_risk_irp: {
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
          rbi_risk_irp_id: number | null
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
          rbi_risk_irp_id?: number | null
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
          rbi_risk_irp_id?: number | null
          risk_level?: number | null
          risk_ranking?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_ims_risk__irp_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_risk_irp_i_ims_rbi_risk_irp_fk"
            columns: ["rbi_risk_irp_id"]
            isOneToOne: false
            referencedRelation: "i_ims_rbi_risk_irp"
            referencedColumns: ["id"]
          },
        ]
      }
      i_ims_service: {
        Row: {
          asset_detail_id: number | null
          created_at: string | null
          created_by: string | null
          fluid_phase_id: number | null
          fluid_representive_id: number | null
          id: number
          ims_asset_type_id: number | null
          ims_general_id: number | null
          toxic_mass_fraction: number | null
          toxicity_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          fluid_phase_id?: number | null
          fluid_representive_id?: number | null
          id?: number
          ims_asset_type_id?: number | null
          ims_general_id?: number | null
          toxic_mass_fraction?: number | null
          toxicity_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          fluid_phase_id?: number | null
          fluid_representive_id?: number | null
          id?: number
          ims_asset_type_id?: number | null
          ims_general_id?: number | null
          toxic_mass_fraction?: number | null
          toxicity_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_ims_service_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_service_e_fluid_phase_fk"
            columns: ["fluid_phase_id"]
            isOneToOne: false
            referencedRelation: "e_fluid_phase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_service_e_fluid_representive_fk"
            columns: ["fluid_representive_id"]
            isOneToOne: false
            referencedRelation: "e_fluid_representive"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_service_e_toxicity_fk"
            columns: ["toxicity_id"]
            isOneToOne: false
            referencedRelation: "e_toxicity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_service_ims_asset_type_id_fkey"
            columns: ["ims_asset_type_id"]
            isOneToOne: false
            referencedRelation: "i_ims_asset_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_ims_service_ims_general_id_fkey"
            columns: ["ims_general_id"]
            isOneToOne: false
            referencedRelation: "i_ims_general"
            referencedColumns: ["id"]
          },
        ]
      }
      i_inspection_data: {
        Row: {
          asset_detail_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          inspection_request: string | null
          inspection_strategy: string | null
          is_active: boolean
          ltcr: number | null
          remaining_life: number | null
          stcr: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          inspection_request?: string | null
          inspection_strategy?: string | null
          is_active: boolean
          ltcr?: number | null
          remaining_life?: number | null
          stcr?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          inspection_request?: string | null
          inspection_strategy?: string | null
          is_active?: boolean
          ltcr?: number | null
          remaining_life?: number | null
          stcr?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_inspection_data_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["asset_id"]
          },
        ]
      }
      i_inspection_efficiency: {
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
      i_insulation_complexity: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Relationships: []
      }
      i_insulation_condition: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Relationships: []
      }
      i_inventory_group: {
        Row: {
          asset_detail_id: number
          component_inventory: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          equipment_volume: number | null
          group_name: string | null
          group_type: string | null
          id: number
          is_status: boolean
          representative_component: string | null
          total_inventory: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_detail_id: number
          component_inventory?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          equipment_volume?: number | null
          group_name?: string | null
          group_type?: string | null
          id?: number
          is_status?: boolean
          representative_component?: string | null
          total_inventory?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_detail_id?: number
          component_inventory?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          equipment_volume?: number | null
          group_name?: string | null
          group_type?: string | null
          id?: number
          is_status?: boolean
          representative_component?: string | null
          total_inventory?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "i_inventory_group_asset_detail_id_fkey"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset"
            referencedColumns: ["id"]
          },
        ]
      }
      i_joint_branch_design: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
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
      i_material_construction: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      i_pipe_complexity: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Relationships: []
      }
      i_pipe_condition: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Relationships: []
      }
      i_previous_failure: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Relationships: []
      }
      i_shaking_frequency: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Relationships: []
      }
      i_spec_header_value: {
        Row: {
          cell_value: number | null
          header_id: number
          spec_id: number
        }
        Insert: {
          cell_value?: number | null
          header_id: number
          spec_id: number
        }
        Update: {
          cell_value?: number | null
          header_id?: number
          spec_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "i_spec_header_value_header_id_fkey"
            columns: ["header_id"]
            isOneToOne: false
            referencedRelation: "i_header_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i_spec_header_value_spec_id_fkey"
            columns: ["spec_id"]
            isOneToOne: false
            referencedRelation: "i_spec_master"
            referencedColumns: ["id"]
          },
        ]
      }
      i_spec_master: {
        Row: {
          code_sheet_id: number
          id: number
          spec_code: string
        }
        Insert: {
          code_sheet_id: number
          id?: number
          spec_code: string
        }
        Update: {
          code_sheet_id?: number
          id?: number
          spec_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "i_spec_master_code_sheet_id_fkey"
            columns: ["code_sheet_id"]
            isOneToOne: false
            referencedRelation: "i_code_sheet"
            referencedColumns: ["id"]
          },
        ]
      }
      i_steelscontent: {
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
      i_visible_audio_shaking: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          description: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          updated_at: string
          user_type_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          updated_at?: string
          user_type_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          updated_at?: string
          user_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_type_id_fkey"
            columns: ["user_type_id"]
            isOneToOne: false
            referencedRelation: "user_type"
            referencedColumns: ["id"]
          },
        ]
      }
      r_rms_uptime: {
        Row: {
          asset_code: string | null
          asset_detail_id: number | null
          created_at: string | null
          created_by: string | null
          date: string | null
          description: string | null
          id: number
          planned_shutdown: number | null
          unplanned_shutdown: number | null
          updated_at: string | null
          updated_by: string | null
          uptime: number | null
        }
        Insert: {
          asset_code?: string | null
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          id?: number
          planned_shutdown?: number | null
          unplanned_shutdown?: number | null
          updated_at?: string | null
          updated_by?: string | null
          uptime?: number | null
        }
        Update: {
          asset_code?: string | null
          asset_detail_id?: number | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          id?: number
          planned_shutdown?: number | null
          unplanned_shutdown?: number | null
          updated_at?: string | null
          updated_by?: string | null
          uptime?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "r_rms_uptime_e_asset_detail_fk"
            columns: ["asset_detail_id"]
            isOneToOne: false
            referencedRelation: "e_asset_detail"
            referencedColumns: ["id"]
          },
        ]
      }
      user_projects: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          project_id: number
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          project_id: number
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          project_id?: number
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "e_project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_type: {
        Row: {
          created_by: string | null
          created_when: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string | null
          priority: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_by?: string | null
          created_when?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string | null
          priority?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_by?: string | null
          created_when?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string | null
          priority?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      work_order_sequence: {
        Row: {
          current_number: number | null
          year: number
        }
        Insert: {
          current_number?: number | null
          year: number
        }
        Update: {
          current_number?: number | null
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
      admin_create_user: {
        Args: {
          user_email: string
          user_full_name: string
          user_type_id: string
        }
        Returns: Json
      }
      admin_update_user_password: {
        Args: { user_id: string; new_password: string }
        Returns: undefined
      }
      assign_user_to_project: {
        Args: { p_user_id: string; p_project_id: number }
        Returns: undefined
      }
      create_admin_user: {
        Args: {
          user_email: string
          user_password: string
          user_full_name: string
        }
        Returns: Json
      }
      direct_query: {
        Args: { query_text: string }
        Returns: Json
      }
      func_five: {
        Args: {
          p_new_work_order_id: number
          p_pm_work_order_id: number
          p_pm_schedule_id: number
          p_wo_pm_schedule_id: number
          p_next_due_date: string
        }
        Returns: undefined
      }
      func_four: {
        Args: { p_frequency_id: number; p_due_date: string }
        Returns: string
      }
      func_many_one: {
        Args: {
          p_created_by: string
          p_start_date: string
          p_end_date: string
          p_pm_schedule_id: number
        }
        Returns: number
      }
      func_many_three: {
        Args: { p_frequency_id: number; p_due_date: string }
        Returns: string
      }
      func_many_two: {
        Args: {
          p_pm_schedule_id: number
          p_generate_id: number
          p_created_by: string
          p_due_date: string
        }
        Returns: undefined
      }
      func_one: {
        Args: { p_schedule_id: number; p_created_by: string }
        Returns: {
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
        }[]
      }
      func_three: {
        Args: {
          p_created_by: string
          p_task_id: number
          p_asset_id: number
          p_description: string
          p_due_date: string
          p_pm_work_order_id: number
          p_facility_id: number
        }
        Returns: number
      }
      func_two: {
        Args: { v_pm_wo_id: number; v_pm_schedule_id: number }
        Returns: undefined
      }
      get_project_assigned_users: {
        Args: { p_project_id: number }
        Returns: {
          id: string
          email: string
          full_name: string
          avatar_url: string
        }[]
      }
      get_table_columns: {
        Args: { param_table_name: string }
        Returns: {
          column_name: string
          data_type: string
          is_nullable: boolean
        }[]
      }
      get_user_assigned_projects: {
        Args: { p_user_id: string }
        Returns: {
          id: number
          project_name: string
          project_code: string
          short_name: string
          project_purpose: string
        }[]
      }
      get_users_for_project_assignment: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          full_name: string
          avatar_url: string
          user_type_id: string
        }[]
      }
      get_users_with_details: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          full_name: string
          user_type_id: string
          user_type: Json
          created_at: string
          updated_at: string
          avatar_url: string
          is_active: boolean
          is_deleted: boolean
          project_assignments: Json
        }[]
      }
      get_users_with_types: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          full_name: string
          user_type_id: string
          user_type: Json
          created_at: string
          updated_at: string
          avatar_url: string
        }[]
      }
      handle_adjustment_inventory: {
        Args: {
          p_inventory_id: number
          p_quantity: number
          p_adjustment_type_id: number
          p_adjustment_category_id: number
          p_created_by: string
          p_remark: string
          p_created_at: string
        }
        Returns: undefined
      }
      handle_issue_inventory: {
        Args: {
          p_inventory_id: number
          p_quantity: number
          p_work_order_no: number
          p_created_by: string
          p_remark: string
          p_created_at: string
        }
        Returns: undefined
      }
      handle_receive_inventory: {
        Args: {
          p_inventory_id: number
          p_received_quantity: number
          p_unit_price: number
          p_po_receive_no: string
          p_created_by: string
          p_created_at: string
          p_remark: string
        }
        Returns: Json
      }
      handle_return_inventory: {
        Args: {
          p_inventory_id: number
          p_quantity: number
          p_work_order_no: number
          p_created_by: string
          p_remark: string
          p_created_at: string
        }
        Returns: undefined
      }
      handle_transfer_inventory: {
        Args: {
          p_source_inventory_id: number
          p_destination_store_id: number
          p_quantity: number
          p_transfer_reason: string
          p_employee_id: number
          p_created_by: string
          p_remark: string
          p_created_at: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      remove_user_from_project: {
        Args: { p_user_id: string; p_project_id: number }
        Returns: undefined
      }
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
