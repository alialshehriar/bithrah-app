-- Add new fields to projects table for mediation platform

-- Privacy & IP Protection (3 levels)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS platform_package VARCHAR(50) DEFAULT 'basic';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS public_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS registered_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS confidential_docs JSONB;

-- Negotiation settings
ALTER TABLE projects ADD COLUMN IF NOT EXISTS negotiation_enabled BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS negotiation_deposit NUMERIC(12, 2);

-- Funding timeline (60 days)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS funding_duration INTEGER DEFAULT 60;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS funding_start_date TIMESTAMP;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS funding_end_date TIMESTAMP;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS auto_refund_on_failure BOOLEAN DEFAULT true;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS payment_gateway_fee NUMERIC(5, 2) DEFAULT 2.00;

-- Add marketing commission fields to backings table
ALTER TABLE backings ADD COLUMN IF NOT EXISTS referrer_id INTEGER REFERENCES users(id);
ALTER TABLE backings ADD COLUMN IF NOT EXISTS marketing_commission NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE backings ADD COLUMN IF NOT EXISTS commission_paid BOOLEAN DEFAULT false;

-- Update negotiations table
ALTER TABLE negotiations ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC(12, 2);
ALTER TABLE negotiations ADD COLUMN IF NOT EXISTS deposit_status VARCHAR(50) DEFAULT 'held';
ALTER TABLE negotiations ADD COLUMN IF NOT EXISTS deposit_refunded_at TIMESTAMP;
ALTER TABLE negotiations ADD COLUMN IF NOT EXISTS has_full_access BOOLEAN DEFAULT false;

-- Create NDA agreements table
CREATE TABLE IF NOT EXISTS nda_agreements (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL REFERENCES users(id),
  project_id INTEGER REFERENCES projects(id),
  agreement_type VARCHAR(50) DEFAULT 'platform',
  agreement_version VARCHAR(20) NOT NULL,
  agreement_text TEXT NOT NULL,
  signed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ip_address VARCHAR(50),
  user_agent TEXT,
  signature_data JSONB,
  status VARCHAR(50) DEFAULT 'active',
  revoked_at TIMESTAMP,
  revoked_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS nda_agreements_user_idx ON nda_agreements(user_id);
CREATE INDEX IF NOT EXISTS nda_agreements_project_idx ON nda_agreements(project_id);
CREATE INDEX IF NOT EXISTS nda_agreements_status_idx ON nda_agreements(status);

-- Create project access logs table
CREATE TABLE IF NOT EXISTS project_access_logs (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  user_id INTEGER REFERENCES users(id),
  access_level VARCHAR(50) NOT NULL,
  access_type VARCHAR(50) NOT NULL,
  content_type VARCHAR(100),
  content_id VARCHAR(255),
  ip_address VARCHAR(50),
  user_agent TEXT,
  referrer VARCHAR(500),
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS project_access_logs_project_user_idx ON project_access_logs(project_id, user_id);
CREATE INDEX IF NOT EXISTS project_access_logs_user_idx ON project_access_logs(user_id);
CREATE INDEX IF NOT EXISTS project_access_logs_created_at_idx ON project_access_logs(created_at);
