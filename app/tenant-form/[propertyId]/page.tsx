"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addTicket } from "@/lib/ticket-service"
import { getPropertyById } from "@/lib/property-service"
import { RentoLogo } from "@/components/rento-logo"
import { Camera } from "lucide-react"

export default function TenantForm() {
  const params = useParams()
  const propertyId = params.propertyId as string
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)

  const property = getPropertyById(propertyId)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description) {
      alert("Please fill in all required fields")
      return
    }

    const newTicket = {
      id: crypto.randomUUID(),
      propertyId,
      title,
      description,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      costEstimate: 0,
      urgency: "medium",
      isTenantSubmitted: true,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Set deadline to 7 days from now
    }

    console.log("Adding new ticket:", newTicket) // Add this line for debugging
    addTicket(newTicket)
    setSubmitted(true)
  }

  if (!property) {
    return <div>Property not found</div>
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <RentoLogo />
        <h1 className="text-2xl font-bold mt-8 mb-4">Thank you for submitting your ticket</h1>
        <p className="text-center mb-4">We have received your request and will process it shortly.</p>
        <Button onClick={() => setSubmitted(false)}>Submit Another Ticket</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <RentoLogo />
      <h1 className="text-2xl font-bold mt-8 mb-4">Submit a Ticket for {property.name}</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="images">Images (optional)</Label>
          <div className="mt-1 flex items-center">
            <label htmlFor="images" className="cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                <Camera className="w-6 h-6 text-gray-600" />
              </div>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <span className="ml-4 text-sm text-gray-600">
              {images.length === 0
                ? "No images selected"
                : `${images.length} image${images.length > 1 ? "s" : ""} selected`}
            </span>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Submit Ticket
        </Button>
      </form>
    </div>
  )
}

