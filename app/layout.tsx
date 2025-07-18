import type React from "react";
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Mountain } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mukesh | React Native Developer Portfolio",
  description:
    "A world-class, fully responsive personal portfolio website for John Doe, a React Native Developer.",
  keywords: [
    "React Native",
    "Developer",
    "Portfolio",
    "Mobile Development",
    "TypeScript",
    "Next.js",
    "Tailwind CSS",
  ],
  authors: [{ name: "John Doe" }],
  openGraph: {
    title: "John Doe | React Native Developer Portfolio",
    description:
      "A world-class, fully responsive personal portfolio website for John Doe, a React Native Developer.",
    url: "https://yourportfolio.com", // Replace with your actual URL
    siteName: "John Doe's Portfolio",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200", // Replace with a custom OG image
        width: 1200,
        height: 630,
        alt: "John Doe's Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mukesh | React Native Developer Portfolio",
    description:
      "A world-class, fully responsive personal portfolio website for John Doe, a React Native Developer.",
    creator: "@yourtwitterhandle", // Replace with your Twitter handle
    images: ["/placeholder.svg?height=630&width=1200"], // Replace with a custom Twitter image
  },
  icons: {
    icon: "/favicon.ico", // Ensure you have a favicon.ico in your public folder
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-sm py-3 px-4 md:px-6 flex items-center justify-between border-b border-border/50">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-primary hover:text-foreground transition-colors"
            >
              <Mountain className="h-6 w-6" />
              <span>Mukesh</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#hero"
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="#about"
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                About
              </Link>
              <Link
                href="#projects"
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Projects
              </Link>
              <Link
                href="#contact"
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Contact
              </Link>
            </nav>
            <ThemeToggle />
          </header>
          {children}
          <footer className="py-8 px-4 md:px-6 text-center text-sm text-muted-foreground border-t border-border/50 bg-card/70 backdrop-blur-sm">
            &copy; {new Date().getFullYear()} John Doe. All rights reserved.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
