"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/src/components/ui/checkbox"
import { DataTableColumnHeader } from "@/src/components/tables/DataTableColumnHeader"
import { Database } from "@/src/types_db"
import Link from "next/link"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

type Org = Database['public']['Tables']['organizations']['Row']

export const rowClick = (row: Org, router: AppRouterInstance) => {
  router.push(`/organizations/${row.id}`)
}

export const columns: ColumnDef<Org>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "logo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logo" />
    ),
    cell: ({ row }) => <div className="w-[100px]">
      <Link href={`/organizations/${row.original.id}/`}>
        <img
          className="h-12 w-12 object-cover"
          src={`https://logo.clearbit.com/${row.original.domain}`}
        />
      </Link></div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[180px]">
      <Link href={`/organizations/${row.original.id}/`}>{row.getValue("name")}</Link>
    </div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "domain",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Domain" />
    ),
    cell: ({ row }) => <div className="w-[180px]"><Link href={`https://${row.getValue("domain")}`}>{row.getValue("domain")}</Link></div>,
    enableSorting: false,
    enableHiding: false,
  },
]