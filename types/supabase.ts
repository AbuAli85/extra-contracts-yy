export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          id: string
          action: string
          created_at: string
          user_id: string
          details: Json | null
          table_name: string | null
          record_id: string | null
        }
        Insert: {
          id?: string
          action: string
          created_at?: string
          user_id: string
          details?: Json | null
          table_name?: string | null
          record_id?: string | null
        }
        Update: {
          id?: string
          action?: string
          created_at?: string
          user_id?: string
          details?: Json | null
          table_name?: string | null
          record_id?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          id: string
          contract_name: string
          contract_number: string
          status: "pending" | "processing" | "completed" | "failed" | "cancelled"
          created_at: string
          updated_at: string
          user_id: string | null
          party_1_id: string | null
          party_2_id: string | null
          promoter_id: string | null
          contract_type: string | null
          contract_data: Json | null
          file_url: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          contract_name: string
          contract_number: string
          status?: "pending" | "processing" | "completed" | "failed" | "cancelled"
          created_at?: string
          updated_at?: string
          user_id?: string | null
          party_1_id?: string | null
          party_2_id?: string | null
          promoter_id?: string | null
          contract_type?: string | null
          contract_data?: Json | null
          file_url?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          contract_name?: string
          contract_number?: string
          status?: "pending" | "processing" | "completed" | "failed" | "cancelled"
          created_at?: string
          updated_at?: string
          user_id?: string | null
          party_1_id?: string | null
          party_2_id?: string | null
          promoter_id?: string | null
          contract_type?: string | null
          contract_data?: Json | null
          file_url?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_party_1_id_fkey"
            columns: ["party_1_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_party_2_id_fkey"
            columns: ["party_2_id"]
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
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          message: string
          read: boolean
          created_at: string
          type: string | null
          data: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          read?: boolean
          created_at?: string
          type?: string | null
          data?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          read?: boolean
          created_at?: string
          type?: string | null
          data?: Json | null
        }
        Relationships: []
      }
      parties: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          type: "individual" | "company" | "organization"
          created_at: string
          updated_at: string
          user_id: string | null
          additional_info: Json | null
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          type: "individual" | "company" | "organization"
          created_at?: string
          updated_at?: string
          user_id?: string | null
          additional_info?: Json | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          type?: "individual" | "company" | "organization"
          created_at?: string
          updated_at?: string
          user_id?: string | null
          additional_info?: Json | null
        }
        Relationships: []
      }
      promoters: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          specialization: string | null
          experience_years: number | null
          rating: number | null
          status: "active" | "inactive" | "suspended"
          created_at: string
          updated_at: string
          user_id: string | null
          profile_data: Json | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          specialization?: string | null
          experience_years?: number | null
          rating?: number | null
          status?: "active" | "inactive" | "suspended"
          created_at?: string
          updated_at?: string
          user_id?: string | null
          profile_data?: Json | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          specialization?: string | null
          experience_years?: number | null
          rating?: number | null
          status?: "active" | "inactive" | "suspended"
          created_at?: string
          updated_at?: string
          user_id?: string | null
          profile_data?: Json | null
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          email: string
          role: "admin" | "user" | "manager"
          created_at: string
          updated_at: string
          profile_data: Json | null
        }
        Insert: {
          id: string
          email: string
          role?: "admin" | "user" | "manager"
          created_at?: string
          updated_at?: string
          profile_data?: Json | null
        }
        Update: {
          id?: string
          email?: string
          role?: "admin" | "user" | "manager"
          created_at?: string
          updated_at?: string
          profile_data?: Json | null
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
          totalContracts: number
          pendingContracts: number
          completedContracts: number
          failedContracts: number
          contractsThisMonth: number
          contractsLastMonth: number
          averageProcessingTime: number
          successRate: number
        }
      }
    }
    Enums: {
      contract_status: "pending" | "processing" | "completed" | "failed" | "cancelled"
      party_type: "individual" | "company" | "organization"
      promoter_status: "active" | "inactive" | "suspended"
      user_role: "admin" | "user" | "manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
