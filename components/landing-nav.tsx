import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RentoLogo } from "@/components/rento-logo"

export function LandingNav() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <RentoLogo />
          <nav className="hidden md:flex space-x-4">
            <Link href="#features" className="text-sm font-medium">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium">
              Testimonials
            </Link>
            <Link href="#faq" className="text-sm font-medium">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

