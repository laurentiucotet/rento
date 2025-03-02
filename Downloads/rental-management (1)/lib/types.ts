export interface Property {
  id: string
  name: string
  address: string
  description?: string
  status: "vacant" | "occupied"
  pricePerNight: number
  isDynamicPricing: boolean
  images?: string[]
  tickets?: Ticket[]
  bookings?: Booking[]
}

export interface Booking {
  id: string
  guestName: string
  startDate: string
  endDate: string
  pricePerNight: number
}

export interface Ticket {
  id?: string
  propertyId: string
  title: string
  description: string
  status: "open" | "in-progress" | "closed"
  assignedTo?: string
  createdAt: string
  updatedAt: string
  costEstimate: number
  deadline: string
  urgency: "low" | "medium" | "high"
  isTenantSubmitted: boolean
  images?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  password: string
}

