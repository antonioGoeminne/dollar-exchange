import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getDollarPrices } from "@/features/currency/api/get-dollar-prices";

export async function GET() {
  const data = await getDollarPrices();
  return NextResponse.json(data);
}

export async function POST() {
  revalidateTag("dollar-prices", "max");
  return NextResponse.json({ message: "Revalidated" });
}
