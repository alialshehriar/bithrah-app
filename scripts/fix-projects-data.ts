import { db } from '../lib/db';
import { projects } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

// Real project images from Unsplash (relevant to each project category)
const projectUpdates = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
    coverImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800'
    ]
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800'
    ]
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
    coverImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'
    ]
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
      'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800'
    ]
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
    coverImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800'
    ]
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800'
    ]
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'
    ]
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
    coverImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
      'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'
    ]
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
    coverImage: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800'
    ]
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
    ]
  }
];

async function fixProjectsData() {
  console.log('Updating projects with real images...\n');
  
  for (const update of projectUpdates) {
    try {
      await db.update(projects)
        .set({
          image: update.image,
          coverImage: update.coverImage,
          gallery: update.gallery
        })
        .where(eq(projects.id, update.id));
      
      console.log(`✅ Updated project ${update.id} with real images`);
    } catch (error) {
      console.error(`❌ Error updating project ${update.id}:`, error);
    }
  }
  
  console.log('\n✅ All projects updated successfully!');
}

fixProjectsData();

