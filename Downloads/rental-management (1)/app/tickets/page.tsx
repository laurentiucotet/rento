"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import type { Ticket, Property } from "@/lib/types"
import { getProperties } from "@/lib/property-service"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Filter, QrCode, Printer } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TicketForm } from "@/components/ticket-form"

export default function TicketsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [propertyFilter, setPropertyFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [selectedPropertyForTicket, setSelectedPropertyForTicket] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const allProperties = getProperties()
    setProperties(allProperties)

    try {
      const response = await fetch("/api/tickets")
      if (response.ok) {
        const allTickets = await response.json()
        console.log("Fetched tickets:", allTickets)
        setTickets(allTickets)
      } else {
        throw new Error("Failed to fetch tickets")
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
    }

    setLoading(false)
  }

  const getPropertyName = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId)
    return property ? property.name : "Unknown Property"
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

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.assignedTo && ticket.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      getPropertyName(ticket.propertyId).toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesProperty = propertyFilter === "all" || ticket.propertyId === propertyFilter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "tenant" && ticket.isTenantSubmitted) ||
      (activeTab === "internal" && !ticket.isTenantSubmitted)

    return matchesSearch && matchesStatus && matchesProperty && matchesTab
  })

  const handleAddTicket = async (ticketData: Partial<Ticket>) => {
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      })

      if (response.ok) {
        const newTicket = await response.json()
        console.log("New ticket created:", newTicket)
        setIsTicketDialogOpen(false)
        loadData()
      } else {
        throw new Error("Failed to create ticket")
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
      alert("Failed to create ticket. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const QRCodeDialog = ({ propertyId }: { propertyId: string }) => {
    const ticketFormUrl = `${window.location.origin}/tenant-form/${propertyId}`

    const handlePrint = () => {
      const printWindow = window.open("", "_blank")
      printWindow?.document.write(`
        <html>
          <head>
            <title>QR Code for ${getPropertyName(propertyId)}</title>
          </head>
          <body>
            <h1>Scan this QR code to submit a ticket for ${getPropertyName(propertyId)}</h1>
            ${document.getElementById(`qr-code-${propertyId}`)?.innerHTML}
          </body>
        </html>
      `)
      printWindow?.document.close()
      printWindow?.print()
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <QrCode className="w-4 h-4 mr-2" />
            Generate QR Code
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code for Tenant Ticket Form</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div id={`qr-code-${propertyId}`}>
              <QRCodeSVG value={ticketFormUrl} size={256} />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Scan this QR code to access the tenant ticket form for this property.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <a href={ticketFormUrl} target="_blank" rel="noopener noreferrer">
                  Open Form
                </a>
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print QR Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

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
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
          <Button onClick={() => setIsTicketDialogOpen(true)}>Create Ticket</Button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Property QR Codes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <Card key={property.id}>
                <CardHeader>
                  <CardTitle>{property.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <QRCodeDialog propertyId={property.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="tenant">Tenant Tickets</TabsTrigger>
            <TabsTrigger value="internal">Internal Tickets</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Property:</span>
              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground">No tickets found.</p>
            <Button className="mt-4" onClick={() => setIsTicketDialogOpen(true)}>
              Create New Ticket
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1 capitalize">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`} />
                      {ticket.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{getPropertyName(ticket.propertyId)}</div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">{ticket.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <div className="text-xs text-muted-foreground">
                    {ticket.isTenantSubmitted
                      ? "Tenant Submitted"
                      : ticket.assignedTo
                        ? `Assigned to: ${ticket.assignedTo}`
                        : "Unassigned"}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(ticket.createdAt)}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          <Select onValueChange={setSelectedPropertyForTicket}>
            <SelectTrigger>
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPropertyForTicket && (
            <TicketForm propertyId={selectedPropertyForTicket} onSubmit={handleAddTicket} isLandlord={true} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

