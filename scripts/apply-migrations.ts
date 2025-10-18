import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const sql = neon(process.env.DATABASE_URL!);

async function applyMigrations() {
  console.log('🚀 Starting migration process...\n');

  try {
    // Read the latest migration file
    const migrationFile = 'drizzle/0003_sudden_micromax.sql';
    const migrationSQL = fs.readFileSync(migrationFile, 'utf-8');

    console.log('📄 Migration file:', migrationFile);
    console.log('📝 SQL Content:\n', migrationSQL);
    console.log('\n🔄 Applying migration...\n');

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      try {
        console.log('Executing:', statement.substring(0, 100) + '...');
        await sql(statement);
        console.log('✅ Success\n');
      } catch (error: any) {
        // Ignore "already exists" errors
        if (error.message?.includes('already exists')) {
          console.log('⚠️  Column already exists, skipping\n');
        } else {
          console.error('❌ Error:', error.message);
          throw error;
        }
      }
    }

    console.log('\n✅ All migrations applied successfully!');
    
    // Verify the new columns exist
    console.log('\n🔍 Verifying new columns...');
    const columns = await sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      AND column_name IN ('platform_commission', 'platform_partnership', 'referral_enabled')
      ORDER BY column_name
    `;
    
    console.log('\nNew columns in projects table:');
    columns.forEach((col: any) => {
      console.log(`✅ ${col.column_name}: ${col.data_type} (default: ${col.column_default})`);
    });

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

applyMigrations();

