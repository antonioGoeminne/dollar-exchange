import { and, desc, eq, gte, inArray, lt } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { dollarInfo } from "@/db/schemas/dollar_info";
import { historicalData } from "@/db/schemas/historical_data";
import { getDollarQuotes } from "@/features/prices";
import { db } from "@/lib/db";

export async function GET(_request: Request) {
  try {
    const quotes = await getDollarQuotes();
    if (quotes.length === 0) {
      revalidateTag("dollar-prices", "max");
      return NextResponse.json({ success: true, updated: 0 });
    }

    const now = new Date();
    const dateOnly = now.toISOString().slice(0, 10);
    const todayStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);

    const refNames = quotes.map((q) => q.refName);

    await db.transaction(async (tx) => {
      // 1. Batch read existing dollar_info by refName
      const existingRows = await tx
        .select({ id: dollarInfo.id, refName: dollarInfo.refName })
        .from(dollarInfo)
        .where(inArray(dollarInfo.refName, refNames));

      const refNameToId = new Map<string, number>();
      const existingIds: number[] = [];
      for (const row of existingRows) {
        if (row.refName != null) {
          refNameToId.set(row.refName, row.id);
          existingIds.push(row.id);
        }
      }

      const yesterdayMap = new Map<
        number,
        { purchasePrice: string; salesPrice: string }
      >();
      if (existingIds.length > 0) {
        const yesterdayRows = await tx
          .select({
            dollarInfoId: historicalData.dollarInfoId,
            purchasePrice: historicalData.purchasePrice,
            salesPrice: historicalData.salesPrice,
          })
          .from(historicalData)
          .where(
            and(
              inArray(historicalData.dollarInfoId, existingIds),
              gte(historicalData.createdAt, yesterdayStart),
              lt(historicalData.createdAt, todayStart),
            ),
          )
          .orderBy(desc(historicalData.createdAt));

        for (const row of yesterdayRows) {
          if (
            row.dollarInfoId != null &&
            !yesterdayMap.has(row.dollarInfoId) &&
            row.purchasePrice != null &&
            row.salesPrice != null
          ) {
            yesterdayMap.set(row.dollarInfoId, {
              purchasePrice: String(row.purchasePrice),
              salesPrice: String(row.salesPrice),
            });
          }
        }
      }

      const newRefNames = refNames.filter((ref) => !refNameToId.has(ref));
      if (newRefNames.length > 0) {
        const newQuotes = quotes.filter((q) => newRefNames.includes(q.refName));
        const inserted = await tx
          .insert(dollarInfo)
          .values(
            newQuotes.map((q) => ({
              exchangeRate: null,
              date: dateOnly,
              purchasePrice: q.purchasePrice.toFixed(4),
              salePrice: q.salePrice.toFixed(4),
              refName: q.refName,
              ranking: q.ranking,
            })),
          )
          .returning({ id: dollarInfo.id, refName: dollarInfo.refName });

        for (const row of inserted) {
          if (row.refName != null) refNameToId.set(row.refName, row.id);
        }
      }

      const toUpdate: Array<{
        id: number;
        exchangeRate: string | null;
        date: string;
        purchasePrice: string;
        salePrice: string;
        refName: string;
        ranking: number;
      }> = [];

      for (const quote of quotes) {
        const dollarInfoId = refNameToId.get(quote.refName);
        if (dollarInfoId == null) continue;

        const purchasePriceStr = quote.purchasePrice.toFixed(4);
        const salePriceStr = quote.salePrice.toFixed(4);
        const currentAvg = (quote.purchasePrice + quote.salePrice) / 2;

        let exchangeRate: string | null = null;
        const prev = yesterdayMap.get(dollarInfoId);
        if (prev != null) {
          const prevPurchase = Number(prev.purchasePrice);
          const prevSales = Number(prev.salesPrice);
          const previousAvg = (prevPurchase + prevSales) / 2;
          if (previousAvg > 0) {
            exchangeRate = (
              ((currentAvg - previousAvg) / previousAvg) *
              100
            ).toFixed(2);
          }
        }

        if (existingIds.includes(dollarInfoId)) {
          toUpdate.push({
            id: dollarInfoId,
            exchangeRate,
            date: dateOnly,
            purchasePrice: purchasePriceStr,
            salePrice: salePriceStr,
            refName: quote.refName,
            ranking: quote.ranking,
          });
        }
      }

      await Promise.all(
        toUpdate.map((row) =>
          tx
            .update(dollarInfo)
            .set({
              exchangeRate: row.exchangeRate,
              date: row.date,
              purchasePrice: row.purchasePrice,
              salePrice: row.salePrice,
              refName: row.refName,
              ranking: row.ranking,
            })
            .where(eq(dollarInfo.id, row.id)),
        ),
      );

      const historicalValues = quotes
        .map((quote) => {
          const dollarInfoId = refNameToId.get(quote.refName);
          if (dollarInfoId == null) return null;
          return {
            dollarInfoId,
            purchasePrice: quote.purchasePrice.toFixed(4),
            salesPrice: quote.salePrice.toFixed(4),
          };
        })
        .filter((v): v is NonNullable<typeof v> => v != null);

      await tx.insert(historicalData).values(historicalValues);
    });

    revalidateTag("dollar-prices", "max");

    return NextResponse.json({
      success: true,
      updated: quotes.length,
    });
  } catch (err) {
    console.error("Cron update-prices error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
