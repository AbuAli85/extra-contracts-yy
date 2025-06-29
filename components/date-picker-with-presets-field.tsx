"use client"
import { format, startOfToday, addYears } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DatePickerWithPresetsFieldProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export const DatePickerWithPresetsField = ({
  date,
  setDate,
  placeholder = "Pick a date",
  disabled = false,
}: DatePickerWithPresetsFieldProps) => {
  const defaultPresets = [
    { label: "Today", date: startOfToday() },
    { label: "+1Y", date: addYears(startOfToday(), 1) },
    { label: "+2Y", date: addYears(startOfToday(), 2) },
    { label: "+3Y", date: addYears(startOfToday(), 3) },
    { label: "+4Y", date: addYears(startOfToday(), 4) },
    { label: "+5Y", date: addYears(startOfToday(), 5) },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) => {
            const selectedPreset = defaultPresets.find((p) => p.label === value)
            if (selectedPreset) {
              setDate(selectedPreset.date)
            } else if (value === "none") {
              setDate(undefined)
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select preset" />
          </SelectTrigger>
          <SelectContent position="popper">
            {defaultPresets.map((preset) => (
              <SelectItem key={preset.label} value={preset.label}>
                {preset.label}
              </SelectItem>
            ))}
            <SelectItem value="none">No date</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus disabled={disabled} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
