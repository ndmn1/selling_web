"use client";

import React from "react";

export type Action<T> = {
  icon: React.ReactNode;
  label: string;
  onClick: (item: T) => void;
  className?: string;
};

export type Column<T> = {
  header: string;
  accessorKey: keyof T;
  cell?: (value: T[keyof T], item: T) => React.ReactNode;
};

interface TableCustomProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
}

function TableCustom<T extends { id: string }>({
  data,
  columns,
  actions = [],
}: TableCustomProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            <tr
              key={item.id}
              className={`hover:bg-gray-50 ${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={`${item.id}-${colIndex}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.cell
                    ? column.cell(item[column.accessorKey], item)
                    : (item[column.accessorKey] as React.ReactNode)}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      onClick={() => action.onClick(item)}
                      className={`p-1 rounded ${
                        action.className ||
                        "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                      title={action.label}
                    >
                      {action.icon}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableCustom;
