import type { Property } from "./types"

const sampleProperties: Property[] = [
  {
    id: "1",
    name: "Sunny Beach House",
    address: "123 Ocean Drive, Miami, FL",
    description: "Beautiful beachfront property with stunning ocean views",
    status: "occupied",
    pricePerNight: 250,
    isDynamicPricing: false,
    images: ["/sample-images/beach-house.jpg"],
  },
  {
    id: "2",
    name: "Mountain Retreat Cabin",
    address: "456 Pine Road, Aspen, CO",
    description: "Cozy cabin in the heart of the mountains",
    status: "vacant",
    pricePerNight: 180,
    isDynamicPricing: true,
    images: ["/sample-images/mountain-cabin.jpg"],
  },
  {
    id: "3",
    name: "Downtown Loft",
    address: "789 Main Street, New York, NY",
    description: "Modern loft in the center of the city",
    status: "occupied",
    pricePerNight: 300,
    isDynamicPricing: false,
    images: ["/sample-images/city-loft.jpg"],
  },
  {
    id: "4",
    name: "Lakeside Cottage",
    address: "101 Lake View Road, Lake Tahoe, CA",
    description: "Charming cottage with beautiful lake views",
    status: "vacant",
    pricePerNight: 200,
    isDynamicPricing: true,
    images: ["/sample-images/lake-cottage.jpg"],
  },
]

// Get all properties from localStorage
export const getProperties = (): Property[] => {
  if (typeof window === "undefined") return []

  const properties = localStorage.getItem("rental_properties")
  return properties ? JSON.parse(properties) : sampleProperties
}

// Save properties to localStorage
export const saveProperties = (properties: Property[]) => {
  if (typeof window === "undefined") return

  localStorage.setItem("rental_properties", JSON.stringify(properties))
}

// Add a new property
export const addProperty = (property: Property): Property => {
  const properties = getProperties()
  properties.push(property)
  saveProperties(properties)
  return property
}

// Update an existing property
export const updateProperty = (property: Property): Property => {
  const properties = getProperties()
  const index = properties.findIndex((p) => p.id === property.id)

  if (index !== -1) {
    properties[index] = property
    saveProperties(properties)
  }

  return property
}

// Delete a property
export const deleteProperty = (propertyId: string): void => {
  const properties = getProperties()
  const filteredProperties = properties.filter((p) => p.id !== propertyId)
  saveProperties(filteredProperties)
}

// Get a property by ID
export const getPropertyById = (propertyId: string): Property | undefined => {
  const properties = getProperties()
  return properties.find((p) => p.id === propertyId)
}

