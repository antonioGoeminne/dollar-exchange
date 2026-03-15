import type { DollarPriceQuote } from "../types";

type ArgentStatsApiItem = {
  dollarType: string;
  buyPrice: number;
  sellPrice: number;
  lastUpdate: string;
  spread?: number;
};

const CASA_TO_REF_NAME: Record<string, string> = {
  OFICIAL: "official",
  BLUE: "blue",
  BOLSA: "mep",
  CCL: "ccl",
  MAYORISTA: "mayorista",
  CRIPTO: "crypto",
  TARJETA: "card",
};

const CASA_RANKING: Record<string, number> = {
  OFICIAL: 1,
  BLUE: 2,
  MAYORISTA: 3,
  BOLSA: 4,
  CCL: 5,
  CRIPTO: 6,
  TARJETA: 7,
};

export async function fetchDollarQuotesFromArgentStatsApi(): Promise<
  DollarPriceQuote[]
> {
  const res = await fetch("https://argenstats.com/api/v1/dollar?view=current", {
    headers: {
      "x-api-key": process.env.ARGENSTATS_API_KEY as string,
    },
  });
  if (!res.ok) throw new Error(`ArgentStatsAPI error: ${res.status}`);
  const data = (await res.json()) as { data: ArgentStatsApiItem[] };

  return Object.values(data?.data || {})?.map((item): DollarPriceQuote => {
    const refName =
      CASA_TO_REF_NAME[item.dollarType] ?? item.dollarType?.toLowerCase();
    const ranking = CASA_RANKING[item.dollarType] ?? 99;
    return {
      refName,
      purchasePrice: item.buyPrice,
      salePrice: item.sellPrice,
      ranking,
    };
  });
}
