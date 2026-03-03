import { getDollarPrices } from "@/features/currency/api/get-dollar-prices";

export default async function Home() {
  const dollarPrices = await getDollarPrices();

  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between ">
      <p>{dollarPrices.map((dollarPrice) => dollarPrice.name)}</p>
    </main>
  );
}
