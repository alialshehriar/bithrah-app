/**
 * نظام إدارة الوضع التجريبي المركزي - محدّث
 * يحتوي على جميع البيانات الوهمية والإعدادات للوضع التجريبي
 */

export const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.DEMO_MODE === 'true';
};

export const getDemoWalletCredit = () => {
  return parseInt(process.env.NEXT_PUBLIC_DEMO_WALLET_CREDIT || '100000');
};

// بيانات المحفظة التجريبية
export const demoWalletData = {
  balance: getDemoWalletCredit(),
  currency: 'SAR',
  transactions: [
    {
      id: '1',
      type: 'deposit',
      amount: getDemoWalletCredit(),
      description: 'رصيد افتتاحي - وضع تجريبي',
      date: new Date().toISOString(),
      status: 'completed'
    },
    {
      id: '2',
      type: 'investment',
      amount: -5000,
      description: 'استثمار في مشروع بذرة التجريبي',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed'
    },
    {
      id: '3',
      type: 'commission',
      amount: 250,
      description: 'عمولة تسويق من مشروع تقني',
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
      type: 'subscription',
      amount: -199,
      description: 'اشتراك الباقة الذهبية',
      date: new Date(Date.now() - 345600000).toISOString(),
      status: 'completed'
    },
    {
      id: '6',
      type: 'negotiation',
      amount: -3000,
      description: 'فتح باب التفاوض لمشروع تقني',
      date: new Date(Date.now() - 432000000).toISOString(),
      status: 'completed'
    }
  ]
};

// مشروع بذرة التجريبي (Demo Project)
export const demoBithrahProject = {
  id: 'demo-bithrah-project',
  title: 'مشروع بذرة التجريبي',
  description: 'مشروع تجريبي يوضح كيفية عمل منصة بذرة. يمكنك تجربة جميع الميزات بدون أي مدفوعات حقيقية.',
  category: 'تقنية',
  goal: 50000,
  raised: 35000,
  backers: 45,
  daysLeft: 30,
  image: '/demo-project.jpg',
  featured: true,
  trending: true,
  is_demo: true,
  owner: {
    name: 'فريق بذرة',
    avatar: '/bithrah-logo.png'
  },
  packages: [
    {
      id: 1,
      name: 'باقة البداية',
      price: 500,
      description: 'عرض المشروع لمدة 30 يوم',
      features: ['ظهور في القائمة العادية', 'دعم فني أساسي']
    },
    {
      id: 2,
      name: 'باقة النمو',
      price: 1500,
      description: 'عرض المشروع لمدة 60 يوم',
      features: ['ظهور مميز', 'شارة مشروع مميز', 'تحليلات أساسية', 'دعم متقدم']
    },
    {
      id: 3,
      name: 'باقة الاحتراف',
      price: 3000,
      description: 'عرض المشروع لمدة 90 يوم',
      features: ['أعلى القائمة', 'شارة احترافية', 'تحليلات AI', 'دعم 24/7', 'ترويج بريدي']
    }
  ],
  negotiation: {
    available: true,
    baseFee: 2000,
    rate: 0.02,
    calculatedFee: 3000
  }
};

// مجتمع بذرة التجريبي (Demo Community)
export const demoBithrahCommunity = {
  id: 'demo-bithrah-community',
  name: 'مجتمع بذرة التجريبي',
  description: 'مجتمع تجريبي لتوضيح كيفية التواصل والمشاركة داخل منصة بذرة',
  members: 1250,
  posts: 45,
  category: 'عام',
  is_demo: true,
  isGolden: false,
  topics: [
    {
      id: 1,
      title: 'مرحباً بك في مجتمع بذرة التجريبي',
      content: 'هذا موضوع تجريبي يوضح كيف يمكنك نشر المواضيع والتفاعل مع الأعضاء الآخرين.',
      author: 'فريق بذرة',
      replies: 12,
      likes: 25,
      date: new Date().toISOString()
    },
    {
      id: 2,
      title: 'كيف تنشر موضوع جديد؟',
      content: 'يمكنك نشر موضوع جديد من خلال الضغط على زر "موضوع جديد" في أعلى الصفحة.',
      author: 'فريق بذرة',
      replies: 8,
      likes: 18,
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 3,
      title: 'كيف ترد على الآخرين؟',
      content: 'يمكنك الرد على أي موضوع من خلال الضغط على زر "رد" أسفل الموضوع.',
      author: 'فريق بذرة',
      replies: 5,
      likes: 10,
      date: new Date(Date.now() - 172800000).toISOString()
    }
  ]
};

