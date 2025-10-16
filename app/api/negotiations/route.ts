import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { negotiations, projects, users, wallets, transactions } from '@/lib/db/schema';
import { eq, and, or, desc } from 'drizzle-orm';

// GET - Get user's negotiations
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    // Get negotiations where user is either investor or project owner
    const userNegotiations = await db.query.negotiations.findMany({
      where: or(
        eq(negotiations.investorId, userId),
        eq(negotiations.projectOwnerId, userId)
      ),
      orderBy: [desc(negotiations.createdAt)],
      with: {
        project: {
          columns: {
            id: true,
            title: true,
            image: true,
          },
        },
        investor: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        projectOwner: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      negotiations: userNegotiations,
    });
  } catch (error) {
    console.error('Negotiations fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المفاوضات' },
      { status: 500 }
    );
  }
}

// POST - Create new negotiation
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { projectId, depositAmount, message } = body;

    if (!projectId || !depositAmount || depositAmount <= 0) {
      return NextResponse.json(
        { error: 'البيانات غير صحيحة' },
        { status: 400 }
      );
    }

    // Get project
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // Check if user is trying to negotiate their own project
    if (project.creatorId === userId) {
      return NextResponse.json(
        { error: 'لا يمكنك التفاوض على مشروعك الخاص' },
        { status: 400 }
      );
    }

    // Check if project allows negotiation
    if (!project.allowNegotiation) {
      return NextResponse.json(
        { error: 'هذا المشروع لا يسمح بالتفاوض' },
        { status: 400 }
      );
    }

    // Check minimum deposit requirement
    const minDeposit = parseFloat(project.minNegotiationDeposit || '0');
    if (parseFloat(depositAmount) < minDeposit) {
      return NextResponse.json(
        { error: `الحد الأدنى للمبلغ المسترد هو ${minDeposit} ر.س` },
        { status: 400 }
      );
    }

    // Check if user has active negotiation for this project
    const existingNegotiation = await db.query.negotiations.findFirst({
      where: and(
        eq(negotiations.projectId, projectId),
        eq(negotiations.investorId, userId),
        or(
          eq(negotiations.status, 'pending'),
          eq(negotiations.status, 'active')
        )
      ),
    });

    if (existingNegotiation) {
      return NextResponse.json(
        { error: 'لديك مفاوضة نشطة بالفعل لهذا المشروع' },
        { status: 400 }
      );
    }

    // Get user wallet
    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.userId, userId),
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'المحفظة غير موجودة' },
        { status: 404 }
      );
    }

    const walletBalance = parseFloat(wallet.balance);
    const deposit = parseFloat(depositAmount);

    if (walletBalance < deposit) {
      return NextResponse.json(
        { error: 'رصيد المحفظة غير كافٍ' },
        { status: 400 }
      );
    }

    // Calculate expiry date (3 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    // Create negotiation
    const [newNegotiation] = await db.insert(negotiations).values({
      projectId,
      investorId: userId,
      projectOwnerId: project.creatorId,
      depositAmount: depositAmount.toString(),
      status: 'pending',
      expiryDate,
      initialMessage: message || null,
    }).returning();

    // Hold deposit amount in wallet (deduct from balance)
    await db
      .update(wallets)
      .set({
        balance: (walletBalance - deposit).toString(),
        updatedAt: new Date(),
      })
      .where(eq(wallets.userId, userId));

    // Create transaction record
    await db.insert(transactions).values({
      userId,
      type: 'deposit_hold',
      amount: depositAmount.toString(),
      status: 'completed',
      description: `حجز مبلغ مسترد للتفاوض على مشروع ${project.title}`,
      relatedId: newNegotiation.id,
    });

    return NextResponse.json({
      success: true,
      negotiation: newNegotiation,
      message: 'تم إنشاء طلب التفاوض بنجاح',
    }, { status: 201 });
  } catch (error) {
    console.error('Negotiation creation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء طلب التفاوض' },
      { status: 500 }
    );
  }
}

