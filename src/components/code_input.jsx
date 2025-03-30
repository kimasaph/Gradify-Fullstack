import { Input } from "@/components/ui/input"
import React from "react"
import { cn } from "@/lib/utils"
export function InputOTPPattern() {
  return (
    <Input
    
      className=
        "w-64 h-12 text-center text-lg border-2 border-emerald-600 bg-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
      maxLength={6}
      pattern="[0-9]{6}"
    />
  )
}