// باقات الاشتراك
export const subscriptionPlans = [
  {
    id: 'silver',
    name: 'الباقة الفضية',
    price: 99,
    duration: 30,
    features: [
      'إشعارات مبكرة للمشاريع الجديدة',
      'تنبيهات للمشاريع القريبة من الاكتمال',
      'وصول لمجتمعات حصرية',
      'تحليلات أساسية بالذكاء الاصطناعي',
      'خصم 5% على رسوم التفاوض'
    ],
    color: 'from-gray-400 to-gray-500'
  },
  {
    id: 'gold',
    name: 'الباقة الذهبية',
    price: 199,
    duration: 30,
    popular: true,
    features: [
      'جميع مزايا الباقة الفضية',
      'وصول للمجتمعات الذهبية الحصرية',
      'تحليلات متقدمة بالذكاء الاصطناعي',
      'توصيات مشاريع مخصصة',
      'أولوية في التواصل مع أصحاب المشاريع',
      'خصم 10% على رسوم التفاوض',
      'تقارير شهرية مفصلة'
    ],
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'platinum',
    name: 'الباقة البلاتينية',
    price: 399,
    duration: 30,
    features: [
      'جميع مزايا الباقة الذهبية',
      'وصول مبكر حصري للمشاريع',
      'مستشار استثماري شخصي',
      'تحليلات AI متقدمة وتنبؤات',
      'أولوية قصوى في جميع الميزات',
      'خصم 20% على رسوم التفاوض',
      'دعوات لفعاليات VIP',
      'تقارير أسبوعية مخصصة',
      'وصول لمجتمع المستثمرين النخبة'
    ],
    color: 'from-purple-500 to-indigo-600'
  }
];

// حساب رسوم التفاوض
export const calculateNegotiationFee = (targetAmount: number) => {
  const baseFee = parseInt(process.env.NEGOTIATION_BASE_FEE || '2000');
  const rate = parseFloat(process.env.NEGOTIATION_RATE || '0.02');
  const min = parseInt(process.env.NEGOTIATION_MIN || '1000');
  const max = parseInt(process.env.NEGOTIATION_MAX || '20000');
  
  const calculatedFee = baseFee + (targetAmount * rate);
  return Math.max(min, Math.min(max, calculatedFee));
};

// بيانات تقييم الأفكار التجريبية
export const demoEvaluations = [
  {
    id: '1',
    projectName: 'تطبيق توصيل طعام صحي',
    score: 8.5,
    category: 'تقنية',
    date: new Date().toISOString(),
    metrics: {
      marketValue: 8.5,
      risks: 6.5,
      innovation: 9.0,
      feasibility: 8.0,
      marketFit: 8.5
    },
    strengths: ['فكرة مبتكرة', 'سوق واعد', 'فريق متمرس'],
    weaknesses: ['منافسة عالية', 'تكلفة تسويق مرتفعة'],
    recommendation: 'يُنصح بالاستثمار مع خطة تسويق قوية'
  }
];

// نظام حماية الملكية الفكرية
export const intellectualProtectionInfo = {
  title: 'نظام حماية الملكية الفكرية',
  description: 'في بذرة، أي فكرة تُسجل أو تُعرض داخل المنصة تخضع لنظام حماية ذكي يضمن سريتها وحقوق مالكها. لا يمكن لأي مستخدم نسخ أو إعادة نشر أي مشروع دون موافقة صاحبه. جميع المشاريع مسجلة زمنياً ومحفوظة في قاعدة بيانات مشفرة.',
  features: [
    'تسجيل زمني لجميع الأفكار والمشاريع',
    'قاعدة بيانات مشفرة بأعلى معايير الأمان',
    'حماية من النسخ وإعادة النشر',
    'نظام تتبع للتعديلات والتحديثات',
    'إثبات ملكية قانوني عند الحاجة'
  ]
};

// دالة للحصول على البيانات التجريبية حسب النوع
export const getDemoData = (type: string) => {
  switch (type) {
    case 'wallet':
      return demoWalletData;
    case 'project':
      return demoBithrahProject;
    case 'community':
      return demoBithrahCommunity;
    case 'subscriptions':
      return subscriptionPlans;
    case 'evaluations':
      return demoEvaluations;
    case 'intellectualProtection':
      return intellectualProtectionInfo;
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
    'negotiation',
    'leaderboard',
    'referrals'
  ];
  
  return allowedFeatures.includes(feature);
};

// دالة لمعالجة عملية تجريبية (خصم واسترداد)
export const processDemoTransaction = async (
  userId: string,
  amount: number,
  type: string,
  description: string
) => {
  if (!isDemoMode()) return { success: false, message: 'الوضع التجريبي غير مفعل' };
  
  // في الوضع التجريبي، نقوم بخصم المبلغ واستراداده تلقائياً بعد فترة
  return {
    success: true,
    message: 'تمت العملية بنجاح (تجريبي)',
    transactionId: `demo-${Date.now()}`,
    refundScheduled: true,
    refundTime: new Date(Date.now() + 300000).toISOString() // 5 دقائق
  };
};

