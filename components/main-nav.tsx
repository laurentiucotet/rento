"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Ticket } from "lucide-react"

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <Home className="w-4 h-4 mr-2" />
        Properties
      </Link>
      <Link
        href="/tickets"
        className={cn(
          "flex items-center text-sm font-medium transition-colors hover:text-primary",
          pathname === "/tickets" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <Ticket className="w-4 h-4 mr-2" />
        Tickets
      </Link>
    </nav>
  )
}

