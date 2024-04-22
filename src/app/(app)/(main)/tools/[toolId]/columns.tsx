"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/src/components/ui/checkbox"
import { DataTableColumnHeader } from "@/src/components/tables/DataTableColumnHeader"
import { Database } from "@/src/types_db"

type Review = Database['public']['Tables']['reviews']['Row']

export const columns: ColumnDef<Review>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => <div className="w-[180px]">
      {row.getValue("price")}
    </div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "terms",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Terms" />
    ),
    cell: ({ row }) => <div className="w-[180px]">
      {row.getValue("terms")}
    </div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => <div className="w-[180px]">
      {row.getValue("start_date")}
    </div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => <div className="w-[180px]">
      {row.getValue("duration")}
    </div>,
    enableSorting: false,
    enableHiding: false,
  },
]