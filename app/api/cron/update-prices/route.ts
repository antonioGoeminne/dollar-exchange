import { asc, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { dollarInfo } from "@/db/schemas/dollar_info";
import { historicalData } from "@/db/schemas/historical_data";
import { getHistoricalPrices } from "@/features/currency/api/get-historical-prices";
import { getDollarQuotes } from "@/features/prices";
import { db } from "@/lib/db";

const calculateExchangeRate = (
  historicalPrice: number | null,
  currentPrice: number | null,
) => {
  if (historicalPrice == null || currentPrice == null) return null;
  return ((currentPrice - historicalPrice) / historicalPrice) * 100;
};

export async function GET() {
  try {
    const quotes = await getDollarQuotes();
    const today = new Date().toISOString().split("T")[0];
    const startOfYesterday = new Date();
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);
    const endOfYesterday = new Date(startOfYesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    for (const quote of quotes) {
      await db
        .update(dollarInfo)
        .set({
          purchasePrice: quote.purchasePrice?.toString() ?? null,
          salePrice: quote.salePrice?.toString() ?? null,
          date: today,
          refName: quote.refName,
          ranking: quote.ranking,
        })
        .where(eq(dollarInfo.refName, quote.refName));
    }

    const dollarPrices = await db
      .select()
      .from(dollarInfo)
      .orderBy(asc(dollarInfo.ranking));
    const historical = await getHistoricalPrices({
      startDate: startOfYesterday,
      endDate: endOfYesterday,
    });

    for (const dollarPrice of dollarPrices) {
      const historicalPrice = historical.find(
        (h) => h.dollarInfoId === dollarPrice.id,
      );
      if (historicalPrice) {
        const purchaseExchangeRate = calculateExchangeRate(
          Number(historicalPrice.purchasePrice),
          Number(dollarPrice.purchasePrice),
        );
        const salesExchangeRate = calculateExchangeRate(
          Number(historicalPrice.salesPrice),
          Number(dollarPrice.salePrice),
        );
        const totalExchangeRate = calculateExchangeRate(
          Number(historicalPrice.purchasePrice) +
            Number(historicalPrice.salesPrice),
          Number(dollarPrice.purchasePrice) + Number(dollarPrice.salePrice),
        );

        await db.insert(historicalData).values({
          dollarInfoId: Number(dollarPrice.id),
          purchasePrice:
            dollarPrice.purchasePrice != null
              ? String(dollarPrice.purchasePrice)
              : null,
          salesPrice:
            dollarPrice.salePrice != null
              ? String(dollarPrice.salePrice)
              : null,
          purchaseExchangeRate: purchaseExchangeRate?.toString() ?? null,
          salesExchangeRate: salesExchangeRate?.toString() ?? null,
          totalExchangeRate: totalExchangeRate?.toString() ?? null,
        });

        await db
          .update(dollarInfo)
          .set({
            purchaseExchangeRate: purchaseExchangeRate?.toString() ?? null,
            salesExchangeRate: salesExchangeRate?.toString() ?? null,
            exchangeRate: totalExchangeRate?.toString() ?? null,
          })
          .where(eq(dollarInfo.id, dollarPrice.id));
      } else {
        await db.insert(historicalData).values({
          dollarInfoId: Number(dollarPrice.id),
          purchasePrice:
            dollarPrice.purchasePrice != null
              ? String(dollarPrice.purchasePrice)
              : null,
          salesPrice:
            dollarPrice.salePrice != null
              ? String(dollarPrice.salePrice)
              : null,
        });
      }
      revalidateTag("dollar-prices", "max");
    }

    return NextResponse.json({ dollarPrices, historical });
  } catch (error) {
    console.error("Error updating prices", error);
    return NextResponse.json(
      { error: "Error updating prices" },
      { status: 500 },
    );
  }
}
