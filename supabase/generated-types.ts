export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      blog_post_authors: {
        Row: {
          can_edit: boolean;
          can_see: boolean;
          created_at: string;
          edited_at: string | null;
          id: number;
          is_creator: boolean;
          label: string | null;
          order: number;
          post_id: number;
          user_id: string;
        };
        Insert: {
          can_edit?: boolean;
          can_see?: boolean;
          created_at?: string;
          edited_at?: string | null;
          id?: number;
          is_creator?: boolean;
          label?: string | null;
          order?: number;
          post_id: number;
          user_id?: string;
        };
        Update: {
          can_edit?: boolean;
          can_see?: boolean;
          created_at?: string;
          edited_at?: string | null;
          id?: number;
          is_creator?: boolean;
          label?: string | null;
          order?: number;
          post_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_post_authors_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "blog_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_post_authors_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_posts: {
        Row: {
          content: string;
          created_at: string;
          edited_at: string | null;
          id: number;
          is_public: boolean;
          slug: string;
          tags: string[];
          title: string;
        };
        Insert: {
          content?: string;
          created_at?: string;
          edited_at?: string | null;
          id?: number;
          is_public?: boolean;
          slug?: string;
          tags?: string[];
          title: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          edited_at?: string | null;
          id?: number;
          is_public?: boolean;
          slug?: string;
          tags?: string[];
          title?: string;
        };
        Relationships: [];
      };
      languages: {
        Row: {
          code: string;
          created_at: string;
          english_name: string;
          id: number;
          local_name: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          english_name: string;
          id?: number;
          local_name: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          english_name?: string;
          id?: number;
          local_name?: string;
        };
        Relationships: [];
      };
      subtext_sub_collection_authors: {
        Row: {
          can_edit: boolean;
          can_see: boolean;
          created_at: string;
          credit: string | null;
          edited_at: string | null;
          id: number;
          is_creator: boolean;
          order: number;
          sub_collection_id: number;
          user_id: string;
        };
        Insert: {
          can_edit?: boolean;
          can_see?: boolean;
          created_at?: string;
          credit?: string | null;
          edited_at?: string | null;
          id?: number;
          is_creator?: boolean;
          order?: number;
          sub_collection_id: number;
          user_id?: string;
        };
        Update: {
          can_edit?: boolean;
          can_see?: boolean;
          created_at?: string;
          credit?: string | null;
          edited_at?: string | null;
          id?: number;
          is_creator?: boolean;
          order?: number;
          sub_collection_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_subtext_sub_collection_authors_sub_collection_id_fkey";
            columns: ["sub_collection_id"];
            isOneToOne: false;
            referencedRelation: "subtext_sub_collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_subtext_sub_collection_authors_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      subtext_sub_collection_items: {
        Row: {
          created_at: string;
          edited_at: string | null;
          id: number;
          order: number;
          sub_collection_id: number;
          sub_pack_id: number;
        };
        Insert: {
          created_at?: string;
          edited_at?: string | null;
          id?: number;
          order?: number;
          sub_collection_id: number;
          sub_pack_id: number;
        };
        Update: {
          created_at?: string;
          edited_at?: string | null;
          id?: number;
          order?: number;
          sub_collection_id?: number;
          sub_pack_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_subtext_sub_collection_items_sub_collection_id_fkey";
            columns: ["sub_collection_id"];
            isOneToOne: false;
            referencedRelation: "subtext_sub_collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_subtext_sub_collection_items_sub_pack_id_fkey";
            columns: ["sub_pack_id"];
            isOneToOne: false;
            referencedRelation: "subtext_sub_packs";
            referencedColumns: ["id"];
          },
        ];
      };
      subtext_sub_collections: {
        Row: {
          created_at: string;
          description: string;
          edited_at: string | null;
          id: number;
          is_public: boolean;
          slug: string | null;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          edited_at?: string | null;
          id?: number;
          is_public?: boolean;
          slug?: string | null;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          edited_at?: string | null;
          id?: number;
          is_public?: boolean;
          slug?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      subtext_sub_pack_authors: {
        Row: {
          can_edit: boolean;
          can_see: boolean;
          created_at: string;
          credit: string | null;
          edited_at: string | null;
          id: number;
          is_creator: boolean;
          order: number;
          sub_pack_id: number;
          user_id: string;
        };
        Insert: {
          can_edit?: boolean;
          can_see?: boolean;
          created_at?: string;
          credit?: string | null;
          edited_at?: string | null;
          id?: number;
          is_creator?: boolean;
          order?: number;
          sub_pack_id: number;
          user_id?: string;
        };
        Update: {
          can_edit?: boolean;
          can_see?: boolean;
          created_at?: string;
          credit?: string | null;
          edited_at?: string | null;
          id?: number;
          is_creator?: boolean;
          order?: number;
          sub_pack_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_subtext_sub_pack_authors_sub_pack_id_fkey";
            columns: ["sub_pack_id"];
            isOneToOne: false;
            referencedRelation: "subtext_sub_packs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_subtext_sub_pack_authors_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      subtext_sub_packs: {
        Row: {
          created_at: string;
          description: string;
          edited_at: string | null;
          id: number;
          is_public: boolean;
          slug: string | null;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          edited_at?: string | null;
          id?: number;
          is_public?: boolean;
          slug?: string | null;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          edited_at?: string | null;
          id?: number;
          is_public?: boolean;
          slug?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      subtext_subs: {
        Row: {
          case_sensitive: boolean;
          created_at: string;
          edited_at: string | null;
          id: number;
          interject_zws: boolean;
          is_regex: boolean;
          order: number;
          quick_lookup: string | null;
          replacement: string;
          sub_pack_id: number;
          target: string;
        };
        Insert: {
          case_sensitive?: boolean;
          created_at?: string;
          edited_at?: string | null;
          id?: number;
          interject_zws?: boolean;
          is_regex?: boolean;
          order?: number;
          quick_lookup?: string | null;
          replacement: string;
          sub_pack_id: number;
          target: string;
        };
        Update: {
          case_sensitive?: boolean;
          created_at?: string;
          edited_at?: string | null;
          id?: number;
          interject_zws?: boolean;
          is_regex?: boolean;
          order?: number;
          quick_lookup?: string | null;
          replacement?: string;
          sub_pack_id?: number;
          target?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_subtext_subs_sub_pack_id_fkey";
            columns: ["sub_pack_id"];
            isOneToOne: false;
            referencedRelation: "subtext_sub_packs";
            referencedColumns: ["id"];
          },
        ];
      };
      uploads: {
        Row: {
          created_at: string;
          created_by: string;
          edited_at: string | null;
          filename: string;
          hash: number;
          id: number;
          size: number;
          slug: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string;
          edited_at?: string | null;
          filename: string;
          hash: number;
          id?: number;
          size: number;
          slug: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          edited_at?: string | null;
          filename?: string;
          hash?: number;
          id?: number;
          size?: number;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "uploads_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          edited_at: string | null;
          id: string;
          is_admin: boolean;
          slug: string | null;
          uid: string | null;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          edited_at?: string | null;
          id?: string;
          is_admin?: boolean;
          slug?: string | null;
          uid?: string | null;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          edited_at?: string | null;
          id?: string;
          is_admin?: boolean;
          slug?: string | null;
          uid?: string | null;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_see_blog_post: {
        Args: {
          _blog_post_id: number;
          _user_id: string;
        };
        Returns: boolean;
      };
      can_see_subtext_sub_collection: {
        Args: {
          _sub_collection_id: number;
          _user_id: string;
        };
        Returns: boolean;
      };
      can_see_subtext_sub_pack: {
        Args: {
          _sub_pack_id: number;
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
