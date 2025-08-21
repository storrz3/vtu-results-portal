// Create RLS policies using SQL commands through Supabase client
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://zauotjcjjbxawukfartz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphdW90amNqamJ4YXd1a2ZhcnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTE2NDksImV4cCI6MjA3MTMyNzY0OX0.QJl1DpOq-S-212Te2iBQOIQSPptc-0GHq7WXSnHc20k'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createPolicies() {
  console.log('🔧 Attempting to create RLS policies...')
  
  const policies = [
    {
      name: 'students_insert_policy',
      sql: `CREATE POLICY "Allow public insert on students" ON students FOR INSERT TO public WITH CHECK (true)`
    },
    {
      name: 'students_delete_policy', 
      sql: `CREATE POLICY "Allow public delete on students" ON students FOR DELETE TO public USING (true)`
    },
    {
      name: 'subjects_insert_policy',
      sql: `CREATE POLICY "Allow public insert on subjects" ON subjects FOR INSERT TO public WITH CHECK (true)`
    },
    {
      name: 'subjects_delete_policy',
      sql: `CREATE POLICY "Allow public delete on subjects" ON subjects FOR DELETE TO public USING (true)`
    }
  ]
  
  let successCount = 0
  let errorCount = 0
  
  for (const policy of policies) {
    try {
      console.log(`Creating ${policy.name}...`)
      const { error } = await supabase.rpc('sql', { query: policy.sql })
      
      if (error) {
        console.log(`❌ ${policy.name} failed:`, error.message)
        errorCount++
      } else {
        console.log(`✅ ${policy.name} created successfully`)
        successCount++
      }
    } catch (err) {
      console.log(`❌ ${policy.name} exception:`, err.message)
      errorCount++
    }
  }
  
  console.log(`\n📊 Results: ${successCount} successful, ${errorCount} failed`)
  
  if (errorCount > 0) {
    console.log('\n💡 If policies failed to create, please run this SQL manually in Supabase:')
    console.log('Go to: https://zauotjcjjbxawukfartz.supabase.co/project/default/sql')
    console.log('\nSQL to run:')
    console.log('-'.repeat(50))
    policies.forEach(policy => {
      console.log(`${policy.sql};`)
    })
    console.log('-'.repeat(50))
  }
  
  // Now test if we can insert data
  console.log('\n🧪 Testing data insertion...')
  try {
    const { data, error } = await supabase
      .from('students')
      .insert({
        usn: 'TEST123',
        full_name: 'Test Student',
        total_marks: 500,
        percentage: 85.5,
        sgpa: 8.5
      })
      .select()
      .single()
    
    if (error) {
      console.log('❌ Test insert failed:', error.message)
      console.log('You still need to create the policies manually')
    } else {
      console.log('✅ Test insert successful! Policies are working')
      
      // Clean up test data
      await supabase.from('students').delete().eq('id', data.id)
      console.log('✅ Test data cleaned up')
      
      console.log('\n🎉 Ready for migration! Run: node scripts/migrate-data-fixed.js')
    }
  } catch (testError) {
    console.log('❌ Test error:', testError.message)
  }
}

createPolicies()