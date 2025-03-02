import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "John Doe",
    title: "Property Manager",
    quote: "Rento has revolutionized the way I manage my properties. It's a game-changer!",
    avatar: "/avatars/john-doe.jpg",
  },
  {
    name: "Jane Smith",
    title: "Landlord",
    quote: "I can't imagine managing my rentals without Rento. It's saved me countless hours.",
    avatar: "/avatars/jane-smith.jpg",
  },
  {
    name: "Mike Johnson",
    title: "Real Estate Investor",
    quote: "The financial tracking features in Rento have helped me maximize my ROI.",
    avatar: "/avatars/mike-johnson.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col justify-between">
              <CardContent className="pt-6">
                <blockquote className="text-lg italic">&ldquo;{testimonial.quote}&rdquo;</blockquote>
              </CardContent>
              <CardFooter className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

