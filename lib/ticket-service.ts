import type { Ticket } from "./types"

const sampleTickets: Ticket[] = [
  {
    id: "1",
    propertyId: "1",
    title: "Leaky Faucet",
    description: "The kitchen faucet is leaking and needs to be fixed",
    status: "open",
    assignedTo: "John Doe",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    costEstimate: 100,
    deadline: new Date().toISOString(),
    urgency: "medium",
    isTenantSubmitted: false,
  },
  {
    id: "2",
    propertyId: "2",
    title: "Broken Heater",
    description: "The central heating system is not working properly",
    status: "in-progress",
    assignedTo: "Jane Smith",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    costEstimate: 500,
    deadline: new Date().toISOString(),
    urgency: "high",
    isTenantSubmitted: false,
  },
  {
    id: "3",
    propertyId: "3",
    title: "Paint Touch-up",
    description: "Some walls need touch-up painting",
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    costEstimate: 200,
    deadline: new Date().toISOString(),
    urgency: "low",
    isTenantSubmitted: true,
  },
  {
    id: "4",
    propertyId: "4",
    title: "Replace Carpet",
    description: "Living room carpet needs to be replaced",
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    costEstimate: 1000,
    deadline: new Date().toISOString(),
    urgency: "medium",
    isTenantSubmitted: true,
  },
]

// Get all tickets from localStorage
export const getTickets = (): Ticket[] => {
  if (typeof window === "undefined") return []

  const tickets = localStorage.getItem("rental_tickets")
  return tickets ? JSON.parse(tickets) : sampleTickets
}

// Get tickets by property ID
export const getTicketsByPropertyId = (propertyId: string): Ticket[] => {
  const tickets = getTickets()
  return tickets.filter((ticket) => ticket.propertyId === propertyId)
}

// Add a new ticket
export const addTicket = (ticket: Ticket): Ticket => {
  const tickets = getTickets()
  tickets.push(ticket)
  localStorage.setItem("rental_tickets", JSON.stringify(tickets))
  console.log("Ticket added:", ticket) // Add this line for debugging
  return ticket
}

// Update an existing ticket
export const updateTicket = (ticket: Ticket): Ticket => {
  const tickets = getTickets()
  const index = tickets.findIndex((t) => t.id === ticket.id)

  if (index !== -1) {
    tickets[index] = ticket
    localStorage.setItem("rental_tickets", JSON.stringify(tickets))
  }

  return ticket
}

// Delete a ticket
export const deleteTicket = (ticketId: string): void => {
  const tickets = getTickets()
  const filteredTickets = tickets.filter((ticket) => ticket.id !== ticketId)
  localStorage.setItem("rental_tickets", JSON.stringify(filteredTickets))
}

