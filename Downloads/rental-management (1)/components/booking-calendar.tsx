"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Property, Booking } from "@/lib/types"
import { updateProperty } from "@/lib/property-service"
import { CalendarIcon, Trash } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BookingCalendarProps {
  property: Property
  onBookingsChanged: () => void
}

export function BookingCalendar({ property, onBookingsChanged }: BookingCalendarProps) {
  const [bookings, setBookings] = useState<Booking[]>(property.bookings || [])
  const [guestName, setGuestName] = useState("")
  const [pricePerNight, setPricePerNight] = useState(property.pricePerNight)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const handleAddBooking = () => {
    if (!dateRange.from || !dateRange.to || !guestName) {
      alert("Please select dates and enter guest name")
      return
    }

    // Check for overlapping bookings
    const isOverlapping = bookings.some((booking) => {
      const existingFrom = new Date(booking.startDate)
      const existingTo = new Date(booking.endDate)
      return (
        (dateRange.from <= existingTo && dateRange.from >= existingFrom) ||
        (dateRange.to <= existingTo && dateRange.to >= existingFrom) ||
        (dateRange.from <= existingFrom && dateRange.to >= existingTo)
      )
    })

    if (isOverlapping) {
      alert("This booking overlaps with an existing booking")
      return
    }

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      guestName,
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      pricePerNight,
    }

    const updatedBookings = [...bookings, newBooking]
    setBookings(updatedBookings)

    // Update property in localStorage
    const updatedProperty = {
      ...property,
      bookings: updatedBookings,
    }
    updateProperty(updatedProperty)
    onBookingsChanged()

    // Reset form
    setGuestName("")
    setPricePerNight(property.pricePerNight)
    setDateRange({ from: undefined, to: undefined })
  }

  const handleDeleteBooking = (bookingId: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const updatedBookings = bookings.filter((booking) => booking.id !== bookingId)
      setBookings(updatedBookings)

      // Update property in localStorage
      const updatedProperty = {
        ...property,
        bookings: updatedBookings,
      }
      updateProperty(updatedProperty)
      onBookingsChanged()
    }
  }

  // Function to get dates that are booked
  const getBookedDates = () => {
    const bookedDates: Date[] = []
    bookings.forEach((booking) => {
      const start = new Date(booking.startDate)
      const end = new Date(booking.endDate)

      // Add all dates between start and end (inclusive)
      const current = new Date(start)
      while (current <= end) {
        bookedDates.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
    })
    return bookedDates
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP")
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerNight">Price per Night ($)</Label>
            <Input
              id="pricePerNight"
              type="number"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(Number(e.target.value))}
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label>Booking Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range as any)}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  modifiers={{
                    booked: getBookedDates(),
                  }}
                  modifiersStyles={{
                    booked: { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={handleAddBooking} className="w-full">
            Add Booking
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Existing Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-muted-foreground">No bookings yet.</p>
        ) : (
          <div className="space-y-2">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <div className="font-medium">{booking.guestName}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </div>
                  <div className="text-sm">${booking.pricePerNight} per night</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteBooking(booking.id)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete booking</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

