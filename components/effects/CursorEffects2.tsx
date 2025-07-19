"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import type { Container, Engine } from "tsparticles-engine";

// Dynamically import Particles to avoid SSR issues
const Particles = dynamic(() => import("react-tsparticles"), {
  ssr: false,
  loading: () => <div></div>,
});

// Subtle particle configuration for homepage only
const subtleConfig = {
  particles: {
    number: {
      value: 20,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: ["#3b82f6", "#8b5cf6", "#06b6d4"],
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.3,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: true,
        speed: 2,
        size_min: 1,
        sync: false,
      },
    },
    line_linked: {
      enable: false,
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "bounce",
      bounce: true,
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: "canvas" as const,
    events: {
      onhover: {
        enable: true,
        mode: "bubble",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 150,
        size: 6,
        duration: 2,
        opacity: 0.8,
        speed: 3,
      },
      push: {
        particles_nb: 3,
      },
    },
  },
  retina_detect: true,
};

// Theme-aware color schemes
const getThemeColors = (isDark: boolean) => ({
  primary: isDark ? "#3b82f6" : "#1d4ed8",
  secondary: isDark ? "#8b5cf6" : "#7c3aed",
  accent: isDark ? "#06b6d4" : "#0891b2",
  background: "transparent",
});

interface CursorEffectsProps {
  effectType?: "bubble" | "trail" | "halo";
  enabled?: boolean;
  className?: string;
}

export default function CursorEffects2({
  effectType = "bubble",
  enabled = true,
  className = "",
}: CursorEffectsProps) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Only show on homepage
  const isHomepage = pathname === "/";

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug logging
  useEffect(() => {
    if (isClient) {
      console.log("CursorEffects Debug:", {
        pathname,
        isHomepage,
        enabled,
        effectType,
      });
    }
  }, [pathname, isHomepage, enabled, effectType, isClient]);

  // Detect theme
  useEffect(() => {
    if (!isClient) return;

    const checkTheme = () => {
      const isDarkMode =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(isDarkMode);
    };

    checkTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkTheme);

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      mediaQuery.removeEventListener("change", checkTheme);
      observer.disconnect();
    };
  }, [isClient]);

  // Initialize particles
  const particlesInit = useCallback(
    async (engine: Engine) => {
      if (!isClient) return;

      try {
        const { loadSlim } = await import("tsparticles-slim");
        console.log("Initializing particles...");
        await loadSlim(engine);
      } catch (error) {
        console.error("Failed to load tsparticles:", error);
      }
    },
    [isClient]
  );

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      console.log("Particles loaded successfully!");
      setIsLoaded(true);
    },
    []
  );

  // Get current configuration with theme colors
  const getCurrentConfig = useCallback(() => {
    const themeColors = getThemeColors(isDark);

    return {
      ...subtleConfig,
      particles: {
        ...subtleConfig.particles,
        color: {
          value: [
            themeColors.primary,
            themeColors.secondary,
            themeColors.accent,
          ],
        },
      },
      background: {
        color: themeColors.background,
      },
    };
  }, [isDark]);

  // Don't render if not client, not homepage, not enabled, or not loaded
  if (!isClient || !isHomepage || !enabled) {
    if (isClient) {
      console.log("CursorEffects not rendering:", {
        isClient,
        isHomepage,
        enabled,
      });
    }
    return null;
  }

  console.log("Rendering CursorEffects on homepage");

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
      style={{ background: "transparent" }}
    >
      <Particles
        id="cursor-effects"
        init={particlesInit}
        loaded={particlesLoaded}
        options={getCurrentConfig() as any}
        className="w-full h-full"
      />
    </div>
  );
}

// Export configuration for external use
export { subtleConfig as particleConfigs };
