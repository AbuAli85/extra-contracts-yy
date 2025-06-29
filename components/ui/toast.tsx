"use client"

import * as React from "react"
import type { ToastAction } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { ToastProvider as ToastProviderPrimitive } from "@radix-ui/react-toast" // Renamed to avoid conflict
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastProviderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastProviderPrimitive.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return <ToastProviderPrimitive.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
})
Toast.displayName = ToastProviderPrimitive.Root.displayName

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastProviderPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastProviderPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastProviderPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastProviderPrimitive.Viewport.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastProviderPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastProviderPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastProviderPrimitive.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))
ToastTitle.displayName = ToastProviderPrimitive.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastProviderPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastProviderPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastProviderPrimitive.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
))
ToastDescription.displayName = ToastProviderPrimitive.Description.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastProviderPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastProviderPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastProviderPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastProviderPrimitive.Close>
))
ToastClose.displayName = ToastProviderPrimitive.Close.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ElementRef<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProviderPrimitive as ToastProvider, // Exporting as ToastProvider
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
}
