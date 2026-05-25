export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          height_cm: number | null;
          current_weight_kg: number | null;
          target_weight_kg: number | null;
          calorie_goal: number;
          protein_goal: number;
          training_frequency: number;
          physique_goal: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      workouts: {
        Row: {
          id: string;
          user_id: string | null;
          code: string;
          title: string;
          description: string | null;
          scheduled_weekday: number | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["workouts"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["workouts"]["Row"]>;
      };
      exercises: {
        Row: {
          id: string;
          workout_id: string;
          name: string;
          sets: number;
          reps: string;
          rest_seconds: number;
          target_muscles: string[];
          execution_tips: string;
          mistakes_to_avoid: string;
          demo_url: string | null;
          position: number;
        };
        Insert: Partial<Database["public"]["Tables"]["exercises"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["exercises"]["Row"]>;
      };
      meals: {
        Row: {
          id: string;
          name: string;
          category: string;
          calories: number;
          protein_g: number;
          ingredients: string[];
          prep_minutes: number;
          image_url: string | null;
          is_snack: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["meals"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["meals"]["Row"]>;
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          recorded_at: string;
          weight_kg: number | null;
          waist_cm: number | null;
          photo_url: string | null;
          notes: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["progress"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["progress"]["Row"]>;
      };
      daily_tracking: {
        Row: {
          id: string;
          user_id: string;
          tracked_date: string;
          calories: number;
          protein_g: number;
          workout_completed: boolean;
          validated: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["daily_tracking"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["daily_tracking"]["Row"]>;
      };
    };
  };
};
