"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterLabel?: string
  filterColumnKey?: string
  allowFiltering?: boolean
}

export function DataTableToolbar<TData>({
  table,
  filterColumnKey = "name",
  filterLabel = "tasks",
  allowFiltering = false
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    allowFiltering && <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filter ${filterLabel}...`}
          value={(table.getColumn(filterColumnKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterColumnKey)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}