import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting demo data seeding...');

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { username: 'demo-owner' },
    update: {},
    create: {
      username: 'demo-owner',
      email: 'demo@bithrahapp.com',
      name: 'مالك المشروع التجريبي',
      password: 'hashed_password_here', // This should be properly hashed
      isDemo: true,
    },
  });

  console.log('✅ Demo user created');

  // Create demo project
  const demoProject = await prisma.project.upsert({
    where: { slug: 'demo-smart-agriculture' },
    update: {},
    create: {
      title: 'مشروع الزراعة الذكية التجريبي',
      slug: 'demo-smart-agriculture',
      description: 'مشروع تجريبي يوضح جميع ميزات منصة بذرة',
      category: 'تقنية',
      fundingGoal: 500000,
      currentFunding: 250000,
      ownerId: demoUser.id,
      isDemo: true,
      status: 'active',
    },
  });

  console.log('✅ Demo project created');

  // Create demo community
  const demoCommunity = await prisma.community.upsert({
    where: { slug: 'demo-tech-community' },
    update: {},
    create: {
      name: 'مجتمع التقنية التجريبي',
      slug: 'demo-tech-community',
      description: 'مجتمع تجريبي للتفاعل والتجربة',
      category: 'تقنية',
      creatorId: demoUser.id,
      isDemo: true,
      memberCount: 150,
    },
  });

  console.log('✅ Demo community created');

  console.log('🎉 Demo data seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding demo data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
