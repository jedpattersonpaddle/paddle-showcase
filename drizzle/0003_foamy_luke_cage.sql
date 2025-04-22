CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"paddle_subscription_id" text NOT NULL,
	"license_key" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
