/**
 * 🗄️ DATABASE MIGRATION SCRIPT
 * 
 * Runs database migrations using Drizzle Kit
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const runMigrations = async () => {
  console.log('🚀 Starting database migrations...');

  try {
    // Create connection
    const migrationClient = postgres(DATABASE_URL, { max: 1 });
    const db = drizzle(migrationClient);

    // Run migrations
    await migrate(db, { 
      migrationsFolder: './drizzle',
    });

    console.log('✅ Migrations completed successfully');
    
    // Close connection
    await migrationClient.end();
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

export default runMigrations;
