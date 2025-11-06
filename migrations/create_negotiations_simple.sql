-- Create negotiations table
CREATE TABLE IF NOT EXISTS negotiations (
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
);

-- Create negotiation_messages table
CREATE TABLE IF NOT EXISTS negotiation_messages (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  negotiation_id INTEGER NOT NULL REFERENCES negotiations(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS negotiations_project_idx ON negotiations(project_id);
CREATE INDEX IF NOT EXISTS negotiations_investor_idx ON negotiations(investor_id);
CREATE INDEX IF NOT EXISTS negotiations_status_idx ON negotiations(status);
CREATE INDEX IF NOT EXISTS negotiation_messages_negotiation_idx ON negotiation_messages(negotiation_id);
CREATE INDEX IF NOT EXISTS negotiation_messages_sender_idx ON negotiation_messages(sender_id);
