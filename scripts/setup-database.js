// This script contains the SQL commands to set up the Supabase database schema
// Run these commands in your Supabase SQL editor

const setupSQL = `
-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usn VARCHAR(20) UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  total_marks INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  sgpa DECIMAL(4,2) NOT NULL DEFAULT 0.00,
  section VARCHAR(10),
  class_rank INTEGER,
  college_rank INTEGER,
  pdf_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL,
  subject_name TEXT NOT NULL,
  marks INTEGER NOT NULL DEFAULT 0,
  grade VARCHAR(2) NOT NULL DEFAULT 'F',
  status VARCHAR(10) NOT NULL DEFAULT 'Fail' CHECK (status IN ('Pass', 'Fail')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_usn ON students(usn);
CREATE INDEX IF NOT EXISTS idx_students_full_name ON students(full_name);
CREATE INDEX IF NOT EXISTS idx_subjects_student_id ON subjects(student_id);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON subjects(code);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subjects_updated_at ON subjects;
CREATE TRIGGER update_subjects_updated_at 
    BEFORE UPDATE ON subjects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a results portal)
DROP POLICY IF EXISTS "Allow public read access on students" ON students;
CREATE POLICY "Allow public read access on students" 
    ON students FOR SELECT 
    TO public 
    USING (true);

DROP POLICY IF EXISTS "Allow public read access on subjects" ON subjects;
CREATE POLICY "Allow public read access on subjects" 
    ON subjects FOR SELECT 
    TO public 
    USING (true);
`;

console.log('Run the following SQL in your Supabase SQL editor:');
console.log('='.repeat(60));
console.log(setupSQL);
console.log('='.repeat(60));

module.exports = { setupSQL };