import type { DollarPriceQuote } from "../types";

type DolarApiItem = {
  casa: string;
  compra: number;
  venta: number;
  nombre: string;
  moneda: string;
  fechaActualizacion: string;
  variacion?: number;
};

const CASA_TO_REF_NAME: Record<string, string> = {
  oficial: "official",
  blue: "blue",
  bolsa: "mep",
  contadoconliqui: "ccl",
  mayorista: "mayorista",
  cripto: "crypto",
  tarjeta: "card",
};

const CASA_RANKING: Record<string, number> = {
  oficial: 1,
  blue: 2,
  mayorista: 3,
  bolsa: 4,
  contadoconliqui: 5,
  cripto: 6,
  tarjeta: 7,
};

export async function fetchDollarQuotesFromDolarApi(): Promise<
  DollarPriceQuote[]
> {
  const res = await fetch("https://dolarapi.com/v1/dolares");
  if (!res.ok) throw new Error(`DolarAPI error: ${res.status}`);
  const data = (await res.json()) as DolarApiItem[];

  return data.map((item): DollarPriceQuote => {
    const refName = CASA_TO_REF_NAME[item.casa] ?? item.casa.toLowerCase();
    const ranking = CASA_RANKING[item.casa] ?? 99;
    return {
      refName,
      purchasePrice: item.compra,
      salePrice: item.venta,
      ranking,
    };
  });
}
