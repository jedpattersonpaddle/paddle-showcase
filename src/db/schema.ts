import {
  pgTable,
  text,
  timestamp,
  unique,
  boolean,
  foreignKey,
  integer,
} from "drizzle-orm/pg-core";

export const verification = pgTable("verification", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const user = pgTable(
  "user",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean("email_verified").notNull(),
    image: text(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
  },
  (table) => [unique("user_email_unique").on(table.email)]
);

export const account = pgTable(
  "account",
  {
    id: text().primaryKey().notNull(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      mode: "string",
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      mode: "string",
    }),
    scope: text(),
    password: text(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "account_user_id_user_id_fk",
    }).onDelete("cascade"),
  ]
);

export const session = pgTable(
  "session",
  {
    id: text().primaryKey().notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    token: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "session_user_id_user_id_fk",
    }).onDelete("cascade"),
    unique("session_token_unique").on(table.token),
  ]
);

export const showcase = pgTable("showcase", {
  id: text().primaryKey().notNull(),
  userId: text("user_id").notNull(),
  companyName: text("company_name").notNull(),
  logoUrl: text("logo_url"),
  brandColor: text("brand_color").notNull(),
  subdomain: text().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const product = pgTable(
  "product",
  {
    id: text().primaryKey().notNull(),
    showcaseId: text("showcase_id").notNull(),
    name: text().notNull(),
    paddleProductId: text("paddle_product_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.showcaseId],
      foreignColumns: [showcase.id],
      name: "product_showcase_id_showcase_id_fk",
    }).onDelete("cascade"),
  ]
);

export const subscription = pgTable("subscription", {
  id: text().primaryKey().notNull(),
  paddleSubscriptionId: text("paddle_subscription_id").notNull(),
  licenseKey: text("license_key").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const price = pgTable(
  "price",
  {
    id: text().primaryKey().notNull(),
    productId: text("product_id").notNull(),
    name: text().notNull(),
    basePriceInCents: integer("base_price_in_cents").notNull(),
    priceQuantity: integer("price_quantity").notNull(),
    recurringInterval: text("recurring_interval").notNull(),
    recurringFrequency: integer("recurring_frequency").notNull(),
    paddlePriceId: text("paddle_price_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.productId],
      foreignColumns: [product.id],
      name: "price_product_id_product_id_fk",
    }).onDelete("cascade"),
  ]
);
