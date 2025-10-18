import { db } from '../lib/db';
import { projects, supportTiers, users } from '../lib/db/schema';
import { eq, asc } from 'drizzle-orm';

async function testProjectAPI() {
  const projectId = 1;
  
  console.log(`Testing project API for project ${projectId}...\n`);
  
  // Get project
  const [project] = await db
    .select({
      id: projects.id,
      title: projects.title,
      image: projects.image,
      coverImage: projects.coverImage,
      packages: projects.packages,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);
  
  console.log('Project data:');
  console.log(`- ID: ${project.id}`);
  console.log(`- Title: ${project.title}`);
  console.log(`- Image: ${project.image}`);
  console.log(`- Packages from JSONB: ${project.packages ? JSON.stringify(project.packages).substring(0, 100) : 'null'}`);
  
  // Get support tiers
  const tiers = await db
    .select()
    .from(supportTiers)
    .where(eq(supportTiers.projectId, projectId))
    .orderBy(asc(supportTiers.amount));
  
  console.log(`\nSupport tiers from support_tiers table: ${tiers.length} tiers`);
  tiers.forEach(tier => {
    console.log(`- ${tier.title}: ${tier.amount} SAR`);
  });
  
  // Format packages
  const formattedPackages = tiers.map(tier => ({
    id: tier.id.toString(),
    title: tier.title,
    description: tier.description || '',
    price: parseFloat(tier.amount),
    deliveryDays: 30,
    features: tier.rewards ? (typeof tier.rewards === 'string' ? JSON.parse(tier.rewards) : tier.rewards) : [],
    maxBackers: tier.maxBackers || 999,
    currentBackers: tier.currentBackers || 0,
  }));
  
  console.log('\nFormatted packages:');
  console.log(JSON.stringify(formattedPackages, null, 2));
}

testProjectAPI().catch(console.error);

