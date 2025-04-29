"use client";

import { Review } from "@/app/page";
import { approveReview } from "@/APIs";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";

export default function ReviewsTable({ reviews }: { reviews: Review[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const updateStatusHandler = async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    try {
      await approveReview(id, status);
      alert("Status updated, refresh page to verify changes.");
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const columns = useMemo<ColumnDef<Review>[]>(
    () => [
      {
        id: "product",
        accessorKey: "product",
        header: "Product",
        cell: ({ row }) => (
          <div className="break-words whitespace-normal">
            {row.original.product}
          </div>
        ),
      },
      {
        id: "date",
        accessorKey: "date",
        header: "Date Created",
        cell: ({ row }) => (
          <div className="break-words whitespace-normal">
            {new Date(row.original.date).toLocaleDateString()}
          </div>
        ),
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Author",
        cell: ({ row }) => (
          <div className="break-words whitespace-normal">
            {row.original.email}
          </div>
        ),
      },
      {
        id: "content",
        accessorKey: "content",
        header: "Review Content",
        cell: ({ row }) => (
          <div className="break-words whitespace-normal">
            <div className="font-bold">{row.original.title}</div>
            <div className="text-yellow-400">{row.original.rating} stars</div>
            <div>{row.original.body}</div>
            {row.original.image && (
              <img
                src={row.original.image}
                alt={row.original.title}
                className="w-20 h-20 object-cover mt-2"
              />
            )}
          </div>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const isLoading = loadingStates[row.original.id] || false;
          
          return (
            <div className="w-[280px]">
              {row.original.status === "PENDING" ? (
                <div className="flex gap-2">
                  <button
                    className={`bg-green-500 text-white px-4 py-2 rounded-md w-[130px] ${
                      isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-green-600"
                    }`}
                    onClick={() => updateStatusHandler(row.original.id, "APPROVED")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Approving..." : "Approve"}
                  </button>
                  <button
                    className={`bg-red-500 text-white px-4 py-2 rounded-md w-[130px] ${
                      isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-red-600"
                    }`}
                    onClick={() => updateStatusHandler(row.original.id, "REJECTED")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center h-[40px]">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      row.original.status === "APPROVED"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {row.original.status}
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [loadingStates]
  );

  const table = useReactTable({
    data: reviews,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      status: (row, id, value) => {
        return value === "" || row.original.status === value;
      },
    },
  });

  return (
    <div className="flex flex-col w-screen max-w-7xl">
      <Link href="/" className="text-blue-400">
        Back to Home
      </Link>
      <h1 className="text-4xl font-bold">Approve / Reject Reviews</h1>
      
      <div className="mt-12">
        <div className="mb-4">
          <select
            value={(columnFilters.find(f => f.id === 'status')?.value as string) ?? ""}
            onChange={(event) =>
              setColumnFilters(prev => {
                const newFilters = prev.filter(f => f.id !== 'status');
                if (event.target.value !== "") {
                  newFilters.push({
                    id: 'status',
                    value: event.target.value
                  });
                }
                return newFilters;
              })
            }
            className="p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-0"
          >
            <option value="" className="bg-gray-800">
              All Statuses
            </option>
            <option value="PENDING" className="bg-gray-800">
              Pending
            </option>
            <option value="APPROVED" className="bg-gray-800">
              Approved
            </option>
            <option value="REJECTED" className="bg-gray-800">
              Rejected
            </option>
          </select>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-800">
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <th key={header.id} className="p-4 text-left font-bold">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-800">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 