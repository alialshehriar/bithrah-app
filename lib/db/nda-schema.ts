import { pgTable, serial, varchar, text, integer, timestamp, boolean, jsonb, uuid, index } from 'drizzle-orm/pg-core';

// ============================================
// NDA (Non-Disclosure Agreement) System
// ============================================

export const ndaAgreements = pgTable('nda_agreements', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  userId: integer('user_id').notNull(), // User who signed
  projectId: integer('project_id'), // Optional: specific project
  
  // Agreement details
  agreementType: varchar('agreement_type', { length: 50 }).default('platform'), // platform, project
  agreementVersion: varchar('agreement_version', { length: 20 }).notNull(),
  agreementText: text('agreement_text').notNull(),
  
  // Signature
  signedAt: timestamp('signed_at').defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  signatureData: jsonb('signature_data'), // Digital signature info
  
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

// ============================================
// Project Access Logs
// ============================================

export const projectAccessLogs = pgTable('project_access_logs', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull(),
  userId: integer('user_id').notNull(),
  
  // Access details
  accessLevel: varchar('access_level', { length: 50 }).notNull(), // public, registered, negotiator
  accessType: varchar('access_type', { length: 50 }).notNull(), // view, download, share
  
  // What was accessed
  contentType: varchar('content_type', { length: 100 }), // description, document, image, etc
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

