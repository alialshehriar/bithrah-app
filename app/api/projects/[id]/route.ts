import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, users, supportTiers } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const projectId = parseInt(params.id);

    const [project] = await db
      .select({
        id: projects.id,
        title: projects.title,
        shortDescription: projects.shortDescription,
        description: projects.description,
        category: projects.category,
        image: projects.image,
        coverImage: projects.coverImage,
        gallery: projects.gallery,
        video: projects.video,
        fundingGoal: projects.fundingGoal,
        currentFunding: projects.currentFunding,
        backersCount: projects.backersCount,
        deadline: projects.deadline,
        packages: projects.packages,
        updates: projects.updates,
        faq: projects.faq,
        teamMembers: projects.teamMembers,
        status: projects.status,
        city: projects.city,
        country: projects.country,
        creatorId: projects.creatorId,
        creatorName: users.name,
        creatorAvatar: users.avatar,
        creatorLevel: users.level,
      })
      .from(projects)
      .leftJoin(users, eq(projects.creatorId, users.id))
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // Get creator's projects count
    const creatorProjects = await db
      .select({ count: projects.id })
      .from(projects)
      .where(eq(projects.creatorId, project.creatorId));

    // Get support tiers for this project
    const tiers = await db
      .select()
      .from(supportTiers)
      .where(eq(supportTiers.projectId, projectId))
      .orderBy(asc(supportTiers.amount));

    // Format support tiers to match the expected package structure
    const formattedPackages = tiers.map(tier => ({
      id: tier.id.toString(),
      title: tier.title,
      description: tier.description || '',
      price: parseFloat(tier.amount),
      deliveryDays: 30, // Default value
      features: tier.rewards ? (typeof tier.rewards === 'string' ? JSON.parse(tier.rewards) : tier.rewards) : [],
      maxBackers: tier.maxBackers || 999,
      currentBackers: tier.currentBackers || 0,
    }));

    const formattedProject = {
      ...project,
      packages: formattedPackages.length > 0 ? formattedPackages : (project.packages || []),
      creator: {
        id: project.creatorId,
        name: project.creatorName,
        avatar: project.creatorAvatar,
        level: project.creatorLevel,
        projectsCount: creatorProjects.length,
      },
      location: {
        city: project.city,
        country: project.country,
      },
    };

    return NextResponse.json({
      success: true,
      project: formattedProject,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
