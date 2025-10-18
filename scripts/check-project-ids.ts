import { db } from '../lib/db';
import { projects } from '../lib/db/schema';

async function checkProjects() {
  console.log('Checking projects in database...\n');
  
  const allProjects = await db.select({
    id: projects.id,
    title: projects.title,
  }).from(projects);
  
  console.log(`Found ${allProjects.length} projects:\n`);
  allProjects.forEach(p => {
    console.log(`ID: ${p.id} - ${p.title}`);
  });
}

checkProjects().catch(console.error);

