-- Add sandbox mode setting
INSERT INTO settings (key, value, category, description, is_public, updated_at)
VALUES (
  'sandbox_mode',
  '{"enabled": false, "description": "Enable sandbox mode to show dummy data for testing"}'::jsonb,
  'system',
  'Controls whether the application shows real data or dummy data for testing purposes',
  false,
  NOW()
)
ON CONFLICT (key) DO NOTHING;

-- Add login tracking table if not exists
CREATE TABLE IF NOT EXISTS login_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  email VARCHAR(255),
  ip_address VARCHAR(50),
  user_agent TEXT,
  login_method VARCHAR(50), -- email, google, etc
  status VARCHAR(50) DEFAULT 'success', -- success, failed
  failure_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS login_logs_user_idx ON login_logs(user_id);
CREATE INDEX IF NOT EXISTS login_logs_created_at_idx ON login_logs(created_at);

-- Add idea evaluations tracking (already exists in ai_evaluations but ensure it's complete)
-- Ensure ai_evaluations table has all necessary fields
ALTER TABLE ai_evaluations ADD COLUMN IF NOT EXISTS evaluation_data JSONB;
ALTER TABLE ai_evaluations ADD COLUMN IF NOT EXISTS strengths JSONB;
ALTER TABLE ai_evaluations ADD COLUMN IF NOT EXISTS weaknesses JSONB;
ALTER TABLE ai_evaluations ADD COLUMN IF NOT EXISTS recommendations JSONB;

-- Add interaction tracking fields to analytics if not exist
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS interaction_type VARCHAR(50); -- like, comment, share, view
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS duration INTEGER; -- time spent in seconds

-- Ensure wallets table has all necessary fields
ALTER TABLE wallets ADD COLUMN IF NOT EXISTS pending_balance NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE wallets ADD COLUMN IF NOT EXISTS available_balance NUMERIC(12, 2) DEFAULT 0;

-- Add commission tracking to transactions
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS commission_type VARCHAR(50); -- marketing, platform, referral
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5, 2); -- percentage

-- Add project views tracking
CREATE TABLE IF NOT EXISTS project_views (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  session_id VARCHAR(255),
  ip_address VARCHAR(50),
  user_agent TEXT,
  referrer VARCHAR(500),
  duration INTEGER, -- seconds spent viewing
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS project_views_project_idx ON project_views(project_id);
CREATE INDEX IF NOT EXISTS project_views_user_idx ON project_views(user_id);
CREATE INDEX IF NOT EXISTS project_views_created_at_idx ON project_views(created_at);

-- Add evaluation requests tracking
CREATE TABLE IF NOT EXISTS evaluation_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  project_id INTEGER REFERENCES projects(id),
  idea_title VARCHAR(255),
  idea_description TEXT,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  ai_evaluation_id INTEGER REFERENCES ai_evaluations(id),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS evaluation_requests_user_idx ON evaluation_requests(user_id);
CREATE INDEX IF NOT EXISTS evaluation_requests_status_idx ON evaluation_requests(status);

