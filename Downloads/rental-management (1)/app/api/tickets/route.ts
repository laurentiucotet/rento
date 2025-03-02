import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { Ticket } from "@/lib/types"

const ticketsFile = path.join(process.cwd(), "data", "tickets.json")

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), "data"))) {
  fs.mkdirSync(path.join(process.cwd(), "data"))
}

// Ensure tickets file exists
if (!fs.existsSync(ticketsFile)) {
  fs.writeFileSync(ticketsFile, "[]")
}

export async function GET() {
  try {
    const tickets = JSON.parse(fs.readFileSync(ticketsFile, "utf-8"))
    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Error reading tickets:", error)
    return NextResponse.json({ error: "Failed to read tickets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const ticket: Ticket = await request.json()
    const tickets: Ticket[] = JSON.parse(fs.readFileSync(ticketsFile, "utf-8"))

    const newTicket: Ticket = {
      ...ticket,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tickets.push(newTicket)
    fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2))

    return NextResponse.json(newTicket)
  } catch (error) {
    console.error("Error saving ticket:", error)
    return NextResponse.json({ error: "Failed to save ticket" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedTicket: Ticket = await request.json()
    const tickets: Ticket[] = JSON.parse(fs.readFileSync(ticketsFile, "utf-8"))

    const index = tickets.findIndex((t) => t.id === updatedTicket.id)
    if (index !== -1) {
      tickets[index] = { ...updatedTicket, updatedAt: new Date().toISOString() }
      fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2))
      return NextResponse.json(tickets[index])
    } else {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating ticket:", error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}

