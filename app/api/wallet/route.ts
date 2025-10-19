import { NextResponse } from 'next/server';
import { demoConfig } from '@/lib/demo-config';

export async function GET() {
  try {
    // In demo mode, return demo wallet data
    if (demoConfig.isEnabled) {
      return NextResponse.json({
        success: true,
        wallet: {
          id: 1,
          userId: 1,
          balance: demoConfig.wallet.initialCredit.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        transactions: [
          {
            id: 1,
            type: 'deposit',
            amount: demoConfig.wallet.initialCredit.toString(),
            status: 'completed',
            description: 'رصيد تجريبي مبدئي',
            createdAt: new Date(),
            relatedId: null,
          },
        ],
      });
    }

    // TODO: Implement real wallet data fetching when not in demo mode
    return NextResponse.json({
      success: true,
      wallet: {
        id: 1,
        userId: 1,
        balance: '0',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      transactions: [],
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب بيانات المحفظة' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, amount, description } = body;

    // In demo mode, simulate transaction
      if (demoConfig.isEnabled) {
      return NextResponse.json({
        success: true,
        transaction: {
          id: Date.now(),
          type,
          amount: amount.toString(),
          status: 'completed',
          description,
          createdAt: new Date(),
          relatedId: null,
        },
        message: 'تمت العملية بنجاح (وضع تجريبي)',
      });
    }

    // TODO: Implement real transaction creation when not in demo mode
    return NextResponse.json(
      { success: false, error: 'الوضع التجريبي غير مفعل' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء المعاملة' },
      { status: 500 }
    );
  }
}

