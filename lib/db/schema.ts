import { pgTable, serial, varchar, text, integer, numeric, timestamp, boolean, jsonb, uuid, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// USERS & AUTHENTICATION
// ============================================

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  username: varchar('username', { length: 100 }).unique(),
  avatar: varchar('avatar', { length: 500 }),
  bio: text('bio'),
  phone: varchar('phone', { length: 50 }),
  phoneVerified: boolean('phone_verified').default(false),
  dateOfBirth: timestamp('date_of_birth'),
  gender: varchar('gender', { length: 20 }),
  country: varchar('country', { length: 100 }),
  city: varchar('city', { length: 100 }),
  address: text('address'),
  postalCode: varchar('postal_code', { length: 20 }),
  
  // Platform specific
  role: varchar('role', { length: 50 }).default('user').notNull(), // user, admin, moderator
  status: varchar('status', { length: 50 }).default('active').notNull(), // active, suspended, banned, deleted
  level: integer('level').default(1).notNull(),
  points: integer('points').default(0).notNull(),
  experience: integer('experience').default(0).notNull(),
  
  // Referral system
  referralCode: varchar('referral_code', { length: 50 }).unique(),
  referredBy: integer('referred_by'),
  referralCount: integer('referral_count').default(0),
  referralEarnings: numeric('referral_earnings', { precision: 12, scale: 2 }).default('0'),
  
  // Subscription
  subscriptionTier: varchar('subscription_tier', { length: 50 }).default('free'), // free, basic, premium, enterprise
  subscriptionStatus: varchar('subscription_status', { length: 50 }).default('active'),
  subscriptionStartDate: timestamp('subscription_start_date'),
  subscriptionEndDate: timestamp('subscription_end_date'),
  
  // Preferences & Settings
  language: varchar('language', { length: 10 }).default('ar'),
  timezone: varchar('timezone', { length: 50 }).default('Asia/Riyadh'),
  currency: varchar('currency', { length: 10 }).default('SAR'),
  notificationSettings: jsonb('notification_settings'),
  privacySettings: jsonb('privacy_settings'),
  preferences: jsonb('preferences'),
  
  // Social links
  socialLinks: jsonb('social_links'), // {twitter, linkedin, github, website, etc}
  
  // Security
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
  lastLoginAt: timestamp('last_login_at'),
  lastLoginIp: varchar('last_login_ip', { length: 50 }),
  passwordResetToken: varchar('password_reset_token', { length: 255 }),
  passwordResetExpires: timestamp('password_reset_expires'),
  
  // Onboarding
  onboardingCompleted: boolean('onboarding_completed').default(false),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  referralCodeIdx: index('users_referral_code_idx').on(table.referralCode),
  usernameIdx: index('users_username_idx').on(table.username),
}));

