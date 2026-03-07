import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, source } = body

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert({
        name:      name.trim(),
        email:     email   ?? null,
        phone:     phone   ?? null,
        message:   message ?? null,
        source:    source  ?? "chatbot",
        contacted: false,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error saving lead:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ id: data.id })
  } catch (err) {
    console.error("Leads API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
