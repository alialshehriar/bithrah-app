import { db } from '../lib/db';
import { projects, supportTiers, users } from '../lib/db/schema';
import { sql } from 'drizzle-orm';

async function checkProductionDB() {
  console.log('Checking production database status...\n');
  
  try {
    // Check projects
    const projectCount = await db.select({ count: sql`count(*)` }).from(projects);
    console.log(`Projects in database: ${projectCount[0].count}`);
    
    // Check support tiers
    const tiersCount = await db.select({ count: sql`count(*)` }).from(supportTiers);
    console.log(`Support tiers in database: ${tiersCount[0].count}`);
    
    // Check users
    const usersCount = await db.select({ count: sql`count(*)` }).from(users);
    console.log(`Users in database: ${usersCount[0].count}`);
    
    // Get sample project
    const sampleProjects = await db.select().from(projects).limit(3);
    console.log('\nSample projects:');
    sampleProjects.forEach(p => {
      console.log(`- ID: ${p.id}, Title: ${p.title}`);
    });
    
    // Get sample support tiers
    const sampleTiers = await db.select().from(supportTiers).limit(3);
    console.log('\nSample support tiers:');
    sampleTiers.forEach(t => {
      console.log(`- Project ID: ${t.projectId}, Title: ${t.title}, Amount: ${t.amount}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProductionDB();

