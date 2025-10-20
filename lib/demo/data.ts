/**
 * Demo Mode Data
 * البيانات التجريبية لمنصة بذرة
 */

export const DEMO_PROJECT = {
  id: 'demo-project-1',
  uuid: 'demo-uuid-project-1',
  creatorId: 0,
  creatorName: 'فريق بذرة',
  creatorAvatar: '/images/demo-avatar.png',
  
  title: 'مشروع تجريبي - اكتشف كيف تعمل بذرة',
  slug: 'demo-project-discover-bithrah',
  description: `# مرحبًا بك في المشروع التجريبي! 🌱

هذا مشروع تجريبي كامل يوضح لك جميع ميزات منصة بذرة.

## ما يمكنك فعله:
- 💰 دعم المشروع بأي مبلغ من رصيدك التجريبي
- 🤝 فتح بوابة التفاوض مع صاحب الفكرة
- 📊 مشاهدة تقدم التمويل والإحصائيات
- 💬 التفاعل مع المجتمع والتعليقات
- 🎁 اختيار باقات الدعم المختلفة

## عن المشروع:
منصة بذرة هي منصة التمويل الجماعي الرائدة في السعودية، تربط بين أصحاب الأفكار والمستثمرين لتحويل الأحلام إلى واقع.

### المزايا:
- ✅ تمويل آمن وموثوق
- ✅ نظام تفاوض ذكي
- ✅ تقييم بالذكاء الاصطناعي
- ✅ مجتمع نشط من رواد الأعمال

**ملاحظة**: جميع المعاملات في هذا المشروع افتراضية ولا تُخصم فعليًا.`,
  
  shortDescription: 'اكتشف كيف تعمل منصة بذرة من خلال هذا المشروع التجريبي الكامل',
  category: 'تقنية',
  subCategory: 'منصات رقمية',
  tags: ['تجريبي', 'تمويل جماعي', 'ريادة أعمال', 'تقنية'],
  
  coverImage: '/images/demo-project-cover.jpg',
  images: [
    '/images/demo-project-1.jpg',
    '/images/demo-project-2.jpg',
    '/images/demo-project-3.jpg',
  ],
  video: 'https://www.youtube.com/watch?v=demo',
  
  fundingGoal: '500000',
  currentFunding: '350000',
  backersCount: 127,
  daysLeft: 45,
  
  status: 'active',
  visibility: 'public',
  featured: true,
  
  packages: [
    {
      id: 1,
      name: 'باقة البداية',
      description: 'ادعم المشروع وكن جزءًا من النجاح',
      price: '100',
      benefits: ['شكر خاص', 'تحديثات حصرية'],
      available: true,
      backers: 45,
    },
    {
      id: 2,
      name: 'باقة الداعم',
      description: 'دعم أكبر مع مزايا إضافية',
      price: '500',
      benefits: ['كل ما سبق', 'وصول مبكر', 'شهادة تقدير'],
      available: true,
      backers: 32,
    },
    {
      id: 3,
      name: 'باقة الشريك',
      description: 'كن شريكًا استراتيجيًا في المشروع',
      price: '2000',
      benefits: ['كل ما سبق', 'اجتماع مع الفريق', 'ذكر في الموقع'],
      available: true,
      backers: 15,
    },
  ],
  
  updates: [
    {
      id: 1,
      title: 'تحديث: وصلنا 70% من الهدف!',
      content: 'شكرًا لجميع الداعمين، وصلنا إلى 70% من هدفنا التمويلي!',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      title: 'إطلاق ميزة التفاوض الذكي',
      content: 'يمكنك الآن فتح بوابة التفاوض مع صاحب الفكرة مباشرة',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ],
  
  comments: [
    {
      id: 1,
      userId: 1,
      userName: 'أحمد المطيري',
      userAvatar: '/images/avatar-1.jpg',
      content: 'مشروع رائع! متحمس لرؤية النتائج',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 12,
    },
    {
      id: 2,
      userId: 2,
      userName: 'سارة العتيبي',
      userAvatar: '/images/avatar-2.jpg',
      content: 'فكرة مبتكرة، بالتوفيق للفريق',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      likes: 8,
    },
  ],
  
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(),
};

export const DEMO_COMMUNITY = {
  id: 'demo-community-1',
  uuid: 'demo-uuid-community-1',
  creatorId: 0,
  
  name: 'مجتمع بذرة التجريبي',
  slug: 'demo-bithrah-community',
  description: `مرحبًا بك في مجتمع بذرة التجريبي! 👋

هذا مجتمع تفاعلي يوضح لك كيفية:
- 📝 نشر المحتوى والأفكار
- 💬 التعليق والتفاعل مع الأعضاء
- ❤️ الإعجاب والحفظ
- 🔔 متابعة التحديثات

انضم الآن وكن جزءًا من مجتمع رواد الأعمال!`,
  
  category: 'ريادة أعمال',
  coverImage: '/images/demo-community-cover.jpg',
  avatar: '/images/demo-community-avatar.jpg',
  
  membersCount: 1234,
  postsCount: 5,
  isPublic: true,
  isPremium: false,
  
  posts: [
    {
      id: 1,
      authorId: 1,
      authorName: 'محمد السعيد',
      authorAvatar: '/images/avatar-3.jpg',
      content: 'ما هي أفضل الممارسات لإطلاق مشروع ناجح على بذرة؟',
      likes: 24,
      comments: 8,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      authorId: 2,
      authorName: 'فاطمة الدوسري',
      authorAvatar: '/images/avatar-4.jpg',
      content: 'شاركت تجربتي في التمويل الجماعي، تعلمت الكثير!',
      likes: 18,
      comments: 5,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ],
  
  rules: [
    'احترم جميع الأعضاء',
    'لا للمحتوى المسيء',
    'شارك خبراتك بإيجابية',
    'ساعد الآخرين',
  ],
  
  createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(),
};

export const DEMO_EVENT = {
  id: 'demo-event-1',
  uuid: 'demo-uuid-event-1',
  organizerId: 0,
  
  title: 'ورشة عمل: كيف تطلق مشروعك على بذرة',
  slug: 'demo-workshop-launch-project',
  description: `# ورشة عمل تفاعلية 🎯

تعلم كيفية إطلاق مشروعك بنجاح على منصة بذرة.

## ما ستتعلمه:
- 📋 كيفية إعداد صفحة المشروع
- 💰 استراتيجيات التمويل الناجحة
- 📱 التسويق والترويج
- 🤝 بناء مجتمع داعم
- 📊 تحليل النتائج

## المحاضرون:
- خبراء في التمويل الجماعي
- رواد أعمال ناجحون
- فريق بذرة

**المدة**: ساعتان  
**المكان**: أونلاين (Zoom)  
**التسجيل**: مجاني`,
  
  category: 'ورشة عمل',
  type: 'online',
  
  startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
  
  location: 'أونلاين - Zoom',
  coverImage: '/images/demo-event-cover.jpg',
  
  attendeesCount: 89,
  maxAttendees: 200,
  
  status: 'upcoming',
  isFeatured: true,
  isFree: true,
  
  agenda: [
    { time: '19:00', title: 'الترحيب والتعارف' },
    { time: '19:15', title: 'مقدمة عن بذرة' },
    { time: '19:30', title: 'كيفية إنشاء مشروع ناجح' },
    { time: '20:00', title: 'استراتيجيات التمويل' },
    { time: '20:30', title: 'جلسة أسئلة وأجوبة' },
  ],
  
  createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(),
};

export const DEMO_WALLET_TRANSACTIONS = [
  {
    id: 1,
    type: 'credit',
    amount: 100000,
    description: 'رصيد تجريبي أولي',
    status: 'completed',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    type: 'debit',
    amount: 500,
    description: 'دعم مشروع تجريبي',
    status: 'completed',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    type: 'credit',
    amount: 50,
    description: 'عمولة إحالة',
    status: 'completed',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export const DEMO_USER_STATS = {
  projectsSupported: 3,
  totalInvested: 1500,
  commissionEarned: 150,
  referralsCount: 5,
  level: 2,
  points: 450,
  achievements: [
    { id: 1, name: 'أول دعم', icon: '🎯', unlocked: true },
    { id: 2, name: 'داعم نشط', icon: '⭐', unlocked: true },
    { id: 3, name: 'مسوق ناجح', icon: '💼', unlocked: false },
  ],
};

export default {
  DEMO_PROJECT,
  DEMO_COMMUNITY,
  DEMO_EVENT,
  DEMO_WALLET_TRANSACTIONS,
  DEMO_USER_STATS,
};

