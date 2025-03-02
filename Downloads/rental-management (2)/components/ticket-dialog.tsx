"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { Ticket } from "@/lib/types"
import { addTicket, updateTicket } from "@/lib/ticket-service"

interface TicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  propertyId: string
  onTicketAdded: () => void
  ticketToEdit?: Ticket | null
}

export function TicketDialog({ open, onOpenChange, propertyId, onTicketAdded, ticketToEdit }: TicketDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"open" | "in-progress" | "closed">("open")
  const [assignedTo, setAssignedTo] = useState("")
  const [costEstimate, setCostEstimate] = useState(0)
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("low")

  useEffect(() => {
    if (ticketToEdit) {
      setTitle(ticketToEdit.title)
      setDescription(ticketToEdit.description)
      setStatus(ticketToEdit.status)
      setAssignedTo(ticketToEdit.assignedTo || "")
      setCostEstimate(ticketToEdit.costEstimate)
      setUrgency(ticketToEdit.urgency)
    } else {
      resetForm()
    }
  }, [ticketToEdit])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setStatus("open")
    setAssignedTo("")
    setCostEstimate(0)
    setUrgency("low")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title) {
      alert("Please enter a title for the ticket")
      return
    }

    const ticketData: Ticket = {
      id: ticketToEdit ? ticketToEdit.id : crypto.randomUUID(),
      propertyId,
      title,
      description,
      status,
      assignedTo: assignedTo || undefined,
      createdAt: ticketToEdit ? ticketToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      costEstimate,
      urgency,
      isTenantSubmitted: false,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Set deadline to 7 days from now
    }

    if (ticketToEdit) {
      updateTicket(ticketData)
    } else {
      addTicket(ticketData)
    }

    onTicketAdded()
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{ticketToEdit ? "Edit Ticket" : "Create Ticket"}</DialogTitle>
          <DialogDescription>
            {ticketToEdit ? "Update the details of this ticket." : "Create a new ticket for this property."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Broken window" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Window in the living room is broken and needs to be fixed."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as any)}>
              <SelectTrigger>
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
              placeholder="John Doe"
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
            <Select value={urgency} onValueChange={(value) => setUrgency(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{ticketToEdit ? "Update Ticket" : "Create Ticket"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

