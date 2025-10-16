import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// GET /api/platform-packages - Get all platform packages
export async function GET(request: NextRequest) {
  try {
    const packages = await query(
      `SELECT * FROM platform_packages WHERE is_active = true ORDER BY 
       CASE 
         WHEN type = 'basic' THEN 1 
         WHEN type = 'bithrah_plus' THEN 2 
       END`
    );

    return NextResponse.json({ success: true, packages });
  } catch (error) {
    console.error('Error fetching platform packages:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch packages' }, { status: 500 });
  }
}

// POST /api/platform-packages - Create a new platform package (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const {
      id,
      name,
      type,
      commissionPercentage,
      equityPercentage,
      features,
      marketingSupport,
      consultingServices,
      freeAiEvaluations,
      priorityListing,
      advancedSupport,
      detailedReports,
      dedicatedAccountManager,
      color,
      icon,
      badge,
    } = await request.json();

    // Validate required fields
    if (!id || !name || !type || !commissionPercentage || !features || !color || !icon || !badge) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Insert package
    const result = await query(
      `INSERT INTO platform_packages (
        id, name, type, commission_percentage, equity_percentage, features,
        marketing_support, consulting_services, free_ai_evaluations, priority_listing,
        advanced_support, detailed_reports, dedicated_account_manager,
        color, icon, badge, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        id, name, type, commissionPercentage, equityPercentage || null, JSON.stringify(features),
        marketingSupport || false, consultingServices || false, freeAiEvaluations || 0, priorityListing || false,
        advancedSupport || false, detailedReports || false, dedicatedAccountManager || false,
        color, icon, badge
      ]
    );

    return NextResponse.json({ success: true, package: result[0] });
  } catch (error) {
    console.error('Error creating platform package:', error);
    return NextResponse.json({ success: false, error: 'Failed to create package' }, { status: 500 });
  }
}

// PUT /api/platform-packages - Update a platform package (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const {
      id,
      name,
      commissionPercentage,
      equityPercentage,
      features,
      marketingSupport,
      consultingServices,
      freeAiEvaluations,
      priorityListing,
      advancedSupport,
      detailedReports,
      dedicatedAccountManager,
      color,
      icon,
      badge,
      isActive,
    } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Package ID is required' }, { status: 400 });
    }

    const result = await query(
      `UPDATE platform_packages SET
        name = COALESCE($1, name),
        commission_percentage = COALESCE($2, commission_percentage),
        equity_percentage = $3,
        features = COALESCE($4, features),
        marketing_support = COALESCE($5, marketing_support),
        consulting_services = COALESCE($6, consulting_services),
        free_ai_evaluations = COALESCE($7, free_ai_evaluations),
        priority_listing = COALESCE($8, priority_listing),
        advanced_support = COALESCE($9, advanced_support),
        detailed_reports = COALESCE($10, detailed_reports),
        dedicated_account_manager = COALESCE($11, dedicated_account_manager),
        color = COALESCE($12, color),
        icon = COALESCE($13, icon),
        badge = COALESCE($14, badge),
        is_active = COALESCE($15, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $16
      RETURNING *`,
      [
        name, commissionPercentage, equityPercentage, features ? JSON.stringify(features) : null,
        marketingSupport, consultingServices, freeAiEvaluations, priorityListing,
        advancedSupport, detailedReports, dedicatedAccountManager,
        color, icon, badge, isActive, id
      ]
    );

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: result[0] });
  } catch (error) {
    console.error('Error updating platform package:', error);
    return NextResponse.json({ success: false, error: 'Failed to update package' }, { status: 500 });
  }
}

