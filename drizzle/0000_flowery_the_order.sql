CREATE TABLE IF NOT EXISTS "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"achievement_key" varchar(100) NOT NULL,
	"achievement_type" varchar(50),
	"title" varchar(255),
	"description" text,
	"points_awarded" integer DEFAULT 0,
	"badge_icon" varchar(255),
	"progress" integer DEFAULT 0,
	"target" integer,
	"metadata" jsonb,
	"unlocked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_evaluations" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"version" integer DEFAULT 1,
	"model" varchar(50),
	"overall_score" integer,
	"feasibility_score" integer,
	"market_score" integer,
	"innovation_score" integer,
	"impact_score" integer,
	"evaluation_data" jsonb,
	"strengths" jsonb,
	"weaknesses" jsonb,
	"opportunities" jsonb,
	"threats" jsonb,
	"recommendations" text,
	"market_size" varchar(50),
	"competition_level" varchar(50),
	"target_audience" jsonb,
	"projected_revenue" jsonb,
	"break_even_analysis" jsonb,
	"status" varchar(50) DEFAULT 'completed',
	"processing_time" integer,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_evaluations_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"event_category" varchar(100),
	"event_action" varchar(100),
	"event_label" varchar(255),
	"user_id" integer,
	"session_id" varchar(255),
	"target_id" integer,
	"target_type" varchar(50),
	"user_agent" text,
	"ip_address" varchar(50),
	"referrer" varchar(500),
	"url" varchar(500),
	"device" varchar(50),
	"browser" varchar(50),
	"os" varchar(50),
	"country" varchar(100),
	"city" varchar(100),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" varchar(100) NOT NULL,
	"entity" varchar(100),
	"entity_id" integer,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" varchar(50),
	"user_agent" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "backings" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"transaction_id" integer,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'SAR',
	"package_id" varchar(100),
	"package_details" jsonb,
	"referrer_id" integer,
	"marketing_commission" numeric(12, 2) DEFAULT '0',
	"commission_paid" boolean DEFAULT false,
	"status" varchar(50) DEFAULT 'pending',
	"reward_delivered" boolean DEFAULT false,
	"delivered_at" timestamp,
	"message" text,
	"is_anonymous" boolean DEFAULT false,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "backings_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"target_id" integer NOT NULL,
	"target_type" varchar(50) NOT NULL,
	"collection_name" varchar(100),
	"notes" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"target_id" integer NOT NULL,
	"target_type" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"parent_id" integer,
	"likes_count" integer DEFAULT 0,
	"replies_count" integer DEFAULT 0,
	"status" varchar(50) DEFAULT 'published',
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "comments_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "communities" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" integer NOT NULL,
	"project_id" integer,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255),
	"description" text,
	"short_description" varchar(500),
	"category" varchar(100),
	"tags" jsonb,
	"image" varchar(500),
	"cover_image" varchar(500),
	"tier" varchar(50) DEFAULT 'public',
	"is_private" boolean DEFAULT false,
	"requires_approval" boolean DEFAULT false,
	"member_limit" integer,
	"member_count" integer DEFAULT 0,
	"active_members" integer DEFAULT 0,
	"posts_count" integer DEFAULT 0,
	"features" jsonb,
	"rules" jsonb,
	"settings" jsonb,
	"moderation_settings" jsonb,
	"status" varchar(50) DEFAULT 'active',
	"verified" boolean DEFAULT false,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "communities_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "communities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" varchar(50) DEFAULT 'member' NOT NULL,
	"permissions" jsonb,
	"points" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"support_count" integer DEFAULT 0,
	"posts_count" integer DEFAULT 0,
	"comments_count" integer DEFAULT 0,
	"status" varchar(50) DEFAULT 'active',
	"metadata" jsonb,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"last_active_at" timestamp,
	"left_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"community_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(255),
	"content" text NOT NULL,
	"content_type" varchar(50) DEFAULT 'text',
	"attachments" jsonb,
	"likes_count" integer DEFAULT 0,
	"comments_count" integer DEFAULT 0,
	"shares_count" integer DEFAULT 0,
	"status" varchar(50) DEFAULT 'published',
	"pinned" boolean DEFAULT false,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "community_posts_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"target_id" integer NOT NULL,
	"target_type" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" integer NOT NULL,
	"recipient_id" integer NOT NULL,
	"subject" varchar(255),
	"content" text NOT NULL,
	"content_type" varchar(50) DEFAULT 'text',
	"attachments" jsonb,
	"thread_id" varchar(100),
	"parent_id" integer,
	"read" boolean DEFAULT false,
	"read_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_by_sender" boolean DEFAULT false,
	"deleted_by_recipient" boolean DEFAULT false,
	CONSTRAINT "messages_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nda_agreements" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"project_id" integer,
	"agreement_type" varchar(50) DEFAULT 'platform',
	"agreement_version" varchar(20) NOT NULL,
	"agreement_text" text NOT NULL,
	"signed_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(50),
	"user_agent" text,
	"signature_data" jsonb,
	"status" varchar(50) DEFAULT 'active',
	"revoked_at" timestamp,
	"revoked_reason" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "nda_agreements_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "negotiation_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"negotiation_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"content" text NOT NULL,
	"message_type" varchar(50) DEFAULT 'text',
	"attachments" jsonb,
	"status" varchar(50) DEFAULT 'sent',
	"flagged" boolean DEFAULT false,
	"flag_reason" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read_at" timestamp,
	CONSTRAINT "negotiation_messages_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "negotiations" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"project_id" integer NOT NULL,
	"investor_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"deposit_amount" numeric(12, 2) NOT NULL,
	"deposit_status" varchar(50) DEFAULT 'held',
	"deposit_refunded_at" timestamp,
	"has_full_access" boolean DEFAULT false,
	"agreed_amount" numeric(12, 2),
	"agreement_terms" text,
	"agreement_reached" boolean DEFAULT false,
	"agreement_date" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "negotiations_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"category" varchar(50),
	"title" varchar(255),
	"content" text NOT NULL,
	"action_url" varchar(500),
	"action_text" varchar(100),
	"related_id" integer,
	"related_type" varchar(50),
	"read" boolean DEFAULT false,
	"read_at" timestamp,
	"priority" varchar(20) DEFAULT 'normal',
	"channels" jsonb,
	"sent_via_email" boolean DEFAULT false,
	"sent_via_push" boolean DEFAULT false,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	CONSTRAINT "notifications_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_access_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" integer,
	"access_level" varchar(50) NOT NULL,
	"access_type" varchar(50) NOT NULL,
	"content_type" varchar(100),
	"content_id" varchar(255),
	"ip_address" varchar(50),
	"user_agent" text,
	"referrer" varchar(500),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255),
	"description" text,
	"short_description" varchar(500),
	"category" varchar(100),
	"sub_category" varchar(100),
	"tags" jsonb,
	"image" varchar(500),
	"cover_image" varchar(500),
	"gallery" jsonb,
	"video" varchar(500),
	"documents" jsonb,
	"funding_goal" numeric(12, 2) NOT NULL,
	"current_funding" numeric(12, 2) DEFAULT '0',
	"minimum_funding" numeric(12, 2),
	"currency" varchar(10) DEFAULT 'SAR',
	"backers_count" integer DEFAULT 0,
	"start_date" timestamp,
	"deadline" timestamp,
	"expected_delivery" timestamp,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"visibility" varchar(50) DEFAULT 'public',
	"featured" boolean DEFAULT false,
	"verified" boolean DEFAULT false,
	"platform_package" varchar(50) DEFAULT 'basic',
	"packages" jsonb,
	"public_description" text,
	"registered_description" text,
	"full_description" text,
	"confidential_docs" jsonb,
	"negotiation_enabled" boolean DEFAULT false,
	"negotiation_deposit" numeric(12, 2),
	"funding_duration" integer DEFAULT 60,
	"funding_start_date" timestamp,
	"funding_end_date" timestamp,
	"auto_refund_on_failure" boolean DEFAULT true,
	"payment_gateway_fee" numeric(5, 2) DEFAULT '2.00',
	"views_count" integer DEFAULT 0,
	"likes_count" integer DEFAULT 0,
	"comments_count" integer DEFAULT 0,
	"shares_count" integer DEFAULT 0,
	"bookmarks_count" integer DEFAULT 0,
	"ai_score" integer,
	"ai_evaluation_data" jsonb,
	"country" varchar(100),
	"city" varchar(100),
	"location" jsonb,
	"faq" jsonb,
	"updates" jsonb,
	"risks" text,
	"team_members" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "projects_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"referrer_id" integer NOT NULL,
	"referred_id" integer NOT NULL,
	"referral_code" varchar(50) NOT NULL,
	"source" varchar(100),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"commission_earned" numeric(10, 2) DEFAULT '0',
	"commission_paid" boolean DEFAULT false,
	"first_purchase_at" timestamp,
	"rewarded_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referrals_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporter_id" integer NOT NULL,
	"target_id" integer NOT NULL,
	"target_type" varchar(50) NOT NULL,
	"reason" varchar(100) NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'pending',
	"reviewed_by" integer,
	"reviewed_at" timestamp,
	"resolution" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" jsonb,
	"category" varchar(50),
	"description" text,
	"is_public" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"tier" varchar(50) NOT NULL,
	"plan_id" varchar(100),
	"price" numeric(10, 2),
	"currency" varchar(10) DEFAULT 'SAR',
	"billing_cycle" varchar(50),
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"trial_end_date" timestamp,
	"cancelled_at" timestamp,
	"auto_renew" boolean DEFAULT true,
	"payment_provider" varchar(50),
	"payment_provider_id" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"category" varchar(50),
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'SAR',
	"fee" numeric(10, 2) DEFAULT '0',
	"net_amount" numeric(12, 2),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"payment_method" varchar(50),
	"payment_provider" varchar(50),
	"payment_provider_id" varchar(255),
	"related_id" integer,
	"related_type" varchar(50),
	"description" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"email_verification_token" varchar(255),
	"password" varchar(255) NOT NULL,
	"name" varchar(255),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"username" varchar(100),
	"avatar" varchar(500),
	"bio" text,
	"phone" varchar(50),
	"phone_verified" boolean DEFAULT false,
	"date_of_birth" timestamp,
	"gender" varchar(20),
	"country" varchar(100),
	"city" varchar(100),
	"address" text,
	"postal_code" varchar(20),
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"experience" integer DEFAULT 0 NOT NULL,
	"referral_code" varchar(50),
	"referred_by" integer,
	"referral_count" integer DEFAULT 0,
	"referral_earnings" numeric(12, 2) DEFAULT '0',
	"subscription_tier" varchar(50) DEFAULT 'free',
	"subscription_status" varchar(50) DEFAULT 'active',
	"subscription_start_date" timestamp,
	"subscription_end_date" timestamp,
	"language" varchar(10) DEFAULT 'ar',
	"timezone" varchar(50) DEFAULT 'Asia/Riyadh',
	"currency" varchar(10) DEFAULT 'SAR',
	"notification_settings" jsonb,
	"privacy_settings" jsonb,
	"preferences" jsonb,
	"social_links" jsonb,
	"two_factor_enabled" boolean DEFAULT false,
	"two_factor_secret" varchar(255),
	"last_login_at" timestamp,
	"last_login_ip" varchar(50),
	"password_reset_token" varchar(255),
	"password_reset_expires" timestamp,
	"onboarding_completed" boolean DEFAULT false,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"balance" numeric(12, 2) DEFAULT '0' NOT NULL,
	"currency" varchar(10) DEFAULT 'SAR',
	"daily_limit" numeric(12, 2),
	"monthly_limit" numeric(12, 2),
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"is_frozen" boolean DEFAULT false,
	"frozen_at" timestamp,
	"frozen_reason" text,
	"total_deposits" numeric(12, 2) DEFAULT '0',
	"total_withdrawals" numeric(12, 2) DEFAULT '0',
	"total_transactions" integer DEFAULT 0,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallets_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "wallets_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_evaluations" ADD CONSTRAINT "ai_evaluations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_evaluations" ADD CONSTRAINT "ai_evaluations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analytics" ADD CONSTRAINT "analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "backings" ADD CONSTRAINT "backings_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "backings" ADD CONSTRAINT "backings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "backings" ADD CONSTRAINT "backings_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "backings" ADD CONSTRAINT "backings_referrer_id_users_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communities" ADD CONSTRAINT "communities_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communities" ADD CONSTRAINT "communities_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_members" ADD CONSTRAINT "community_members_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_members" ADD CONSTRAINT "community_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nda_agreements" ADD CONSTRAINT "nda_agreements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nda_agreements" ADD CONSTRAINT "nda_agreements_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "negotiation_messages" ADD CONSTRAINT "negotiation_messages_negotiation_id_negotiations_id_fk" FOREIGN KEY ("negotiation_id") REFERENCES "public"."negotiations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "negotiation_messages" ADD CONSTRAINT "negotiation_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "negotiations" ADD CONSTRAINT "negotiations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "negotiations" ADD CONSTRAINT "negotiations_investor_id_users_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_access_logs" ADD CONSTRAINT "project_access_logs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_access_logs" ADD CONSTRAINT "project_access_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_users_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_id_users_id_fk" FOREIGN KEY ("referred_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "achievements_user_idx" ON "achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "achievements_key_idx" ON "achievements" USING btree ("achievement_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_evaluations_project_idx" ON "ai_evaluations" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_evaluations_user_idx" ON "ai_evaluations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_event_type_idx" ON "analytics" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_user_idx" ON "analytics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_created_at_idx" ON "analytics" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_user_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "backings_project_idx" ON "backings" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "backings_user_idx" ON "backings" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "bookmarks_user_target_idx" ON "bookmarks" USING btree ("user_id","target_id","target_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookmarks_user_idx" ON "bookmarks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_target_idx" ON "comments" USING btree ("target_id","target_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_user_idx" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "communities_creator_idx" ON "communities" USING btree ("creator_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "communities_slug_idx" ON "communities" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "communities_category_idx" ON "communities" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "community_members_community_user_idx" ON "community_members" USING btree ("community_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "community_members_user_idx" ON "community_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "community_posts_community_idx" ON "community_posts" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "community_posts_user_idx" ON "community_posts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "likes_user_target_idx" ON "likes" USING btree ("user_id","target_id","target_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_sender_idx" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_recipient_idx" ON "messages" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_thread_idx" ON "messages" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nda_agreements_user_idx" ON "nda_agreements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nda_agreements_project_idx" ON "nda_agreements" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nda_agreements_status_idx" ON "nda_agreements" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "negotiation_messages_negotiation_idx" ON "negotiation_messages" USING btree ("negotiation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "negotiation_messages_sender_idx" ON "negotiation_messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "negotiations_project_idx" ON "negotiations" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "negotiations_investor_idx" ON "negotiations" USING btree ("investor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "negotiations_status_idx" ON "negotiations" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_read_idx" ON "notifications" USING btree ("read");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_type_idx" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_access_logs_project_user_idx" ON "project_access_logs" USING btree ("project_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_access_logs_user_idx" ON "project_access_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_access_logs_created_at_idx" ON "project_access_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_creator_idx" ON "projects" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_category_idx" ON "projects" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "projects_slug_idx" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "referrals_referrer_idx" ON "referrals" USING btree ("referrer_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "referrals_referred_idx" ON "referrals" USING btree ("referred_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_target_idx" ON "reports" USING btree ("target_id","target_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_status_idx" ON "reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriptions_user_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriptions_status_idx" ON "subscriptions" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_user_idx" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_status_idx" ON "transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_type_idx" ON "transactions" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_referral_code_idx" ON "users" USING btree ("referral_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "wallets_user_idx" ON "wallets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wallets_status_idx" ON "wallets" USING btree ("status");