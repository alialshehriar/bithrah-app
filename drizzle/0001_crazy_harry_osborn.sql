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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "support_tiers" ADD CONSTRAINT "support_tiers_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "support_tiers_project_idx" ON "support_tiers" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "support_tiers_amount_idx" ON "support_tiers" USING btree ("amount");