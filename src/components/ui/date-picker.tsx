"use client"

import * as React from "react"
import { format } from "date-fns"

import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover"
import { Calendar as CalendarIcon } from "@phosphor-icons/react/dist/ssr"

type DatePickerProps = { 
  value: Date | undefined,
  onSelect: (date: Date | undefined) => void 
  id?: string
  className?: string
}

export function DatePicker({value, onSelect, id, className}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            className,
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          id={id}
          mode="single"
          selected={value}
          onSelect={(date, selectedDay, activeModifiers, e) => {
            onSelect(date)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
