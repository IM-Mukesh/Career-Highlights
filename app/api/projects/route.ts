// app/api/projects/route.ts
import { NextResponse } from "next/server"
import type { Project } from "@/lib/types"

const projects: Project[] = [
  {
    id: "1",
    title: "E-commerce Storefront",
    description: "A modern e-commerce platform built with Next.js and Stripe for seamless payments.",
    image: "/placeholder.svg?height=400&width=600",
    href: "https://example.com/ecommerce",
    techStack: ["Next.js", "React", "Tailwind CSS", "Stripe"],
  },
  {
    id: "2",
    title: "AI Chatbot Interface",
    description: "An interactive AI chatbot interface powered by a custom NLP model.",
    image: "/placeholder.svg?height=400&width=600",
    href: "https://example.com/chatbot",
    techStack: ["Python", "Flask", "React", "TypeScript"],
  },
  {
    id: "3",
    title: "Task Management App",
    description: "A full-stack task management application with user authentication and real-time updates.",
    image: "/placeholder.svg?height=400&width=600",
    href: "https://example.com/task-app",
    techStack: ["Node.js", "Express", "MongoDB", "React"],
  },
]

export async function GET() {
  return NextResponse.json(projects)
}
