export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string | null
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      mamas: {
        Row: {
          accent_description: string | null
          available_from: string | null
          available_until: string | null
          avatar_url: string | null
          color_primary: string | null
          color_secondary: string | null
          created_at: string | null
          cuisine_type: Database["public"]["Enums"]["cuisine_type"]
          description: string
          id: string
          is_permanent: boolean | null
          name: string
          personality_traits: string[] | null
          signature_dish: string | null
          updated_at: string | null
          voice_id: string | null
        }
        Insert: {
          accent_description?: string | null
          available_from?: string | null
          available_until?: string | null
          avatar_url?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          created_at?: string | null
          cuisine_type: Database["public"]["Enums"]["cuisine_type"]
          description: string
          id?: string
          is_permanent?: boolean | null
          name: string
          personality_traits?: string[] | null
          signature_dish?: string | null
          updated_at?: string | null
          voice_id?: string | null
        }
        Update: {
          accent_description?: string | null
          available_from?: string | null
          available_until?: string | null
          avatar_url?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          created_at?: string | null
          cuisine_type?: Database["public"]["Enums"]["cuisine_type"]
          description?: string
          id?: string
          is_permanent?: boolean | null
          name?: string
          personality_traits?: string[] | null
          signature_dish?: string | null
          updated_at?: string | null
          voice_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cooking_level: Database["public"]["Enums"]["cooking_level"] | null
          created_at: string | null
          dietary_preferences: string[] | null
          favorite_mama_id: string | null
          id: string
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          cooking_level?: Database["public"]["Enums"]["cooking_level"] | null
          created_at?: string | null
          dietary_preferences?: string[] | null
          favorite_mama_id?: string | null
          id: string
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          cooking_level?: Database["public"]["Enums"]["cooking_level"] | null
          created_at?: string | null
          dietary_preferences?: string[] | null
          favorite_mama_id?: string | null
          id?: string
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_favorite_mama"
            columns: ["favorite_mama_id"]
            isOneToOne: false
            referencedRelation: "mamas"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cook_time: number
          created_at: string | null
          cultural_notes: string | null
          description: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          hero_image_url: string | null
          id: string
          ingredients: Json
          mama_id: string
          offline_available: boolean | null
          prep_time: number
          servings: number | null
          steps: Json
          title: string
          updated_at: string | null
          voice_variations: Json | null
        }
        Insert: {
          cook_time: number
          created_at?: string | null
          cultural_notes?: string | null
          description: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          hero_image_url?: string | null
          id?: string
          ingredients?: Json
          mama_id: string
          offline_available?: boolean | null
          prep_time: number
          servings?: number | null
          steps?: Json
          title: string
          updated_at?: string | null
          voice_variations?: Json | null
        }
        Update: {
          cook_time?: number
          created_at?: string | null
          cultural_notes?: string | null
          description?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          hero_image_url?: string | null
          id?: string
          ingredients?: Json
          mama_id?: string
          offline_available?: boolean | null
          prep_time?: number
          servings?: number | null
          steps?: Json
          title?: string
          updated_at?: string | null
          voice_variations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_mama_id_fkey"
            columns: ["mama_id"]
            isOneToOne: false
            referencedRelation: "mamas"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string | null
          id: string
          items: Json
          name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          items?: Json
          name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          items?: Json
          name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          current_step: number | null
          id: string
          notes: string | null
          recipe_id: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          current_step?: number | null
          id?: string
          notes?: string | null
          recipe_id: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          current_step?: number | null
          id?: string
          notes?: string | null
          recipe_id?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_cache: {
        Row: {
          audio_url: string
          created_at: string | null
          duration_ms: number | null
          expires_at: string | null
          id: string
          text_hash: string
          voice_id: string
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          duration_ms?: number | null
          expires_at?: string | null
          id?: string
          text_hash: string
          voice_id: string
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          duration_ms?: number | null
          expires_at?: string | null
          id?: string
          text_hash?: string
          voice_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_voice_cache: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_profile_owner: {
        Args: { profile_id: string }
        Returns: boolean
      }
    }
    Enums: {
      cooking_level: "beginner" | "intermediate" | "advanced" | "expert"
      cuisine_type:
        | "italian"
        | "mexican"
        | "chinese"
        | "indian"
        | "japanese"
        | "french"
        | "thai"
        | "mediterranean"
        | "american"
        | "korean"
        | "vietnamese"
        | "greek"
      difficulty_level: "easy" | "medium" | "hard"
      subscription_tier: "free" | "premium" | "family"
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
      cooking_level: ["beginner", "intermediate", "advanced", "expert"],
      cuisine_type: [
        "italian",
        "mexican",
        "chinese",
        "indian",
        "japanese",
        "french",
        "thai",
        "mediterranean",
        "american",
        "korean",
        "vietnamese",
        "greek",
      ],
      difficulty_level: ["easy", "medium", "hard"],
      subscription_tier: ["free", "premium", "family"],
    },
  },
} as const
