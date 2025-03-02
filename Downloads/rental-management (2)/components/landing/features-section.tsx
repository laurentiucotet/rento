"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Calendar, FileText, Users, Settings, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    title: "Property Management",
    description: "Easily manage all your properties in one place",
    icon: Home,
  },
  {
    title: "Booking System",
    description: "Streamline your booking process with our integrated calendar",
    icon: Calendar,
  },
  {
    title: "Financial Tracking",
    description: "Keep track of your income and expenses effortlessly",
    icon: TrendingUp,
  },
  {
    title: "Maintenance Requests",
    description: "Handle maintenance tickets efficiently",
    icon: FileText,
  },
  {
    title: "Tenant Portal",
    description: "Provide a seamless experience for your tenants",
    icon: Users,
  },
  {
    title: "Customizable Settings",
    description: "Tailor the app to fit your specific needs",
    icon: Settings,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

