import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');

// Load environment variables
let supabaseUrl, supabaseKey;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      supabaseKey = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
    }
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env\n');
  console.log('Please add these to your .env file:');
  console.log('SUPABASE_URL=your_supabase_url_here');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here\n');
  process.exit(1);
}

console.log('\n🔧 Setting up users table...');
console.log(`📍 Project: ${supabaseUrl.split('https://')[1].split('.')[0]}\n`);

// We don't need the supabase client for this script since we're just providing instructions
// const supabase = createClient(supabaseUrl, supabaseKey);

async function setupUsersTable() {
  try {
    console.log('📋 Executing SQL to create users table...\n');

    // Execute the SQL - note: Supabase doesn't support raw SQL execution via client
    // So we'll create the table using the Supabase client methods
    console.log('Creating users table...');
    
    // Since we can't execute raw SQL directly via the client, we'll document what needs to be done
    console.log('\n📝 Manual Setup Required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to your project');
    console.log('3. Go to the SQL Editor section');
    console.log('4. Copy and paste the following SQL:');
    console.log('\n' + '='.repeat(60));
    const sqlContent = fs.readFileSync(path.join(__dirname, 'create_users_table.sql'), 'utf8');
    console.log(sqlContent);
    console.log('='.repeat(60));
    console.log('\n5. Click "Run" to execute the SQL\n');
    
    console.log('✅ Users table setup instructions provided above');
    console.log('✅ Please follow the manual steps to complete the setup');
    
  } catch (error) {
    console.error('❌ Error setting up users table:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupUsersTable();