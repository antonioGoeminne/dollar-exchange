import { fetchDollarQuotesFromArgentStatsApi } from "./providers/argenstatsapi";
import { fetchDollarQuotesFromDolarApi } from "./providers/dolarapi";
import { fetchDollarQuotesFromMonedApi } from "./providers/monedapi";
import type { DollarPriceQuote } from "./types";

export type { DollarPriceQuote } from "./types";

const PROVIDERS = ["monedapi", "dolarapi", "argenstatsapi"] as const;
type Provider = (typeof PROVIDERS)[number];

function isProvider(value: string | undefined): value is Provider {
  return value !== undefined && PROVIDERS.includes(value as Provider);
}

export async function getDollarQuotes(): Promise<DollarPriceQuote[]> {
  const provider = process.env.PRICE_PROVIDER;
  if (isProvider(provider)) {
    if (provider === "monedapi") return fetchDollarQuotesFromMonedApi();
    if (provider === "dolarapi") return fetchDollarQuotesFromDolarApi();
    if (provider === "argenstatsapi")
      return fetchDollarQuotesFromArgentStatsApi();
  }
  return fetchDollarQuotesFromMonedApi();
}
