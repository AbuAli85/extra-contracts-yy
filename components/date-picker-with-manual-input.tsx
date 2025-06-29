"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useTranslations } from "next-intl"

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

export function DatePickerWithManualInput({ date, setDate, placeholder, disabled }: DatePickerWithManualInputProps) {
  const t = useTranslations("DatePicker")
  const [inputValue, setInputValue] = React.useState(date ? format(date, "PPP") : "")

  React.useEffect(() => {
    setInputValue(date ? format(date, "PPP") : "")
  }, [date])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    try {
      const parsedDate = new Date(e.target.value)
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate)
      } else {
        setDate(undefined) // Clear date if input is invalid
      }
    } catch {
      setDate(undefined) // Clear date on parsing error
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setInputValue(selectedDate ? format(selectedDate, "PPP") : "")
  }

  return (
    <Popover>
      <div className="flex w-full items-center space-x-2">
        <Input
          placeholder={placeholder || t("pickADate")}
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          className="flex-grow"
        />
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-auto p-2", !date && "text-muted-foreground")}
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
