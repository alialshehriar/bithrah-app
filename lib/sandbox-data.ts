// Sandbox Data Generator for Bithrah Platform
// Generates complete dummy data for testing all features

export const sandboxUsers = [
  {
    id: 1001,
    name: 'أحمد محمد العلي',
    email: 'ahmed.ali@sandbox.bithrah.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    bio: 'رائد أعمال سعودي متخصص في التقنية المالية',
    level: 5,
    points: 2500,
    projects_count: 3,
    backings_count: 12
  },
  {
    id: 1002,
    name: 'فاطمة عبدالله',
    email: 'fatima.abdullah@sandbox.bithrah.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
    bio: 'مستثمرة ومهتمة بدعم المشاريع الناشئة',
    level: 7,
    points: 4200,
    projects_count: 1,
    backings_count: 28
  },
  {
    id: 1003,
    name: 'خالد سعد الغامدي',
    email: 'khaled.alghamdi@sandbox.bithrah.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khaled',
    bio: 'مطور تطبيقات ومهتم بالذكاء الاصطناعي',
    level: 4,
    points: 1800,
    projects_count: 2,
    backings_count: 8
  },
  {
    id: 1004,
    name: 'نورة إبراهيم',
    email: 'noura.ibrahim@sandbox.bithrah.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noura',
    bio: 'مصممة UI/UX وخبيرة في تجربة المستخدم',
    level: 6,
    points: 3100,
    projects_count: 4,
    backings_count: 15
  },
  {
    id: 1005,
    name: 'عمر الشهراني',
    email: 'omar.alshahrani@sandbox.bithrah.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',
    bio: 'مستشار أعمال ومدرب ريادة أعمال',
    level: 8,
    points: 5600,
    projects_count: 2,
    backings_count: 35
  }
];

export const sandboxProjects = [
  {
    id: 2001,
    title: 'منصة تعليم البرمجة للأطفال',
    description: 'منصة تفاعلية لتعليم الأطفال البرمجة من خلال الألعاب والأنشطة التفاعلية',
    category: 'تعليم',
    creator_id: 1001,
    creator_name: 'أحمد محمد العلي',
    goal: 150000,
    raised: 112500,
    backers_count: 45,
    days_left: 12,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    packages: [
      { id: 1, name: 'داعم برونزي', amount: 500, description: 'شكر خاص + شهادة تقدير', backers: 20 },
      { id: 2, name: 'داعم فضي', amount: 1000, description: 'كل ما سبق + اشتراك مجاني لمدة 3 أشهر', backers: 15 },
      { id: 3, name: 'داعم ذهبي', amount: 5000, description: 'كل ما سبق + جلسة استشارية مجانية', backers: 10 }
    ]
  },
  {
    id: 2002,
    title: 'تطبيق توصيل الطعام الصحي',
    description: 'تطبيق ذكي لتوصيل الوجبات الصحية المعدة من قبل أخصائيي تغذية',
    category: 'صحة',
    creator_id: 1002,
    creator_name: 'فاطمة عبدالله',
    goal: 200000,
    raised: 156000,
    backers_count: 62,
    days_left: 8,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    packages: [
      { id: 1, name: 'داعم مبتدئ', amount: 300, description: 'خصم 10% على أول طلب', backers: 30 },
      { id: 2, name: 'داعم متوسط', amount: 1500, description: 'اشتراك شهري مجاني', backers: 22 },
      { id: 3, name: 'داعم متميز', amount: 10000, description: 'اشتراك سنوي + استشارة تغذية', backers: 10 }
    ]
  },
  {
    id: 2003,
    title: 'منصة التجارة الإلكترونية للحرفيين',
    description: 'سوق إلكتروني يربط الحرفيين السعوديين بالمشترين مباشرة',
    category: 'تجارة إلكترونية',
    creator_id: 1003,
    creator_name: 'خالد سعد الغامدي',
    goal: 300000,
    raised: 225000,
    backers_count: 78,
    days_left: 15,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    packages: [
      { id: 1, name: 'داعم بسيط', amount: 200, description: 'شكر على المنصة', backers: 40 },
      { id: 2, name: 'داعم نشط', amount: 2000, description: 'عضوية مميزة لمدة سنة', backers: 28 },
      { id: 3, name: 'داعم استراتيجي', amount: 15000, description: 'حصة في الأرباح + مقعد استشاري', backers: 10 }
    ]
  }
];

