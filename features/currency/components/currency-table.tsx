"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Table } from "@/features/ui/table";

export type Dollar = {
  id: number;
  createdAt: string;
  exchangeRate: string | null;
  date: string | null;
  name: string | null;
  purchasePrice: string | null;
  salePrice: string | null;
  refName: string | null;
  change1h?: number;
};

function PercentBadge({ value = 0 }: { value: number }) {
  const isNegative = value < 0;
  const color = isNegative
    ? "text-red-500 bg-red-50"
    : "text-emerald-500 bg-emerald-50";

  return (
    <span
      className={`inline-flex min-w-[48px] md:min-w-[64px] items-center justify-end rounded-full px-1 md:px-2 py-1  text-xs font-medium ${color}`}
    >
      {isNegative ? "" : "+"}
      {Number(value).toFixed(2)}%
    </span>
  );
}

const coinImages: Record<string, string> = {
  blue: "/blue.webp",
  official: "/official.webp",
  crypto: "/crypto.webp",
  mep: "/mep.webp",
  card: "/card.webp",
  ccl: "/ccl.webp",
};

function getCoinImage(coin: string) {
  return coinImages[coin] ?? "/logo-dollar.webp";
}

const columns: ColumnDef<Dollar>[] = [
  {
    id: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const coin = row.original;

      return (
        <div className="flex items-center gap-3">
          {coin.refName && (
            <div className="aspect-square h-8 relative">
              <Image
                sizes="100px"
                src={getCoinImage(coin.refName)}
                alt={coin.name ?? ""}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className=" text-xs md:text-sm text-slate-800">{coin.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "purchasePrice",
    header: "Compra",
    cell: (info) => (
      <>
        {info.getValue<string>() && (
          <span className=" text-xs md:text-sm text-slate-900">
            ${info.getValue<string>()}
          </span>
        )}
      </>
    ),
  },
  {
    accessorKey: "salePrice",
    header: "Venta",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: (info) => (
      <span className="text-xs md:text-sm text-slate-900">
        ${info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "change1h",
    header: "↑ ↓",
    meta: { align: "right" as const },
    cell: (info) => <PercentBadge value={info.getValue<number>()} />,
  },
];

export function CurrencyTable({ data }: { data: Dollar[] }) {
  return <Table<Dollar> data={data} columns={columns} />;
}
