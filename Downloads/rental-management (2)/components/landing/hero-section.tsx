"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <Image src="/hero-background.jpg" alt="Modern apartment interior" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Simplify Your Rental Property Management</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Rento: The all-in-one solution for property managers and landlords
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild size="lg" variant="default">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#request-demo">Request Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

