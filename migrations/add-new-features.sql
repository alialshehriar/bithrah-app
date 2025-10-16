-- Platform Packages Table
CREATE TABLE IF NOT EXISTS platform_packages (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('basic', 'bithrah_plus')),
  commission_percentage DECIMAL(5, 2) NOT NULL,
  equity_percentage DECIMAL(5, 2),
  features TEXT NOT NULL,
  marketing_support BOOLEAN NOT NULL DEFAULT false,
  consulting_services BOOLEAN NOT NULL DEFAULT false,
  free_ai_evaluations INTEGER NOT NULL DEFAULT 0,
  priority_listing BOOLEAN NOT NULL DEFAULT false,
  advanced_support BOOLEAN NOT NULL DEFAULT false,
  detailed_reports BOOLEAN NOT NULL DEFAULT false,
  dedicated_account_manager BOOLEAN NOT NULL DEFAULT false,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  badge TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Negotiation Bots Table
CREATE TABLE IF NOT EXISTS negotiation_bots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('investor', 'project_owner', 'mediator')),
  personality VARCHAR(50) NOT NULL CHECK (personality IN ('professional', 'friendly', 'aggressive', 'conservative')),
  response_delay INTEGER DEFAULT 2000,
  strategies JSONB,
  knowledge_base JSONB,
  conversation_history JSONB,
  success_rate INTEGER DEFAULT 0,
  total_negotiations INTEGER DEFAULT 0,
  average_response_time INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_sandbox BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bot Messages Table
CREATE TABLE IF NOT EXISTS bot_messages (
  id SERIAL PRIMARY KEY,
  bot_id INTEGER REFERENCES negotiation_bots(id) ON DELETE CASCADE,
  negotiation_id INTEGER,
  message TEXT NOT NULL,
  message_type VARCHAR(50),
  sentiment VARCHAR(50),
  confidence INTEGER,
  context JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add is_sandbox column to existing tables if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_sandbox BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_sandbox BOOLEAN DEFAULT false;
ALTER TABLE negotiations ADD COLUMN IF NOT EXISTS is_sandbox BOOLEAN DEFAULT false;
ALTER TABLE wallets ADD COLUMN IF NOT EXISTS is_sandbox BOOLEAN DEFAULT false;

-- Add bot_id to negotiations table
ALTER TABLE negotiations ADD COLUMN IF NOT EXISTS bot_id INTEGER REFERENCES negotiation_bots(id) ON DELETE SET NULL;

-- Insert default platform packages
INSERT INTO platform_packages (id, name, type, commission_percentage, equity_percentage, features, marketing_support, consulting_services, free_ai_evaluations, priority_listing, advanced_support, detailed_reports, dedicated_account_manager, color, icon, badge, is_active)
VALUES 
  (
    'basic',
    'باقة Basic',
    'basic',
    6.50,
    NULL,
    '["عرض المشروع على المنصة", "دعم فني أساسي", "تقارير شهرية", "وصول لمجتمع بذرة"]',
    false,
    false,
    1,
    false,
    false,
    false,
    false,
    '#14B8A6',
    'shield',
    'الباقة الأساسية',
    true
  ),
  (
    'bithrah_plus',
    'باقة Bithrah Plus',
    'bithrah_plus',
    3.00,
    2.00,
    '["جميع مزايا Basic", "دعم تسويقي متقدم", "استشارات متخصصة", "5 تقييمات AI مجانية", "أولوية في العرض", "تقارير مفصلة أسبوعية", "مدير حساب مخصص", "شراكة 2% في المشروع"]',
    true,
    true,
    5,
    true,
    true,
    true,
    true,
    '#8B5CF6',
    'crown',
    'الباقة المميزة',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Insert initial sandbox setting
INSERT INTO system_settings (key, value, description, updated_at)
VALUES ('sandbox_enabled', 'false', 'Enable or disable sandbox mode', CURRENT_TIMESTAMP)
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_platform_packages_type ON platform_packages(type);
CREATE INDEX IF NOT EXISTS idx_negotiation_bots_type ON negotiation_bots(type);
CREATE INDEX IF NOT EXISTS idx_negotiation_bots_sandbox ON negotiation_bots(is_sandbox);
CREATE INDEX IF NOT EXISTS idx_bot_messages_bot_id ON bot_messages(bot_id);
CREATE INDEX IF NOT EXISTS idx_bot_messages_negotiation_id ON bot_messages(negotiation_id);
CREATE INDEX IF NOT EXISTS idx_users_sandbox ON users(is_sandbox);
CREATE INDEX IF NOT EXISTS idx_projects_sandbox ON projects(is_sandbox);
CREATE INDEX IF NOT EXISTS idx_negotiations_sandbox ON negotiations(is_sandbox);
CREATE INDEX IF NOT EXISTS idx_wallets_sandbox ON wallets(is_sandbox);

