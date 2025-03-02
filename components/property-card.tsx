"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PropertyDialog } from "@/components/property-dialog"
import { TicketDialog } from "@/components/ticket-dialog"
import type { Property } from "@/lib/types"
import { deleteProperty, updateProperty } from "@/lib/property-service"
import { Calendar, Home, MapPin, MoreHorizontal, Pencil, Ticket, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookingCalendar } from "@/components/booking-calendar"
import { format, isFuture } from "date-fns"

interface PropertyCardProps {
  property: Property
  onPropertyChanged: () => void
}

export function PropertyCard({ property, onPropertyChanged }: PropertyCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)

  const handleEdit = () => {
    setIsEditDialogOpen(true)
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deleteProperty(property.id)
      onPropertyChanged()
    }
  }

  const handleStatusChange = (status: "vacant" | "occupied") => {
    const updatedProperty = { ...property, status }
    updateProperty(updatedProperty)
    onPropertyChanged()
  }

  const handleAddTicket = () => {
    setIsTicketDialogOpen(true)
  }

  const getImageUrl = () => {
    if (property.images && property.images.length > 0) {
      return property.images[0]
    }
    return "/placeholder.svg?height=200&width=300"
  }

  const getVacancyPeriod = () => {
    if (property.status !== "vacant") return null

    const futureBookings = property.bookings?.filter((booking) => isFuture(new Date(booking.startDate))) || []
    if (futureBookings.length === 0) return "No future bookings"

    const nextBooking = futureBookings.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )[0]
    return `Vacant until ${format(new Date(nextBooking.startDate), "PP")}`
  }

  return (
    <Card>
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={getImageUrl() || "/placeholder.svg"}
            alt={property.name}
            fill
            className="object-cover rounded-t-lg"
          />
          <Badge className="absolute top-2 right-2" variant={property.status === "vacant" ? "outline" : "default"}>
            {property.status === "vacant" ? "Vacant" : "Occupied"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl mb-2">{property.name}</CardTitle>
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.address}</span>
        </div>
        <div className="text-sm mb-2">
          ${property.pricePerNight} per night
          {property.isDynamicPricing && " (Dynamic pricing enabled)"}
        </div>
        {property.status === "vacant" && <div className="text-sm text-muted-foreground">{getVacancyPeriod()}</div>}
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm" onClick={() => setIsBookingDialogOpen(true)}>
          <Calendar className="h-4 w-4 mr-1" />
          Bookings
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddTicket}>
              <Ticket className="mr-2 h-4 w-4" />
              Add Ticket
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("vacant")}>
              <Home className="mr-2 h-4 w-4" />
              Mark as Vacant
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("occupied")}>
              <Home className="mr-2 h-4 w-4" />
              Mark as Occupied
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>

      <PropertyDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onPropertyAdded={onPropertyChanged}
        propertyToEdit={property}
      />

      <TicketDialog
        open={isTicketDialogOpen}
        onOpenChange={setIsTicketDialogOpen}
        propertyId={property.id}
        onTicketAdded={onPropertyChanged}
      />

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bookings for {property.name}</DialogTitle>
          </DialogHeader>
          <BookingCalendar property={property} onBookingsChanged={onPropertyChanged} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

