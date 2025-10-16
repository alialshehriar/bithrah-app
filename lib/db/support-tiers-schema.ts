import { pgTable, serial, varchar, text, integer, boolean, timestamp, decimal } from 'drizzle-orm/pg-core';

// Support Tiers - باقات الدعم التي يقدمها صاحب المشروع للداعمين
export const supportTiers = pgTable('support_tiers', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull(),
  
  // Tier details
  title: varchar('title', { length: 255 }).notNull(), // مثال: "الداعم البرونزي"
  description: text('description').notNull(), // وصف المكافآت
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(), // المبلغ المطلوب
  
  // Rewards - المكافآت
  rewards: text('rewards').notNull(), // JSON array of rewards
  deliveryDate: timestamp('delivery_date'), // تاريخ التسليم المتوقع
  
  // Limits
  maxBackers: integer('max_backers'), // عدد محدود من الداعمين (اختياري)
  currentBackers: integer('current_backers').default(0), // العدد الحالي
  
  // Shipping
  shippingIncluded: boolean('shipping_included').default(false),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }),
  shippingRegions: text('shipping_regions'), // JSON array of regions
  
  // Status
  isActive: boolean('is_active').default(true),
  isVisible: boolean('is_visible').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Backings - الدعم الفعلي من المستخدمين
export const backings = pgTable('backings', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull(),
  tierId: integer('tier_id').references(() => supportTiers.id),
  backerId: integer('backer_id').notNull(), // user_id
  
  // Payment
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending'), // pending, completed, failed, refunded
  paymentMethod: varchar('payment_method', { length: 50 }),
  transactionId: varchar('transaction_id', { length: 255 }),
  
  // Shipping info
  shippingAddress: text('shipping_address'),
  shippingStatus: varchar('shipping_status', { length: 50 }), // pending, shipped, delivered
  trackingNumber: varchar('tracking_number', { length: 255 }),
  
  // Status
  status: varchar('status', { length: 50 }).default('active'), // active, cancelled, completed
  
  // Timestamps
  backedAt: timestamp('backed_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

