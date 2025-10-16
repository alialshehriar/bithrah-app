import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// GET /api/sandbox/bots - Get all bots
export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const bots = await query(
      `SELECT * FROM negotiation_bots WHERE is_sandbox = true ORDER BY created_at DESC`
    );

    return NextResponse.json({ success: true, bots });
  } catch (error) {
    console.error('Error fetching bots:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bots' }, { status: 500 });
  }
}

// POST /api/sandbox/bots - Create a new bot
export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name, type, personality, responseDelay, strategies } = await request.json();

    const bot = await query(
      `INSERT INTO negotiation_bots (
        name, type, personality, response_delay, strategies,
        is_active, is_sandbox, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        name,
        type,
        personality,
        responseDelay || 2000,
        JSON.stringify(strategies || [])
      ]
    );

    return NextResponse.json({ success: true, bot: bot[0] });
  } catch (error) {
    console.error('Error creating bot:', error);
    return NextResponse.json({ success: false, error: 'Failed to create bot' }, { status: 500 });
  }
}

// DELETE /api/sandbox/bots - Delete a bot
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const botId = searchParams.get('id');

    if (!botId) {
      return NextResponse.json({ success: false, error: 'Bot ID is required' }, { status: 400 });
    }

    await query(`DELETE FROM negotiation_bots WHERE id = $1`, [botId]);

    return NextResponse.json({ success: true, message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Error deleting bot:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete bot' }, { status: 500 });
  }
}

