/**
 * Sandbox Mode System
 * Allows users to test the platform with virtual wallets and fake transactions
 */

export interface SandboxWallet {
  userId: number;
  balance: number;
  currency: string;
  transactions: SandboxTransaction[];
}

export interface SandboxTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'backing' | 'refund' | 'commission';
  amount: number;
  description: string;
  timestamp: Date;
  projectId?: number;
  status: 'completed' | 'pending' | 'failed';
}

// Default sandbox wallet balance
export const SANDBOX_DEFAULT_BALANCE = 100000; // 100,000 SAR

// Check if user is in sandbox mode
export function isSandboxMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('sandbox_mode') === 'true';
}

// Toggle sandbox mode
export function toggleSandboxMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sandbox_mode', enabled ? 'true' : 'false');
  
  // Reload page to apply changes
  window.location.reload();
}

// Get sandbox wallet for user
export function getSandboxWallet(userId: number): SandboxWallet {
  if (typeof window === 'undefined') {
    return {
      userId,
      balance: SANDBOX_DEFAULT_BALANCE,
      currency: 'SAR',
      transactions: [],
    };
  }

  const stored = localStorage.getItem(`sandbox_wallet_${userId}`);
  if (stored) {
    const wallet = JSON.parse(stored);
    // Convert date strings back to Date objects
    wallet.transactions = wallet.transactions.map((t: any) => ({
      ...t,
      timestamp: new Date(t.timestamp),
    }));
    return wallet;
  }

  // Create new sandbox wallet
  const newWallet: SandboxWallet = {
    userId,
    balance: SANDBOX_DEFAULT_BALANCE,
    currency: 'SAR',
    transactions: [
      {
        id: `init_${Date.now()}`,
        type: 'deposit',
        amount: SANDBOX_DEFAULT_BALANCE,
        description: 'رصيد افتتاحي للتجربة',
        timestamp: new Date(),
        status: 'completed',
      },
    ],
  };

  localStorage.setItem(`sandbox_wallet_${userId}`, JSON.stringify(newWallet));
  return newWallet;
}

// Update sandbox wallet
export function updateSandboxWallet(wallet: SandboxWallet): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`sandbox_wallet_${wallet.userId}`, JSON.stringify(wallet));
}

// Add transaction to sandbox wallet
export function addSandboxTransaction(
  userId: number,
  transaction: Omit<SandboxTransaction, 'id' | 'timestamp'>
): SandboxWallet {
  const wallet = getSandboxWallet(userId);
  
  const newTransaction: SandboxTransaction = {
    ...transaction,
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  };

  // Update balance based on transaction type
  if (transaction.type === 'deposit' || transaction.type === 'refund') {
    wallet.balance += transaction.amount;
  } else if (transaction.type === 'withdrawal' || transaction.type === 'backing' || transaction.type === 'commission') {
    wallet.balance -= transaction.amount;
  }

  wallet.transactions.unshift(newTransaction);
  updateSandboxWallet(wallet);
  
  return wallet;
}

// Process sandbox backing
export async function processSandboxBacking(
  userId: number,
  projectId: number,
  amount: number,
  projectTitle: string
): Promise<{ success: boolean; message: string; wallet?: SandboxWallet }> {
  const wallet = getSandboxWallet(userId);

  if (wallet.balance < amount) {
    return {
      success: false,
      message: 'رصيد غير كافي في المحفظة التجريبية',
    };
  }

  const updatedWallet = addSandboxTransaction(userId, {
    type: 'backing',
    amount,
    description: `دعم مشروع: ${projectTitle}`,
    projectId,
    status: 'completed',
  });

  return {
    success: true,
    message: 'تم الدعم بنجاح في الوضع التجريبي',
    wallet: updatedWallet,
  };
}

// Reset sandbox wallet
export function resetSandboxWallet(userId: number): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`sandbox_wallet_${userId}`);
}

// Get sandbox mode badge component data
export function getSandboxBadge() {
  return {
    text: 'وضع تجريبي',
    icon: '🧪',
    color: 'bg-yellow-500',
    description: 'أنت تستخدم المنصة في الوضع التجريبي. جميع المعاملات وهمية.',
  };
}

