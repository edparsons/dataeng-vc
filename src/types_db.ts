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
      organizations: {
        Row: {
          aum: string | null
          created_at: string | null
          domain: string
          firm_size: string | null
          id: string
          linkedin: string | null
          name: string | null
          privacy_type: string | null
          public_key: string | null
          public_key_user: string | null
          status: string
          strike_zone: string | null
          target_geo: string | null
          tech_team_size: string | null
          updated_at: string | null
        }
        Insert: {
          aum?: string | null
          created_at?: string | null
          domain: string
          firm_size?: string | null
          id?: string
          linkedin?: string | null
          name?: string | null
          privacy_type?: string | null
          public_key?: string | null
          public_key_user?: string | null
          status?: string
          strike_zone?: string | null
          target_geo?: string | null
          tech_team_size?: string | null
          updated_at?: string | null
        }
        Update: {
          aum?: string | null
          created_at?: string | null
          domain?: string
          firm_size?: string | null
          id?: string
          linkedin?: string | null
          name?: string | null
          privacy_type?: string | null
          public_key?: string | null
          public_key_user?: string | null
          status?: string
          strike_zone?: string | null
          target_geo?: string | null
          tech_team_size?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_organizations_public_key_user_fkey"
            columns: ["public_key_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["email"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string | null
          duration: number | null
          id: string
          organization_hash: string
          organization_id: string | null
          price: number | null
          start_date: string | null
          terms: string | null
          tool_id: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          id?: string
          organization_hash: string
          organization_id?: string | null
          price?: number | null
          start_date?: string | null
          terms?: string | null
          tool_id: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          id?: string
          organization_hash?: string
          organization_id?: string | null
          price?: number | null
          start_date?: string | null
          terms?: string | null
          tool_id?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      survey: {
        Row: {
          created_at: string
          data: Json
          id: number
        }
        Insert: {
          created_at?: string
          data: Json
          id?: number
        }
        Update: {
          created_at?: string
          data?: Json
          id?: number
        }
        Relationships: []
      }
      tools: {
        Row: {
          api: boolean | null
          created_at: string | null
          description: string | null
          id: string
          logo: string | null
          name: string
          published_pricing: string | null
          status: string
          type: string
          updated_at: string | null
          website: string
        }
        Insert: {
          api?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo?: string | null
          name: string
          published_pricing?: string | null
          status?: string
          type: string
          updated_at?: string | null
          website: string
        }
        Update: {
          api?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo?: string | null
          name?: string
          published_pricing?: string | null
          status?: string
          type?: string
          updated_at?: string | null
          website?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          linkedin: string | null
          name: string | null
          organization_id: string | null
          photo: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          linkedin?: string | null
          name?: string | null
          organization_id?: string | null
          photo?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          linkedin?: string | null
          name?: string | null
          organization_id?: string | null
          photo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
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
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
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
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
