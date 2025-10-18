import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, projects, wallets, transactions } from '@/lib/db/schema';
import { eq, sql, desc, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Fetch all users with their stats
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        status: users.status,
        level: users.level,
        points: users.points,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        lastActive: users.lastLoginAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    // Get wallet balances for all users
    const walletData = await db
      .select({
        userId: wallets.userId,
        balance: wallets.balance,
      })
      .from(wallets);

    const walletMap = new Map(walletData.map(w => [w.userId, w.balance || '0']));

    // Get project counts for all users
    const projectCounts = await db
      .select({
        ownerId: projects.creatorId,
        count: sql<number>`count(*)::int`,
      })
      .from(projects)
      .groupBy(projects.creatorId);

    const projectCountMap = new Map(projectCounts.map(p => [p.ownerId, p.count]));

    // Get investment counts (transactions where user is the investor)
    const investmentCounts = await db
      .select({
        userId: transactions.userId,
        count: sql<number>`count(*)::int`,
        total: sql<string>`sum(amount)::text`,
      })
      .from(transactions)
      .where(eq(transactions.type, 'investment'))
      .groupBy(transactions.userId);

    const investmentMap = new Map(investmentCounts.map(i => [i.userId, { count: i.count, total: i.total || '0' }]));

    // Calculate stats
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      total: allUsers.length,
      active: allUsers.filter(u => u.status === 'active').length,
      inactive: allUsers.filter(u => u.status === 'inactive').length,
      suspended: allUsers.filter(u => u.status === 'suspended').length,
      newThisMonth: allUsers.filter(u => new Date(u.createdAt) >= thisMonthStart).length,
      verified: allUsers.filter(u => u.emailVerified).length,
    };

    // Format users data
    const formattedUsers = allUsers.map(user => {
      const investments = investmentMap.get(user.id) || { count: 0, total: '0' };
      
      return {
        id: user.id.toString(),
        name: user.name || 'مستخدم',
        email: user.email,
        phone: user.phone,
        role: user.role || 'user',
        status: user.status || 'active',
        level: user.level || 1,
        points: user.points || 0,
        verified: user.emailVerified || false,
        walletBalance: walletMap.get(user.id) || '0',
        totalProjects: projectCountMap.get(user.id) || 0,
        totalInvestments: investments.count,
        totalEarnings: investments.total,
        joinedAt: user.createdAt,
        lastActive: user.lastActive || user.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      stats,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المستخدمين' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, phone } = body;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Create new user - only required fields
    const insertData: any = {
      email,
      password, // In production, hash the password
    };
    
    // Add optional fields if provided
    if (name) insertData.name = name;
    if (role) insertData.role = role;
    if (phone) insertData.phone = phone;
    
    const [newUser] = await db
      .insert(users)
      .values(insertData)
      .returning();

    // Create wallet for new user - only required field
    await db.insert(wallets).values({
      userId: newUser.id,
    });

    return NextResponse.json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء المستخدم' },
      { status: 500 }
    );
  }
}

