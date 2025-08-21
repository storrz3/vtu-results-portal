// Test Supabase connection and verify existing data
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://zauotjcjjbxawukfartz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphdW90amNqamJ4YXd1a2ZhcnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTE2NDksImV4cCI6MjA3MTMyNzY0OX0.QJl1DpOq-S-212Te2iBQOIQSPptc-0GHq7WXSnHc20k'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔄 Testing Supabase connection...')
    
    // Test connection by checking students table
    const { data: students, error: studentsError, count } = await supabase
      .from('students')
      .select('*', { count: 'exact' })
      .limit(5)

    if (studentsError) {
      console.error('❌ Error querying students table:', studentsError)
      return
    }

    console.log(`✅ Students table accessible! Found ${count} total students`)
    console.log('📊 Sample students:')
    students.forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.usn} - ${student.full_name} (SGPA: ${student.sgpa})`)
    })

    // Test subjects table
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
      .limit(10)

    if (subjectsError) {
      console.error('❌ Error querying subjects table:', subjectsError)
      return
    }

    console.log(`✅ Subjects table accessible! Found sample subjects:`)
    subjects.forEach((subject, index) => {
      console.log(`  ${index + 1}. ${subject.code} - ${subject.subject_name} (${subject.marks} marks, Grade: ${subject.grade})`)
    })

    // Test student with subjects join
    console.log('\n🔍 Testing joined query (student with subjects)...')
    const { data: studentWithSubjects, error: joinError } = await supabase
      .from('students')
      .select(`
        *,
        subjects (
          code,
          subject_name,
          marks,
          grade,
          status
        )
      `)
      .limit(1)
      .single()

    if (joinError) {
      console.error('❌ Error in joined query:', joinError)
      return
    }

    console.log(`✅ Joined query works! Sample student:`)
    console.log(`  USN: ${studentWithSubjects.usn}`)
    console.log(`  Name: ${studentWithSubjects.full_name}`)
    console.log(`  SGPA: ${studentWithSubjects.sgpa}`)
    console.log(`  Subjects count: ${studentWithSubjects.subjects.length}`)
    
    studentWithSubjects.subjects.forEach((subject, index) => {
      console.log(`    ${index + 1}. ${subject.code}: ${subject.marks} (${subject.grade}) - ${subject.status}`)
    })

    console.log('\n🎉 All database connections working perfectly!')
    console.log('✅ Database is ready for the application')

  } catch (error) {
    console.error('❌ Connection test failed:', error)
  }
}

// Run the test
testConnection()