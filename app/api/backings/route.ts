import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// GET /api/backings - Get user's backings or project's backings
export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId') || session.userId;

    let backings;
    if (projectId) {
      // Get all backings for a project (for project owner)
      const project = await query(
        `SELECT creator_id FROM projects WHERE id = $1`,
        [projectId]
      );

      if (project.length === 0 || project[0].creator_id !== session.userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
      }

      backings = await query(
        `SELECT b.*, st.title as tier_title, st.amount as tier_amount,
                u.name as backer_name, u.email as backer_email
         FROM backings b
         JOIN support_tiers st ON b.tier_id = st.id
         JOIN users u ON b.backer_id = u.id
         WHERE b.project_id = $1
         ORDER BY b.backed_at DESC`,
        [projectId]
      );
    } else {
      // Get user's own backings
      backings = await query(
        `SELECT b.*, st.title as tier_title, st.amount as tier_amount,
                p.title as project_title, p.id as project_id
         FROM backings b
         JOIN support_tiers st ON b.tier_id = st.id
         JOIN projects p ON b.project_id = p.id
         WHERE b.backer_id = $1
         ORDER BY b.backed_at DESC`,
        [userId]
      );
    }

    return NextResponse.json({ success: true, backings });
  } catch (error) {
    console.error('Error fetching backings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch backings' }, { status: 500 });
  }
}

// POST /api/backings - Create a new backing
export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const {
      projectId,
      tierId,
      amount,
      shippingAddress,
      paymentMethod
    } = await request.json();

    // Verify tier exists and is available
    const tier = await query(
      `SELECT * FROM support_tiers WHERE id = $1 AND project_id = $2 AND is_active = true`,
      [tierId, projectId]
    );

    if (tier.length === 0) {
      return NextResponse.json({ success: false, error: 'Tier not found or inactive' }, { status: 404 });
    }

    // Check if tier has max backers limit
    if (tier[0].max_backers && tier[0].current_backers >= tier[0].max_backers) {
      return NextResponse.json({ success: false, error: 'Tier is fully backed' }, { status: 400 });
    }

    // Verify amount matches tier
    if (parseFloat(amount) < parseFloat(tier[0].amount)) {
      return NextResponse.json({ success: false, error: 'Amount is less than tier minimum' }, { status: 400 });
    }

    // Create backing
    const backing = await query(
      `INSERT INTO backings (
        project_id, tier_id, backer_id, amount,
        shipping_address, payment_method, payment_status,
        backed_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        projectId,
        tierId,
        session.userId,
        amount,
        shippingAddress,
        paymentMethod
      ]
    );

    // Update tier current backers count
    await query(
      `UPDATE support_tiers 
       SET current_backers = current_backers + 1 
       WHERE id = $1`,
      [tierId]
    );

    // Update project funding
    await query(
      `UPDATE projects 
       SET current_funding = current_funding + $1 
       WHERE id = $2`,
      [amount, projectId]
    );

    return NextResponse.json({ success: true, backing: backing[0] });
  } catch (error) {
    console.error('Error creating backing:', error);
    return NextResponse.json({ success: false, error: 'Failed to create backing' }, { status: 500 });
  }
}

// PUT /api/backings - Update backing status (payment, shipping)
export async function PUT(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, paymentStatus, shippingStatus, trackingNumber } = await request.json();

    // Verify ownership or project ownership
    const backing = await query(
      `SELECT b.*, p.creator_id 
       FROM backings b
       JOIN projects p ON b.project_id = p.id
       WHERE b.id = $1`,
      [id]
    );

    if (backing.length === 0) {
      return NextResponse.json({ success: false, error: 'Backing not found' }, { status: 404 });
    }

    if (backing[0].backer_id !== session.userId && backing[0].creator_id !== session.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (paymentStatus) {
      updates.push(`payment_status = $${paramCount}`);
      values.push(paymentStatus);
      paramCount++;
    }

    if (shippingStatus) {
      updates.push(`shipping_status = $${paramCount}`);
      values.push(shippingStatus);
      paramCount++;
    }

    if (trackingNumber) {
      updates.push(`tracking_number = $${paramCount}`);
      values.push(trackingNumber);
      paramCount++;
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    const updatedBacking = await query(
      `UPDATE backings 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return NextResponse.json({ success: true, backing: updatedBacking[0] });
  } catch (error) {
    console.error('Error updating backing:', error);
    return NextResponse.json({ success: false, error: 'Failed to update backing' }, { status: 500 });
  }
}

