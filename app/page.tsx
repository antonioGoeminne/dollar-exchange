import { getDollarPrices } from "@/features/currency/api/get-dollar-prices";
import {
  CurrencyTable,
  type Dollar,
} from "@/features/currency/components/currency-table";

export default async function Home() {
  const dollarPrices = await getDollarPrices();
  return (
    <main className="px-2 md:px-10 py-10">
      <div className="flex flex-col gap-10 w-full md:w-[50%] mx-auto">
        <p className="font-medium text-sm md:text-base">Domingo 1 de marzo</p>
        <CurrencyTable data={dollarPrices as unknown as Dollar[]} />
      </div>
    </main>
  );
}
