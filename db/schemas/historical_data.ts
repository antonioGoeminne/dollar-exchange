import {
  bigint,
  bigserial,
  numeric,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";
import { dollarInfo } from "./dollar_info";

export const historicalData = pgTable("historical_Data", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  dollarInfoId: bigint("dollar_info_id", { mode: "number" }).references(
    () => dollarInfo.id,
  ),
  salesPrice: numeric("sales_price", { precision: 18, scale: 4 }),
  purchasePrice: numeric("purchase_price", { precision: 18, scale: 4 }),
  purchaseExchangeRate: numeric("purchase_exchange_rate", {
    precision: 18,
    scale: 4,
  }),
  salesExchangeRate: numeric("sales_exchange_rate", {
    precision: 18,
    scale: 4,
  }),
  totalExchangeRate: numeric("total_exchange_rate", {
    precision: 18,
    scale: 4,
  }),
});
