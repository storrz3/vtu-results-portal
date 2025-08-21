// Script to add INSERT policies for data migration
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://zauotjcjjbxawukfartz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphdW90amNqamJ4YXd1a2ZhcnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTE2NDksImV4cCI6MjA3MTMyNzY0OX0.QJl1DpOq-S-212Te2iBQOIQSPptc-0GHq7WXSnHc20k'

const supabase = createClient(supabaseUrl, supabaseKey)

const insertPoliciesSQL = `
-- Add INSERT policies for data migration

-- Allow INSERT on students table
DROP POLICY IF EXISTS "Allow public insert on students" ON students;
CREATE POLICY "Allow public insert on students" 
    ON students FOR INSERT 
    TO public 
    WITH CHECK (true);

-- Allow INSERT on subjects table  
DROP POLICY IF EXISTS "Allow public insert on subjects" ON subjects;
CREATE POLICY "Allow public insert on subjects" 
    ON subjects FOR INSERT 
    TO public 
    WITH CHECK (true);

-- Allow DELETE on students table (for migration cleanup)
DROP POLICY IF EXISTS "Allow public delete on students" ON students;
CREATE POLICY "Allow public delete on students" 
    ON students FOR DELETE 
    TO public 
    USING (true);

-- Allow DELETE on subjects table (for migration cleanup)
DROP POLICY IF EXISTS "Allow public delete on subjects" ON subjects;
CREATE POLICY "Allow public delete on subjects" 
    ON subjects FOR DELETE 
    TO public 
    USING (true);
`;

async function setupInsertPolicies() {
  try {
    console.log('🔧 Setting up INSERT policies for data migration...')
    console.log('\nSQL to run in Supabase SQL Editor:')
    console.log('='.repeat(60))
    console.log(insertPoliciesSQL)
    console.log('='.repeat(60))
    console.log('\nPlease run this SQL in your Supabase SQL Editor, then re-run the migration script.')
    
    // Test if we can create the policies (this might fail due to permissions)
    console.log('\n🔄 Attempting to create policies via client...')
    
    // This will likely fail, but let's try anyway
    const { error } = await supabase.rpc('exec', { 
      sql: insertPoliciesSQL 
    })
    
    if (error) {
      console.log('❌ Cannot create policies via client (expected):', error.message)
      console.log('✅ Please run the SQL above manually in Supabase SQL Editor')
    } else {
      console.log('✅ Policies created successfully!')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    console.log('\n💡 Manual approach: Copy the SQL above and run it in Supabase SQL Editor')
  }
}

setupInsertPolicies()