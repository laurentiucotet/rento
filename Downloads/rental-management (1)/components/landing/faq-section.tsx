import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Rento?",
    answer:
      "Rento is an all-in-one property management solution designed to simplify the process of managing rental properties for landlords and property managers.",
  },
  {
    question: "How does Rento help with property management?",
    answer:
      "Rento provides tools for property listing, tenant screening, rent collection, maintenance tracking, and financial reporting, all in one platform.",
  },
  {
    question: "Is Rento suitable for small landlords?",
    answer:
      "Yes, Rento is designed to cater to property managers of all sizes, from those with a single property to large-scale operations.",
  },
  {
    question: "Can tenants use Rento?",
    answer:
      "Yes, Rento offers a tenant portal where renters can pay rent, submit maintenance requests, and communicate with property managers.",
  },
  {
    question: "Is my data secure with Rento?",
    answer:
      "Absolutely. We use industry-standard encryption and security measures to protect your data and ensure your privacy.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

