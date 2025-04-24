import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { log } from './vite';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database or set the environment variable?"
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Function to set search path for multi-tenant schema per system
export async function setSearchPath(client: any, schemaName: string) {
  await client.query(`SET search_path TO ${schemaName}, public;`);
  return client;
}

// Function to get a client with a specific schema
export async function getClientWithSchema(schemaName: string) {
  const client = await pool.connect();
  try {
    await setSearchPath(client, schemaName);
    return client;
  } catch (error) {
    client.release();
    throw error;
  }
}

// Transaction with schema
export async function withSchemaTransaction<T>(
  schemaName: string,
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    await setSearchPath(client, schemaName);
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    log(`Transaction error: ${e}`, 'db');
    throw e;
  } finally {
    client.release();
  }
}

// Initialize pool error listener
pool.on('error', (err) => {
  log(`Unexpected error on idle client: ${err}`, 'db');
});

// Close pool (for cleanup)
export async function closePool() {
  await pool.end();
}
