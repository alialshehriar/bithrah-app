import { pgTable, text, integer, boolean, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core';

// Platform package types (for project creators)
export const platformPackageEnum = pgEnum('platform_package', ['basic', 'bithrah_plus']);

// Platform packages configuration
export const platformPackages = pgTable('platform_packages', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(), // Basic, Bithrah Plus
  type: platformPackageEnum('type').notNull(),
  
  // Commission structure
  commissionPercentage: decimal('commission_percentage', { precision: 5, scale: 2 }).notNull(), // 6.5 or 3.0
  equityPercentage: decimal('equity_percentage', { precision: 5, scale: 2 }), // 2.0 for Bithrah Plus only
  
  // Features
  features: text('features').notNull(), // JSON array of features
  
  // Services provided
  marketingSupport: boolean('marketing_support').notNull().default(false),
  consultingServices: boolean('consulting_services').notNull().default(false),
  freeAiEvaluations: integer('free_ai_evaluations').notNull().default(0),
  priorityListing: boolean('priority_listing').notNull().default(false),
  advancedSupport: boolean('advanced_support').notNull().default(false),
  detailedReports: boolean('detailed_reports').notNull().default(false),
  dedicatedAccountManager: boolean('dedicated_account_manager').notNull().default(false),
  
  // Branding
  color: text('color').notNull(),
  icon: text('icon').notNull(),
  badge: text('badge').notNull(),
  
  // Status
  isActive: boolean('is_active').notNull().default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Project reward packages (for backers)
export const rewardPackages = pgTable('reward_packages', {
  id: text('id').primaryKey().notNull(),
  projectId: text('project_id').notNull(),
  
  // Package details
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  
  // Reward items (NO equity or profit sharing - compliance with CMA)
  rewardItems: text('reward_items').notNull(), // JSON array: ["منتج مجاني", "شكر خاص", "هدية"]
  deliveryDate: timestamp('delivery_date'),
  estimatedDelivery: text('estimated_delivery'), // "شهر واحد", "3 أشهر"
  
  // Quantity limits
  limitedQuantity: integer('limited_quantity'),
  availableQuantity: integer('available_quantity'),
  
  // Stats
  backerCount: integer('backer_count').notNull().default(0),
  totalRaised: decimal('total_raised', { precision: 10, scale: 2 }).notNull().default('0'),
  
  // Status
  isActive: boolean('is_active').notNull().default(true),
  isSandbox: boolean('is_sandbox').notNull().default(false),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Reward package backers
export const rewardBackers = pgTable('reward_backers', {
  id: text('id').primaryKey().notNull(),
  packageId: text('package_id').references(() => rewardPackages.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').notNull(),
  projectId: text('project_id').notNull(),
  
  // Payment details
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text('payment_status').notNull().default('pending'), // pending, completed, refunded
  
  // Delivery status
  deliveryStatus: text('delivery_status').default('pending'), // pending, processing, shipped, delivered
  trackingNumber: text('tracking_number'),
  shippingAddress: text('shipping_address'),
  
  // Timestamps
  backedAt: timestamp('backed_at').notNull().defaultNow(),
  deliveredAt: timestamp('delivered_at'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Platform equity shares (for Bithrah Plus projects)
export const platformEquityShares = pgTable('platform_equity_shares', {
  id: text('id').primaryKey().notNull(),
  projectId: text('project_id').notNull(),
  platformPackageId: text('platform_package_id').references(() => platformPackages.id).notNull(),
  
  // Equity details
  equityPercentage: decimal('equity_percentage', { precision: 5, scale: 2 }).notNull(), // 2.00
  contractUrl: text('contract_url'),
  contractSigned: boolean('contract_signed').notNull().default(false),
  contractSignedAt: timestamp('contract_signed_at'),
  
  // Terms
  profitSharingTerms: text('profit_sharing_terms'),
  reportingFrequency: text('reporting_frequency'), // monthly, quarterly, yearly
  
  // Status
  status: text('status').notNull().default('active'), // active, terminated
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

