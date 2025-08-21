// Migration script that works around RLS by using service role key (if available)
// Or provides instructions for manual policy setup

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://zauotjcjjbxawukfartz.supabase.co'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphdW90amNqamJ4YXd1a2ZhcnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTE2NDksImV4cCI6MjA3MTMyNzY0OX0.QJl1DpOq-S-212Te2iBQOIQSPptc-0GHq7WXSnHc20k'

// For data migration, we can try with anon key first
const supabase = createClient(supabaseUrl, anonKey)

async function setupPoliciesAndMigrate() {
  console.log('🚀 Setting up database policies and migrating data...')
  
  console.log('\n📋 STEP 1: You need to run these SQL commands in your Supabase SQL Editor:')
  console.log('=' * 80)
  console.log(`
-- Temporarily add INSERT and DELETE policies for migration
DROP POLICY IF EXISTS "Allow public insert on students" ON students;
CREATE POLICY "Allow public insert on students" 
    ON students FOR INSERT 
    TO public 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on subjects" ON subjects;
CREATE POLICY "Allow public insert on subjects" 
    ON subjects FOR INSERT 
    TO public 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on students" ON students;
CREATE POLICY "Allow public delete on students" 
    ON students FOR DELETE 
    TO public 
    USING (true);

DROP POLICY IF EXISTS "Allow public delete on subjects" ON subjects;
CREATE POLICY "Allow public delete on subjects" 
    ON subjects FOR DELETE 
    TO public 
    USING (true);
`)
  console.log('=' * 80)
  
  console.log('\n✋ Please:')
  console.log('1. Go to your Supabase Dashboard')
  console.log('2. Navigate to SQL Editor')
  console.log('3. Copy and paste the SQL above')
  console.log('4. Click "Run"')
  console.log('5. Then come back here and press Enter to continue...')
  
  // Wait for user input
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  await new Promise((resolve) => {
    rl.question('Press Enter when you have run the SQL policies... ', () => {
      rl.close()
      resolve()
    })
  })
  
  console.log('\n🔄 Now attempting data migration...')
  
  // Run the existing migration logic
  try {
    const { migrateToSupabase } = require('./migrate-data-fixed.js')
    await migrateToSupabase()
  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.log('\n💡 If migration still fails, you might need to:')
    console.log('1. Check that the policies were created successfully')
    console.log('2. Verify your Supabase project settings')
    console.log('3. Or contact me for further debugging')
  }
}

// Check if running directly
if (require.main === module) {
  setupPoliciesAndMigrate()
}

module.exports = { setupPoliciesAndMigrate }