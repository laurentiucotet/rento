import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function RequestDemoSection() {
  return (
    <section id="request-demo" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Request a Demo</h2>
        <form className="max-w-md mx-auto space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Your company name" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Tell us about your property management needs" />
          </div>
          <Button type="submit" className="w-full">
            Request Demo
          </Button>
        </form>
      </div>
    </section>
  )
}

