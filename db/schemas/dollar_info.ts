import {
  bigserial,
  date,
  numeric,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const dollarInfo = pgTable("dollar_info", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  exchangeRate: numeric("exchange_rate", { precision: 18, scale: 4 }),
  date: date("date"),
  name: varchar("name", { length: 255 }),
  purchasePrice: numeric("purchase_price", { precision: 18, scale: 4 }),
  salePrice: numeric("sale_price", { precision: 18, scale: 4 }),
  refName: varchar("ref_name", { length: 255 }),
});