// ============================================
// PROJECTS & IDEAS
// ============================================

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  creatorId: integer('creator_id').references(() => users.id).notNull(),
  
  // Basic info
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique(),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 500 }),
  category: varchar('category', { length: 100 }),
  subCategory: varchar('sub_category', { length: 100 }),
  tags: jsonb('tags'), // Array of tags
  
  // Media
  image: varchar('image', { length: 500 }),
  coverImage: varchar('cover_image', { length: 500 }),
  gallery: jsonb('gallery'), // Array of image URLs
  video: varchar('video', { length: 500 }),
  documents: jsonb('documents'), // Array of document URLs
  
  // Funding details
  fundingGoal: numeric('funding_goal', { precision: 12, scale: 2 }).notNull(),
  currentFunding: numeric('current_funding', { precision: 12, scale: 2 }).default('0'),
  minimumFunding: numeric('minimum_funding', { precision: 12, scale: 2 }),
  currency: varchar('currency', { length: 10 }).default('SAR'),
  backersCount: integer('backers_count').default(0),
  
  // Timeline
  startDate: timestamp('start_date'),
  deadline: timestamp('deadline'),
  expectedDelivery: timestamp('expected_delivery'),
  
  // Status & visibility
  status: varchar('status', { length: 50 }).default('draft').notNull(), // draft, pending, active, funded, completed, cancelled, failed
  visibility: varchar('visibility', { length: 50 }).default('public'), // public, private, unlisted
  featured: boolean('featured').default(false),
  verified: boolean('verified').default(false),
  
  // Package & rewards
  platformPackage: varchar('platform_package', { length: 50 }).default('basic'), // basic, bithrah_plus
  packages: jsonb('packages'), // Array of reward packages
  
  // Privacy & IP Protection (3 levels)
  publicDescription: text('public_description'), // Level 1: Visitors (not logged in)
  registeredDescription: text('registered_description'), // Level 2: Registered users
  fullDescription: text('full_description'), // Level 3: Negotiators only
  confidentialDocs: jsonb('confidential_docs'), // Only for negotiators
  
  // Negotiation settings
  negotiationEnabled: boolean('negotiation_enabled').default(false),
  negotiationDeposit: numeric('negotiation_deposit', { precision: 12, scale: 2 }),
  
  // Funding timeline (60 days)
  fundingDuration: integer('funding_duration').default(60), // days
  fundingStartDate: timestamp('funding_start_date'),
  fundingEndDate: timestamp('funding_end_date'),
  autoRefundOnFailure: boolean('auto_refund_on_failure').default(true),
  paymentGatewayFee: numeric('payment_gateway_fee', { precision: 5, scale: 2 }).default('2.00'), // 2%
  
  // Engagement metrics
  viewsCount: integer('views_count').default(0),
  likesCount: integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  sharesCount: integer('shares_count').default(0),
  bookmarksCount: integer('bookmarks_count').default(0),
  
  // AI evaluation
  aiScore: integer('ai_score'),
  aiEvaluationData: jsonb('ai_evaluation_data'),
  
  // Location
  country: varchar('country', { length: 100 }),
  city: varchar('city', { length: 100 }),
  location: jsonb('location'), // {lat, lng, address}
  
  // Additional data
  faq: jsonb('faq'), // Array of {question, answer}
  updates: jsonb('updates'), // Array of project updates
  risks: text('risks'),
  teamMembers: jsonb('team_members'), // Array of team member info
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  creatorIdx: index('projects_creator_idx').on(table.creatorId),
  statusIdx: index('projects_status_idx').on(table.status),
  categoryIdx: index('projects_category_idx').on(table.category),
  slugIdx: uniqueIndex('projects_slug_idx').on(table.slug),
}));

// ============================================
// COMMUNITIES
// ============================================

export const communities = pgTable('communities', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  creatorId: integer('creator_id').references(() => users.id).notNull(),
  projectId: integer('project_id').references(() => projects.id), // Optional: linked to a project
  
  // Basic info
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique(),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 500 }),
  category: varchar('category', { length: 100 }),
  tags: jsonb('tags'),
  
  // Media
  image: varchar('image', { length: 500 }),
  coverImage: varchar('cover_image', { length: 500 }),
  
  // Community settings
  tier: varchar('tier', { length: 50 }).default('public'), // public, bronze, silver, gold
  isPrivate: boolean('is_private').default(false),
  requiresApproval: boolean('requires_approval').default(false),
  memberLimit: integer('member_limit'),
  
  // Stats
  memberCount: integer('member_count').default(0),
  activeMembers: integer('active_members').default(0),
  postsCount: integer('posts_count').default(0),
  
  // Features
  features: jsonb('features'), // Array of enabled features
  rules: jsonb('rules'), // Array of community rules
  
  // Settings
  settings: jsonb('settings'),
  moderationSettings: jsonb('moderation_settings'),
  
  // Status
  status: varchar('status', { length: 50 }).default('active'), // active, archived, suspended
  verified: boolean('verified').default(false),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  creatorIdx: index('communities_creator_idx').on(table.creatorId),
  slugIdx: uniqueIndex('communities_slug_idx').on(table.slug),
  categoryIdx: index('communities_category_idx').on(table.category),
}));

