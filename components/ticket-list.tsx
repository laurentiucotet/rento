"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TicketDialog } from "@/components/ticket-dialog"
import type { Ticket } from "@/lib/types"
import { getTicketsByPropertyId, deleteTicket, updateTicket } from "@/lib/ticket-service"
import { Clock, Edit, MoreHorizontal, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  }, []) // Removed propertyId from dependencies

  const loadTickets = () => {
    const propertyTickets = getTicketsByPropertyId(propertyId)
    setTickets(propertyTickets)
  }

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket)
    setIsDialogOpen(true)
  }

  const handleDelete = (ticketId: string) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      deleteTicket(ticketId)
      loadTickets()
      onTicketsChanged()
    }
  }

  const handleStatusChange = (ticket: Ticket, status: "open" | "in-progress" | "closed") => {
    const updatedTicket = { ...ticket, status }
    updateTicket(updatedTicket)
    loadTickets()
    onTicketsChanged()
  }

  const handleTicketAdded = () => {
    loadTickets()
    onTicketsChanged()
    setIsDialogOpen(false)
    setEditingTicket(null)
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
                <div className="text-xs text-muted-foreground">Assigned to: {ticket.assignedTo || "Unassigned"}</div>
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

      <TicketDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        propertyId={propertyId}
        onTicketAdded={handleTicketAdded}
        ticketToEdit={editingTicket}
      />
    </div>
  )
}

