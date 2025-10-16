import { pgTable, serial, varchar, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Negotiation Bots
export const negotiationBots = pgTable('negotiation_bots', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // investor, project_owner, mediator
  personality: varchar('personality', { length: 50 }).notNull(), // professional, friendly, aggressive, conservative
  
  // Bot behavior
  responseDelay: integer('response_delay').default(2000), // milliseconds
  strategies: jsonb('strategies'), // Array of negotiation strategies
  
  // Bot knowledge
  knowledgeBase: jsonb('knowledge_base'), // Domain-specific knowledge
  conversationHistory: jsonb('conversation_history'), // Past conversations for learning
  
  // Performance metrics
  successRate: integer('success_rate').default(0), // Percentage
  totalNegotiations: integer('total_negotiations').default(0),
  averageResponseTime: integer('average_response_time').default(0),
  
  // Settings
  isActive: boolean('is_active').default(true),
  isSandbox: boolean('is_sandbox').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Bot Messages
export const botMessages = pgTable('bot_messages', {
  id: serial('id').primaryKey(),
  botId: integer('bot_id').references(() => negotiationBots.id),
  negotiationId: integer('negotiation_id'),
  message: text('message').notNull(),
  messageType: varchar('message_type', { length: 50 }), // greeting, question, offer, counter_offer, acceptance, rejection
  sentiment: varchar('sentiment', { length: 50 }), // positive, neutral, negative
  confidence: integer('confidence'), // 0-100
  
  // Context
  context: jsonb('context'), // Conversation context
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// System Settings
export const systemSettings = pgTable('system_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).unique().notNull(),
  value: text('value'),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

