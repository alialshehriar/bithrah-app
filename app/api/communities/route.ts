import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode, demoBithrahCommunity } from '@/lib/demo-mode';

export const dynamic = 'force-dynamic';
// Sandbox communities data with correct structure
const sandboxCommunities = [
  // Demo community - always first
  {
    id: 999,
    name: 'مجتمع بذرة التجريبي',
    description: 'مجتمع تجريبي لتوضيح كيفية التواصل والمشاركة داخل منصة بذرة',
    category: 'other',
    privacy: 'public',
    coverImage: null,
    memberCount: 1250,
    postCount: 45,
    createdAt: new Date().toISOString(),
    isDemo: true,
    creator: {
      id: 0,
      name: 'فريق بذرة',
      username: 'bithrah_team',
      avatar: null,
    },
  },
  {
    id: 1,
    name: 'مجتمع التقنية والابتكار',
    description: 'مجتمع متخصص في التقنية والابتكار وريادة الأعمال التقنية',
    category: 'technology',
    privacy: 'public',
    coverImage: null,
    memberCount: 2547,
    postCount: 450,
    createdAt: new Date('2024-01-15').toISOString(),
    isDemo: false,
    creator: {
      id: 1,
      name: 'أحمد محمد',
      username: 'ahmed_tech',
      avatar: null,
    },
  },
  {
    id: 2,
    name: 'مجتمع الصحة والطب',
    description: 'مجتمع للمهتمين بالصحة والطب والابتكارات الطبية',
    category: 'health',
    privacy: 'public',
    coverImage: null,
    memberCount: 1823,
    postCount: 320,
    createdAt: new Date('2024-02-01').toISOString(),
    isDemo: false,
    creator: {
      id: 2,
      name: 'فاطمة علي',
      username: 'fatima_health',
      avatar: null,
    },
  },
  {
    id: 3,
    name: 'مجتمع التعليم والتدريب',
    description: 'مجتمع متخصص في التعليم والتدريب والتطوير المهني',
    category: 'education',
    privacy: 'public',
    coverImage: null,
    memberCount: 3421,
    postCount: 580,
    createdAt: new Date('2024-01-20').toISOString(),
    isDemo: false,
    creator: {
      id: 3,
      name: 'محمد سعيد',
      username: 'mohammed_edu',
      avatar: null,
    },
  },
  {
    id: 4,
    name: 'مجتمع الطاقة المتجددة',
    description: 'مجتمع للمهتمين بالطاقة المتجددة والاستدامة البيئية',
    category: 'business',
    privacy: 'public',
    coverImage: null,
    memberCount: 1654,
    postCount: 280,
    createdAt: new Date('2024-02-10').toISOString(),
    isDemo: false,
    creator: {
      id: 4,
      name: 'سارة أحمد',
      username: 'sara_energy',
      avatar: null,
    },
  },
  {
    id: 5,
    name: 'مجتمع ريادة الأعمال',
    description: 'مجتمع لرواد الأعمال والمستثمرين والمهتمين بعالم الأعمال',
    category: 'business',
    privacy: 'public',
    coverImage: null,
    memberCount: 4521,
    postCount: 890,
    createdAt: new Date('2024-01-10').toISOString(),
    isDemo: false,
    creator: {
      id: 5,
      name: 'خالد عبدالله',
      username: 'khaled_business',
      avatar: null,
    },
  },
  {
    id: 6,
    name: 'مجتمع التسويق الرقمي',
    description: 'مجتمع للمهتمين بالتسويق الرقمي ووسائل التواصل الاجتماعي',
    category: 'business',
    privacy: 'public',
    coverImage: null,
    memberCount: 2134,
    postCount: 410,
    createdAt: new Date('2024-02-15').toISOString(),
    isDemo: false,
    creator: {
      id: 6,
      name: 'نورة سعد',
      username: 'noura_marketing',
      avatar: null,
    },
  },
  {
    id: 7,
    name: 'مجتمع الذكاء الاصطناعي',
    description: 'مجتمع متخصص في الذكاء الاصطناعي والتعلم الآلي',
    category: 'technology',
    privacy: 'public',
    coverImage: null,
    memberCount: 3876,
    postCount: 620,
    createdAt: new Date('2024-01-25').toISOString(),
    isDemo: false,
    creator: {
      id: 7,
      name: 'عمر حسن',
      username: 'omar_ai',
      avatar: null,
    },
  },
  {
    id: 8,
    name: 'مجتمع الأمن السيبراني',
    description: 'مجتمع للمهتمين بالأمن السيبراني وحماية البيانات',
    category: 'technology',
    privacy: 'public',
    coverImage: null,
    memberCount: 1987,
    postCount: 340,
    createdAt: new Date('2024-02-05').toISOString(),
    isDemo: false,
    creator: {
      id: 8,
      name: 'ليلى أحمد',
      username: 'layla_security',
      avatar: null,
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'popular';
    
    // Use sandbox data (demo community is already included)
    let filtered = [...sandboxCommunities];
    
    // Filter by search
    if (search) {
      filtered = filtered.filter(c => 
        c.name.includes(search) || c.description.includes(search)
      );
    }
    
    // Filter by category
    if (category) {
      filtered = filtered.filter(c => c.category === category);
    }
    
    // Sort
    if (sort === 'popular') {
      filtered.sort((a, b) => b.memberCount - a.memberCount);
    } else if (sort === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'members') {
      filtered.sort((a, b) => b.memberCount - a.memberCount);
    }
    
    return NextResponse.json({
      success: true,
      communities: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المجتمعات', communities: [] },
      { status: 200 }
    );
  }
}

