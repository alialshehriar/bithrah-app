import { pgTable, serial, integer, varchar, decimal, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from './schema';

// جدول أكواد الإحالة
export const referralCodes = pgTable('referral_codes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  code: varchar('code', { length: 20 }).notNull().unique(),
  usesCount: integer('uses_count').default(0),
  maxUses: integer('max_uses'),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// جدول الإحالات
export const referrals = pgTable('referrals', {
  id: serial('id').primaryKey(),
  referrerId: integer('referrer_id').notNull().references(() => users.id),
  referredId: integer('referred_id').notNull().references(() => users.id),
  referralCode: varchar('referral_code', { length: 20 }).notNull(),
  rewardGiven: boolean('reward_given').default(false),
  rewardAmount: decimal('reward_amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// جدول المكافآت
export const rewards = pgTable('rewards', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(),
  points: integer('points').default(0),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  description: text('description'),
  sourceType: varchar('source_type', { length: 50 }),
  sourceId: integer('source_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// جدول المستويات
export const userLevels = pgTable('user_levels', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  level: integer('level').default(1),
  totalPoints: integer('total_points').default(0),
  rank: varchar('rank', { length: 50 }).default('مبتدئ'),
  badges: jsonb('badges').default([]),
  achievements: jsonb('achievements').default([]),
  updatedAt: timestamp('updated_at').defaultNow(),
});

