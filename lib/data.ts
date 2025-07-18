// lib/data.ts
import type { Project } from "./types"

export const dummyProjects: Project[] = [
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
  {
    id: "4",
    title: "Portfolio Website V2",
    description: "The second iteration of my personal portfolio, focusing on advanced animations and modern design.",
    image: "/placeholder.svg?height=400&width=600",
    href: "https://example.com/portfolio-v2",
    techStack: ["Next.js", "Framer Motion", "Tailwind CSS"],
  },
  {
    id: "5",
    title: "Mobile Game Prototype",
    description: "A simple mobile game prototype developed with React Native and Expo.",
    image: "/placeholder.svg?height=400&width=600",
    href: "https://example.com/mobile-game",
    techStack: ["React Native", "Expo", "JavaScript"],
  },
]
