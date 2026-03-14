import { and, desc, gte, lte } from "drizzle-orm";
import { historicalData } from "@/db/schemas/historical_data";
import { db } from "@/lib/db";

export type GetHistoricalPricesParams = {
  startDate?: Date | string;
  endDate?: Date | string;
};

export async function getHistoricalPrices(params?: GetHistoricalPricesParams) {
  const { startDate, endDate } = params ?? {};
  const conditions = [];
  if (startDate) {
    conditions.push(gte(historicalData.createdAt, new Date(startDate)));
  }
  if (endDate) {
    conditions.push(lte(historicalData.createdAt, new Date(endDate)));
  }
  return db
    .select()
    .from(historicalData)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(historicalData.createdAt));
}
