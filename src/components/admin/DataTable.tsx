"use client";

import { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
}

export default function DataTable<T>({ data, columns, keyField }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto bg-surface-card border border-border-default rounded-cards shadow-card">
      <table className="w-full text-left font-ui">
        <thead>
          <tr className="border-b border-border-default bg-surface-page text-muted-text text-body-sm uppercase tracking-wider">
            {columns.map((col, i) => (
              <th key={i} className={`px-6 py-4 font-bold ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-muted-text">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={String(row[keyField])} className="hover:bg-surface-page/50 transition-colors">
                {columns.map((col, i) => (
                  <td key={i} className={`px-6 py-4 text-body-sm text-body-text ${col.className || ""}`}>
                    {typeof col.accessor === "function" ? col.accessor(row) : (row[col.accessor] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
