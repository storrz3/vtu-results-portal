// Quick migration script - let's try a different approach
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://zauotjcjjbxawukfartz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphdW90amNqamJ4YXd1a2ZhcnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTE2NDksImV4cCI6MjA3MTMyNzY0OX0.QJl1DpOq-S-212Te2iBQOIQSPptc-0GHq7WXSnHc20k'

const supabase = createClient(supabaseUrl, supabaseKey)

async function quickMigrate() {
  console.log('🚀 Quick migration approach...')
  
  console.log('\n📋 IMPORTANT: You need to run this SQL in Supabase first:')
  console.log('Go to: https://zauotjcjjbxawukfartz.supabase.co/project/default/sql')
  console.log('Run this SQL:')
  console.log('-'.repeat(60))
  console.log(`
CREATE POLICY "Allow public insert on students" 
    ON students FOR INSERT 
    TO public 
    WITH CHECK (true);

CREATE POLICY "Allow public insert on subjects" 
    ON subjects FOR INSERT 
    TO public 
    WITH CHECK (true);

CREATE POLICY "Allow public delete on students" 
    ON students FOR DELETE 
    TO public 
    USING (true);

CREATE POLICY "Allow public delete on subjects" 
    ON subjects FOR DELETE 
    TO public 
    USING (true);
`)
  console.log('-'.repeat(60))
  
  console.log('\nAfter running the SQL, press Ctrl+C and run: node scripts/migrate-data-fixed.js')
  
  // Keep the process alive to show the message
  process.stdin.resume()
}

quickMigrate()