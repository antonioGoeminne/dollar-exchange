import type { DollarPriceQuote } from "../types";

type MonedaApiItem = {
  moneda: string;
  origen: string;
  compra: number;
  venta: number;
  actualizado: string;
};

const API_ORIGEN_TO_REF_NAME: Record<string, string> = {
  BLUE: "blue",
  BNA: "official",
  BOLSA: "mep",
  CCL: "ccl",
  CRIPTO: "crypto",
  TARJETA: "card",
  MAYORISTA: "mayorista",
};

const ORIGEN_RANKING: Record<string, number> = {
  BLUE: 1,
  BNA: 2,
  MAYORISTA: 3,
  BOLSA: 4,
  CCL: 5,
  CRIPTO: 6,
  TARJETA: 7,
};

function refNameFromApiOrigen(origen: string): string {
  return API_ORIGEN_TO_REF_NAME[origen] ?? origen.toLowerCase();
}

export async function fetchDollarQuotesFromMonedApi(): Promise<
  DollarPriceQuote[]
> {
  const res = await fetch("https://monedapi.ar/api/usd");
  if (!res.ok) throw new Error(`MonedAPI error: ${res.status}`);
  const data = (await res.json()) as MonedaApiItem[];

  return data.map((item): DollarPriceQuote => {
    const refName = refNameFromApiOrigen(item.origen);
    const ranking = ORIGEN_RANKING[item.origen] ?? 99;
    return {
      refName,
      purchasePrice: item.compra,
      salePrice: item.venta,
      ranking,
    };
  });
}
