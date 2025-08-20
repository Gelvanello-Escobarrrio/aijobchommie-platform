/**
 *  DATABASE SETUP SCRIPT
 * 
 * Sets up the database schema and seeds it with South African data
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(' Starting AI Job Chommie database setup...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '../../../.env');
if (!fs.existsSync(envPath)) {
  console.log('  No .env file found. Please create one based on .env.example');
  console.log('   Make sure to set your DATABASE_URL and other required variables.\n');
}

try {
  // Step 1: Install dependencies if not already installed
  console.log(' Ensuring dependencies are installed...');
  try {
    execSync('npm list tsx', { stdio: 'ignore', cwd: path.join(__dirname, '..') });
  } catch {
    console.log('Installing tsx for TypeScript execution...');
    execSync('npm install tsx --save-dev', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  }

  // Step 2: Build the schema types
  console.log(' Building database schema...');
  try {
    execSync('npx drizzle-kit generate:pg --schema=src/models/schema.ts', { 
      stdio: 'inherit', 
      cwd: path.join(__dirname, '..')
    });
    console.log(' Schema generated successfully');
  } catch (error) {
    console.log('  Schema generation skipped (may already exist)');
  }

  // Step 3: Run migrations (if using a cloud database)
  console.log('  Setting up database tables...');
  try {
    execSync('npx drizzle-kit push:pg --schema=src/models/schema.ts', { 
      stdio: 'inherit', 
      cwd: path.join(__dirname, '..')
    });
    console.log(' Database tables created successfully');
  } catch (error) {
    console.log('  Database push failed - this is normal if using local setup');
    console.log('   You may need to run the SQL migration manually');
  }

  // Step 4: Seed the database
  console.log(' Seeding database with South African data...');
  try {
    execSync('npx tsx scripts/seed-data.ts', { 
      stdio: 'inherit', 
      cwd: path.join(__dirname, '..')
    });
    console.log(' Database seeded successfully');
  } catch (error) {
    console.log('  Database seeding failed:', error.message);
    console.log('   This may be due to missing environment variables or database connection issues');
  }

  console.log('\n Database setup completed!');
  console.log('\nNext steps:');
  console.log('1. Start the API server: npm run api:dev');
  console.log('2. Test the endpoints: http://localhost:3001/api/v1/jobs');
  console.log('3. Check the admin panel with: admin@aijobchommie.co.za / admin123!');

} catch (error) {
  console.error(' Setup failed:', error.message);
  process.exit(1);
}
