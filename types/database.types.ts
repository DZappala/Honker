import { Honk } from ".";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      honks: {
        Row: {
          post_id: number;
          created_at: string;
          user_id: string;
          content: string;
          likes: number;
          reposts: number;
          replys: number;
          reference: number | null;
          is_reply: boolean;
          is_repost: boolean;
        };
        Insert: {
          post_id?: number;
          created_at: string;
          user_id: string;
          content: string;
          likes?: number;
          reposts?: number;
          replys?: number;
          reference?: number | null;
          is_reply: boolean;
          is_repost: boolean;
        };
        Update: {
          post_id?: number;
          created_at?: string;
          user_id?: string;
          content?: string;
          likes?: number;
          reposts?: number;
          replys?: number;
          reference?: number | null;
          is_reply?: boolean;
          is_repost?: boolean;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          updated_at: string | null;
          username: string;
          website: string | null;
          avatar_url: string | null;
          followers: string[] | null;
          following: string[] | null;
          created_at: string | null;
          bio: string | null;
          location: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          updated_at?: string | null;
          username: string;
          website?: string | null;
          avatar_url?: string | null;
          followers?: string[] | null;
          following?: string[] | null;
          created_at?: string | null;
          bio?: string | null;
          location?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          updated_at?: string | null;
          username?: string;
          website?: string | null;
          avatar_url?: string | null;
          followers?: string[] | null;
          following?: string[] | null;
          created_at?: string | null;
          bio?: string | null;
          location?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_honks_for_feed: {
        Args: { input_user_id: string };
        Returns: Honk;
      };
      get_user_honks: {
        Args: { input_user_id: string };
        Returns: Honk;
      };
      handle_follow_user: {
        Args: { current_user_id: string; input: string };
        Returns: undefined;
      };
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_user: {
        Args: { email_to_check: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
