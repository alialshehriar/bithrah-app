ALTER TABLE "support_tiers" DROP CONSTRAINT "support_tiers_uuid_unique";--> statement-breakpoint
ALTER TABLE "negotiations" ALTER COLUMN "deposit_amount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "negotiations" ALTER COLUMN "deposit_status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "support_tiers" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "support_tiers" ALTER COLUMN "rewards" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "support_tiers" ALTER COLUMN "shipping_regions" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "support_tiers" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "support_tiers" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "negotiations" ADD COLUMN "amount" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "negotiations" ADD COLUMN "payment_status" varchar(50);--> statement-breakpoint
ALTER TABLE "support_tiers" DROP COLUMN IF EXISTS "uuid";--> statement-breakpoint
ALTER TABLE "support_tiers" DROP COLUMN IF EXISTS "estimated_delivery";--> statement-breakpoint
ALTER TABLE "support_tiers" DROP COLUMN IF EXISTS "display_order";--> statement-breakpoint
ALTER TABLE "support_tiers" DROP COLUMN IF EXISTS "metadata";