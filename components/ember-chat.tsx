"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────────────────

type Role = "ember" | "user"

interface Message {
  id: string
  role: Role
  content: string
}

type ConvState =
  | "idle"               // before first open
  | "greeting"           // sending the 3 auto-greet messages
  | "chatting"           // normal back-and-forth
  | "contact_ask_method" // showing email/phone quick-reply buttons
  | "contact_await_email"
  | "contact_await_phone"
  | "contact_await_name"
  | "done"               // lead saved

// ── FAQ rule engine ──────────────────────────────────────────────────────────

const FAQ_RULES: Array<{
  keywords: string[]
  response: string
  triggerContact?: true
}> = [
  // Check burn time BEFORE shipping so "how long" in "how long does it burn" matches here
  {
    keywords: ["burn", "last", "hours"],
    response:
      "Our 8oz jar candles burn for approximately 45–55 hours when cared for properly. Always trim your wick to ¼ inch before each burn! 🕯️",
  },
  {
    keywords: ["scent", "smell", "fragrance", "strong", "throw"],
    response:
      "Each product page has a Scent Profile showing fragrance notes and throw strength! Browse our full collection at /shop. Want help finding a scent?",
  },
  {
    keywords: ["custom", "personalize", "personalised", "special", "bulk", "wedding", "event", "gift"],
    response:
      "Savi loves making custom candles! 🕯️ We can do custom scents, labels, and bulk orders for weddings, events, or gifts. Drop your contact info below and Savi will personally reach out with details.",
    triggerContact: true,
  },
  {
    keywords: ["return", "refund", "exchange", "broken", "damaged"],
    response:
      "We want you to love your candles! If something arrived damaged or isn't right, email us at hello@saviscandles.com and we'll make it right. 🤍",
  },
  {
    keywords: ["wax", "ingredient", "natural", "soy", "paraffin", "safe", "toxic"],
    response:
      "All of Savi's candles are hand-poured using high-quality wax with premium fragrance oils. Each product page lists burn time and scent profile!",
  },
  {
    keywords: ["ship", "shipping", "delivery", "how long", "when will"],
    response:
      "We typically ship within 2–3 business days! 🚚 Standard delivery takes 5–7 business days. Orders over $75 ship free automatically.",
  },
]

const DEFAULT_RESPONSE =
  "That's a great question! I want to make sure Savi gets back to you personally on that. Can I grab your email or phone number so she can reach out directly? 🤍"

// ── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const isValidPhone = (v: string) => v.replace(/\D/g, "").length >= 10

function matchFAQ(text: string) {
  const lower = text.toLowerCase()
  return FAQ_RULES.find((r) => r.keywords.some((kw) => lower.includes(kw))) ?? null
}

// ── Sub-components ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <EmberAvatar />
      <div className="flex items-center gap-1.5 px-4 py-3 bg-secondary rounded-2xl rounded-tl-sm">
        <span className="typing-dot block w-1.5 h-1.5 rounded-full bg-foreground/50" />
        <span className="typing-dot block w-1.5 h-1.5 rounded-full bg-foreground/50" />
        <span className="typing-dot block w-1.5 h-1.5 rounded-full bg-foreground/50" />
      </div>
    </div>
  )
}

