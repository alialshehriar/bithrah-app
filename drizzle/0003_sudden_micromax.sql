ALTER TABLE "projects" ADD COLUMN "platform_commission" numeric(5, 2) DEFAULT '6.50';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "platform_partnership" numeric(5, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "referral_enabled" boolean DEFAULT false;