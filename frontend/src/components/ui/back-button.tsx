"use client"

// No external icon dep; use SVG

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BackButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  const router = useRouter()
  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className={cn(
        "absolute left-4 top-4 z-50 h-9 w-9 rounded-full p-0 sm:left-6 sm:top-6",
        className
      )}
      {...props}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>

      <span className="sr-only">Back</span>
    </Button>
  )
}

