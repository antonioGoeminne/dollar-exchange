import { getDollarPrices } from "@/features/currency/api/get-dollar-prices";
import {
  CurrencyTable,
  type Dollar,
} from "@/features/currency/components/currency-table";
import { LastUpdatedBadge } from "@/features/layout/last-updated-badge";
import { Today } from "@/features/layout/today";

export default async function Home() {
  const dollarPrices = await getDollarPrices();
  return (
    <main className="px-2 lg:px-10 py-5">
      <div className="flex flex-col gap-4 lg:gap-10 w-full lg:w-[50%] mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg lg:text-xl font-bold">
            Precio del Dólar hoy en Argentina | Blue, Oficial, MEP y Cripto
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <Today />
            <LastUpdatedBadge />
          </div>
        </div>
        <CurrencyTable data={dollarPrices as unknown as Dollar[]} />
      </div>
    </main>
  );
}
