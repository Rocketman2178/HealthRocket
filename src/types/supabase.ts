export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          plan: string
          lifespan: number
          healthspan: number
          healthspan_years: number
          health_score: number
          level: number
          fuel_points: number
          burn_streak: number
          onboarding_completed: boolean
          health_score: number
          healthspan_years: number
          lifespan: number
          healthspan: number
          onboarding_completed: boolean
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          name?: string | null
          plan?: string
          lifespan?: number
          healthspan?: number
          healthspan_years?: number
          health_score?: number
          level?: number
          fuel_points?: number
          burn_streak?: number
          onboarding_completed?: boolean
          health_score?: number
          healthspan_years?: number
          lifespan?: number
          healthspan?: number
          onboarding_completed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          plan?: string
          lifespan?: number
          healthspan?: number
          healthspan_years?: number
          health_score?: number
          level?: number
          fuel_points?: number
          burn_streak?: number
          onboarding_completed?: boolean
          health_score?: number
          healthspan_years?: number
          lifespan?: number
          healthspan?: number
          onboarding_completed?: boolean
        }
      }
      category_scores: {
        Row: {
          id: string
          user_id: string
          mindset_score: number
          sleep_score: number
          exercise_score: number
          nutrition_score: number
          biohacking_score: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mindset_score: number
          sleep_score: number
          exercise_score: number
          nutrition_score: number
          biohacking_score: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mindset_score?: number
          sleep_score?: number
          exercise_score?: number
          nutrition_score?: number
          biohacking_score?: number
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          status: string
          progress: number
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          status: string
          progress?: number
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          status?: string
          progress?: number
          started_at?: string
          completed_at?: string | null
        }
      }
      completed_boosts: {
        Row: {
          id: string
          user_id: string
          boost_id: string
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          boost_id: string
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          boost_id?: string
          completed_at?: string
        }
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
  }
}