export const communityMembers = pgTable('community_members', {
  id: serial('id').primaryKey(),
  communityId: integer('community_id').references(() => communities.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Role & permissions
  role: varchar('role', { length: 50 }).default('member').notNull(), // owner, admin, moderator, member
  permissions: jsonb('permissions'),
  
  // Activity & engagement
  points: integer('points').default(0),
  level: integer('level').default(1),
  supportCount: integer('support_count').default(0),
  postsCount: integer('posts_count').default(0),
  commentsCount: integer('comments_count').default(0),
  
  // Status
  status: varchar('status', { length: 50 }).default('active'), // active, banned, left
  
  // Metadata
  metadata: jsonb('metadata'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  lastActiveAt: timestamp('last_active_at'),
  leftAt: timestamp('left_at'),
}, (table) => ({
  communityUserIdx: uniqueIndex('community_members_community_user_idx').on(table.communityId, table.userId),
  userIdx: index('community_members_user_idx').on(table.userId),
}));

export const communityPosts = pgTable('community_posts', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  communityId: integer('community_id').references(() => communities.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Content
  title: varchar('title', { length: 255 }),
  content: text('content').notNull(),
  contentType: varchar('content_type', { length: 50 }).default('text'), // text, poll, event, announcement
  
  // Media
  attachments: jsonb('attachments'), // Array of media URLs
  
  // Engagement
  likesCount: integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  sharesCount: integer('shares_count').default(0),
  
  // Status
  status: varchar('status', { length: 50 }).default('published'), // draft, published, hidden, deleted
  pinned: boolean('pinned').default(false),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  communityIdx: index('community_posts_community_idx').on(table.communityId),
  userIdx: index('community_posts_user_idx').on(table.userId),
}));

// ============================================
// SUBSCRIPTIONS & PAYMENTS
// ============================================

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Subscription details
  tier: varchar('tier', { length: 50 }).notNull(), // free, basic, premium, enterprise
  planId: varchar('plan_id', { length: 100 }),
  
  // Pricing
  price: numeric('price', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 10 }).default('SAR'),
  billingCycle: varchar('billing_cycle', { length: 50 }), // monthly, yearly
  
  // Status & dates
  status: varchar('status', { length: 50 }).default('active').notNull(), // active, cancelled, expired, suspended
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  trialEndDate: timestamp('trial_end_date'),
  cancelledAt: timestamp('cancelled_at'),
  
  // Settings
  autoRenew: boolean('auto_renew').default(true),
  
  // Payment integration
  paymentProvider: varchar('payment_provider', { length: 50 }), // stripe, paypal, etc
  paymentProviderId: varchar('payment_provider_id', { length: 255 }),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('subscriptions_user_idx').on(table.userId),
  statusIdx: index('subscriptions_status_idx').on(table.status),
}));

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Transaction details
  type: varchar('type', { length: 50 }).notNull(), // payment, refund, withdrawal, commission
  category: varchar('category', { length: 50 }), // subscription, backing, referral, etc
  
  // Amount
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('SAR'),
  fee: numeric('fee', { precision: 10, scale: 2 }).default('0'),
  netAmount: numeric('net_amount', { precision: 12, scale: 2 }),
  
  // Status
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, completed, failed, refunded
  
  // Payment details
  paymentMethod: varchar('payment_method', { length: 50 }), // card, bank_transfer, wallet
  paymentProvider: varchar('payment_provider', { length: 50 }),
  paymentProviderId: varchar('payment_provider_id', { length: 255 }),
  
  // References
  relatedId: integer('related_id'), // ID of related entity (project, subscription, etc)
  relatedType: varchar('related_type', { length: 50 }), // project, subscription, etc
  
  // Metadata
  description: text('description'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('transactions_user_idx').on(table.userId),
  statusIdx: index('transactions_status_idx').on(table.status),
  typeIdx: index('transactions_type_idx').on(table.type),
}));

export const wallets = pgTable('wallets', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  
  // Balance
  balance: numeric('balance', { precision: 12, scale: 2 }).default('0').notNull(),
  currency: varchar('currency', { length: 10 }).default('SAR'),
  
  // Limits
  dailyLimit: numeric('daily_limit', { precision: 12, scale: 2 }),
  monthlyLimit: numeric('monthly_limit', { precision: 12, scale: 2 }),
  
  // Status
  status: varchar('status', { length: 50 }).default('active').notNull(), // active, frozen, suspended
  isFrozen: boolean('is_frozen').default(false),
  frozenAt: timestamp('frozen_at'),
  frozenReason: text('frozen_reason'),
  
  // Statistics
  totalDeposits: numeric('total_deposits', { precision: 12, scale: 2 }).default('0'),
  totalWithdrawals: numeric('total_withdrawals', { precision: 12, scale: 2 }).default('0'),
  totalTransactions: integer('total_transactions').default(0),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: uniqueIndex('wallets_user_idx').on(table.userId),
  statusIdx: index('wallets_status_idx').on(table.status),
}));

