"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TicketForm } from "@/components/ticket-form"
import type { Ticket } from "@/lib/types"
import { Clock, Edit, MoreHorizontal, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TicketListProps {
  propertyId: string
  onTicketsChanged: () => void
}

export function TicketList({ propertyId, onTicketsChanged }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const response = await fetch("/api/tickets")
      if (response.ok) {
        const allTickets = await response.json()
        const propertyTickets = allTickets.filter((ticket: Ticket) => ticket.propertyId === propertyId)
        setTickets(propertyTickets)
      } else {
        throw new Error("Failed to fetch tickets")
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
      alert("Failed to load tickets. Please try again.")
    }
  }

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket)
    setIsDialogOpen(true)
  }

  const handleDelete = async (ticketId: string) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        const response = await fetch(`/api/tickets/${ticketId}`, { method: "DELETE" })
        if (response.ok) {
          loadTickets()
          onTicketsChanged()
        } else {
          throw new Error("Failed to delete ticket")
        }
      } catch (error) {
        console.error("Error deleting ticket:", error)
        alert("Failed to delete ticket. Please try again.")
      }
    }
  }

  const handleStatusChange = async (ticket: Ticket, status: "open" | "in-progress" | "closed") => {
    try {
      const updatedTicket = { ...ticket, status }
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTicket),
      })
      if (response.ok) {
        loadTickets()
        onTicketsChanged()
      } else {
        throw new Error("Failed to update ticket status")
      }
    } catch (error) {
      console.error("Error updating ticket status:", error)
      alert("Failed to update ticket status. Please try again.")
    }
  }

  const handleTicketSubmit = async (ticketData: Partial<Ticket>) => {
    try {
      if (editingTicket) {
        const response = await fetch(`/api/tickets/${editingTicket.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...editingTicket, ...ticketData }),
        })
        if (response.ok) {
          loadTickets()
          onTicketsChanged()
          setIsDialogOpen(false)
          setEditingTicket(null)
        } else {
          throw new Error("Failed to update ticket")
        }
      } else {
        const response = await fetch("/api/tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticketData),
        })
        if (response.ok) {
          loadTickets()
          onTicketsChanged()
          setIsDialogOpen(false)
        } else {
          throw new Error("Failed to create ticket")
        }
      }
    } catch (error) {
      console.error("Error submitting ticket:", error)
      alert("Failed to submit ticket. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-500"
      case "in-progress":
        return "bg-yellow-500"
      case "closed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-muted-foreground">No tickets found for this property.</p>
          <Button className="mt-2" onClick={() => setIsDialogOpen(true)}>
            Create Ticket
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{ticket.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(ticket)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(ticket, "open")}>
                        Mark as Open
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(ticket, "in-progress")}>
                        Mark as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(ticket, "closed")}>
                        Mark as Closed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(ticket.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="flex items-center gap-1 capitalize">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`} />
                    {ticket.status.replace("-", " ")}
                  </Badge>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(ticket.createdAt)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">{ticket.description}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="text-xs text-muted-foreground">
                  {ticket.isTenantSubmitted ? "Tenant Submitted" : "Landlord Submitted"}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Button onClick={() => setIsDialogOpen(true)}>
          {tickets.length === 0 ? "Create First Ticket" : "Add New Ticket"}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTicket ? "Edit Ticket" : "Create Ticket"}</DialogTitle>
          </DialogHeader>
          <TicketForm
            propertyId={propertyId}
            onSubmit={handleTicketSubmit}
            initialTicket={editingTicket || undefined}
            isLandlord={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

