CREATE TABLE "product" (
	"id" text PRIMARY KEY NOT NULL,
	"showcase_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "showcase" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"company_name" text NOT NULL,
	"logo_url" text,
	"brand_color" text NOT NULL,
	"subdomain" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "showcase_subdomain_unique" UNIQUE("subdomain")
);
--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_showcase_id_showcase_id_fk" FOREIGN KEY ("showcase_id") REFERENCES "public"."showcase"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "price" ADD CONSTRAINT "price_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "showcase" ADD CONSTRAINT "showcase_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;