"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextValue = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children, ...props }: React.ComponentPropsWithoutRef<typeof Sidebar>) {
  const [isOpen, setIsOpen] = React.useState(false)

  return <SidebarContext.Provider value={{ isOpen, setIsOpen }}>{children}</SidebarContext.Provider>
}

const sidebarVariants = cva("flex flex-col border-r bg-background transition-all duration-300 ease-in-out", {
  variants: {
    variant: {
      default: "w-64",
      compact: "w-20",
    },
    isOpen: {
      true: "w-64",
      false: "w-20",
    },
  },
  defaultVariants: {
    variant: "default",
    isOpen: false,
  },
})

interface SidebarProps extends React.ComponentPropsWithoutRef<"aside">, VariantProps<typeof sidebarVariants> {}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, variant, isOpen: isOpenProp, ...props }, ref) => {
    const context = React.useContext(SidebarContext)
    const isOpen = context ? context.isOpen : isOpenProp

    return <aside ref={ref} className={cn(sidebarVariants({ variant, isOpen, className }))} {...props} />
  },
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between p-4", className)} {...props} />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <ScrollArea className="flex-1">
      <div ref={ref} className={cn("p-4", className)} {...props} />
    </ScrollArea>
  ),
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4 border-t", className)} {...props} />,
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("grid gap-2 pb-4", className)} {...props} />,
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(SidebarContext)
    const isOpen = context ? context.isOpen : true // Default to open if no provider

    return (
      <div
        ref={ref}
        className={cn("px-3 text-sm font-semibold text-muted-foreground", !isOpen && "text-center", className)}
        {...props}
      />
    )
  },
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("grid gap-1", className)} {...props} />,
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("grid gap-1", className)} {...props} />,
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
  {
    variants: {
      isActive: {
        true: "bg-accent text-accent-foreground",
        false: "text-muted-foreground",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
)

interface SidebarMenuButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const context = React.useContext(SidebarContext)
    const isOpen = context ? context.isOpen : true // Default to open if no provider

    return (
      <Comp
        ref={ref}
        className={cn(sidebarMenuButtonVariants({ isActive, className }), !isOpen && "justify-center")}
        {...props}
      />
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(SidebarContext)
    if (!context) {
      throw new Error("SidebarTrigger must be used within a SidebarProvider")
    }
    const { isOpen, setIsOpen } = context

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9", className)}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    )
  },
)
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(SidebarContext)
    const isOpen = context ? context.isOpen : true // Default to open if no provider

    return (
      <div
        ref={ref}
        className={cn("flex-1 transition-all duration-300 ease-in-out", isOpen ? "ml-64" : "ml-20", className)}
        {...props}
      />
    )
  },
)
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<typeof Input>>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(SidebarContext)
    const isOpen = context ? context.isOpen : true // Default to open if no provider

    return (
      <Input
        ref={ref}
        className={cn("transition-all duration-300 ease-in-out", !isOpen && "w-0 opacity-0", className)}
        {...props}
      />
    )
  },
)
SidebarInput.displayName = "SidebarInput"

const SidebarRail = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(SidebarContext)
    const isOpen = context ? context.isOpen : true // Default to open if no provider

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center p-4 border-t", isOpen && "hidden", className)}
        {...props}
      >
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
        <Separator className="my-4" />
        {/* Add more rail items here if needed */}
      </div>
    )
  },
)
SidebarRail.displayName = "SidebarRail"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarInput,
  SidebarRail,
}
