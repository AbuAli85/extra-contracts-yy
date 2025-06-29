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
        }
        Insert: {
          id?: string
          action: string
          created_at?: string
          user_id: string
          details?: Json | null
        }
        Update: {
          id?: string
          action?: string
          created_at?: string
          user_id?: string
          details?: Json | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          id: string
          contract_name: string
          status: string
          created_at: string
          updated_at: string
          user_id: string | null
          contract_data: Json | null
          contract_url: string | null
          contract_number: string | null
          party_1_name: string | null
          party_1_email: string | null
          party_2_name: string | null
          party_2_email: string | null
          contract_type: string | null
          language: string | null
        }
        Insert: {
          id?: string
          contract_name: string
          status?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          contract_data?: Json | null
          contract_url?: string | null
          contract_number?: string | null
          party_1_name?: string | null
          party_1_email?: string | null
          party_2_name?: string | null
          party_2_email?: string | null
          contract_type?: string | null
          language?: string | null
        }
        Update: {
          id?: string
          contract_name?: string
          status?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          contract_data?: Json | null
          contract_url?: string | null
          contract_number?: string | null
          party_1_name?: string | null
          party_1_email?: string | null
          party_2_name?: string | null
          party_2_email?: string | null
          contract_type?: string | null
          language?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          message: string
          created_at: string
          read: boolean
          user_id: string
        }
        Insert: {
          id?: string
          message: string
          created_at?: string
          read?: boolean
          user_id: string
        }
        Update: {
          id?: string
          message?: string
          created_at?: string
          read?: boolean
          user_id?: string
        }
        Relationships: []
      }
      parties: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
          user_id: string | null
          type: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
          type?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
          type?: string | null
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
          created_at: string
          updated_at: string
          user_id: string | null
          bio: string | null
          website: string | null
          social_media: Json | null
          profile_image: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
          bio?: string | null
          website?: string | null
          social_media?: Json | null
          profile_image?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
          bio?: string | null
          website?: string | null
          social_media?: Json | null
          profile_image?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
          updated_at: string
          full_name: string | null
        }
        Insert: {
          id?: string
          email: string
          role?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
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
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    ? (Database["public"]["Tables"] & Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof Database["public"]["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
