"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Property, Booking } from "@/lib/types"
import { addProperty, updateProperty } from "@/lib/property-service"
import { X, Upload } from "lucide-react"
import Image from "next/image"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface PropertyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPropertyAdded: () => void
  propertyToEdit?: Property
}

export function PropertyDialog({ open, onOpenChange, onPropertyAdded, propertyToEdit }: PropertyDialogProps) {
  // Form state
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"vacant" | "occupied">("vacant")
  const [pricePerNight, setPricePerNight] = useState(0)
  const [images, setImages] = useState<string[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState("details")

  // Booking and calendar state
  const [guestName, setGuestName] = useState("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })

  // Populate form when editing a property
  useEffect(() => {
    if (propertyToEdit) {
      setName(propertyToEdit.name)
      setAddress(propertyToEdit.address)
      setDescription(propertyToEdit.description || "")
      setStatus(propertyToEdit.status)
      setPricePerNight(propertyToEdit.pricePerNight)
      setImages(propertyToEdit.images || [])
      setBookings(propertyToEdit.bookings || [])
    } else {
      resetForm()
    }
  }, [propertyToEdit])

  const resetForm = () => {
    setName("")
    setAddress("")
    setDescription("")
    setStatus("vacant")
    setPricePerNight(0)
    setImages([])
    setBookings([])
    setActiveTab("details")
    setDateRange({ from: undefined, to: undefined })
  }

  // Handle image uploads
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          setImages((prev) => [...prev, event.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ""
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Add a booking using the selected date range
  const handleAddBooking = () => {
    if (!dateRange.from || !dateRange.to) {
      alert("Please select dates for the booking")
      return
    }

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      guestName, // or you can use status or another field if needed
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      pricePerNight,
    }

    setBookings((prev) => [...prev, newBooking])
    setDateRange({ from: undefined, to: undefined })
    setGuestName("")
  }

  const handleDeleteBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name || !address) {
      alert("Please fill in all required fields")
      return
    }

    const propertyData: Property = {
      id: propertyToEdit ? propertyToEdit.id : crypto.randomUUID(),
      name,
      address,
      description,
      status,
      pricePerNight,
      images,
      bookings,
      tickets: propertyToEdit ? propertyToEdit.tickets || [] : [],
    }

    if (propertyToEdit) {
      updateProperty(propertyData)
    } else {
      addProperty(propertyData)
    }

    onPropertyAdded()
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-visible">
        <DialogHeader>
          <DialogTitle>{propertyToEdit ? "Edit Property" : "Add Property"}</DialogTitle>
          <DialogDescription>
            {propertyToEdit ? "Update the details of your property." : "Add a new property to your dashboard."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="pricing">Pricing &amp; Bookings</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Beach House" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Ocean Drive, Miami, FL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A beautiful beachfront property..."
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Pricing & Bookings Tab */}
            <TabsContent value="pricing" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={status === "vacant" ? "default" : "outline"}
                      onClick={() => setStatus("vacant")}
                    >
                      Vacant
                    </Button>
                    <Button
                      type="button"
                      variant={status === "occupied" ? "default" : "outline"}
                      onClick={() => setStatus("occupied")}
                    >
                      Occupied
                    </Button>
                  </div>
                </div>
                {status === "occupied" && (
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
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Bookings</h3>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label>Booking Dates</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-2",
                            !dateRange.from && "text-muted-foreground",
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4 overflow-hidden" />
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
                      {/* The PopoverContent is styled with a high z-index so it appears on top */}
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                        style={{ zIndex: 9999 }}
                      >
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={(range) => setDateRange(range as any)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex-none object-left-bottom">
                    <Label className="invisible">Add Booking</Label>
                    <Button className="mt-2" onClick={handleAddBooking}>
                      Add Booking
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center">
                      <span>
                        {format(new Date(booking.startDate), "LLL dd, y")} -{" "}
                        {format(new Date(booking.endDate), "LLL dd, y")}: {booking.guestName}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteBooking(booking.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-4 py-4">
              <div className="flex items-center justify-center w-full">
                <Label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or JPEG</p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-32 w-full">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Property image ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
                {images.length === 0 && (
                  <p className="text-sm text-muted-foreground col-span-full">No images added yet.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{propertyToEdit ? "Update Property" : "Add Property"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

