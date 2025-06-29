"use client"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"

interface DatePickerWithPresetsFieldProps {
  value?: Date
  onChange: (date?: Date) => void
  disabled?: boolean
  placeholder?: string
}

export function DatePickerWithPresetsField({
  value,
  onChange,
  disabled,
  placeholder,
}: DatePickerWithPresetsFieldProps) {
  const t = useTranslations("DatePickerWithPresetsField")

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
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(selectValue) => {
            const days = Number.parseInt(selectValue)
            if (!isNaN(days)) {
              onChange(addDays(new Date(), days))
            } else if (selectValue === "today") {
              onChange(new Date())
            } else {
              onChange(undefined)
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("select")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">{t("today")}</SelectItem>
            <SelectItem value="7">{t("in7Days")}</SelectItem>
            <SelectItem value="14">{t("in14Days")}</SelectItem>
            <SelectItem value="30">{t("in30Days")}</SelectItem>
            <SelectItem value="90">{t("in90Days")}</SelectItem>
            <SelectItem value="365">{t("in1Year")}</SelectItem>
            <SelectItem value="none">{t("clear")}</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={value} onSelect={onChange} initialFocus disabled={disabled} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
