import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { dollarInfo } from "@/db/schemas/dollar_info";
import { db } from "@/lib/db";

export const getDollarPrices = unstable_cache(
  async () => {
    const dollarPrices = await db
      .select()
      .from(dollarInfo)
      .orderBy(asc(dollarInfo.ranking));
    return dollarPrices;
  },
  ["dollar-prices"],
  {
    tags: ["dollar-prices"],
    revalidate: 30,
  },
);
