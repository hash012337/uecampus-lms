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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          course: string
          course_code: string
          created_at: string | null
          description: string | null
          due_date: string | null
          feedback: string | null
          grade: string | null
          hours_left: number | null
          id: string
          points: number | null
          priority: string | null
          status: string | null
          submitted_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course: string
          course_code: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          feedback?: string | null
          grade?: string | null
          hours_left?: number | null
          id?: string
          points?: number | null
          priority?: string | null
          status?: string | null
          submitted_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course?: string
          course_code?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          feedback?: string | null
          grade?: string | null
          hours_left?: number | null
          id?: string
          points?: number | null
          priority?: string | null
          status?: string | null
          submitted_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cohort_enrollments: {
        Row: {
          auto_sync: boolean | null
          cohort_id: string
          course_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          auto_sync?: boolean | null
          cohort_id: string
          course_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          auto_sync?: boolean | null
          cohort_id?: string
          course_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohort_enrollments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohort_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      cohort_members: {
        Row: {
          added_at: string | null
          cohort_id: string
          id: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          cohort_id: string
          id?: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          cohort_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohort_members_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      cohorts: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          accreditation: string | null
          career_opportunities: string[] | null
          category: string
          code: string
          created_at: string | null
          description: string | null
          duration: string | null
          enrolled_students: number | null
          entry_requirements: string[] | null
          grade: string | null
          id: string
          installments: boolean | null
          instructor: string | null
          learning_outcomes: string[] | null
          level: string | null
          mode: string | null
          modules: string[] | null
          next_class: string | null
          overview: string | null
          partner: string | null
          progress: number | null
          rating: number | null
          status: string | null
          subcategory: string | null
          time_slot: string | null
          title: string
          tuition: string | null
          updated_at: string | null
        }
        Insert: {
          accreditation?: string | null
          career_opportunities?: string[] | null
          category: string
          code: string
          created_at?: string | null
          description?: string | null
          duration?: string | null
          enrolled_students?: number | null
          entry_requirements?: string[] | null
          grade?: string | null
          id?: string
          installments?: boolean | null
          instructor?: string | null
          learning_outcomes?: string[] | null
          level?: string | null
          mode?: string | null
          modules?: string[] | null
          next_class?: string | null
          overview?: string | null
          partner?: string | null
          progress?: number | null
          rating?: number | null
          status?: string | null
          subcategory?: string | null
          time_slot?: string | null
          title: string
          tuition?: string | null
          updated_at?: string | null
        }
        Update: {
          accreditation?: string | null
          career_opportunities?: string[] | null
          category?: string
          code?: string
          created_at?: string | null
          description?: string | null
          duration?: string | null
          enrolled_students?: number | null
          entry_requirements?: string[] | null
          grade?: string | null
          id?: string
          installments?: boolean | null
          instructor?: string | null
          learning_outcomes?: string[] | null
          level?: string | null
          mode?: string | null
          modules?: string[] | null
          next_class?: string | null
          overview?: string | null
          partner?: string | null
          progress?: number | null
          rating?: number | null
          status?: string | null
          subcategory?: string | null
          time_slot?: string | null
          title?: string
          tuition?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dashboard_stats: {
        Row: {
          completed: number | null
          created_at: string | null
          id: string
          in_progress: number | null
          total_activity: number | null
          upcoming: number | null
          updated_at: string | null
        }
        Insert: {
          completed?: number | null
          created_at?: string | null
          id?: string
          in_progress?: number | null
          total_activity?: number | null
          upcoming?: number | null
          updated_at?: string | null
        }
        Update: {
          completed?: number | null
          created_at?: string | null
          id?: string
          in_progress?: number | null
          total_activity?: number | null
          upcoming?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string
          created_at: string | null
          enrolled_at: string | null
          enrolled_by: string | null
          enrollment_duration_days: number | null
          expires_at: string | null
          id: string
          progress: number | null
          role: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          enrolled_at?: string | null
          enrolled_by?: string | null
          enrollment_duration_days?: number | null
          expires_at?: string | null
          id?: string
          progress?: number | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          enrolled_at?: string | null
          enrolled_by?: string | null
          enrollment_duration_days?: number | null
          expires_at?: string | null
          id?: string
          progress?: number | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      library_items: {
        Row: {
          category: string
          course_id: string | null
          created_at: string | null
          description: string | null
          downloads: number | null
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          is_public: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          category: string
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      meta_courses: {
        Row: {
          child_course_id: string
          created_at: string | null
          id: string
          parent_course_id: string
        }
        Insert: {
          child_course_id: string
          created_at?: string | null
          id?: string
          parent_course_id: string
        }
        Update: {
          child_course_id?: string
          created_at?: string | null
          id?: string
          parent_course_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meta_courses_child_course_id_fkey"
            columns: ["child_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meta_courses_parent_course_id_fkey"
            columns: ["parent_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      progress_tracking: {
        Row: {
          assignment_id: string | null
          completed_at: string | null
          course_id: string
          created_at: string | null
          id: string
          item_type: string
          max_score: number | null
          percentage: number | null
          quiz_id: string | null
          score: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assignment_id?: string | null
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          item_type: string
          max_score?: number | null
          percentage?: number | null
          quiz_id?: string | null
          score?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assignment_id?: string | null
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          item_type?: string
          max_score?: number | null
          percentage?: number | null
          quiz_id?: string | null
          score?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_tracking_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_tracking_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_tracking_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          best_score: number | null
          course: string
          created_at: string | null
          difficulty: string | null
          duration: number | null
          id: string
          questions: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          best_score?: number | null
          course: string
          created_at?: string | null
          difficulty?: string | null
          duration?: number | null
          id?: string
          questions?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          best_score?: number | null
          course?: string
          created_at?: string | null
          difficulty?: string | null
          duration?: number | null
          id?: string
          questions?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      timetable: {
        Row: {
          color: string | null
          course_code: string
          course_name: string
          created_at: string | null
          day_of_week: string
          end_time: string
          id: string
          instructor: string | null
          notes: string | null
          room: string | null
          start_time: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          color?: string | null
          course_code: string
          course_name: string
          created_at?: string | null
          day_of_week: string
          end_time: string
          id?: string
          instructor?: string | null
          notes?: string | null
          room?: string | null
          start_time: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          color?: string | null
          course_code?: string
          course_name?: string
          created_at?: string | null
          day_of_week?: string
          end_time?: string
          id?: string
          instructor?: string | null
          notes?: string | null
          room?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "teacher" | "non_editing_teacher" | "student"
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
    Enums: {
      app_role: ["admin", "user", "teacher", "non_editing_teacher", "student"],
    },
  },
} as const