export const backings = pgTable('backings', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  transactionId: integer('transaction_id').references(() => transactions.id),
  
  // Backing details
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('SAR'),
  packageId: varchar('package_id', { length: 100 }),
  packageDetails: jsonb('package_details'),
  
  // Marketing commission (0.5%)
  referrerId: integer('referrer_id').references(() => users.id), // Marketer who referred
  marketingCommission: numeric('marketing_commission', { precision: 12, scale: 2 }).default('0'), // 0.5% of amount
  commissionPaid: boolean('commission_paid').default(false),
  
  // Status
  status: varchar('status', { length: 50 }).default('pending'), // pending, confirmed, refunded
  
  // Delivery
  rewardDelivered: boolean('reward_delivered').default(false),
  deliveredAt: timestamp('delivered_at'),
  
  // Metadata
  message: text('message'),
  isAnonymous: boolean('is_anonymous').default(false),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  projectIdx: index('backings_project_idx').on(table.projectId),
  userIdx: index('backings_user_idx').on(table.userId),
}));

// ============================================
// REFERRALS & REWARDS
// ============================================

export const referrals = pgTable('referrals', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  referrerId: integer('referrer_id').references(() => users.id).notNull(),
  referredId: integer('referred_id').references(() => users.id).notNull(),
  
  // Referral details
  referralCode: varchar('referral_code', { length: 50 }).notNull(),
  source: varchar('source', { length: 100 }), // web, mobile, social, etc
  
  // Status & rewards
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, completed, rewarded
  commissionEarned: numeric('commission_earned', { precision: 10, scale: 2 }).default('0'),
  commissionPaid: boolean('commission_paid').default(false),
  
  // Activity tracking
  firstPurchaseAt: timestamp('first_purchase_at'),
  rewardedAt: timestamp('rewarded_at'),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  referrerIdx: index('referrals_referrer_idx').on(table.referrerId),
  referredIdx: uniqueIndex('referrals_referred_idx').on(table.referredId),
}));

export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Achievement details
  achievementKey: varchar('achievement_key', { length: 100 }).notNull(),
  achievementType: varchar('achievement_type', { length: 50 }), // milestone, badge, trophy
  title: varchar('title', { length: 255 }),
  description: text('description'),
  
  // Rewards
  pointsAwarded: integer('points_awarded').default(0),
  badgeIcon: varchar('badge_icon', { length: 255 }),
  
  // Progress
  progress: integer('progress').default(0),
  target: integer('target'),
  
  // Metadata
  metadata: jsonb('metadata'),
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('achievements_user_idx').on(table.userId),
  keyIdx: index('achievements_key_idx').on(table.achievementKey),
}));

// ============================================
// AI EVALUATIONS
// ============================================

export const aiEvaluations = pgTable('ai_evaluations', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Evaluation details
  version: integer('version').default(1),
  model: varchar('model', { length: 50 }), // gpt-4, gpt-5, etc
  
  // Scores
  overallScore: integer('overall_score'), // 0-100
  feasibilityScore: integer('feasibility_score'),
  marketScore: integer('market_score'),
  innovationScore: integer('innovation_score'),
  impactScore: integer('impact_score'),
  
  // Analysis
  evaluationData: jsonb('evaluation_data'),
  strengths: jsonb('strengths'), // Array of strengths
  weaknesses: jsonb('weaknesses'), // Array of weaknesses
  opportunities: jsonb('opportunities'),
  threats: jsonb('threats'),
  recommendations: text('recommendations'),
  
  // Market analysis
  marketSize: varchar('market_size', { length: 50 }),
  competitionLevel: varchar('competition_level', { length: 50 }),
  targetAudience: jsonb('target_audience'),
  
  // Financial projections
  projectedRevenue: jsonb('projected_revenue'),
  breakEvenAnalysis: jsonb('break_even_analysis'),
  
  // Status
  status: varchar('status', { length: 50 }).default('completed'), // processing, completed, failed
  
  // Metadata
  processingTime: integer('processing_time'), // in seconds
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  projectIdx: index('ai_evaluations_project_idx').on(table.projectId),
  userIdx: index('ai_evaluations_user_idx').on(table.userId),
}));

