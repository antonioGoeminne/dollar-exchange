import { dollarInfo } from "@/db/schemas/dollar_info";
import { db } from "@/lib/db";

export async function getDollarPrices() {
    const dollarPrices = await db.select().from(dollarInfo);
    return dollarPrices;
}