"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormControl } from "@/components/ui/form"

interface ComboboxFieldProps<T extends { id: string; name: string }> {
  options: T[]
  value: string | undefined
  onValueChange: (value: string) => void
  placeholder: string
  noResultsText: string
  searchPlaceholder: string
  disabled?: boolean
}

export function ComboboxField<T extends { id: string; name: string }>({
  options,
  value,
  onValueChange,
  placeholder,
  noResultsText,
  searchPlaceholder,
  disabled,
}: ComboboxFieldProps<T>) {
  const [open, setOpen] = React.useState(false)
  const t = useTranslations("ComboboxField")

  const selectedOption = options.find((option) => option.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
            disabled={disabled}
          >
            {selectedOption ? selectedOption.name : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{noResultsText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.name}
                  key={option.id}
                  onSelect={() => {
                    onValueChange(option.id === value ? "" : option.id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", option.id === value ? "opacity-100" : "opacity-0")} />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
