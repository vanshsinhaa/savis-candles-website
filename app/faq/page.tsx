import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FooterGradient } from "@/components/footer-gradient"

const faqs = [
  {
    id: "1",
    question: "What are your candles made from?",
    answer:
      "Our candles are crafted from 100% natural soy wax, premium fragrance oils, and lead-free cotton wicks. Each candle is hand-poured in small batches to ensure the highest quality.",
  },
  {
    id: "2",
    question: "How long do the candles burn?",
    answer:
      "Burn times vary by candle size, ranging from 42 to 55 hours. Each product listing includes specific burn time information. For optimal performance, trim the wick to 1/4 inch before each use.",
  },
  {
    id: "3",
    question: "Do you offer international shipping?",
    answer:
      "Currently, we ship within the United States and Canada. International shipping to select countries will be available soon. Sign up for our newsletter to be notified when we expand.",
  },
  {
    id: "4",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, contact us for a full refund or exchange. Candles must be unused and in original packaging.",
  },
  {
    id: "5",
    question: "Are your candles eco-friendly?",
    answer:
      "Yes! We use sustainable soy wax, recyclable glass containers, and biodegradable packaging materials. Our commitment to the environment extends throughout our entire production process.",
  },
  {
    id: "6",
    question: "How should I care for my candle?",
    answer:
      "Always trim the wick to 1/4 inch before lighting. Burn for 2-3 hours at a time to ensure an even melt pool. Never leave a burning candle unattended, and keep away from drafts and flammable materials.",
  },
  {
    id: "7",
    question: "Can I reuse the candle containers?",
    answer:
      "Our glass containers are designed to be reused. Once your candle is finished, clean out any remaining wax with hot water and soap, then repurpose the container for storage, plants, or decor.",
  },
  {
    id: "8",
    question: "Do you offer gift wrapping?",
    answer:
      "Yes, we offer complimentary gift wrapping for all orders. Simply select the gift wrap option at checkout, and we'll package your candles beautifully with a handwritten note if desired.",
  },
]

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-6 py-32">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-light tracking-tight">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-foreground/60">Everything you need to know about our candles</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.id} value={faq.id} className="rounded-lg border border-border bg-card px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="pt-1 font-medium">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-12 text-foreground/70">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <FooterGradient />
    </main>
  )
}
