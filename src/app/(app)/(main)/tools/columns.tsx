"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/src/components/ui/checkbox"
import { DataTableColumnHeader } from "@/src/components/tables/DataTableColumnHeader"
import { Database } from "@/src/types_db"
import Link from "next/link"

export type Tool = Database['public']['Tables']['tools']['Row'] & { reviews: Database['public']['Tables']['reviews']['Row'][] }

export const getRootDomain = (url: string | null) => {
  if (!url) return '';
  let domain = url.split('/')[2];
  if (!domain) {
    console.error('No domain found for url', url)
  }
  if (domain?.split('.').length > 2) {
    domain = domain.split('.').slice(1).join('.')
  }
  return domain;
}

let formatCurrency = new Intl.NumberFormat(undefined, {
	style: 'currency',
	currency: 'USD'
});


export const columns: ColumnDef<Tool>[] = [
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
    id: "logo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logo" />
    ),
    cell: ({ row }) => <div className="w-[50px]">
      <Link href={`/tools/${row.original.id}/`}>
        <img
          className="h-12 w-12 object-cover"
          src={`https://logo.clearbit.com/${getRootDomain(row.original.website)}`}
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
    cell: ({ row }) => <div className="w-[100px]">
      <Link href={`/tools/${row.original.id}/`}>
        {row.getValue("name")}
      </Link></div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "website",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Website" />
    ),
    cell: ({ row }) => <div className="w-[180px] truncate"><a href={row.getValue("website")} target="_blank">{row.getValue("website")}</a></div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => <div className="w-[280px]">{row.getValue("description")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "published_pricing",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published Pricing" />
    ),
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("published_pricing")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "api",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="API" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("api") === true ? "YES" : row.getValue("api") === false ? "NO" : "N/A "}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "reviews",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Organizations" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.original.reviews?.length}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "average_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Price (USD)" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{
      row.original.reviews?.length > 0 ? (
        formatCurrency.format(row.original.reviews.reduce((acc, review) => acc + (review.price || 0), 0) / row.original.reviews.length)
      ) : ''
    }</div>,
    enableSorting: false,
    enableHiding: false,
  },
]