const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  try {
    console.log('Starting migration...');
    
    // Drop existing tables
    await sql`DROP TABLE IF EXISTS negotiation_messages CASCADE`;
    await sql`DROP TABLE IF EXISTS negotiations CASCADE`;
    console.log('✓ Dropped existing tables');
    
    // Create negotiations table
    await sql`
      CREATE TABLE negotiations (
        id SERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        project_id INTEGER NOT NULL REFERENCES projects(id),
        investor_id INTEGER NOT NULL REFERENCES users(id),
        owner_id INTEGER NOT NULL REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'active' NOT NULL,
        started_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP,
        completed_at TIMESTAMP,
        agreement_reached BOOLEAN DEFAULT FALSE,
        suggested_terms JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✓ Created negotiations table');
    
    // Create negotiation_messages table
    await sql`
      CREATE TABLE negotiation_messages (
        id SERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        negotiation_id INTEGER NOT NULL REFERENCES negotiations(id) ON DELETE CASCADE,
        sender_id INTEGER NOT NULL REFERENCES users(id),
        message TEXT NOT NULL,
        is_ai_generated BOOLEAN DEFAULT FALSE,
        flagged BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✓ Created negotiation_messages table');
    
    // Create indexes
    await sql`CREATE INDEX negotiations_project_idx ON negotiations(project_id)`;
    await sql`CREATE INDEX negotiations_investor_idx ON negotiations(investor_id)`;
    await sql`CREATE INDEX negotiations_status_idx ON negotiations(status)`;
    await sql`CREATE INDEX negotiation_messages_negotiation_idx ON negotiation_messages(negotiation_id)`;
    await sql`CREATE INDEX negotiation_messages_sender_idx ON negotiation_messages(sender_id)`;
    console.log('✓ Created indexes');
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