export const sandboxCommunities = [
  {
    id: 3001,
    name: 'رواد الأعمال السعوديين',
    description: 'مجتمع لرواد الأعمال لتبادل الخبرات والفرص',
    category: 'أعمال',
    members_count: 1247,
    posts_count: 3421,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'
  },
  {
    id: 3002,
    name: 'المطورين والمبرمجين',
    description: 'مجتمع تقني لمناقشة البرمجة والتقنيات الحديثة',
    category: 'تقنية',
    members_count: 892,
    posts_count: 2156,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
  },
  {
    id: 3003,
    name: 'المستثمرون الملائكة',
    description: 'مجتمع للمستثمرين المهتمين بدعم المشاريع الناشئة',
    category: 'استثمار',
    members_count: 456,
    posts_count: 1089,
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800'
  }
];

export const sandboxMessages = [
  {
    id: 4001,
    sender_id: 1002,
    sender_name: 'فاطمة عبدالله',
    sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
    last_message: 'مرحباً، أنا مهتمة بالاستثمار في مشروعك',
    timestamp: '2024-01-15T10:30:00',
    unread: true
  },
  {
    id: 4002,
    sender_id: 1005,
    sender_name: 'عمر الشهراني',
    sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',
    last_message: 'هل يمكننا مناقشة تفاصيل الباقة الذهبية؟',
    timestamp: '2024-01-14T15:45:00',
    unread: false
  },
  {
    id: 4003,
    sender_id: 1003,
    sender_name: 'خالد سعد الغامدي',
    sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khaled',
    last_message: 'شكراً على دعمك للمشروع!',
    timestamp: '2024-01-13T09:20:00',
    unread: false
  }
];

export const sandboxEvents = [
  {
    id: 5001,
    title: 'ملتقى رواد الأعمال 2024',
    description: 'لقاء سنوي لرواد الأعمال والمستثمرين',
    date: '2024-02-15',
    location: 'الرياض، السعودية',
    attendees_count: 250,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
  },
  {
    id: 5002,
    title: 'ورشة عمل: كيف تجذب المستثمرين',
    description: 'ورشة تدريبية لتعلم مهارات عرض المشاريع',
    date: '2024-01-25',
    location: 'جدة، السعودية',
    attendees_count: 120,
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800'
  }
];

export const sandboxAchievements = [
  { id: 1, title: 'أول مشروع', description: 'أنشأت مشروعك الأول', icon: 'rocket', unlocked: true },
  { id: 2, title: 'داعم نشط', description: 'دعمت 10 مشاريع', icon: 'heart', unlocked: true },
  { id: 3, title: 'مستثمر ملاك', description: 'استثمرت أكثر من 50,000 ريال', icon: 'star', unlocked: false },
  { id: 4, title: 'قائد مجتمع', description: 'أنشأت مجتمع بأكثر من 100 عضو', icon: 'users', unlocked: false },
  { id: 5, title: 'مشروع ناجح', description: 'وصل مشروعك لهدف التمويل', icon: 'trophy', unlocked: true }
];

export const sandboxLeaderboard = [
  { rank: 1, user_id: 1005, name: 'عمر الشهراني', points: 5600, level: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar' },
  { rank: 2, user_id: 1002, name: 'فاطمة عبدالله', points: 4200, level: 7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima' },
  { rank: 3, user_id: 1004, name: 'نورة إبراهيم', points: 3100, level: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noura' },
  { rank: 4, user_id: 1001, name: 'أحمد محمد العلي', points: 2500, level: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed' },
  { rank: 5, user_id: 1003, name: 'خالد سعد الغامدي', points: 1800, level: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khaled' }
];
