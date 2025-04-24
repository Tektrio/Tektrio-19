import { pool } from '../server/db';
import config from '../shared/config';
import dotenv from 'dotenv';

// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// List of schemas to create
const SCHEMAS = config.schemas.systems;

async function createSchemas() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create schemas if they don't exist
    for (const schema of SCHEMAS) {
      console.log(`Creating schema: ${schema}`);
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
    }
    
    // Create the tenants table in public schema if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.tenants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        schema_name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        active BOOLEAN DEFAULT TRUE
      );
    `);
    
    // Insert or update the tenants
    for (const schema of SCHEMAS) {
      const systemName = schema.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      await client.query(`
        INSERT INTO public.tenants (name, schema_name)
        VALUES ($1, $2)
        ON CONFLICT (schema_name) 
        DO UPDATE SET name = $1, updated_at = NOW();
      `, [systemName, schema]);
    }
    
    await client.query('COMMIT');
    console.log('✅ Migration completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during migration:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// Execute the migration
createSchemas().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
