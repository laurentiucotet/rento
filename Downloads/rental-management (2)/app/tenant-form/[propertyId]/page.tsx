"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TicketForm } from "@/components/ticket-form"
import { getPropertyById } from "@/lib/property-service"
import { RentoLogo } from "@/components/rento-logo"
import type { Ticket } from "@/lib/types"

export default function TenantForm() {
  const params = useParams()
  const propertyId = params.propertyId as string
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [property, setProperty] = useState(getPropertyById(propertyId))

  useEffect(() => {
    if (!property) {
      setError("Property not found")
    }
  }, [property])

  const handleSubmit = async (ticketData: Partial<Ticket>) => {
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...ticketData,
          propertyId,
          isTenantSubmitted: true,
          status: "open",
          createdAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const savedTicket = await response.json()
        console.log("Ticket saved:", savedTicket)
        setSubmitted(true)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit ticket")
      }
    } catch (error) {
      console.error("Error submitting ticket:", error)
      setError("Failed to submit ticket. Please try again.")
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <RentoLogo />
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <RentoLogo />
        <Card className="w-full max-w-md mt-8">
          <CardHeader>
            <CardTitle>Thank you for submitting your ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">We have received your request and will process it shortly.</p>
            <Button onClick={() => setSubmitted(false)} className="w-full">
              Submit Another Ticket
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <RentoLogo />
      <Card className="w-full max-w-md mt-8">
        <CardHeader>
          <CardTitle>Submit a Ticket for {property?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketForm propertyId={propertyId} onSubmit={handleSubmit} isLandlord={false} />
        </CardContent>
      </Card>
    </div>
  )
}

