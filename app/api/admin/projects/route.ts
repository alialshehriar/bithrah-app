import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, users } from '@/lib/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { sandboxProjects, sandboxStats } from '@/lib/sandbox/data';

export async function GET(request: NextRequest) {
  try {
    // Check if sandbox mode is enabled
    const sandboxMode = request.cookies.get('sandbox-mode')?.value === 'true';
    
    if (sandboxMode) {
      return NextResponse.json({
        success: true,
        projects: sandboxProjects,
        stats: sandboxStats.projects,
      });
    }
    // Fetch all projects with creator info
    const allProjects = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        category: projects.category,
        status: projects.status,
        fundingGoal: projects.fundingGoal,
        currentFunding: projects.currentFunding,
        backersCount: projects.backersCount,
        creatorId: projects.creatorId,
        createdAt: projects.createdAt,
        deadline: projects.deadline,
      })
      .from(projects)
      .orderBy(desc(projects.createdAt));

    // Get creator names
    const creatorIds = [...new Set(allProjects.map(p => p.creatorId))];
    const creators = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .where(sql`${users.id} = ANY(${creatorIds})`);

    const creatorMap = new Map(creators.map(c => [c.id, c.name || 'مستخدم']));

    // Calculate stats
    const stats = {
      total: allProjects.length,
      pending: allProjects.filter(p => p.status === 'pending').length,
      active: allProjects.filter(p => p.status === 'active').length,
      funded: allProjects.filter(p => p.status === 'funded').length,
      rejected: allProjects.filter(p => p.status === 'rejected').length,
      totalFunding: allProjects.reduce((sum, p) => sum + parseFloat(p.currentFunding || '0'), 0).toFixed(2),
    };

    // Format projects data
    const formattedProjects = allProjects.map(project => ({
      id: project.id.toString(),
      title: project.title || 'مشروع',
      description: project.description || '',
      category: project.category || 'عام',
      status: project.status || 'pending',
      fundingGoal: project.fundingGoal || '0',
      currentFunding: project.currentFunding || '0',
      backersCount: project.backersCount || 0,
      creatorName: creatorMap.get(project.creatorId) || 'مستخدم',
      createdAt: project.createdAt,
      deadline: project.deadline,
    }));

    return NextResponse.json({
      success: true,
      projects: formattedProjects,
      stats,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المشاريع' },
      { status: 500 }
    );
  }
}

