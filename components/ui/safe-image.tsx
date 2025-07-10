"use client"
import Image from "next/image"
import { useState } from "react"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

interface SafeImageProps {
  src?: string | null
  alt: string
  width?: number
  height?: number
  className?: string
  fallback?: React.ReactNode
}

export function SafeImage({ src, alt, className, ...props }: SafeImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (!src || !src.includes("supabase.co")) {
    return (
      <div className={cn("flex items-center justify-center rounded-full bg-muted", className)}>
        {props.fallback || <User className="h-1/2 w-1/2 text-muted-foreground" />}
      </div>
    )
  }

  return (
    <div className={cn("relative h-10 w-10 rounded-full bg-muted", className)}>
      <Image
        src={src}
        alt={alt}
        className={cn(
          "rounded-full object-cover transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        fill
        onError={() => setImageError(true)}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
      />
      {imageError && (
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-muted">
          {props.fallback || <User className="h-1/2 w-1/2 text-muted-foreground" />}
        </span>
      )}
    </div>
  )
}
