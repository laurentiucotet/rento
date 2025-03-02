"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PropertyDashboard } from "@/components/property-dashboard"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { isAuthenticated } from "@/lib/auth"
import { RentoLogo } from "@/components/rento-logo"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <RentoLogo />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
        </div>
        <PropertyDashboard />
      </main>
    </div>
  )
}

