/**
 *  DATABASE CONFIGURATION
 * 
 * Supabase + PostgreSQL configuration with connection pooling
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

// Debug environment variables
console.log(' Environment Debug:');
console.log('SUPABASE_URL:', SUPABASE_URL ? 'Found' : 'Missing');
console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Found' : 'Missing');
console.log('DATABASE_URL:', DATABASE_URL ? 'Found' : 'Missing');

// Supabase client for auth and real-time features
export const supabase = createClient(
  SUPABASE_URL || '',
  SUPABASE_ANON_KEY || ''
);

// Admin client for server-side operations
export const supabaseAdmin = createClient(
  SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// PostgreSQL connection pool
export const pgPool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Drizzle ORM setup
const queryClient = postgres(DATABASE_URL || '');
export const db = drizzle(queryClient);

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = await pgPool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Initialize database connection
export async function initializeDatabase(): Promise<void> {
  try {
    console.log(' Initializing database connection...');
    await checkDatabaseHealth();
    console.log(' Database connected successfully');
  } catch (error) {
    console.error(' Database connection failed:', error);
    throw error;
  }
}
