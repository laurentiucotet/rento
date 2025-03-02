"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyTable } from "@/components/property-table"
import { PropertyCard } from "@/components/property-card"
import { PropertyDialog } from "@/components/property-dialog"
import type { Property, Ticket } from "@/lib/types"
import { getProperties } from "@/lib/property-service"
import { getTickets } from "@/lib/ticket-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, TicketIcon, AlertTriangle, Calendar } from "lucide-react"

export function PropertyDashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const loadedProperties = getProperties()
    const loadedTickets = getTickets()
    setProperties(loadedProperties)
    setTickets(loadedTickets)
  }

  const handlePropertyAdded = () => {
    loadData()
    setIsDialogOpen(false)
  }

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const calculateVacancyRate = () => {
    const vacantProperties = properties.filter((p) => p.status === "vacant")
    return properties.length > 0 ? ((vacantProperties.length / properties.length) * 100).toFixed(2) : "0.00"
  }

  const getTicketsToSolve = () => {
    return tickets.filter((t) => t.status !== "closed").length
  }

  const getUrgentTickets = () => {
    return tickets.filter((t) => t.urgency === "high" && t.status !== "closed").length
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacancy Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateVacancyRate()}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets to Solve</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTicketsToSolve()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUrgentTickets()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            defaultValue="table"
            className="w-[200px]"
            onValueChange={(value) => setViewMode(value as "table" | "grid")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setIsDialogOpen(true)}>Add Property</Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <PropertyTable properties={filteredProperties} onPropertiesChanged={handlePropertyAdded} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} onPropertyChanged={handlePropertyAdded} />
          ))}
        </div>
      )}

      <PropertyDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onPropertyAdded={handlePropertyAdded} />

      <Card className="sticky bottom-4 mt-8">
        <CardContent className="flex flex-col items-center justify-between p-6 sm:flex-row">
          <div className="mb-4 text-center sm:mb-0 sm:text-left">
            <h3 className="text-lg font-semibold">Coming soon!</h3>
            <p className="text-sm text-muted-foreground">Import your rentals from 3rd parties</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" disabled>
              Import from Airbnb
            </Button>
            <Button variant="outline" disabled>
              Import from Booking.com
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

