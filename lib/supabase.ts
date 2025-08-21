import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export type Student = {
  id: string
  usn: string
  full_name: string
  total_marks: number
  percentage: number
  sgpa: number
  section?: string
  class_rank?: number
  college_rank?: number
  pdf_link?: string
  created_at: string
  updated_at: string
}

export type Subject = {
  id: string
  student_id: string
  code: string
  subject_name: string
  marks: number
  grade: string
  status: 'Pass' | 'Fail'
  created_at: string
  updated_at: string
}

// Database schema
export type Database = {
  public: {
    Tables: {
      students: {
        Row: Student
        Insert: Omit<Student, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Student, 'id' | 'created_at' | 'updated_at'>>
      }
      subjects: {
        Row: Subject
        Insert: Omit<Subject, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Subject, 'id' | 'created_at' | 'updated_at'>>
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