function EmberAvatar() {
  return (
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground text-background text-[11px] flex items-center justify-center mb-0.5 select-none">
      🕯️
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isEmber = msg.role === "ember"
  return (
    <div className={cn("flex gap-2", isEmber ? "items-end" : "items-end justify-end")}>
      {isEmber && <EmberAvatar />}
      <p
        className={cn(
          "max-w-[82%] px-4 py-2.5 rounded-2xl font-body text-sm leading-relaxed whitespace-pre-wrap",
          isEmber
            ? "bg-secondary text-foreground rounded-tl-sm"
            : "bg-foreground text-background rounded-tr-sm",
        )}
      >
        {msg.content}
      </p>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export function EmberChat() {
  const pathname = usePathname()

  // ── State ─────────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen]       = useState(false)
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState("")
  const [isTyping, setIsTyping]   = useState(false)
  const [convState, setConvState] = useState<ConvState>("idle")
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [hasGreeted, setHasGreeted]     = useState(false)
  const [isHydrated, setIsHydrated]     = useState(false)

  // Refs — avoid stale closures for values updated asynchronously
  const contactTriggeredRef = useRef(false)
  const contactCapturedRef  = useRef(false)
  const pendingEmail        = useRef("")
  const pendingPhone        = useRef("")
  const userMsgCount        = useRef(0)
  const messagesEndRef      = useRef<HTMLDivElement>(null)
  const inputRef            = useRef<HTMLInputElement>(null)

  // Hide on admin pages — hooks still called, just no render
  const isAdmin = pathname?.startsWith("/admin")

  // ── LocalStorage hydration (client-only) ──────────────────────────────────
  useEffect(() => {
    const greeted         = localStorage.getItem("ember_greeted") === "true"
    const contactDone     = localStorage.getItem("ember_contact_done") === "true"
    const savedMessages   = localStorage.getItem("ember_messages")

    setHasGreeted(greeted)

    if (contactDone) {
      contactTriggeredRef.current = true
      contactCapturedRef.current  = true
    }

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages) as Message[]
        setMessages(parsed)
        userMsgCount.current = parsed.filter((m) => m.role === "user").length
        if (parsed.length > 0) setConvState("chatting")
      } catch {
        // ignore corrupt data
      }
    }

    setIsHydrated(true)
  }, [])

  // Persist messages
  useEffect(() => {
    if (!isHydrated || messages.length === 0) return
    localStorage.setItem("ember_messages", JSON.stringify(messages))
  }, [messages, isHydrated])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 320)
  }, [isOpen])

  // Trigger greeting on first open
  useEffect(() => {
    if (!isOpen || !isHydrated) return
    if (!hasGreeted && convState === "idle") startGreeting()
  }, [isOpen, isHydrated]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Message helpers ───────────────────────────────────────────────────────
  function addMsg(role: Role, content: string): Message {
    const msg: Message = { id: uid(), role, content }
    setMessages((prev) => [...prev, msg])
    if (role === "user") userMsgCount.current += 1
    return msg
  }

  async function emberSay(content: string) {
    setIsTyping(true)
    await sleep(600)
    setIsTyping(false)
    addMsg("ember", content)
  }

  // ── Greeting flow ─────────────────────────────────────────────────────────
  async function startGreeting() {
    setConvState("greeting")
    localStorage.setItem("ember_greeted", "true")
    setHasGreeted(true)

    await emberSay("Hi there! I'm Ember 🕯️ — your guide to Savi's handcrafted candles.")
    await emberSay(
      "Whether you're looking for the perfect scent, have questions about an order, or want to make a custom request — I'm here to help!",
    )
    await emberSay("What brings you in today?")

    setQuickReplies(["Browse products 🛍️", "Custom order request ✨", "Just looking around 👀"])
    setConvState("chatting")
  }

  // ── Contact capture flow ──────────────────────────────────────────────────
  async function triggerContactCapture() {
    if (contactTriggeredRef.current) return
    contactTriggeredRef.current = true
    setConvState("contact_ask_method")
    await emberSay(
      "Can I grab your name and best way to reach you? Savi personally follows up with every inquiry 🤍",
    )
    setQuickReplies(["Share my email 📧", "Share my phone 📱"])
  }

  async function saveLead(name: string) {
    const transcript = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join(" | ")

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: pendingEmail.current || null,
          phone: pendingPhone.current || null,
          message: transcript,
          source: "chatbot",
        }),
      })

      const data = await res.json()

      if (data.id) {
        // Fire-and-forget owner notification
        fetch("/api/notify-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email: pendingEmail.current || null,
            phone: pendingPhone.current || null,
            message: transcript,
          }),
        }).catch(() => {}) // non-critical
      }
    } catch (err) {
      console.error("Ember: failed to save lead", err)
    }

    contactCapturedRef.current = true
    localStorage.setItem("ember_contact_done", "true")
  }

  // ── Message handler ───────────────────────────────────────────────────────
  async function handleUserMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    addMsg("user", trimmed)
    setInput("")

    // Contact capture states — bypass FAQ
    if (convState === "contact_await_email") {
      if (!isValidEmail(trimmed)) {
        await emberSay("Hmm, that doesn't look like a valid email — could you try again? 😊")
        return
      }
      pendingEmail.current = trimmed
      setConvState("contact_await_name")
      await emberSay("Got it! And your name?")
      return
    }

    if (convState === "contact_await_phone") {
      if (!isValidPhone(trimmed)) {
        await emberSay("That number needs at least 10 digits — could you double-check? 😊")
        return
      }
      pendingPhone.current = trimmed
      setConvState("contact_await_name")
      await emberSay("Got it! And your name?")
      return
    }

    if (convState === "contact_await_name") {
      await saveLead(trimmed)
      setConvState("done")
      await emberSay(
        `Perfect, ${trimmed}! 🕯️ Savi will personally reach out soon. In the meantime, feel free to browse the shop!`,
      )
      return
    }

    // Normal FAQ chat
    const match = matchFAQ(trimmed)

    if (match) {
      await emberSay(match.response)
      if (match.triggerContact) {
        await triggerContactCapture()
        return
      }
    } else {
      await emberSay(DEFAULT_RESPONSE)
      await triggerContactCapture()
      return
    }

    // 3+ messages rule — trigger contact capture if not yet triggered
    if (userMsgCount.current >= 3) {
      await triggerContactCapture()
    }
  }

  // ── Quick-reply handler ───────────────────────────────────────────────────
  async function handleQuickReply(reply: string) {
    setQuickReplies([])

    switch (reply) {
      case "Browse products 🛍️":
        addMsg("user", reply)
        await emberSay(
          "Great! Our full collection is at /shop — every product shows scent notes, burn time, and you can Quick Add straight to cart. Anything specific I can help you find?",
        )
        break

      case "Custom order request ✨":
        addMsg("user", reply)
        await emberSay(
          "Savi loves making custom candles! 🕯️ Custom scents, labels, and bulk orders for weddings, events, or gifts — let's get started!",
        )
        await triggerContactCapture()
        break

      case "Just looking around 👀":
        addMsg("user", reply)
        await emberSay("Of course! Take your time — I'm here if anything catches your eye. 🕯️")
        break

      case "Share my email 📧":
        addMsg("user", reply)
        setConvState("contact_await_email")
        await emberSay("What's your email address?")
        break

      case "Share my phone 📱":
        addMsg("user", reply)
        setConvState("contact_await_phone")
        await emberSay("What's your phone number?")
        break
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || inputDisabled) return
    handleUserMessage(input)
  }

  // Input is disabled when Ember controls the conversation flow
  const inputDisabled = convState === "greeting" || convState === "contact_ask_method"

  const inputPlaceholder =
    inputDisabled
      ? "Choose an option above ↑"
      : convState === "contact_await_email"
      ? "your@email.com"
      : convState === "contact_await_phone"
      ? "Your phone number"
      : convState === "contact_await_name"
      ? "Your name"
      : "Type a message..."

  const inputType =
    convState === "contact_await_email" ? "email"
    : convState === "contact_await_phone" ? "tel"
    : "text"

  // ── Render ────────────────────────────────────────────────────────────────
  if (isAdmin) return null

  return (
    <>
      {/* ── Chat panel ─────────────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed z-50 bg-background flex flex-col overflow-hidden",
          "border border-border shadow-2xl",
          // Mobile: full screen from bottom
          "inset-x-0 bottom-0 h-[100dvh]",
          // Desktop: floating panel
          "md:inset-auto md:bottom-20 md:right-4 md:w-[380px] md:h-[500px] md:rounded-2xl",
          // Open/close animation
          "transition-[transform,opacity] duration-300 ease-out",
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full md:translate-y-4 opacity-0 pointer-events-none",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Ember — Savi's Candle Assistant"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-sm select-none">
              🕯️
            </div>
            <div>
              <h3 className="font-heading text-sm font-normal leading-tight">Ember 🕯️</h3>
              <p className="font-body text-[11px] text-foreground/50">Savi's Candle Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full w-7 h-7 flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Close chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && !isTyping && (
            <p className="text-center font-body text-xs text-foreground/30 py-8 select-none">
              Opening the conversation...
            </p>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        {quickReplies.length > 0 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2 flex-shrink-0">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="font-body text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-secondary transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 px-4 py-3 border-t border-border flex-shrink-0"
        >
          <input
            ref={inputRef}
            type={inputType}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={inputDisabled}
            placeholder={inputPlaceholder}
            className="flex-1 min-w-0 font-body text-sm bg-secondary rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-40 disabled:cursor-not-allowed"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || inputDisabled}
            aria-label="Send message"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center transition-opacity disabled:opacity-30 hover:opacity-80 active:scale-95"
          >
            <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 21L23 12 2 3v7l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>

      {/* ── Chat bubble ────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "fixed bottom-4 right-4 z-50",
          "w-14 h-14 rounded-full bg-foreground text-background shadow-lg",
          "flex items-center justify-center select-none",
          "transition-transform duration-200 hover:scale-110 active:scale-95",
          !isOpen && "animate-ember-pulse",
        )}
        aria-label={isOpen ? "Close Ember chat" : "Open Ember chat"}
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl leading-none">🕯️</span>
        )}
      </button>
    </>
  )
}
