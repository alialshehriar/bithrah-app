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
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const sandboxMode = searchParams.get('sandbox') === 'true';
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = '';
    
    if (sandboxMode) {
      whereClause = 'is_sandbox = true';
    } else {
      whereClause = '(is_sandbox = false OR is_sandbox IS NULL)';
    }

    if (search) {
      whereClause += ` AND (name ILIKE '%${search}%' OR email ILIKE '%${search}%' OR username ILIKE '%${search}%')`;
    }

    if (role) {
      whereClause += ` AND role = '${role}'`;
    }

    if (status === 'active') {
      whereClause += ` AND email_verified = true`;
    } else if (status === 'inactive') {
      whereClause += ` AND email_verified = false`;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users
      WHERE ${whereClause}
    `;
    const countResult = await sql(countQuery);
    const totalUsers = parseInt(countResult[0].total);

    // Get users with pagination
    const usersQuery = `
      SELECT 
        id,
        name,
        email,
        username,
        role,
        points,
        level,
        email_verified,
        created_at,
        updated_at,
        is_sandbox,
        (SELECT COUNT(*) FROM projects WHERE owner_id = users.id) as projects_count,
        (SELECT COUNT(*) FROM investments WHERE user_id = users.id) as investments_count,
        (SELECT COALESCE(SUM(amount), 0) FROM investments WHERE user_id = users.id) as total_invested
      FROM users
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    const users = await sql(usersQuery);

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        points: user.points || 0,
        level: user.level || 1,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        isSandbox: user.is_sandbox,
        projectsCount: parseInt(user.projects_count || 0),
        investmentsCount: parseInt(user.investments_count || 0),
        totalInvested: parseFloat(user.total_invested || 0),
        status: user.email_verified ? 'active' : 'inactive'
      })),
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Build update fields
    const allowedFields = ['name', 'email', 'username', 'role', 'points', 'level', 'email_verified'];
    const updateFields: any = {};
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields[field] = updates[field];
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, error: 'لا توجد حقول للتحديث' },
        { status: 400 }
      );
    }

    // Update user
    const updateParts = Object.entries(updateFields).map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key} = '${value}'`;
      } else if (typeof value === 'boolean') {
        return `${key} = ${value}`;
      } else {
        return `${key} = ${value}`;
      }
    });

    const updateQuery = `
      UPDATE users
      SET ${updateParts.join(', ')}, updated_at = NOW()
      WHERE id = ${userId}
    `;
    await sql(updateQuery);

    // Get updated user
    const updatedUser = await sql`
      SELECT 
        id, name, email, username, role, points, level, 
        email_verified, created_at, updated_at
      FROM users
      WHERE id = ${userId}
    `;

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المستخدم بنجاح',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Check if user exists
    const user = await sql`
      SELECT id, role FROM users WHERE id = ${userId}
    `;

    if (user.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Prevent deleting admin users
    if (user[0].role === 'admin') {
      return NextResponse.json(
        { success: false, error: 'لا يمكن حذف مستخدم مدير' },
        { status: 403 }
      );
    }

    // Delete user (cascade will handle related records)
    await sql`
      DELETE FROM users WHERE id = ${userId}
    `;

    return NextResponse.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

