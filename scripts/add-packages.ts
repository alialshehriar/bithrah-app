import { db } from '../lib/db';
import { projects } from '../lib/db/schema';
import { lte } from 'drizzle-orm';

const packages = [
  {
    id: 1,
    title: 'باقة البرونز',
    description: 'دعم بسيط للمشروع',
    price: 100,
    features: ['شكر خاص', 'تحديثات المشروع'],
  },
  {
    id: 2,
    title: 'باقة الفضة',
    description: 'دعم متوسط مع مزايا إضافية',
    price: 500,
    features: ['شكر خاص', 'تحديثات المشروع', 'منتج مجاني'],
  },
  {
    id: 3,
    title: 'باقة الذهب',
    description: 'دعم كبير مع مزايا حصرية',
    price: 1000,
    features: ['شكر خاص', 'تحديثات المشروع', 'منتج مجاني', 'اسمك في قائمة الداعمين'],
  },
];

async function addPackages() {
  try {
    console.log('Adding packages to projects...');
    
    // Update all projects with packages
    await db
      .update(projects)
      .set({ packages: JSON.stringify(packages) })
      .where(lte(projects.id, 10));

    console.log('✅ Packages added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding packages:', error);
    process.exit(1);
  }
}

addPackages();

