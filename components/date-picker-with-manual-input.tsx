"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DatePickerWithManualInputProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePickerWithManualInput({
  date,
  setDate,
  placeholder = "YYYY-MM-DD",
  disabled = false,
}: DatePickerWithManualInputProps) {
  const [inputValue, setInputValue] = React.useState(date ? format(date, "yyyy-MM-dd") : "")

  React.useEffect(() => {
    setInputValue(date ? format(date, "yyyy-MM-dd") : "")
  }, [date])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    try {
      const parsedDate = new Date(value)
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate)
      } else {
        setDate(undefined)
      }
    } catch {
      setDate(undefined)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setInputValue(selectedDate ? format(selectedDate, "yyyy-MM-dd") : "")
  }

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
      <PopoverContent className="w-auto p-0">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="mb-2"
          disabled={disabled}
        />
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus disabled={disabled} />
      </PopoverContent>
    </Popover>
  )
}
