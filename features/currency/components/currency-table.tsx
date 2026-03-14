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
  description: string | null;
};

function PercentBadge({ value = 0 }: { value: number }) {
  const isZero = value === 0;
  const isNegative = value < 0;
  const color = isZero
    ? "text-slate-500"
    : isNegative
      ? "text-red-500"
      : "text-emerald-500";
  const arrow = isZero ? null : isNegative ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-3"
    >
      <title>Arrow down</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-3"
    >
      <title>Arrow up</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
      />
    </svg>
  );
  const display = `${Number(value).toFixed(2)}%`;

  return (
    <span
      className={`inline-flex items-center justify-end gap-0.5 text-xs font-light tabular-nums ${color}`}
    >
      {arrow != null && <span aria-hidden>{arrow}</span>}
      {display}
    </span>
  );
}

const columns: ColumnDef<Dollar>[] = [
  {
    id: "name",
    header: "COTIZACIÓN",
    cell: ({ row }) => {
      const coin = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className=" text-xs lg:text-sm  font-semibold text-slate-700">
            {coin.name}
          </span>
          <span className="text-[11px] lg:text-xs font-semibold text-slate-400">
            {coin.description}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "purchasePrice",
    header: "COMPRA",
    meta: { align: "right" as const },
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
            <span className=" text-xs lg:text-sm  text-slate-900">
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
    header: "VENTA",
    meta: { align: "right" as const, className: "w-[1%] whitespace-nowrap" },
    cell: (info) => {
      const row = info.row.original;
      const price = info.getValue<string>();
      const value =
        row.salesExchangeRate != null && row.salesExchangeRate !== ""
          ? Number(row.salesExchangeRate)
          : 0;
      return (
        <div className="flex flex-col items-end gap-0.5">
          <span className=" text-xs lg:text-sm  font-semibold text-slate-900">
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
