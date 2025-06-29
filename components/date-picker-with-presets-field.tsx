"use client"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useTranslations } from "next-intl"

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

export function DatePickerWithPresetsField({ date, setDate, placeholder, disabled }: DatePickerWithPresetsFieldProps) {
  const t = useTranslations("DatePicker")

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder || t("pickADate")}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) => {
            const today = new Date()
            if (value === "today") {
              setDate(today)
            } else if (value === "tomorrow") {
              setDate(addDays(today, 1))
            } else if (value === "nextWeek") {
              setDate(addDays(today, 7))
            } else if (value === "nextMonth") {
              setDate(addDays(today, 30))
            } else {
              setDate(undefined)
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("select")} />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="today">{t("today")}</SelectItem>
            <SelectItem value="tomorrow">{t("tomorrow")}</SelectItem>
            <SelectItem value="nextWeek">{t("nextWeek")}</SelectItem>
            <SelectItem value="nextMonth">{t("nextMonth")}</SelectItem>
            <SelectItem value="none">{t("clear")}</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
