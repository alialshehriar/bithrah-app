import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';
import { projects } from '../lib/db/schema.js';

async function addSupportTiers() {
  try {
    console.log('Creating support_tiers table...');
    
    // Create the table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "support_tiers" (
        "id" serial PRIMARY KEY NOT NULL,
        "uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
        "project_id" integer NOT NULL,
        "title" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "amount" numeric(12, 2) NOT NULL,
        "rewards" jsonb,
        "delivery_date" timestamp,
        "estimated_delivery" varchar(100),
        "max_backers" integer,
        "current_backers" integer DEFAULT 0,
        "shipping_included" boolean DEFAULT false,
        "shipping_cost" numeric(12, 2),
        "shipping_regions" jsonb,
        "is_active" boolean DEFAULT true,
        "is_visible" boolean DEFAULT true,
        "display_order" integer DEFAULT 0,
        "metadata" jsonb,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "support_tiers_uuid_unique" UNIQUE("uuid")
      );
    `);

    console.log('Adding foreign key constraint...');
    await db.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "support_tiers" ADD CONSTRAINT "support_tiers_project_id_projects_id_fk" 
        FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log('Creating indexes...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "support_tiers_project_idx" ON "support_tiers" USING btree ("project_id");
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "support_tiers_amount_idx" ON "support_tiers" USING btree ("amount");
    `);

    console.log('✅ Table created successfully!');
    console.log('\nFetching existing projects...');

    // Get all projects
    const allProjects = await db.select({ id: projects.id, title: projects.title }).from(projects);
    console.log(`Found ${allProjects.length} projects`);

    // Define support tiers for each project
    const tierTemplates = [
      {
        title: 'الداعم البرونزي',
        description: 'دعم أساسي للمشروع مع شكر خاص',
        amountMultiplier: 0.05, // 5% of goal
        rewards: ['شكر خاص في صفحة المشروع', 'تحديثات حصرية عن تقدم المشروع'],
        estimatedDelivery: 'فوري',
        displayOrder: 1,
      },
      {
        title: 'الداعم الفضي',
        description: 'دعم متوسط مع مكافآت إضافية',
        amountMultiplier: 0.1, // 10% of goal
        rewards: ['جميع مكافآت المستوى البرونزي', 'شهادة تقدير رقمية', 'وصول مبكر للمنتج/الخدمة'],
        estimatedDelivery: 'خلال شهر من انتهاء الحملة',
        displayOrder: 2,
      },
      {
        title: 'الداعم الذهبي',
        description: 'دعم كبير مع مكافآت مميزة',
        amountMultiplier: 0.2, // 20% of goal
        rewards: ['جميع مكافآت المستويات السابقة', 'منتج/خدمة مجانية', 'ذكر خاص كداعم رئيسي', 'دعوة لحدث إطلاق المشروع'],
        estimatedDelivery: 'خلال شهرين من انتهاء الحملة',
        maxBackers: 50,
        displayOrder: 3,
      },
      {
        title: 'الداعم البلاتيني',
        description: 'دعم استثنائي مع مكافآت حصرية',
        amountMultiplier: 0.5, // 50% of goal
        rewards: ['جميع مكافآت المستويات السابقة', 'نسخة محدودة من المنتج', 'جلسة استشارية مع فريق المشروع', 'شراكة استراتيجية محتملة', 'ذكر كشريك مؤسس'],
        estimatedDelivery: 'خلال 3 أشهر من انتهاء الحملة',
        maxBackers: 10,
        displayOrder: 4,
      },
    ];

    console.log('\nAdding support tiers to projects...');
    let totalAdded = 0;

    for (const project of allProjects) {
      console.log(`\nProcessing project: ${project.title} (ID: ${project.id})`);
      
      // Assume a default goal amount if not available (we'll use 100000 SAR as base)
      const baseGoal = 100000;

      for (const template of tierTemplates) {
        const amount = baseGoal * template.amountMultiplier;
        
        await db.execute(sql`
          INSERT INTO support_tiers (
            project_id, title, description, amount, rewards
          ) VALUES (
            ${project.id},
            ${template.title},
            ${template.description},
            ${amount},
            ${JSON.stringify(template.rewards)}::jsonb
          )
        `);
        
        totalAdded++;
      }
      
      console.log(`  ✅ Added ${tierTemplates.length} tiers`);
    }

    console.log(`\n✅ Successfully added ${totalAdded} support tiers to ${allProjects.length} projects!`);
    console.log('\nVerifying...');
    
    const tierCount = await db.execute(sql`SELECT COUNT(*) as count FROM support_tiers`);
    console.log(`Total support tiers in database: ${tierCount.rows[0].count}`);

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

addSupportTiers()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

