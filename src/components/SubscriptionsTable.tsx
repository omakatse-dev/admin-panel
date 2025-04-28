"use client";

import { deactivateSubscription } from "@/APIs";
import { SubscriptionType } from "@/app/subscriptions/page";
import { useState, useMemo } from "react";
import NewBoxModal from "./NewBoxModal";
import PetDetailsModal from "./PetDetailsModal";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

export default function SubscriptionsTable({
  uniqueResults,
}: {
  uniqueResults: SubscriptionType[];
}) {
  const [showNewBoxModal, setShowNewBoxModal] = useState(false);
  const [showPetDetailsModal, setShowPetDetailsModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPetDetails, setSelectedPetDetails] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleSelectContract = (index: number) => {
    setSelectedIndex(index);
    setShowNewBoxModal(true);
  };

  const handleShowPetDetails = (petDetails: string) => {
    setSelectedPetDetails(petDetails);
    setShowPetDetailsModal(true);
  };

  const hasAllergies = (petDetails: string) => {
    try {
      const parsed = JSON.parse(petDetails);
      if (Array.isArray(parsed)) {
        return parsed.some((pet) => pet.allergies?.allergies?.length > 0);
      }
      return false;
    } catch {
      return false;
    }
  };

  const columns = useMemo<ColumnDef<SubscriptionType>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="break-words whitespace-normal">
            {row.original.name}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="break-words whitespace-normal">
            {row.original.email}
          </div>
        ),
      },
      {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => (
          <div className="break-words whitespace-normal">
            {row.original.address}
          </div>
        ),
      },
      {
        accessorKey: "boxProgress",
        header: "Curr Box",
        cell: ({ row }) => (
          <div className="break-words whitespace-normal">
            {row.original.duplicateCount} / {row.original.planDuration}
          </div>
        ),
      },
      {
        accessorKey: "size",
        header: "Box Size",
        cell: ({ row }) => (
          <div className="break-words whitespace-normal">
            {row.original.size}
          </div>
        ),
      },
      {
        accessorKey: "pets",
        header: "Pet Details",
        cell: ({ row }) => {
          const hasPetAllergies = hasAllergies(row.original.pets);
          return (
            <div className="break-words whitespace-normal text-blue-400 hover:text-blue-300 flex items-center gap-2">
              Click to view details
              {hasPetAllergies && (
                <span
                  className="w-2 h-2 bg-red-500 rounded-full"
                  title="Has allergies"
                ></span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "items",
        header: "Items",
        cell: ({ row }) => {
          const items = JSON.parse(row.original.items);
          return (
            <div className="break-words whitespace-normal">
              {items.map((item: { variantId: string; quantity: string }) => (
                <div key={item.variantId} className="text-sm">
                  {item.variantId} x {item.quantity}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="break-words whitespace-normal">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                row.original.status === "ACTIVE"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {row.original.status}
            </span>
          </div>
        ),
        filterFn: (row, id, value) => {
          return value === "" || row.original.status === value;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              disabled={row.original.status === "INACTIVE"}
              className="border border-blue-500 text-blue-500 rounded-md px-3 py-1 hover:bg-blue-500/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectContract(row.index);
              }}
            >
              New Box
            </button>
            <button
              disabled={row.original.status === "INACTIVE"}
              className="border border-red-500 text-red-500 rounded-md px-3 py-1 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation();
                deactivateSubscription(row.original.contractId);
              }}
            >
              Deactivate
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: uniqueResults,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 mt-12 w-full">
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <div className="mb-4 flex gap-4">
            <input
              placeholder="Filter by email..."
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-0 placeholder-gray-400"
            />
            <select
              value={
                (table.getColumn("status")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("status")?.setFilterValue(event.target.value)
              }
              className="p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-0"
            >
              <option value="" className="bg-gray-800">
                All Statuses
              </option>
              <option value="ACTIVE" className="bg-gray-800">
                Active
              </option>
              <option value="INACTIVE" className="bg-gray-800">
                Inactive
              </option>
            </select>
          </div>
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-gray-800">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-4 text-left font-bold"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-800 cursor-pointer"
                  onClick={() => handleShowPetDetails(row.original.pets)}
                >
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
      {showNewBoxModal && (
        <NewBoxModal
          setShowNewBoxModal={setShowNewBoxModal}
          contractId={uniqueResults[selectedIndex].contractId}
          number={(uniqueResults[selectedIndex].duplicateCount + 1).toString()}
          size={uniqueResults[selectedIndex].size}
        />
      )}
      {showPetDetailsModal && (
        <PetDetailsModal
          setShowModal={setShowPetDetailsModal}
          petDetails={selectedPetDetails}
        />
      )}
    </div>
  );
}
