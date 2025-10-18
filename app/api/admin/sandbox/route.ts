import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET sandbox status
export async function GET(request: NextRequest) {
  try {
    const [sandboxSetting] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'sandbox_mode'))
      .limit(1);

    if (!sandboxSetting) {
      return NextResponse.json({
        success: true,
        enabled: false,
      });
    }

    const value = sandboxSetting.value as { enabled: boolean };
    
    return NextResponse.json({
      success: true,
      enabled: value.enabled || false,
    });
  } catch (error) {
    console.error('Error fetching sandbox status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sandbox status',
        enabled: false,
      },
      { status: 500 }
    );
  }
}

// POST - Toggle sandbox mode
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enabled } = body;

    // TODO: Add admin authentication check
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Update or insert sandbox setting
    const [updatedSetting] = await db
      .insert(settings)
      .values({
        key: 'sandbox_mode',
        value: { enabled: !!enabled },
        category: 'system',
        description: 'Controls sandbox mode',
        isPublic: false,
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          value: { enabled: !!enabled },
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({
      success: true,
      enabled: (updatedSetting.value as { enabled: boolean }).enabled,
      message: `Sandbox mode ${enabled ? 'enabled' : 'disabled'} successfully`,
    });
  } catch (error) {
    console.error('Error updating sandbox status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update sandbox status',
      },
      { status: 500 }
    );
  }
}

