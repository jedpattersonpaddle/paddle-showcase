CREATE TABLE "price" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"name" text NOT NULL,
	"base_price_in_cents" integer NOT NULL,
	"price_quantity" integer NOT NULL,
	"recurring_interval" text NOT NULL,
	"recurring_frequency" integer NOT NULL,
	"paddle_price_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "showcase" DROP CONSTRAINT "showcase_subdomain_unique";--> statement-breakpoint
ALTER TABLE "showcase" DROP CONSTRAINT "showcase_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "price" ADD CONSTRAINT "price_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "price_name";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "base_price_in_cents";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "price_quantity";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "recurring_interval";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "recurring_frequency";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "paddle_product_id";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "paddle_price_id";