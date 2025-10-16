import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// GET /api/support-tiers?projectId=123 - Get support tiers for a project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const tiers = await query(
      `SELECT * FROM support_tiers 
       WHERE project_id = $1 AND is_active = true 
       ORDER BY amount ASC`,
      [projectId]
    );

    return NextResponse.json({ success: true, tiers });
  } catch (error) {
    console.error('Error fetching support tiers:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch support tiers' }, { status: 500 });
  }
}

// POST /api/support-tiers - Create a new support tier
export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const {
      projectId,
      title,
      description,
      amount,
      rewards,
      deliveryDate,
      maxBackers,
      shippingIncluded,
      shippingCost,
      shippingRegions
    } = await request.json();

    // Verify project ownership
    const project = await query(
      `SELECT creator_id FROM projects WHERE id = $1`,
      [projectId]
    );

    if (project.length === 0 || project[0].creator_id !== session.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const tier = await query(
      `INSERT INTO support_tiers (
        project_id, title, description, amount, rewards,
        delivery_date, max_backers, shipping_included,
        shipping_cost, shipping_regions, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        projectId,
        title,
        description,
        amount,
        JSON.stringify(rewards),
        deliveryDate,
        maxBackers,
        shippingIncluded,
        shippingCost,
        shippingRegions ? JSON.stringify(shippingRegions) : null
      ]
    );

    return NextResponse.json({ success: true, tier: tier[0] });
  } catch (error) {
    console.error('Error creating support tier:', error);
    return NextResponse.json({ success: false, error: 'Failed to create support tier' }, { status: 500 });
  }
}

// PUT /api/support-tiers - Update a support tier
export async function PUT(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updates } = await request.json();

    // Verify ownership
    const tier = await query(
      `SELECT st.*, p.creator_id 
       FROM support_tiers st
       JOIN projects p ON st.project_id = p.id
       WHERE st.id = $1`,
      [id]
    );

    if (tier.length === 0 || tier[0].creator_id !== session.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    const updatedTier = await query(
      `UPDATE support_tiers 
       SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return NextResponse.json({ success: true, tier: updatedTier[0] });
  } catch (error) {
    console.error('Error updating support tier:', error);
    return NextResponse.json({ success: false, error: 'Failed to update support tier' }, { status: 500 });
  }
}

// DELETE /api/support-tiers?id=123 - Delete a support tier
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Tier ID is required' }, { status: 400 });
    }

    // Verify ownership
    const tier = await query(
      `SELECT st.*, p.creator_id 
       FROM support_tiers st
       JOIN projects p ON st.project_id = p.id
       WHERE st.id = $1`,
      [id]
    );

    if (tier.length === 0 || tier[0].creator_id !== session.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // Check if there are any backings
    const backings = await query(
      `SELECT COUNT(*) as count FROM backings WHERE tier_id = $1`,
      [id]
    );

    if (backings[0].count > 0) {
      // Don't delete, just deactivate
      await query(
        `UPDATE support_tiers SET is_active = false WHERE id = $1`,
        [id]
      );
      return NextResponse.json({ success: true, message: 'Tier deactivated (has backings)' });
    } else {
      // Safe to delete
      await query(`DELETE FROM support_tiers WHERE id = $1`, [id]);
      return NextResponse.json({ success: true, message: 'Tier deleted' });
    }
  } catch (error) {
    console.error('Error deleting support tier:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete support tier' }, { status: 500 });
  }
}

