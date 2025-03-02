"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { PropertyDialog } from "@/components/property-dialog"
import { TicketList } from "@/components/ticket-list"
import { TicketDialog } from "@/components/ticket-dialog"
import type { Property } from "@/lib/types"
import { deleteProperty, updateProperty } from "@/lib/property-service"
import { ChevronDown, ChevronRight, MoreHorizontal, Pencil, Trash } from "lucide-react"
import Image from "next/image"

interface PropertyTableProps {
  properties: Property[]
  onPropertiesChanged: () => void
}

export function PropertyTable({ properties, onPropertiesChanged }: PropertyTableProps) {
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [selectedPropertyForTicket, setSelectedPropertyForTicket] = useState<Property | null>(null)

  const toggleExpand = (propertyId: string) => {
    if (expandedProperty === propertyId) {
      setExpandedProperty(null)
    } else {
      setExpandedProperty(propertyId)
    }
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (propertyId: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deleteProperty(propertyId)
      onPropertiesChanged()
    }
  }

  const handleStatusChange = (property: Property, status: "vacant" | "occupied") => {
    const updatedProperty = { ...property, status }
    updateProperty(updatedProperty)
    onPropertiesChanged()
  }

  const handleAddTicket = (property: Property) => {
    setSelectedPropertyForTicket(property)
    setIsTicketDialogOpen(true)
  }

  const getImageUrl = (property: Property) => {
    if (property.images && property.images.length > 0) {
      return property.images[0]
    }
    return "/placeholder.svg?height=40&width=40"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price per Night</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No properties found.
              </TableCell>
            </TableRow>
          ) : (
            properties.map((property) => (
              <Collapsible key={property.id} open={expandedProperty === property.id} onOpenChange={() => {}} asChild>
                <>
                  <TableRow>
                    <TableCell>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => toggleExpand(property.id)}>
                          {expandedProperty === property.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="relative h-10 w-10">
                          <Image
                            src={getImageUrl(property) || "/placeholder.svg"}
                            alt={property.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <span className="font-medium">{property.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={property.status === "vacant" ? "outline" : "default"} size="sm">
                            {property.status === "vacant" ? "Vacant" : "Occupied"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusChange(property, "vacant")}>
                            Vacant
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(property, "occupied")}>
                            Occupied
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>${property.pricePerNight}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(property)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddTicket(property)}>Add Ticket</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(property.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <div className="p-4 bg-muted/50">
                          <h3 className="font-medium mb-2">Tickets</h3>
                          <TicketList propertyId={property.id} onTicketsChanged={onPropertiesChanged} />
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))
          )}
        </TableBody>
      </Table>

      {editingProperty && (
        <PropertyDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onPropertyAdded={onPropertiesChanged}
          propertyToEdit={editingProperty}
        />
      )}

      {selectedPropertyForTicket && (
        <TicketDialog
          open={isTicketDialogOpen}
          onOpenChange={setIsTicketDialogOpen}
          propertyId={selectedPropertyForTicket.id}
          onTicketAdded={onPropertiesChanged}
        />
      )}
    </div>
  )
}

