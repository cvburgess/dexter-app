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
      daily_habits: {
        Row: {
          date: string
          habit_id: string
          percent_complete: number | null
          steps: number
          steps_complete: number
          user_id: string
        }
        Insert: {
          date: string
          habit_id: string
          percent_complete?: number | null
          steps: number
          steps_complete?: number
          user_id?: string
        }
        Update: {
          date?: string
          habit_id?: string
          percent_complete?: number | null
          steps?: number
          steps_complete?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_habits_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      days: {
        Row: {
          date: string
          notes: string | null
          prompts: Json | null
          user_id: string
        }
        Insert: {
          date?: string
          notes?: string | null
          prompts?: Json | null
          user_id?: string
        }
        Update: {
          date?: string
          notes?: string | null
          prompts?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          id: string
          is_archived: boolean
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_archived?: boolean
          title?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_archived?: boolean
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      habits: {
        Row: {
          created_at: string
          days_active: number[]
          emoji: string
          id: string
          is_archived: boolean
          is_paused: boolean
          steps: number
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_active: number[]
          emoji: string
          id?: string
          is_archived?: boolean
          is_paused?: boolean
          steps: number
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          days_active?: number[]
          emoji?: string
          id?: string
          is_archived?: boolean
          is_paused?: boolean
          steps?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      lists: {
        Row: {
          created_at: string
          emoji: string
          id: string
          is_archived: boolean
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          is_archived?: boolean
          title?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          is_archived?: boolean
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      preferences: {
        Row: {
          calendar_end_time: string
          calendar_start_time: string
          calendar_urls: string[]
          dark_theme: string
          enable_calendar: boolean
          enable_habits: boolean
          enable_journal: boolean
          enable_notes: boolean
          light_theme: string
          template_note: string
          template_prompts: string[]
          theme_mode: number
          user_id: string
        }
        Insert: {
          calendar_end_time?: string
          calendar_start_time?: string
          calendar_urls?: string[]
          dark_theme?: string
          enable_calendar?: boolean
          enable_habits?: boolean
          enable_journal?: boolean
          enable_notes?: boolean
          light_theme?: string
          template_note?: string
          template_prompts?: string[]
          theme_mode?: number
          user_id?: string
        }
        Update: {
          calendar_end_time?: string
          calendar_start_time?: string
          calendar_urls?: string[]
          dark_theme?: string
          enable_calendar?: boolean
          enable_habits?: boolean
          enable_journal?: boolean
          enable_notes?: boolean
          light_theme?: string
          template_note?: string
          template_prompts?: string[]
          theme_mode?: number
          user_id?: string
        }
        Relationships: []
      }
      repeat_task_templates: {
        Row: {
          created_at: string
          goal_id: string | null
          id: string
          list_id: string | null
          priority: number
          schedule: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_id?: string | null
          id?: string
          list_id?: string | null
          priority?: number
          schedule?: string
          title?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          goal_id?: string | null
          id?: string
          list_id?: string | null
          priority?: number
          schedule?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repeat_task_templates_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repeat_task_templates_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          due_on: string | null
          goal_id: string | null
          id: string
          list_id: string | null
          priority: number
          scheduled_for: string | null
          status: number
          subtask_of: string | null
          template_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          due_on?: string | null
          goal_id?: string | null
          id?: string
          list_id?: string | null
          priority?: number
          scheduled_for?: string | null
          status?: number
          subtask_of?: string | null
          template_id?: string | null
          title?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          due_on?: string | null
          goal_id?: string | null
          id?: string
          list_id?: string | null
          priority?: number
          scheduled_for?: string | null
          status?: number
          subtask_of?: string | null
          template_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_subtask_of_fkey"
            columns: ["subtask_of"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "repeat_task_templates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>
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
