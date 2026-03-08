"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type ColumnMeta = {
  align?: "left" | "right";
  className?: string;
};

function getAlignClass(meta?: ColumnMeta) {
  return meta?.align === "right" ? "text-right" : "text-left";
}

export function Table<T>({
  data,
  columns,
}: {
  data: T[];
  columns: ColumnDef<T>[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-md shadow-sm">
          <div className="overflow-hidden rounded-md border border-slate-200/80 bg-white/80 backdrop-blur">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-white border-b border-slate-200/70 text-xs font-semibold text-slate-500">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const meta = header.column.columnDef.meta as
                        | ColumnMeta
                        | undefined;
                      return (
                        <th
                          key={header.id}
                          className={`px-1 md:px-4 py-3 align-middle ${getAlignClass(meta)} ${meta?.className ?? ""}`}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-neutral-100/80">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white/80 transition-colors hover:bg-neutral-50/80 relative"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as
                        | ColumnMeta
                        | undefined;
                      return (
                        <td
                          key={cell.id}
                          className={`whitespace-nowrap px-2 md:px-4 py-2 ${getAlignClass(meta)} ${meta?.className ?? ""}`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
