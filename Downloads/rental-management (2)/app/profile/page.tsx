"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { getCurrentUser, updateUser } from "@/lib/auth"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(getCurrentUser())
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      const updatedUser = { ...user, name, email }
      updateUser(updatedUser)
      setUser(updatedUser)
      alert("Profile updated successfully")
    }
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit">Update Profile</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

