import { NextResponse } from "next/server";
import { getLastUpdate } from "@/features/currency/api/get-last-update";

export async function GET() {
  const { lastUpdate } = await getLastUpdate();

  if (lastUpdate == null) {
    return NextResponse.json(
      { lastUpdate: null, message: "No hay registros históricos" },
      { status: 200 },
    );
  }

  return NextResponse.json({ lastUpdate });
}
