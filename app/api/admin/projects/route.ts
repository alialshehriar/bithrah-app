import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { neon } from '@neondatabase/serverless';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token and check if user is admin
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;

    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - يجب أن تكون مديراً' },
        { status: 403 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const sandboxMode = searchParams.get('sandbox') === 'true';
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = [];
    
    if (sandboxMode) {
      whereConditions.push(sql`p.is_sandbox = true`);
    } else {
      whereConditions.push(sql`(p.is_sandbox = false OR p.is_sandbox IS NULL)`);
    }

    if (search) {
      whereConditions.push(sql`(p.title ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`})`);
    }

    if (status) {
      whereConditions.push(sql`p.status = ${status}`);
    }

    if (category) {
      whereConditions.push(sql`p.category = ${category}`);
    }

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM projects p
      WHERE ${sql.join(whereConditions, sql` AND `)}
    `;
    const totalProjects = parseInt(countResult[0].total);

    // Get projects with pagination
    const projects = await sql`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.category,
        p.goal_amount,
        p.current_amount,
        p.status,
        p.created_at,
        p.updated_at,
        p.image_url,
        p.is_sandbox,
        p.package_type,
        u.id as owner_id,
        u.name as owner_name,
        u.email as owner_email,
        (SELECT COUNT(*) FROM investments WHERE project_id = p.id) as backers_count,
        (SELECT COUNT(*) FROM negotiations WHERE project_id = p.id) as negotiations_count
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE ${sql.join(whereConditions, sql` AND `)}
      ORDER BY p.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return NextResponse.json({
      success: true,
      projects: projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        goalAmount: parseFloat(project.goal_amount || 0),
        currentAmount: parseFloat(project.current_amount || 0),
        status: project.status,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
        imageUrl: project.image_url,
        isSandbox: project.is_sandbox,
        packageType: project.package_type,
        owner: {
          id: project.owner_id,
          name: project.owner_name,
          email: project.owner_email
        },
        backersCount: parseInt(project.backers_count || 0),
        negotiationsCount: parseInt(project.negotiations_count || 0),
        progress: project.goal_amount > 0 
          ? Math.round((parseFloat(project.current_amount || 0) / parseFloat(project.goal_amount)) * 100)
          : 0
      })),
      pagination: {
        page,
        limit,
        total: totalProjects,
        totalPages: Math.ceil(totalProjects / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

