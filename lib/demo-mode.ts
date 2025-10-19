/**
 * نظام إدارة الوضع التجريبي المركزي
 * يحتوي على جميع البيانات الوهمية والإعدادات للوضع التجريبي
 */

export const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.DEMO_MODE === 'true';
};

// بيانات المحفظة التجريبية
export const demoWalletData = {
  balance: 100000,
  currency: 'SAR',
  transactions: [
    {
      id: '1',
      type: 'deposit',
      amount: 100000,
      description: 'رصيد افتتاحي - وضع تجريبي',
      date: new Date().toISOString(),
      status: 'completed'
    },
    {
      id: '2',
      type: 'investment',
      amount: -5000,
      description: 'استثمار في مشروع تطبيق التوصيل',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed'
    },
    {
      id: '3',
      type: 'commission',
      amount: 250,
      description: 'عمولة تسويق من مشروع المتجر الإلكتروني',
      date: new Date(Date.now() - 172800000).toISOString(),
      status: 'completed'
    },
    {
      id: '4',
      type: 'reward',
      amount: 500,
      description: 'مكافأة إنجاز المستوى الثاني',
      date: new Date(Date.now() - 259200000).toISOString(),
      status: 'completed'
    },
    {
      id: '5',
      type: 'investment',
      amount: -3000,
      description: 'استثمار في مشروع منصة التعليم',
      date: new Date(Date.now() - 345600000).toISOString(),
      status: 'completed'
    }
  ]
};

// بيانات المشاريع التجريبية
export const demoProjects = [
  {
    id: '1',
    title: 'تطبيق توصيل ذكي',
    description: 'منصة توصيل مدعومة بالذكاء الاصطناعي لتحسين تجربة العملاء',
    category: 'تقنية',
    goal: 50000,
    raised: 35000,
    backers: 45,
    daysLeft: 15,
    image: '/projects/delivery-app.jpg',
    featured: true,
    trending: true
  },
  {
    id: '2',
    title: 'متجر إلكتروني للمنتجات المحلية',
    description: 'منصة لدعم المنتجات السعودية المحلية',
    category: 'تجارة',
    goal: 30000,
    raised: 28000,
    backers: 67,
    daysLeft: 8,
    image: '/projects/local-store.jpg',
    featured: true
  },
  {
    id: '3',
    title: 'منصة تعليمية تفاعلية',
    description: 'تعليم البرمجة للأطفال بطريقة ممتعة وتفاعلية',
    category: 'تعليم',
    goal: 40000,
    raised: 15000,
    backers: 32,
    daysLeft: 22,
    image: '/projects/edu-platform.jpg',
    trending: true
  }
];

// بيانات المجتمعات التجريبية
export const demoCommunities = [
  {
    id: '1',
    name: 'رواد الأعمال التقنيين',
    description: 'مجتمع لمناقشة أفكار المشاريع التقنية',
    members: 1250,
    posts: 450,
    category: 'تقنية',
    isGolden: true
  },
  {
    id: '2',
    name: 'المستثمرون الملائكة',
    description: 'مجتمع حصري للمستثمرين والداعمين',
    members: 340,
    posts: 180,
    category: 'استثمار',
    isGolden: true
  },
  {
    id: '3',
    name: 'التجارة الإلكترونية',
    description: 'نصائح وخبرات في مجال التجارة الإلكترونية',
    members: 890,
    posts: 320,
    category: 'تجارة',
    isGolden: false
  }
];

// بيانات المستخدمين التجريبية
export const demoUsers = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    role: 'investor',
    level: 5,
    points: 2500,
    joinDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'فاطمة علي',
    email: 'fatima@example.com',
    role: 'project_owner',
    level: 4,
    points: 1800,
    joinDate: '2024-02-20'
  },
  {
    id: '3',
    name: 'خالد سعيد',
    email: 'khaled@example.com',
    role: 'marketer',
    level: 3,
    points: 1200,
    joinDate: '2024-03-10'
  }
];

// إحصائيات المنصة التجريبية
export const demoPlatformStats = {
  totalUsers: 2847,
  activeProjects: 1234,
  totalFunding: 5420000,
  activeCommunities: 45,
  totalTransactions: 8950,
  successRate: 78.5
};

// بيانات التقييمات التجريبية
export const demoEvaluations = [
  {
    id: '1',
    projectName: 'تطبيق توصيل طعام صحي',
    score: 8.5,
    category: 'تقنية',
    date: new Date().toISOString(),
    strengths: ['فكرة مبتكرة', 'سوق واعد', 'فريق متمرس'],
    weaknesses: ['منافسة عالية', 'تكلفة تسويق مرتفعة'],
    recommendation: 'يُنصح بالاستثمار مع خطة تسويق قوية'
  },
  {
    id: '2',
    projectName: 'منصة تعليم اللغات',
    score: 7.2,
    category: 'تعليم',
    date: new Date(Date.now() - 86400000).toISOString(),
    strengths: ['محتوى تعليمي متميز', 'واجهة سهلة الاستخدام'],
    weaknesses: ['نموذج عمل غير واضح', 'حاجة لمزيد من المعلمين'],
    recommendation: 'يحتاج لتطوير استراتيجية الإيرادات'
  }
];

// دالة للحصول على البيانات التجريبية حسب النوع
export const getDemoData = (type: string) => {
  switch (type) {
    case 'wallet':
      return demoWalletData;
    case 'projects':
      return demoProjects;
    case 'communities':
      return demoCommunities;
    case 'users':
      return demoUsers;
    case 'stats':
      return demoPlatformStats;
    case 'evaluations':
      return demoEvaluations;
    default:
      return null;
  }
};

// دالة للتحقق من صلاحيات الوضع التجريبي
export const canAccessDemoFeature = (feature: string) => {
  if (!isDemoMode()) return false;
  
  const allowedFeatures = [
    'wallet',
    'projects',
    'communities',
    'evaluations',
    'subscriptions',
    'leaderboard'
  ];
  
  return allowedFeatures.includes(feature);
};

