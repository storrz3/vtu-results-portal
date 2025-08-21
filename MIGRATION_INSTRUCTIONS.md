# 🎯 Database Migration Instructions

## ✅ Current Status
- **Database Connection**: Working ✅
- **Tables**: Created (students, subjects) ✅  
- **Data Parsing**: Working perfectly (8 subjects per student) ✅
- **Issue**: Row Level Security policies prevent data insertion ❌

## 🔧 Solution Steps

### Step 1: Create Database Policies
1. **Open Supabase SQL Editor**: https://zauotjcjjbxawukfartz.supabase.co/project/default/sql

2. **Copy and paste this SQL** and click "Run":

```sql
-- Create INSERT and DELETE policies for data migration
CREATE POLICY "Allow public insert on students" 
    ON students FOR INSERT 
    TO public 
    WITH CHECK (true);

CREATE POLICY "Allow public delete on students" 
    ON students FOR DELETE 
    TO public 
    USING (true);

CREATE POLICY "Allow public insert on subjects" 
    ON subjects FOR INSERT 
    TO public 
    WITH CHECK (true);

CREATE POLICY "Allow public delete on subjects" 
    ON subjects FOR DELETE 
    TO public 
    USING (true);
```

### Step 2: Verify Policies Work
Run this command to test:
```bash
cd /app && node scripts/debug-migration.js
```

You should see: ✅ Test insert successful!

### Step 3: Run Data Migration
```bash
cd /app && node scripts/migrate-data-fixed.js
```

Expected output:
- ✅ Successfully migrated: 3 students
- ✅ Found X students in database

### Step 4: Start the Application
```bash
cd /app && npm run dev
```

Visit: http://localhost:3000

### Step 5: Test Student Search
Try searching for:
- USN: `3VC24CD001` (should find: A SAKSHI)
- USN: `3VC24CD002` (should find: ADITHYA PRAKASH R)
- USN: `3VC24CD003` (should find: AKSHAY KUMAR U)

## 🧪 Verification Commands

After completing steps 1-3, run these to verify:

```bash
# Test database connection
node scripts/test-connection.js

# Check parsed data
node scripts/test-fixed-parsing.js

# Test migration
node scripts/debug-migration.js
```

## 📊 Expected Results

After successful migration, you should have:
- **3 students** in the database
- **24 subjects** total (8 subjects × 3 students)
- **Working Next.js app** showing student results

## 🚨 If Migration Still Fails

1. Check Supabase Dashboard → Authentication → Policies
2. Verify policies were created for both tables
3. Try running the SQL again
4. Contact support if issues persist

---

**Next**: After running Step 1 (SQL policies), let me know and I'll complete the migration! 🚀