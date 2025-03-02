import type { User } from "./types"

// Get users from localStorage
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []

  const users = localStorage.getItem("rental_users")
  return users ? JSON.parse(users) : []
}

// Save users to localStorage
export const saveUsers = (users: User[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("rental_users", JSON.stringify(users))
}

// Create a new user
export const signup = (name: string, email: string, password: string): User => {
  const users = getUsers()

  // Check if user already exists
  if (users.some((user) => user.email === email)) {
    throw new Error("User with this email already exists")
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
  }

  users.push(newUser)
  saveUsers(users)

  return newUser
}

// Login a user
export const login = (email: string, password: string): User => {
  const users = getUsers()

  const user = users.find((user) => user.email === email && user.password === password)

  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Set current user in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("rental_current_user", JSON.stringify(user))
  }

  return user
}

// Get current logged in user
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const user = localStorage.getItem("rental_current_user")
  return user ? JSON.parse(user) : null
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getCurrentUser()
}

// Logout user
export const logout = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem("rental_current_user")
}

// Update user
export const updateUser = (user: User) => {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === user.id)
  if (index !== -1) {
    users[index] = user
    saveUsers(users)
  }
}

// Create a default user
const createDefaultUser = () => {
  const defaultUser: User = {
    id: "default",
    name: "Default User",
    email: "cotetlaurentiu@gmail.com",
    password: "12345",
  }

  const users = getUsers()
  if (!users.some((user) => user.email === defaultUser.email)) {
    users.push(defaultUser)
    saveUsers(users)
  }
}

// Call this function when the app initializes
createDefaultUser()

