-- ============================================
-- Wallet & Commission System - Complete Schema
-- ============================================

-- 1. Wallets Table
CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  pending_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_earned NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_withdrawn NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'SAR',
  status VARCHAR(50) DEFAULT 'active',
  is_sandbox BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS wallets_user_idx ON wallets(user_id);
CREATE INDEX IF NOT EXISTS wallets_status_idx ON wallets(status);

-- 2. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  wallet_id INTEGER NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'commission', 'withdrawal', 'refund', 'deposit', 'payment'
  amount NUMERIC(12, 2) NOT NULL,
  balance_before NUMERIC(12, 2) NOT NULL,
  balance_after NUMERIC(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'cancelled'
  description TEXT,
  reference_type VARCHAR(50), -- 'project', 'backing', 'negotiation', 'referral'
  reference_id INTEGER,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS transactions_wallet_idx ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS transactions_user_idx ON transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_type_idx ON transactions(type);
CREATE INDEX IF NOT EXISTS transactions_status_idx ON transactions(status);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON transactions(created_at DESC);

-- 3. Referral Codes Table
CREATE TABLE IF NOT EXISTS referral_codes (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) DEFAULT 'general', -- 'general', 'project', 'campaign'
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  commission_rate NUMERIC(5, 2) DEFAULT 5.00, -- percentage
  uses_count INTEGER DEFAULT 0,
  max_uses INTEGER, -- NULL = unlimited
  total_earned NUMERIC(12, 2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'expired'
  expires_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS referral_codes_user_idx ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS referral_codes_code_idx ON referral_codes(code);
CREATE INDEX IF NOT EXISTS referral_codes_project_idx ON referral_codes(project_id);
CREATE INDEX IF NOT EXISTS referral_codes_status_idx ON referral_codes(status);

-- 4. Referrals Table (Tracking)
CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  referral_code_id INTEGER NOT NULL REFERENCES referral_codes(id) ON DELETE CASCADE,
  referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  backing_id INTEGER REFERENCES backings(id) ON DELETE SET NULL,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  commission_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  commission_rate NUMERIC(5, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'paid', 'cancelled'
  paid_at TIMESTAMP,
  ip_address VARCHAR(50),
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS referrals_code_idx ON referrals(referral_code_id);
CREATE INDEX IF NOT EXISTS referrals_referrer_idx ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS referrals_referred_user_idx ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS referrals_backing_idx ON referrals(backing_id);
CREATE INDEX IF NOT EXISTS referrals_status_idx ON referrals(status);
CREATE INDEX IF NOT EXISTS referrals_created_at_idx ON referrals(created_at DESC);

-- 5. Commissions Table
CREATE TABLE IF NOT EXISTS commissions (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_id INTEGER NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'referral', 'marketing', 'platform'
  source_type VARCHAR(50) NOT NULL, -- 'backing', 'project', 'subscription'
  source_id INTEGER NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  rate NUMERIC(5, 2) NOT NULL,
  base_amount NUMERIC(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'paid', 'cancelled'
  approved_at TIMESTAMP,
  paid_at TIMESTAMP,
  approved_by INTEGER REFERENCES users(id),
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS commissions_user_idx ON commissions(user_id);
CREATE INDEX IF NOT EXISTS commissions_wallet_idx ON commissions(wallet_id);
CREATE INDEX IF NOT EXISTS commissions_type_idx ON commissions(type);
CREATE INDEX IF NOT EXISTS commissions_source_idx ON commissions(source_type, source_id);
CREATE INDEX IF NOT EXISTS commissions_status_idx ON commissions(status);
CREATE INDEX IF NOT EXISTS commissions_created_at_idx ON commissions(created_at DESC);

-- 6. Withdrawal Requests Table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_id INTEGER NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  fee NUMERIC(12, 2) DEFAULT 0.00,
  net_amount NUMERIC(12, 2) NOT NULL,
  method VARCHAR(50) NOT NULL, -- 'bank_transfer', 'paypal', 'stripe'
  account_details JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'rejected', 'cancelled'
  processed_by INTEGER REFERENCES users(id),
  processed_at TIMESTAMP,
  rejection_reason TEXT,
  transaction_id INTEGER REFERENCES transactions(id),
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS withdrawal_requests_user_idx ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS withdrawal_requests_wallet_idx ON withdrawal_requests(wallet_id);
CREATE INDEX IF NOT EXISTS withdrawal_requests_status_idx ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS withdrawal_requests_created_at_idx ON withdrawal_requests(created_at DESC);

-- 7. Add wallet-related fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_commissions_earned NUMERIC(12, 2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_marketer BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS marketer_level VARCHAR(50); -- 'bronze', 'silver', 'gold', 'platinum'

-- 8. Add commission tracking to backings table
ALTER TABLE backings ADD COLUMN IF NOT EXISTS referral_code_id INTEGER REFERENCES referral_codes(id);
ALTER TABLE backings ADD COLUMN IF NOT EXISTS commission_earned NUMERIC(12, 2) DEFAULT 0.00;
ALTER TABLE backings ADD COLUMN IF NOT EXISTS commission_status VARCHAR(50) DEFAULT 'pending';

-- 9. Create function to automatically create wallet for new users
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (user_id, balance, currency, status)
  VALUES (NEW.id, 0.00, 'SAR', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_create_user_wallet ON users;
CREATE TRIGGER trigger_create_user_wallet
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_user_wallet();

-- 10. Create function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(user_id_param INTEGER)
RETURNS VARCHAR(50) AS $$
DECLARE
  code VARCHAR(50);
  exists_check INTEGER;
BEGIN
  LOOP
    -- Generate random 8-character code
    code := upper(substring(md5(random()::text || user_id_param::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT COUNT(*) INTO exists_check FROM referral_codes WHERE code = code;
    
    EXIT WHEN exists_check = 0;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- 11. Create function to calculate commission
CREATE OR REPLACE FUNCTION calculate_commission(
  amount_param NUMERIC,
  rate_param NUMERIC
)
RETURNS NUMERIC AS $$
BEGIN
  RETURN ROUND(amount_param * (rate_param / 100), 2);
END;
$$ LANGUAGE plpgsql;

-- 12. Create view for wallet summary
CREATE OR REPLACE VIEW wallet_summary AS
SELECT 
  w.id,
  w.uuid,
  w.user_id,
  u.username,
  u.email,
  w.balance,
  w.pending_balance,
  w.total_earned,
  w.total_withdrawn,
  w.currency,
  w.status,
  w.is_sandbox,
  COUNT(DISTINCT t.id) as transaction_count,
  COUNT(DISTINCT c.id) as commission_count,
  COALESCE(SUM(CASE WHEN c.status = 'pending' THEN c.amount ELSE 0 END), 0) as pending_commissions,
  w.created_at,
  w.updated_at
FROM wallets w
JOIN users u ON w.user_id = u.id
LEFT JOIN transactions t ON w.id = t.wallet_id
LEFT JOIN commissions c ON w.id = c.wallet_id
GROUP BY w.id, w.uuid, w.user_id, u.username, u.email, w.balance, w.pending_balance, 
         w.total_earned, w.total_withdrawn, w.currency, w.status, w.is_sandbox, 
         w.created_at, w.updated_at;

-- 13. Create indexes for performance
CREATE INDEX IF NOT EXISTS users_referral_code_idx ON users(referral_code);
CREATE INDEX IF NOT EXISTS users_is_marketer_idx ON users(is_marketer);
CREATE INDEX IF NOT EXISTS backings_referral_code_idx ON backings(referral_code_id);
CREATE INDEX IF NOT EXISTS backings_commission_status_idx ON backings(commission_status);