// ============================================
// NOTIFICATIONS & MESSAGES
// ============================================

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Notification details
  type: varchar('type', { length: 50 }).notNull(), // system, project, community, message, etc
  category: varchar('category', { length: 50 }),
  title: varchar('title', { length: 255 }),
  content: text('content').notNull(),
  
  // Action
  actionUrl: varchar('action_url', { length: 500 }),
  actionText: varchar('action_text', { length: 100 }),
  
  // Related entity
  relatedId: integer('related_id'),
  relatedType: varchar('related_type', { length: 50 }),
  
  // Status
  read: boolean('read').default(false),
  readAt: timestamp('read_at'),
  
  // Priority
  priority: varchar('priority', { length: 20 }).default('normal'), // low, normal, high, urgent
  
  // Delivery
  channels: jsonb('channels'), // Array: email, push, sms
  sentViaEmail: boolean('sent_via_email').default(false),
  sentViaPush: boolean('sent_via_push').default(false),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
}, (table) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  readIdx: index('notifications_read_idx').on(table.read),
  typeIdx: index('notifications_type_idx').on(table.type),
}));

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  recipientId: integer('recipient_id').references(() => users.id).notNull(),
  
  // Message content
  subject: varchar('subject', { length: 255 }),
  content: text('content').notNull(),
  contentType: varchar('content_type', { length: 50 }).default('text'),
  
  // Attachments
  attachments: jsonb('attachments'),
  
  // Thread
  threadId: varchar('thread_id', { length: 100 }),
  parentId: integer('parent_id'),
  
  // Status
  read: boolean('read').default(false),
  readAt: timestamp('read_at'),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deletedBySender: boolean('deleted_by_sender').default(false),
  deletedByRecipient: boolean('deleted_by_recipient').default(false),
}, (table) => ({
  senderIdx: index('messages_sender_idx').on(table.senderId),
  recipientIdx: index('messages_recipient_idx').on(table.recipientId),
  threadIdx: index('messages_thread_idx').on(table.threadId),
}));

// ============================================
// INTERACTIONS & ENGAGEMENT
// ============================================

export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Target entity
  targetId: integer('target_id').notNull(),
  targetType: varchar('target_type', { length: 50 }).notNull(), // project, post, comment
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userTargetIdx: uniqueIndex('likes_user_target_idx').on(table.userId, table.targetId, table.targetType),
}));

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Target entity
  targetId: integer('target_id').notNull(),
  targetType: varchar('target_type', { length: 50 }).notNull(), // project, post
  
  // Comment content
  content: text('content').notNull(),
  parentId: integer('parent_id'), // For nested comments
  
  // Engagement
  likesCount: integer('likes_count').default(0),
  repliesCount: integer('replies_count').default(0),
  
  // Status
  status: varchar('status', { length: 50 }).default('published'), // published, hidden, deleted
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  targetIdx: index('comments_target_idx').on(table.targetId, table.targetType),
  userIdx: index('comments_user_idx').on(table.userId),
}));

export const bookmarks = pgTable('bookmarks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Target entity
  targetId: integer('target_id').notNull(),
  targetType: varchar('target_type', { length: 50 }).notNull(), // project, post
  
  // Organization
  collectionName: varchar('collection_name', { length: 100 }),
  
  // Metadata
  notes: text('notes'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userTargetIdx: uniqueIndex('bookmarks_user_target_idx').on(table.userId, table.targetId, table.targetType),
  userIdx: index('bookmarks_user_idx').on(table.userId),
}));

// ============================================
// ANALYTICS & TRACKING
// ============================================

export const analytics = pgTable('analytics', {
  id: serial('id').primaryKey(),
  
  // Event details
  eventType: varchar('event_type', { length: 100 }).notNull(), // page_view, click, conversion, etc
  eventCategory: varchar('event_category', { length: 100 }),
  eventAction: varchar('event_action', { length: 100 }),
  eventLabel: varchar('event_label', { length: 255 }),
  
  // User & session
  userId: integer('user_id').references(() => users.id),
  sessionId: varchar('session_id', { length: 255 }),
  
  // Target entity
  targetId: integer('target_id'),
  targetType: varchar('target_type', { length: 50 }),
  
  // Technical details
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 50 }),
  referrer: varchar('referrer', { length: 500 }),
  url: varchar('url', { length: 500 }),
  
  // Device & location
  device: varchar('device', { length: 50 }),
  browser: varchar('browser', { length: 50 }),
  os: varchar('os', { length: 50 }),
  country: varchar('country', { length: 100 }),
  city: varchar('city', { length: 100 }),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  eventTypeIdx: index('analytics_event_type_idx').on(table.eventType),
  userIdx: index('analytics_user_idx').on(table.userId),
  createdAtIdx: index('analytics_created_at_idx').on(table.createdAt),
}));

