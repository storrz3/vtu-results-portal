// Debug script for deployment issues
// Run with: node scripts/debug-deployment.js

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('=== VTU Results Portal Deployment Debug ===\n');

// Test 1: Check if local CSV file exists
console.log('1. Checking local CSV file...');
const csvPath = path.join(process.cwd(), 'students.csv');
try {
  const csvStats = fs.statSync(csvPath);
  console.log(`✅ Local CSV found: ${csvStats.size} bytes`);
  
  // Read first few lines
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').slice(0, 3);
  console.log('   First 3 lines:');
  lines.forEach((line, i) => console.log(`   ${i + 1}: ${line.substring(0, 100)}...`));
} catch (error) {
  console.log(`❌ Local CSV not found: ${error.message}`);
}

// Test 2: Check if local JSON file exists
console.log('\n2. Checking local JSON file...');
const jsonPath = path.join(process.cwd(), 'data', 'students.json');
try {
  const jsonStats = fs.statSync(jsonPath);
  console.log(`✅ Local JSON found: ${jsonStats.size} bytes`);
  
  // Try to parse JSON
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`   Contains ${jsonContent.length} student records`);
} catch (error) {
  console.log(`❌ Local JSON issue: ${error.message}`);
}

// Test 3: Check external URL accessibility
console.log('\n3. Testing external CSV URL...');
const csvUrl = 'https://raw.githubusercontent.com/storrz3/VTU-results-portal/6f88a83b9f7fef0a2c61b81805575a111ad053e3/students.csv';

https.get(csvUrl, (res) => {
  console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
  console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log(`✅ External CSV accessible: ${data.length} bytes`);
      const lines = data.split('\n').slice(0, 3);
      console.log('   First 3 lines:');
      lines.forEach((line, i) => console.log(`   ${i + 1}: ${line.substring(0, 100)}...`));
    } else {
      console.log(`❌ External CSV failed: ${res.statusCode}`);
    }
  });
}).on('error', (error) => {
  console.log(`❌ External CSV error: ${error.message}`);
});

// Test 4: Environment variables
console.log('\n4. Environment variables:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`   CSV_DATA_URL: ${process.env.CSV_DATA_URL || 'undefined'}`);
console.log(`   VERCEL: ${process.env.VERCEL || 'undefined'}`);
console.log(`   NETLIFY: ${process.env.NETLIFY || 'undefined'}`);

console.log('\n=== Debug Complete ===');