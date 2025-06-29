"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"

interface DatePickerWithManualInputProps {
  value?: Date
  onChange: (date?: Date) => void
  disabled?: boolean
  placeholder?: string
}

export function DatePickerWithManualInput({ value, onChange, disabled, placeholder }: DatePickerWithManualInputProps) {
  const t = useTranslations("DatePickerWithManualInput")
  const [inputValue, setInputValue] = React.useState(value ? format(value, "PPP") : "")

  React.useEffect(() => {
    setInputValue(value ? format(value, "PPP") : "")
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    try {
      const date = new Date(e.target.value)
      if (!isNaN(date.getTime())) {
        onChange(date)
      } else {
        onChange(undefined) // Clear date if input is invalid
      }
    } catch {
      onChange(undefined) // Clear date on parsing error
    }
  }

  const handleDateSelect = (date?: Date) => {
    onChange(date)
    setInputValue(date ? format(date, "PPP") : "")
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder || t("placeholder")}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={handleDateSelect} initialFocus disabled={disabled} />
        <div className="p-4">
          <Input
            placeholder={placeholder || t("placeholder")}
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