// ============================================
// SYSTEM & ADMIN
// ============================================

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).unique().notNull(),
  value: jsonb('value'),
  category: varchar('category', { length: 50 }),
  description: text('description'),
  isPublic: boolean('is_public').default(false),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  
  // Action details
  action: varchar('action', { length: 100 }).notNull(),
  entity: varchar('entity', { length: 100 }),
  entityId: integer('entity_id'),
  
  // Changes
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  
  // Context
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('audit_logs_user_idx').on(table.userId),
  actionIdx: index('audit_logs_action_idx').on(table.action),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
}));

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  reporterId: integer('reporter_id').references(() => users.id).notNull(),
  
  // Target entity
  targetId: integer('target_id').notNull(),
  targetType: varchar('target_type', { length: 50 }).notNull(), // user, project, post, comment
  
  // Report details
  reason: varchar('reason', { length: 100 }).notNull(),
  description: text('description'),
  
  // Status
  status: varchar('status', { length: 50 }).default('pending'), // pending, reviewing, resolved, dismissed
  reviewedBy: integer('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  resolution: text('resolution'),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  targetIdx: index('reports_target_idx').on(table.targetId, table.targetType),
  statusIdx: index('reports_status_idx').on(table.status),
}));



// ============================================
// RELATIONS
// ============================================

export const usersRelations = relations(users, ({ many, one }) => ({
  projects: many(projects),
  communities: many(communities),
  communityMemberships: many(communityMembers),
  backings: many(backings),
  referralsMade: many(referrals, { relationName: 'referrer' }),
  referralsReceived: many(referrals, { relationName: 'referred' }),
  referrer: one(users, {
    fields: [users.referredBy],
    references: [users.id],
  }),
  notifications: many(notifications),
  messagesSent: many(messages, { relationName: 'sender' }),
  messagesReceived: many(messages, { relationName: 'recipient' }),
  aiEvaluations: many(aiEvaluations),
  achievements: many(achievements),
  subscriptions: many(subscriptions),
  transactions: many(transactions),
  likes: many(likes),
  comments: many(comments),
  bookmarks: many(bookmarks),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  creator: one(users, {
    fields: [projects.creatorId],
    references: [users.id],
  }),
  backings: many(backings),
  aiEvaluations: many(aiEvaluations),
  communities: many(communities),
  comments: many(comments),
  likes: many(likes),
  bookmarks: many(bookmarks),
}));

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  creator: one(users, {
    fields: [communities.creatorId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [communities.projectId],
    references: [projects.id],
  }),
  members: many(communityMembers),
  posts: many(communityPosts),
}));

