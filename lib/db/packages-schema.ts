import { pgTable, text, integer, boolean, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { projects } from './schema';

// Package types
export const packageTypeEnum = pgEnum('package_type', ['reward', 'bithrah_plus']);

// Packages table
export const packages = pgTable('packages', {
  id: text('id').primaryKey().notNull(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  
  // Package details
  type: packageTypeEnum('type').notNull().default('reward'),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  
  // Reward package fields
  rewardItems: text('reward_items'), // JSON array of rewards
  deliveryDate: timestamp('delivery_date'),
  limitedQuantity: integer('limited_quantity'),
  availableQuantity: integer('available_quantity'),
  
  // Bithrah Plus fields (2% partnership)
  equityPercentage: decimal('equity_percentage', { precision: 5, scale: 2 }), // 2.00
  contractTerms: text('contract_terms'),
  profitSharingTerms: text('profit_sharing_terms'),
  reportingFrequency: text('reporting_frequency'), // monthly, quarterly, yearly
  minimumInvestment: decimal('minimum_investment', { precision: 10, scale: 2 }),
  
  // Stats
  backerCount: integer('backer_count').notNull().default(0),
  totalRaised: decimal('total_raised', { precision: 10, scale: 2 }).notNull().default('0'),
  
  // Status
  isActive: boolean('is_active').notNull().default(true),

  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Package backers (who backed which package)
export const packageBackers = pgTable('package_backers', {
  id: text('id').primaryKey().notNull(),
  packageId: text('package_id').references(() => packages.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').notNull(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  
  // Payment details
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text('payment_status').notNull().default('pending'), // pending, completed, refunded
  
  // For Bithrah Plus
  contractSigned: boolean('contract_signed').notNull().default(false),
  contractUrl: text('contract_url'),
  equityOwned: decimal('equity_owned', { precision: 5, scale: 2 }),
  
  // Delivery status (for reward packages)
  deliveryStatus: text('delivery_status').default('pending'), // pending, shipped, delivered
  trackingNumber: text('tracking_number'),
  
  // Timestamps
  backedAt: timestamp('backed_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Subscription plans
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['free', 'silver', 'gold', 'platinum']);

export const subscriptionPlans = pgTable('subscription_plans', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(), // Free, Silver, Gold, Platinum
  tier: subscriptionPlanEnum('tier').notNull(),
  
  // Pricing
  monthlyPrice: decimal('monthly_price', { precision: 10, scale: 2 }).notNull(),
  yearlyPrice: decimal('yearly_price', { precision: 10, scale: 2 }).notNull(),
  
  // Features
  maxProjects: integer('max_projects').notNull(),
  maxCommunities: integer('max_communities').notNull(),
  maxEvents: integer('max_events').notNull(),
  canCreateBithrahPlus: boolean('can_create_bithrah_plus').notNull().default(false),
  canNegotiate: boolean('can_negotiate').notNull().default(false),
  prioritySupport: boolean('priority_support').notNull().default(false),
  aiEvaluations: integer('ai_evaluations').notNull().default(0), // 0 = unlimited
  
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

// User subscriptions
export const userSubscriptions = pgTable('user_subscriptions', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id').notNull(),
  planId: text('plan_id').references(() => subscriptionPlans.id).notNull(),
  
  // Subscription details
  status: text('status').notNull().default('active'), // active, cancelled, expired
  billingCycle: text('billing_cycle').notNull(), // monthly, yearly
  
  // Dates
  startDate: timestamp('start_date').notNull().defaultNow(),
  endDate: timestamp('end_date').notNull(),
  nextBillingDate: timestamp('next_billing_date'),
  cancelledAt: timestamp('cancelled_at'),
  
  // Payment
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text('payment_method'),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

