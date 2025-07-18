// app/api/contact/route.ts
import { NextResponse } from "next/server"
import type { ContactFormData } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json()
    console.log("Received contact form data:", data)

    // Simulate a delay for network request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real application, you would send this data to an email service (e.g., SendGrid, Nodemailer)
    // or save it to a database.

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ message: "Failed to send message." }, { status: 500 })
  }
}
