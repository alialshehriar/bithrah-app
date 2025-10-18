-- Complete Migration for Bithrah Platform
-- This script creates all missing tables and fixes schema issues

-- 1. Fix notifications table - add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add action_url if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='notifications' AND column_name='action_url') THEN
        ALTER TABLE notifications ADD COLUMN action_url VARCHAR(500);
    END IF;
    
    -- Add link column as alias for action_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='notifications' AND column_name='link') THEN
        ALTER TABLE notifications ADD COLUMN link VARCHAR(500);
    END IF;
    
    -- Add message column as alias for content
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='notifications' AND column_name='message') THEN
        ALTER TABLE notifications ADD COLUMN message TEXT;
    END IF;
END $$;

-- 2. Create wallet_transactions table if not exists
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
    
    -- Transaction details
    type VARCHAR(50) NOT NULL, -- deposit, withdrawal, transfer, commission, refund
    amount NUMERIC(12, 2) NOT NULL,
    balance_after NUMERIC(12, 2),
    currency VARCHAR(10) DEFAULT 'SAR',
    
    -- Description
    description TEXT,
    reference VARCHAR(255),
    
    -- Related entity
    related_id INTEGER,
    related_type VARCHAR(50), -- project, backing, referral, etc
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, cancelled
    
    -- Metadata
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS wallet_transactions_wallet_id_idx ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS wallet_transactions_type_idx ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS wallet_transactions_status_idx ON wallet_transactions(status);

-- 3. Ensure wallets table exists with correct structure
CREATE TABLE IF NOT EXISTS wallets (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    
    -- Balance
    balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    currency VARCHAR(10) DEFAULT 'SAR',
    
    -- Limits
    daily_limit NUMERIC(12, 2),
    monthly_limit NUMERIC(12, 2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, closed
    is_verified BOOLEAN DEFAULT false,
    
    -- Metadata
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS wallets_user_id_idx ON wallets(user_id);

-- 4. Create user_interests table if not exists
CREATE TABLE IF NOT EXISTS user_interests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    interest VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, interest)
);

CREATE INDEX IF NOT EXISTS user_interests_user_id_idx ON user_interests(user_id);

-- 5. Ensure all users have wallets
INSERT INTO wallets (user_id, balance, currency, status, created_at, updated_at)
SELECT id, 0.00, 'SAR', 'active', NOW(), NOW()
FROM users
WHERE id NOT IN (SELECT user_id FROM wallets WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;

-- 6. Update existing notifications to sync message and content
UPDATE notifications 
SET message = content 
WHERE message IS NULL AND content IS NOT NULL;

UPDATE notifications 
SET content = message 
WHERE content IS NULL AND message IS NOT NULL;

-- 7. Update existing notifications to sync link and action_url
UPDATE notifications 
SET link = action_url 
WHERE link IS NULL AND action_url IS NOT NULL;

UPDATE notifications 
SET action_url = link 
WHERE action_url IS NULL AND link IS NOT NULL;

-- 8. Add sample data for testing
-- This will be handled by the Node.js script

COMMIT;

