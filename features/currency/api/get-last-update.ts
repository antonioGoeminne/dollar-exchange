import { desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { historicalData } from "@/db/schemas/historical_data";
import { db } from "@/lib/db";

export const getLastUpdate = unstable_cache(
  async (): Promise<{ lastUpdate: Date | null }> => {
    const [last] = await db
      .select({ createdAt: historicalData.createdAt })
      .from(historicalData)
      .orderBy(desc(historicalData.createdAt))
      .limit(1);

    return { lastUpdate: last?.createdAt ?? null };
  },
  ["last-update"],
  {
    tags: ["last-update"],
    revalidate: 30,
  },
);
