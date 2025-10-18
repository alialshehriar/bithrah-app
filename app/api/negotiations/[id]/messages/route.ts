import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

async function verifySession(request: NextRequest) {
  try {
    const token = request.cookies.get('bithrah-token')?.value;
    if (!token) return null;
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { id: payload.id as number };
  } catch (error) {
    return null;
  }
}

// Simple content monitoring patterns
const FORBIDDEN_PATTERNS = [
  /\b\d{10}\b/, // Phone numbers (10 digits)
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // Phone numbers with separators
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email addresses
  /\b(whatsapp|واتساب|واتس|telegram|تلغرام|تليجرام)\b/i, // Messaging apps
  /\b(twitter|تويتر|instagram|انستقرام|انستا|snapchat|سناب)\b/i, // Social media
  /\b(call me|اتصل|تواصل معي|راسلني)\b/i, // Contact requests
];

function checkForbiddenContent(content: string): boolean {
  return FORBIDDEN_PATTERNS.some((pattern) => pattern.test(content));
}

// GET /api/negotiations/[id]/messages - Get all messages for a negotiation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const negotiationId = parseInt(id);

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: 'خطأ في الإعدادات' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Verify user is part of negotiation
    const negotiations = await sql`
      SELECT * FROM negotiations 
      WHERE id = ${negotiationId} 
        AND (initiator_id = ${session.id} OR receiver_id = ${session.id})
    `;

    if (negotiations.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'لم يتم العثور على التفاوض' 
      }, { status: 404 });
    }

    // Get messages
    const messages = await sql`
      SELECT 
        nm.id,
        nm.content,
        nm.sender_id,
        nm.created_at,
        nm.flagged,
        u.name as sender_name,
        u.avatar as sender_avatar
      FROM negotiation_messages nm
      JOIN users u ON nm.sender_id = u.id
      WHERE nm.negotiation_id = ${negotiationId}
      ORDER BY nm.created_at ASC
    `;

    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.sender_id.toString(),
      senderName: msg.sender_name,
      senderAvatar: msg.sender_avatar,
      timestamp: msg.created_at,
      isOwn: msg.sender_id === session.id,
      status: 'read' as const,
      flagged: msg.flagged || false,
    }));

    return NextResponse.json({ 
      success: true, 
      messages: formattedMessages 
    });
  } catch (error: any) {
    console.error('[Messages API] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'حدث خطأ في الخادم',
      details: error?.message 
    }, { status: 500 });
  }
}

// POST /api/negotiations/[id]/messages - Send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const negotiationId = parseInt(id);
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'محتوى الرسالة مطلوب' 
      }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: 'خطأ في الإعدادات' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Check if negotiation exists and is active
    const negotiations = await sql`
      SELECT * FROM negotiations 
      WHERE id = ${negotiationId} 
        AND status = 'active'
        AND (initiator_id = ${session.id} OR receiver_id = ${session.id})
    `;

    if (negotiations.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'التفاوض غير موجود أو منتهي' 
      }, { status: 404 });
    }

    // Check for forbidden content
    const isFlagged = checkForbiddenContent(content);

    if (isFlagged) {
      console.warn(`[Messages API] Flagged message in negotiation ${negotiationId} by user ${session.id}`);
    }

    // Insert message
    const newMessages = await sql`
      INSERT INTO negotiation_messages (negotiation_id, sender_id, content, flagged, created_at)
      VALUES (${negotiationId}, ${session.id}, ${content}, ${isFlagged}, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const newMessage = newMessages[0];

    // Get sender info
    const users = await sql`
      SELECT name, avatar FROM users WHERE id = ${session.id}
    `;

    const user = users[0];

    return NextResponse.json({
      success: true,
      message: {
        id: newMessage.id,
        content: newMessage.content,
        senderId: newMessage.sender_id.toString(),
        senderName: user.name,
        senderAvatar: user.avatar,
        timestamp: newMessage.created_at,
        isOwn: true,
        status: 'sent' as const,
        flagged: newMessage.flagged || false,
      }
    });
  } catch (error: any) {
    console.error('[Messages API] Error sending:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'حدث خطأ في الخادم',
      details: error?.message 
    }, { status: 500 });
  }
}

