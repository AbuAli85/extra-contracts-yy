"use client"
// CORE INPUT COMPONENT: For use within FormField
import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useDebouncedCallback } from "use-debounce"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ComboboxFieldProps {
  field: {
    name: string
    value: string | null | undefined
    onChange: (value: string | null) => void
    ref: React.Ref<any>
  }
  options: { value: string; label: string }[]
  placeholder?: string
  searchPlaceholder?: string
  emptyStateMessage?: string
  disabled?: boolean
  isLoading?: boolean
}

export default function ComboboxField({
  field,
  options,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyStateMessage = "No option found.",
  disabled,
  isLoading = false,
}: ComboboxFieldProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value)
  }, 300)

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [options, searchQuery])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !field.value && "text-muted-foreground",
            disabled && "bg-muted/50 cursor-not-allowed opacity-50",
          )}
          disabled={disabled}
          ref={field.ref}
        >
          {field.value ? options.find((option) => option.value === field.value)?.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={inputValue}
              onValueChange={(val) => {
                setInputValue(val)
                debouncedSetSearch(val)
              }}
            />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyStateMessage}</CommandEmpty>
                  <CommandGroup>
                    {filteredOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => {
                          field.onChange(option.value === field.value ? null : option.value)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === option.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  )
}
