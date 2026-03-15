import { getDollarPrices } from "@/features/currency/api/get-dollar-prices";
import {
  CurrencyTable,
  type Dollar,
} from "@/features/currency/components/currency-table";
import { Today } from "@/features/layout/today";

export default async function Home() {
  const dollarPrices = await getDollarPrices();
  return (
    <main className="px-2 lg:px-10 py-10">
      <div className="flex flex-col gap-4  lg:gap-10 w-full lg:w-[50%] mx-auto">
        <Today />
        <CurrencyTable data={dollarPrices as unknown as Dollar[]} />
      </div>
    </main>
  );
}
