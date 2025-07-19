"use client";
// app/page.tsx
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ProjectsSection from "@/components/projects-section";
import ContactSection from "@/components/contact-section";
import SocialLinks from "@/components/social-links";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CursorEffects from "@/components/effects/CursorEffects";

export default function Home() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);

  const handleSecretClick = () => {
    setClickCount((prev) => prev + 1);
    if (clickCount === 4) {
      // 5th click (0-4 = 5 clicks)
      router.push("/admin/contacts");
      setClickCount(0);
    }
    // Reset count after 3 seconds
    setTimeout(() => setClickCount(0), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CursorEffects mode="bubble" />
      <SocialLinks />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      {/* Secret Admin Button */}
      <div className="fixed bottom-2 right-2 z-40">
        <button
          onClick={() => router.push("/admin/contacts")}
          className="opacity-5 hover:opacity-100 transition-opacity duration-300 p-2 text-xs text-muted-foreground hover:text-foreground"
          title="Admin Panel"
        >
          👁️
        </button>
      </div>

      {/* Secret Double-Click Area */}
      <div
        onClick={handleSecretClick}
        className="fixed top-4 left-4 w-8 h-8 z-40 cursor-pointer opacity-0 hover:opacity-20 transition-opacity duration-300"
        title="Secret Area"
      />

      <Toaster />
    </div>
  );
}
