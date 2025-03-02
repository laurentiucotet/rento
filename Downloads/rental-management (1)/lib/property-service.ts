interface Property {
  id: string
  name: string
  address: string
  description: string
  status: string
  pricePerNight: number
  isDynamicPricing: boolean
  images: string[]
}

const STORAGE_KEY = "rental_properties"

const sampleProperties: Property[] = [
  {
    id: "1",
    name: "Sunny Beach House",
    address: "123 Ocean Drive, Miami, FL",
    description: "Beautiful beachfront property with stunning ocean views",
    status: "occupied",
    pricePerNight: 250,
    isDynamicPricing: false,
    images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2"],
  },
  {
    id: "2",
    name: "Mountain Retreat Cabin",
    address: "456 Pine Road, Aspen, CO",
    description: "Cozy cabin in the heart of the mountains",
    status: "vacant",
    pricePerNight: 180,
    isDynamicPricing: true,
    images: ["https://images.unsplash.com/photo-1542718610-a1d656d1884c"],
  },
  {
    id: "3",
    name: "Downtown Loft",
    address: "789 Main Street, New York, NY",
    description: "Modern loft in the center of the city",
    status: "occupied",
    pricePerNight: 300,
    isDynamicPricing: false,
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
  },
  {
    id: "4",
    name: "Lakeside Cottage",
    address: "101 Lake View Road, Lake Tahoe, CA",
    description: "Charming cottage with beautiful lake views",
    status: "vacant",
    pricePerNight: 200,
    isDynamicPricing: true,
    images: ["https://images.unsplash.com/photo-1475087542963-13ab5e611954"],
  },
]

// Get all properties from localStorage
export const getProperties = (): Property[] => {
  if (typeof window === "undefined") return []

  const properties = localStorage.getItem(STORAGE_KEY)
  return properties ? JSON.parse(properties) : sampleProperties
}

// Save properties to localStorage
const saveProperties = (properties: Property[]) => {
  if (typeof window === "undefined") return

  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties))
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

