// Debug migration script to identify the exact issue
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://zauotjcjjbxawukfartz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphdW90amNqamJ4YXd1a2ZhcnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTE2NDksImV4cCI6MjA3MTMyNzY0OX0.QJl1DpOq-S-212Te2iBQOIQSPptc-0GHq7WXSnHc20k'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugMigration() {
  try {
    console.log('🔍 Debugging migration issues...')
    
    // Test a simple insert into students table
    console.log('\n=== Testing Simple Student Insert ===')
    const testStudent = {
      usn: 'TEST001',
      full_name: 'Test Student',
      total_marks: 500,
      percentage: 75.5,
      sgpa: 8.2
    }

    const { data: insertedStudent, error: insertError } = await supabase
      .from('students')
      .insert(testStudent)
      .select()
      .single()

    if (insertError) {
      console.error('❌ Student insert error:', insertError)
      console.error('Error details:', JSON.stringify(insertError, null, 2))
      
      // Check if it's a permission error
      if (insertError.code === '42501' || insertError.message.includes('permission')) {
        console.log('\n🔧 This appears to be a permissions issue.')
        console.log('You may need to:')
        console.log('1. Check your RLS (Row Level Security) policies in Supabase')
        console.log('2. Add INSERT policies for the students and subjects tables')
        console.log('3. Or temporarily disable RLS for migration')
      }
      
      return
    }

    console.log('✅ Student insert successful:', insertedStudent)

    // Test subject insert
    console.log('\n=== Testing Subject Insert ===')
    const testSubject = {
      student_id: insertedStudent.id,
      code: 'TEST101',
      subject_name: 'Test Subject',
      marks: 85,
      grade: 'A',
      status: 'Pass'
    }

    const { data: insertedSubject, error: subjectError } = await supabase
      .from('subjects')
      .insert(testSubject)
      .select()
      .single()

    if (subjectError) {
      console.error('❌ Subject insert error:', subjectError)
      console.error('Error details:', JSON.stringify(subjectError, null, 2))
      return
    }

    console.log('✅ Subject insert successful:', insertedSubject)

    // Clean up test data
    console.log('\n=== Cleaning up test data ===')
    await supabase.from('subjects').delete().eq('id', insertedSubject.id)
    await supabase.from('students').delete().eq('id', insertedStudent.id)
    console.log('✅ Test data cleaned up')

    console.log('\n🎉 Basic inserts work! The issue might be in the migration logic.')

  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

// Run debug
debugMigration()