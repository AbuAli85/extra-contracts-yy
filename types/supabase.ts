export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          content_english: string
          content_spanish: string
          contract_name: string
          contract_type: string
          contract_value: number | null
          created_at: string
          effective_date: string | null
          id: string
          is_archived: boolean
          is_template: boolean
          party_a_id: string
          party_b_id: string
          payment_terms: string | null
          promoter_id: string | null
          status: Database["public"]["Enums"]["contract_status"]
          termination_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_english: string
          content_spanish: string
          contract_name: string
          contract_type: string
          contract_value?: number | null
          created_at?: string
          effective_date?: string | null
          id?: string
          is_archived?: boolean
          is_template?: boolean
          party_a_id: string
          party_b_id: string
          payment_terms?: string | null
          promoter_id?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          termination_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_english?: string
          content_spanish?: string
          contract_name?: string
          contract_type?: string
          contract_value?: number | null
          created_at?: string
          effective_date?: string | null
          id?: string
          is_archived?: boolean
          is_template?: boolean
          party_a_id?: string
          party_b_id?: string
          payment_terms?: string | null
          promoter_id?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          termination_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_party_a_id_fkey"
            columns: ["party_a_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_party_b_id_fkey"
            columns: ["party_b_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      parties: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
          type: Database["public"]["Enums"]["party_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
          type: Database["public"]["Enums"]["party_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["party_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      promoters: {
        Row: {
          company_name: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
          profile_picture_url: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
          profile_picture_url?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          profile_picture_url?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promoters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_analytics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_contracts: number
          active_contracts: number
          pending_review_contracts: number
          total_parties: number
          total_promoters: number
        }[]
      }
    }
    Enums: {
      contract_status: "Draft" | "Pending Review" | "Active" | "Archived" | "Terminated"
      party_type: "Individual" | "Company"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<PublicTableName extends keyof PublicSchema["Tables"] | keyof PublicSchema["Views"]> =
  PublicTableName extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableName]["Row"]
    : PublicTableName extends keyof PublicSchema["Views"]
      ? PublicSchema["Views"][PublicTableName]["Row"]
      : never

export type TablesInsert<PublicTableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][PublicTableName]["Insert"]

export type TablesUpdate<PublicTableName extends keyof PublicSchema["Tables"]> =
  PublicTableName extends keyof PublicSchema["Tables"] ? PublicSchema["Tables"][PublicTableName]["Update"] : never

export type Enums<PublicEnumName extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][PublicEnumName]
