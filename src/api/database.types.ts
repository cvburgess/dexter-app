export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
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
          prompts: Json
          user_id: string
        }
        Insert: {
          date?: string
          notes?: string | null
          prompts?: Json
          user_id?: string
        }
        Update: {
          date?: string
          notes?: string | null
          prompts?: Json
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
      journals: {
        Row: {
          created_at: string
          date: string
          prompts: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          prompts?: Json
          user_id?: string
        }
        Update: {
          created_at?: string
          date?: string
          prompts?: Json
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
      notes: {
        Row: {
          content: string
          created_at: string
          date: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          date: string
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          date?: string
          user_id?: string
        }
        Relationships: []
      }
      preferences: {
        Row: {
          alarm_sound: string
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
          alarm_sound?: string
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
          alarm_sound?: string
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
          alarm_time: string | null
          created_at: string
          goal_id: string | null
          id: string
          list_id: string | null
          priority: number
          schedule: string
          subtasks: Json
          title: string
          user_id: string
        }
        Insert: {
          alarm_time?: string | null
          created_at?: string
          goal_id?: string | null
          id?: string
          list_id?: string | null
          priority?: number
          schedule?: string
          subtasks?: Json
          title?: string
          user_id?: string
        }
        Update: {
          alarm_time?: string | null
          created_at?: string
          goal_id?: string | null
          id?: string
          list_id?: string | null
          priority?: number
          schedule?: string
          subtasks?: Json
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
          alarm_time: string | null
          created_at: string
          due_on: string | null
          goal_id: string | null
          id: string
          list_id: string | null
          priority: number
          scheduled_for: string | null
          status: number
          subtasks: Json
          template_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          alarm_time?: string | null
          created_at?: string
          due_on?: string | null
          goal_id?: string | null
          id?: string
          list_id?: string | null
          priority?: number
          scheduled_for?: string | null
          status?: number
          subtasks?: Json
          template_id?: string | null
          title?: string
          user_id?: string
        }
        Update: {
          alarm_time?: string | null
          created_at?: string
          due_on?: string | null
          goal_id?: string | null
          id?: string
          list_id?: string | null
          priority?: number
          scheduled_for?: string | null
          status?: number
          subtasks?: Json
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
      delete_user: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
