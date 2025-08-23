const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '..', 'students.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV lines
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

// Convert CSV to JavaScript objects
const students = [];

for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
  const record = {};
  
  headers.forEach((header, index) => {
    record[header] = values[index] || '';
  });
  
  if (record.usn && record.name) {
    students.push(record);
  }
}

// Generate JavaScript code
const jsCode = `// Auto-generated from students.csv - ${students.length} students
export const ALL_STUDENTS_DATA = ${JSON.stringify(students, null, 2)};
`;

// Write to file
const outputPath = path.join(__dirname, '..', 'data', 'all-students-generated.ts');
fs.writeFileSync(outputPath, jsCode);

console.log(`✅ Successfully converted ${students.length} students to JavaScript format`);
console.log(`📁 Output file: ${outputPath}`);
console.log(`📊 Sample students:`);
console.log(`   - ${students[0].usn}: ${students[0].name} (SGPA: ${students[0].sgpa})`);
console.log(`   - ${students[1].usn}: ${students[1].name} (SGPA: ${students[1].sgpa})`);
console.log(`   - ${students[2].usn}: ${students[2].name} (SGPA: ${students[2].sgpa})`);
console.log(`   - ... and ${students.length - 3} more students`); 