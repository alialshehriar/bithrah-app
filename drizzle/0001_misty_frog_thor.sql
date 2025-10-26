CREATE TABLE IF NOT EXISTS "comment_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "idea_evaluations" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer,
	"idea_title" varchar(500) NOT NULL,
	"idea_description" text NOT NULL,
	"category" varchar(100),
	"target_market" varchar(200),
	"ai_score" numeric(3, 1),
	"ai_analysis" jsonb,
	"strengths" text[],
	"weaknesses" text[],
	"opportunities" text[],
	"risks" text[],
	"recommendations" text[],
	"market_analysis" text,
	"financial_projection" text,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "idea_evaluations_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nda_otp_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"nda_agreement_id" integer,
	"user_id" integer,
	"email" varchar(255),
	"phone" varchar(50),
	"otp_code" varchar(10) NOT NULL,
	"otp_method" varchar(20) NOT NULL,
	"otp_purpose" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"verified_at" timestamp,
	"expires_at" timestamp NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"ip_address" varchar(50),
	"user_agent" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "nda_otp_verifications_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nda_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"version" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content_arabic" text NOT NULL,
	"content_english" text,
	"is_active" boolean DEFAULT false NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_by" integer,
	"notes" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"activated_at" timestamp,
	CONSTRAINT "nda_templates_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "nda_templates_version_unique" UNIQUE("version")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"parent_id" integer,
	"content" text NOT NULL,
	"likes_count" integer DEFAULT 0,
	"replies_count" integer DEFAULT 0,
	"status" varchar(50) DEFAULT 'published',
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "post_comments_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post_saves" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "support_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"project_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'SAR',
	"tier" varchar(50) DEFAULT 'basic',
	"features" jsonb,
	"max_backers" integer,
	"current_backers" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "support_packages_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "nda_agreements" ALTER COLUMN "signature_data" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "full_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "phone" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "signature_type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "otp_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "otp_method" varchar(20);--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "otp_verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "device_type" varchar(50);--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "browser" varchar(100);--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "os" varchar(100);--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "location" jsonb;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "pdf_generated" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "pdf_url" varchar(500);--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "pdf_storage_path" varchar(500);--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "pdf_generated_at" timestamp;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "email_sent" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "email_sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "email_sent_to" jsonb;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "is_valid" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "revoked_by" integer;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "nda_agreements" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "trending" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_demo" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_comment_id_post_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."post_comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "idea_evaluations" ADD CONSTRAINT "idea_evaluations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nda_otp_verifications" ADD CONSTRAINT "nda_otp_verifications_nda_agreement_id_nda_agreements_id_fk" FOREIGN KEY ("nda_agreement_id") REFERENCES "public"."nda_agreements"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nda_otp_verifications" ADD CONSTRAINT "nda_otp_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nda_templates" ADD CONSTRAINT "nda_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_saves" ADD CONSTRAINT "post_saves_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_saves" ADD CONSTRAINT "post_saves_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "support_packages" ADD CONSTRAINT "support_packages_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "comment_likes_comment_user_idx" ON "comment_likes" USING btree ("comment_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comment_likes_comment_idx" ON "comment_likes" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comment_likes_user_idx" ON "comment_likes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idea_evaluations_user_idx" ON "idea_evaluations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idea_evaluations_status_idx" ON "idea_evaluations" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idea_evaluations_created_at_idx" ON "idea_evaluations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nda_otp_nda_agreement_id_idx" ON "nda_otp_verifications" USING btree ("nda_agreement_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nda_otp_email_idx" ON "nda_otp_verifications" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nda_otp_phone_idx" ON "nda_otp_verifications" USING btree ("phone");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nda_otp_status_idx" ON "nda_otp_verifications" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nda_templates_version_idx" ON "nda_templates" USING btree ("version");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nda_templates_is_active_idx" ON "nda_templates" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_comments_post_idx" ON "post_comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_comments_user_idx" ON "post_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_comments_parent_idx" ON "post_comments" USING btree ("parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "post_likes_post_user_idx" ON "post_likes" USING btree ("post_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_likes_post_idx" ON "post_likes" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_likes_user_idx" ON "post_likes" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "post_saves_post_user_idx" ON "post_saves" USING btree ("post_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_saves_post_idx" ON "post_saves" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_saves_user_idx" ON "post_saves" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "support_packages_project_idx" ON "support_packages" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "support_packages_tier_idx" ON "support_packages" USING btree ("tier");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nda_agreements" ADD CONSTRAINT "nda_agreements_revoked_by_users_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nda_agreements_email_idx" ON "nda_agreements" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nda_agreements_signed_at_idx" ON "nda_agreements" USING btree ("signed_at");