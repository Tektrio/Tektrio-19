import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Load environment variables from .env file if not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  process.exit(1);
}

// Create a pool of connections using the environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('Connecting to Neon DB...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Connection successful!');
    console.log(`⏰ Server time: ${result.rows[0].current_time}`);
    
    // Test schema creation functionality
    console.log('Testing schema creation functionality...');
    await client.query('CREATE SCHEMA IF NOT EXISTS test_schema');
    console.log('✅ Schema creation successful!');
    
    // Test search_path functionality
    console.log('Testing search_path functionality...');
    await client.query('SET search_path TO test_schema, public');
    const schemaResult = await client.query('SHOW search_path');
    console.log(`✅ Search path set to: ${schemaResult.rows[0].search_path}`);
    
    // Clean up test schema
    console.log('Cleaning up test schema...');
    await client.query('DROP SCHEMA IF EXISTS test_schema CASCADE');
    console.log('✅ Test schema cleaned up!');
    
    client.release();
  } catch (err) {
    console.error('❌ Error connecting to Neon DB:', err);
  } finally {
    await pool.end();
  }
}

// Execute test
testConnection();
