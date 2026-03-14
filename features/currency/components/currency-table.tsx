"use client";

import type { ColumnDef } from "@tanstack/react-table";
import useSWR from "swr";
import { Table } from "@/features/ui/table";
import { formatPrice } from "@/lib/prices";

export type Dollar = {
  id: number;
  createdAt: string;
  exchangeRate: string | null;
  purchaseExchangeRate: string | null;
  salesExchangeRate: string | null;
  date: string | null;
  name: string | null;
  purchasePrice: string | null;
  salePrice: string | null;
  refName: string | null;
  change1h?: number;
};

function PercentBadge({ value = 0 }: { value: number }) {
  const isZero = value === 0;
  const isNegative = value < 0;
  const color = isZero
    ? "text-slate-500"
    : isNegative
      ? "text-red-500"
      : "text-emerald-500";
  const arrow = isZero ? null : isNegative ? "▼" : "▲";
  const display = `${Number(value).toFixed(2)}%`;

  return (
    <span
      className={`inline-flex items-center justify-end gap-0.5 text-xs font-semibold tabular-nums ${color}`}
    >
      {arrow != null && <span aria-hidden>{arrow}</span>}
      {display}
    </span>
  );
}

const refColors: Record<string, string> = {
  blue: "bg-blue-300",
  official: "bg-emerald-300",
  crypto: "bg-violet-300",
  mep: "bg-amber-300",
  card: "bg-rose-300",
  ccl: "bg-slate-300",
};

function getRefColor(coin: string) {
  return refColors[coin] ?? "bg-slate-200";
}

const columns: ColumnDef<Dollar>[] = [
  {
    id: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const coin = row.original;

      return (
        <div className="flex items-center gap-3">
          <div
            className={`absolute left-0 top-0 h-full w-0.5 md:w-1 ${getRefColor(coin.refName ?? "")} py-1`}
          ></div>
          <div className=" text-xs md:text-sm text-slate-800">{coin.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "purchasePrice",
    header: "Compra",
    cell: (info) => {
      const row = info.row.original;
      const price = info.getValue<string>();
      const value =
        row.purchaseExchangeRate != null && row.purchaseExchangeRate !== ""
          ? Number(row.purchaseExchangeRate)
          : 0;
      return (
        <div className="flex flex-col items-end gap-0.5">
          {price && (
            <span className="text-xs md:text-sm text-slate-900">
              ${formatPrice(price)}
            </span>
          )}
          <PercentBadge value={value} />
        </div>
      );
    },
  },
  {
    accessorKey: "salePrice",
    header: "Venta",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: (info) => {
      const row = info.row.original;
      const price = info.getValue<string>();
      const value =
        row.salesExchangeRate != null && row.salesExchangeRate !== ""
          ? Number(row.salesExchangeRate)
          : 0;
      return (
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs md:text-sm text-slate-900">
            ${formatPrice(price)}
          </span>
          <PercentBadge value={value} />
        </div>
      );
    },
  },
  {
    accessorKey: "exchangeRate",
    header: "%",
    meta: { align: "right" as const },
    cell: (info) => {
      const raw = info.getValue<string | null>();
      const value = raw != null && raw !== "" ? Number(raw) : 0;
      return <PercentBadge value={value} />;
    },
  },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function CurrencyTable({ data: defaultData }: { data: Dollar[] }) {
  const { data } = useSWR("/api/dollar", fetcher, {
    fallbackData: defaultData,
  });

  return <Table<Dollar> data={data as unknown as Dollar[]} columns={columns} />;
}
