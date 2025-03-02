"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { Ticket } from "@/lib/types"

interface TicketFormProps {
  propertyId: string
  onSubmit: (ticket: Partial<Ticket>) => void
  initialTicket?: Ticket
  isLandlord?: boolean
}

export function TicketForm({ propertyId, onSubmit, initialTicket, isLandlord = false }: TicketFormProps) {
  const [title, setTitle] = useState(initialTicket?.title || "")
  const [description, setDescription] = useState(initialTicket?.description || "")
  const [status, setStatus] = useState(initialTicket?.status || "open")
  const [assignedTo, setAssignedTo] = useState(initialTicket?.assignedTo || "")
  const [costEstimate, setCostEstimate] = useState(initialTicket?.costEstimate || 0)
  const [urgency, setUrgency] = useState(initialTicket?.urgency || "medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      propertyId,
      title,
      description,
      status,
      assignedTo: assignedTo || undefined,
      costEstimate,
      urgency,
      isTenantSubmitted: !isLandlord,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
        />
      </div>
      {isLandlord && (
        <>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Enter name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="costEstimate">Cost Estimate ($)</Label>
            <Slider
              id="costEstimate"
              min={0}
              max={10000}
              step={100}
              value={[costEstimate]}
              onValueChange={(value) => setCostEstimate(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${costEstimate}</span>
              <span>$10,000</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger id="urgency">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      <div className="flex justify-end space-x-2">
        <Button type="submit" variant={isLandlord ? "default" : "secondary"}>
          {initialTicket ? "Update Ticket" : "Create Ticket"}
        </Button>
      </div>
    </form>
  )
}

