import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// GET - Get project details by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المشروع غير صالح' },
        { status: 400 }
      );
    }

    // Get project details with creator info
    const projectResult = await sql`
      SELECT 
        p.*,
        u.id as creator_id,
        u.name as creator_name,
        u.username as creator_username,
        u.email as creator_email,
        u.avatar as creator_avatar,
        u.bio as creator_bio
      FROM projects p
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE p.id = ${projectId}
    `;

    if (projectResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    const projectData = projectResult[0];

    // Get support packages
    const packagesResult = await sql`
      SELECT *
      FROM support_packages
      WHERE project_id = ${projectId}
      AND is_active = true
      ORDER BY amount ASC
    `;

    // Calculate progress
    const progress = Math.round(
      (parseFloat(projectData.current_funding) / parseFloat(projectData.funding_goal)) * 100
    );

    // Calculate days left
    const daysLeft = Math.max(
      0,
      Math.ceil((new Date(projectData.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );

    // Build response
    const project = {
      id: projectData.id,
      title: projectData.title,
      slug: projectData.slug,
      description: projectData.description,
      shortDescription: projectData.short_description,
      category: projectData.category,
      tags: projectData.tags,
      image: projectData.image,
      coverImage: projectData.cover_image,
      video: projectData.video,
      fundingGoal: projectData.funding_goal.toString(),
      currentFunding: projectData.current_funding.toString(),
      currency: projectData.currency,
      backersCount: projectData.backers_count,
      deadline: projectData.deadline,
      status: projectData.status,
      visibility: projectData.visibility,
      featured: projectData.featured,
      verified: projectData.verified,
      isSandbox: projectData.is_sandbox,
      trending: projectData.trending,
      negotiationEnabled: projectData.negotiation_enabled,
      negotiationDeposit: projectData.negotiation_deposit,
      progress,
      daysLeft,
      createdAt: projectData.created_at,
      updatedAt: projectData.updated_at,
      publishedAt: projectData.published_at,
      creator: {
        id: projectData.creator_id,
        name: projectData.creator_name,
        username: projectData.creator_username,
        email: projectData.creator_email,
        avatar: projectData.creator_avatar,
        bio: projectData.creator_bio,
      },
      packages: packagesResult.map((pkg: any) => ({
        id: pkg.id,
        name: pkg.name,
        description: pkg.description,
        amount: pkg.amount.toString(),
        features: pkg.features,
        maxBackers: pkg.max_backers,
        currentBackers: pkg.current_backers,
        isActive: pkg.is_active,
        createdAt: pkg.created_at,
      })),
    };

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب تفاصيل المشروع' },
      { status: 500 }
    );
  }
}

// PATCH - Update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const projectId = parseInt(id);
    const body = await request.json();

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المشروع غير صالح' },
        { status: 400 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields = [
      'title',
      'description',
      'short_description',
      'category',
      'tags',
      'image',
      'cover_image',
      'video',
      'funding_goal',
      'deadline',
      'status',
      'visibility',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        values.push(body[field]);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'لا توجد حقول للتحديث' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = NOW()`);
    values.push(projectId);

    const query = `
      UPDATE projects
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sql(query, values);

    return NextResponse.json({
      success: true,
      project: result[0],
      message: 'تم تحديث المشروع بنجاح',
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث المشروع' },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المشروع غير صالح' },
        { status: 400 }
      );
    }

    await sql`DELETE FROM projects WHERE id = ${projectId}`;

    return NextResponse.json({
      success: true,
      message: 'تم حذف المشروع بنجاح',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف المشروع' },
      { status: 500 }
    );
  }
}