export const communityMembersRelations = relations(communityMembers, ({ one }) => ({
  community: one(communities, {
    fields: [communityMembers.communityId],
    references: [communities.id],
  }),
  user: one(users, {
    fields: [communityMembers.userId],
    references: [users.id],
  }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one, many }) => ({
  community: one(communities, {
    fields: [communityPosts.communityId],
    references: [communities.id],
  }),
  user: one(users, {
    fields: [communityPosts.userId],
    references: [users.id],
  }),
  likes: many(likes),
  comments: many(comments),
}));

export const backingsRelations = relations(backings, ({ one }) => ({
  project: one(projects, {
    fields: [backings.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [backings.userId],
    references: [users.id],
  }),
  transaction: one(transactions, {
    fields: [backings.transactionId],
    references: [transactions.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: 'referrer',
  }),
  referred: one(users, {
    fields: [referrals.referredId],
    references: [users.id],
    relationName: 'referred',
  }),
}));

export const aiEvaluationsRelations = relations(aiEvaluations, ({ one }) => ({
  project: one(projects, {
    fields: [aiEvaluations.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [aiEvaluations.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: 'recipient',
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, {
    fields: [achievements.userId],
    references: [users.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  user: one(users, {
    fields: [analytics.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [reports.reviewedBy],
    references: [users.id],
  }),
}));



// ============================================
// NEGOTIATIONS
// ============================================

export const negotiations = pgTable('negotiations', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  investorId: integer('investor_id').references(() => users.id).notNull(),
  
  // Negotiation details
  status: varchar('status', { length: 50 }).default('active').notNull(), // active, accepted, rejected, cancelled, expired
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(), // 3 days from start
  
  // Deposit (refundable)
  depositAmount: numeric('deposit_amount', { precision: 12, scale: 2 }).notNull(), // Refundable deposit
  depositStatus: varchar('deposit_status', { length: 50 }).default('held'), // held, refunded, forfeited
  depositRefundedAt: timestamp('deposit_refunded_at'),
  
  // Access level
  hasFullAccess: boolean('has_full_access').default(false), // Access to confidential details
  
  // Agreement
  agreedAmount: numeric('agreed_amount', { precision: 12, scale: 2 }),
  agreementTerms: text('agreement_terms'),
  agreementReached: boolean('agreement_reached').default(false),
  agreementDate: timestamp('agreement_date'),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  projectIdx: index('negotiations_project_idx').on(table.projectId),
  investorIdx: index('negotiations_investor_idx').on(table.investorId),
  statusIdx: index('negotiations_status_idx').on(table.status),
}));

export const negotiationMessages = pgTable('negotiation_messages', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  negotiationId: integer('negotiation_id').references(() => negotiations.id).notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  
  // Message content
  content: text('content').notNull(),
  messageType: varchar('message_type', { length: 50 }).default('text'), // text, image, file
  attachments: jsonb('attachments'),
  
  // Status
  status: varchar('status', { length: 50 }).default('sent'), // sent, delivered, read
  flagged: boolean('flagged').default(false), // Flagged by AI for review
  flagReason: text('flag_reason'),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  readAt: timestamp('read_at'),
}, (table) => ({
  negotiationIdx: index('negotiation_messages_negotiation_idx').on(table.negotiationId),
  senderIdx: index('negotiation_messages_sender_idx').on(table.senderId),
}));

export const negotiationsRelations = relations(negotiations, ({ one, many }) => ({
  project: one(projects, {
    fields: [negotiations.projectId],
    references: [projects.id],
  }),
  investor: one(users, {
    fields: [negotiations.investorId],
    references: [users.id],
  }),
  messages: many(negotiationMessages),
}));

export const negotiationMessagesRelations = relations(negotiationMessages, ({ one }) => ({
  negotiation: one(negotiations, {
    fields: [negotiationMessages.negotiationId],
    references: [negotiations.id],
  }),
  sender: one(users, {
    fields: [negotiationMessages.senderId],
    references: [users.id],
  }),
}));








// ============================================
// NDA (Non-Disclosure Agreement) System
// ============================================

export const ndaAgreements = pgTable('nda_agreements', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  projectId: integer('project_id').references(() => projects.id),
  
  // Agreement details
  agreementType: varchar('agreement_type', { length: 50 }).default('platform'), // platform, project
  agreementVersion: varchar('agreement_version', { length: 20 }).notNull(),
  agreementText: text('agreement_text').notNull(),
  
  // Signature
  signedAt: timestamp('signed_at').defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  signatureData: jsonb('signature_data'),
  
  // Status
  status: varchar('status', { length: 50 }).default('active'), // active, revoked, expired
  revokedAt: timestamp('revoked_at'),
  revokedReason: text('revoked_reason'),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('nda_agreements_user_idx').on(table.userId),
  projectIdx: index('nda_agreements_project_idx').on(table.projectId),
  statusIdx: index('nda_agreements_status_idx').on(table.status),
}));

export const projectAccessLogs = pgTable('project_access_logs', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  userId: integer('user_id').references(() => users.id),
  
  // Access details
  accessLevel: varchar('access_level', { length: 50 }).notNull(), // public, registered, negotiator
  accessType: varchar('access_type', { length: 50 }).notNull(), // view, download, share
  
  // What was accessed
  contentType: varchar('content_type', { length: 100 }),
  contentId: varchar('content_id', { length: 255 }),
  
  // Context
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  referrer: varchar('referrer', { length: 500 }),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  projectUserIdx: index('project_access_logs_project_user_idx').on(table.projectId, table.userId),
  userIdx: index('project_access_logs_user_idx').on(table.userId),
  createdAtIdx: index('project_access_logs_created_at_idx').on(table.createdAt),
}));

// Relations for NDA
export const ndaAgreementsRelations = relations(ndaAgreements, ({ one }) => ({
  user: one(users, {
    fields: [ndaAgreements.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [ndaAgreements.projectId],
    references: [projects.id],
  }),
}));

export const projectAccessLogsRelations = relations(projectAccessLogs, ({ one }) => ({
  project: one(projects, {
    fields: [projectAccessLogs.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectAccessLogs.userId],
    references: [users.id],
  }),
}));







// ============================================
// ADDITIONAL WALLET & COMMISSION TABLES
// ============================================

export const referralCodes = pgTable('referral_codes', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  code: varchar('code', { length: 50 }).unique().notNull(),
  type: varchar('type', { length: 50 }).default('general'), // 'general', 'project', 'campaign'
  projectId: integer('project_id').references(() => projects.id),
  commissionRate: numeric('commission_rate', { precision: 5, scale: 2 }).default('5.00'), // percentage
  usesCount: integer('uses_count').default(0),
  maxUses: integer('max_uses'), // NULL = unlimited
  totalEarned: numeric('total_earned', { precision: 12, scale: 2 }).default('0.00'),
  status: varchar('status', { length: 50 }).default('active'), // 'active', 'inactive', 'expired'
  expiresAt: timestamp('expires_at'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('referral_codes_user_idx').on(table.userId),
  codeIdx: index('referral_codes_code_idx').on(table.code),
  projectIdx: index('referral_codes_project_idx').on(table.projectId),
  statusIdx: index('referral_codes_status_idx').on(table.status),
}));

export const commissions = pgTable('commissions', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  walletId: integer('wallet_id').references(() => wallets.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'referral', 'marketing', 'platform'
  sourceType: varchar('source_type', { length: 50 }).notNull(), // 'backing', 'project', 'subscription'
  sourceId: integer('source_id').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  rate: numeric('rate', { precision: 5, scale: 2 }).notNull(),
  baseAmount: numeric('base_amount', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'approved', 'paid', 'cancelled'
  approvedAt: timestamp('approved_at'),
  paidAt: timestamp('paid_at'),
  approvedBy: integer('approved_by').references(() => users.id),
  notes: text('notes'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('commissions_user_idx').on(table.userId),
  walletIdx: index('commissions_wallet_idx').on(table.walletId),
  typeIdx: index('commissions_type_idx').on(table.type),
  sourceIdx: index('commissions_source_idx').on(table.sourceType, table.sourceId),
  statusIdx: index('commissions_status_idx').on(table.status),
  createdAtIdx: index('commissions_created_at_idx').on(table.createdAt),
}));

export const negotiationGates = pgTable('negotiation_gates', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  projectId: integer('project_id').references(() => projects.id).notNull().unique(),
  isOpen: boolean('is_open').default(true).notNull(),
  depositAmount: numeric('deposit_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
  maxNegotiators: integer('max_negotiators'),
  currentNegotiators: integer('current_negotiators').default(0).notNull(),
  requirements: jsonb('requirements'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  projectIdx: index('negotiation_gates_project_idx').on(table.projectId),
  isOpenIdx: index('negotiation_gates_is_open_idx').on(table.isOpen),
}));

// Relations for additional tables
export const referralCodesRelations = relations(referralCodes, ({ one, many }) => ({
  user: one(users, {
    fields: [referralCodes.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [referralCodes.projectId],
    references: [projects.id],
  }),
}));

export const commissionsRelations = relations(commissions, ({ one }) => ({
  user: one(users, {
    fields: [commissions.userId],
    references: [users.id],
  }),
  wallet: one(wallets, {
    fields: [commissions.walletId],
    references: [wallets.id],
  }),
  approver: one(users, {
    fields: [commissions.approvedBy],
    references: [users.id],
  }),
}));

export const negotiationGatesRelations = relations(negotiationGates, ({ one }) => ({
  project: one(projects, {
    fields: [negotiationGates.projectId],
    references: [projects.id],
  }),
}));

