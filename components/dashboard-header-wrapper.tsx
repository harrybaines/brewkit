"use client"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import React from "react"

export function DashboardHeaderWrapper({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()
  const isDashboard = pathname === "/"
  const isSettings = pathname === "/settings"
  const useFixedWidth = isDashboard || isSettings

  return (
    <div
      className={cn(
        "w-full",
        useFixedWidth ? "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" : "px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}