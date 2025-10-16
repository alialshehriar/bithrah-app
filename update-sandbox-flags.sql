-- Update all existing projects to be sandbox data
UPDATE projects SET is_sandbox = true WHERE id > 0;

-- Update all existing backings to be sandbox data
UPDATE backings SET is_sandbox = true WHERE id > 0;

-- Update all existing wallets to be sandbox data
UPDATE wallets SET is_sandbox = true WHERE id > 0;

-- Update all existing transactions to be sandbox data (if column exists)
-- ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_sandbox BOOLEAN DEFAULT false;
-- UPDATE transactions SET is_sandbox = true WHERE id > 0;

-- Update all existing commissions to be sandbox data (if column exists)
-- ALTER TABLE commissions ADD COLUMN IF NOT EXISTS is_sandbox BOOLEAN DEFAULT false;
-- UPDATE commissions SET is_sandbox = true WHERE id > 0;

-- Update all existing referrals to be sandbox data (if column exists)
-- ALTER TABLE referrals ADD COLUMN IF NOT EXISTS is_sandbox BOOLEAN DEFAULT false;
-- UPDATE referrals SET is_sandbox = true WHERE id > 0;

SELECT 'Updated sandbox flags for all existing data' AS status;
