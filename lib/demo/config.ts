/**
 * Demo Mode Configuration
 * إعدادات النسخة التجريبية لمنصة بذرة
 */

export const DEMO_CONFIG = {
  // الرصيد الافتراضي لكل مستخدم جديد
  DEFAULT_BALANCE: 100000.00,
  
  // العملة
  CURRENCY: 'SAR',
  CURRENCY_SYMBOL: 'ر.س',
  
  // رسائل النسخة التجريبية
  MESSAGES: {
    BANNER: '🎯 نسخة تجريبية كاملة - جرّب بذرة قبل الإطلاق الرسمي',
    BANNER_SUBTITLE: 'جميع المعاملات افتراضية ولا تُخصم فعليًا',
    WALLET_INFO: 'هذا رصيد افتراضي للتجربة فقط',
    TRANSACTION_SUCCESS: 'تمت العملية بنجاح (تجريبي)',
    TRANSACTION_INFO: 'تم خصم المبلغ من رصيدك التجريبي',
  },
  
  // إعدادات الجولة التعريفية
  WALKTHROUGH: {
    ENABLED: true,
    AUTO_START: true, // تبدأ تلقائيًا عند أول دخول
    STEPS: [
      {
        id: 1,
        title: 'مرحبًا بك في بذرة! 🌱',
        description: 'منصة التمويل الجماعي الرائدة في السعودية',
        target: 'home',
      },
      {
        id: 2,
        title: 'استكشف المشاريع',
        description: 'تصفح المشاريع المبتكرة ودعم الأفكار التي تؤمن بها',
        target: 'projects',
      },
      {
        id: 3,
        title: 'انضم للمجتمعات',
        description: 'تواصل مع رواد الأعمال والمستثمرين وشارك خبراتك',
        target: 'communities',
      },
      {
        id: 4,
        title: 'قيّم أفكارك بالذكاء الاصطناعي',
        description: 'احصل على تقييم احترافي لفكرتك قبل إطلاقها',
        target: 'evaluate',
      },
      {
        id: 5,
        title: 'إدارة محفظتك',
        description: 'تابع رصيدك ومعاملاتك وعمولاتك',
        target: 'wallet',
      },
      {
        id: 6,
        title: 'اختر باقتك',
        description: 'اشترك في الباقة المناسبة للحصول على مزايا إضافية',
        target: 'subscriptions',
      },
    ],
  },
  
  // إعدادات المحتوى التجريبي
  DEMO_CONTENT: {
    PROJECT: {
      id: 'demo-project-1',
      title: 'مشروع تجريبي - اكتشف كيف تعمل بذرة',
      description: 'هذا مشروع تجريبي يوضح لك كيفية عمل منصة بذرة. يمكنك دعم المشروع، التفاوض مع صاحب الفكرة، والتفاعل مع المجتمع.',
      category: 'تقنية',
      fundingGoal: 500000,
      currentFunding: 350000,
      backersCount: 127,
      status: 'active',
    },
    COMMUNITY: {
      id: 'demo-community-1',
      name: 'مجتمع بذرة التجريبي',
      description: 'تعرف على كيفية التفاعل مع المجتمعات، شارك أفكارك، وتواصل مع رواد الأعمال',
      membersCount: 1234,
      postsCount: 5,
      commentsCount: 15,
    },
    EVENT: {
      id: 'demo-event-1',
      title: 'ورشة عمل: كيف تطلق مشروعك على بذرة',
      description: 'ورشة عمل تفاعلية لتعلم كيفية إطلاق مشروعك بنجاح على منصة بذرة',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // بعد 7 أيام
      location: 'أونلاين',
      attendeesCount: 89,
    },
  },
};

/**
 * التحقق من أن المستخدم في وضع Demo
 */
export function isDemoMode(user: any): boolean {
  return user?.is_demo === true;
}

/**
 * الحصول على رصيد Demo للمستخدم
 */
export function getDemoBalance(user: any): number {
  return user?.demo_balance || DEMO_CONFIG.DEFAULT_BALANCE;
}

/**
 * تنسيق المبلغ مع العملة
 */
export function formatDemoAmount(amount: number): string {
  return `${amount.toLocaleString('ar-SA')} ${DEMO_CONFIG.CURRENCY_SYMBOL}`;
}

/**
 * معالجة معاملة Demo
 */
export function processDemoTransaction(
  currentBalance: number,
  amount: number,
  type: 'debit' | 'credit'
): { success: boolean; newBalance: number; message: string } {
  if (type === 'debit') {
    if (currentBalance < amount) {
      return {
        success: false,
        newBalance: currentBalance,
        message: 'الرصيد التجريبي غير كافٍ',
      };
    }
    return {
      success: true,
      newBalance: currentBalance - amount,
      message: DEMO_CONFIG.MESSAGES.TRANSACTION_SUCCESS,
    };
  } else {
    return {
      success: true,
      newBalance: currentBalance + amount,
      message: 'تمت إضافة المبلغ إلى رصيدك التجريبي',
    };
  }
}

export default DEMO_CONFIG;

