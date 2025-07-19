"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

// Types
type CursorMode = "bubble" | "magnet" | "trail" | "electron-proton";

interface CursorEffectsProps {
  mode: CursorMode;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  charge?: number; // For electron-proton mode
  type?: "electron" | "proton"; // For electron-proton mode
}

// Custom hooks
const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const updateTheme = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        (window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", updateTheme);
    };
  }, []);

  return theme;
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Main component
const CursorEffects: React.FC<CursorEffectsProps> = ({
  mode,
  className = "fixed inset-0 pointer-events-none z-10",
}) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const magnetElementsRef = useRef<Element[]>([]);

  // Only render on homepage and non-mobile devices
  const shouldRender = pathname === "/" && !isMobile;

  // Color scheme based on theme
  const colors = {
    light: {
      particle: "rgba(59, 130, 246, 0.6)", // blue-500
      trail: "rgba(139, 69, 19, 0.4)", // brown
      electron: "rgba(239, 68, 68, 0.8)", // red-500
      proton: "rgba(34, 197, 94, 0.8)", // green-500
    },
    dark: {
      particle: "rgba(147, 197, 253, 0.8)", // blue-300
      trail: "rgba(251, 191, 36, 0.6)", // amber-400
      electron: "rgba(248, 113, 113, 0.9)", // red-400
      proton: "rgba(74, 222, 128, 0.9)", // green-400
    },
  };

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Particle creation functions
  const createBubbleParticle = (x: number, y: number): Particle => ({
    x: x + (Math.random() - 0.5) * 100,
    y: y + (Math.random() - 0.5) * 100,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2 - 1,
    life: 60,
    maxLife: 60,
    size: Math.random() * 8 + 4,
    opacity: 0.8,
  });

  const createTrailParticle = (x: number, y: number): Particle => ({
    x,
    y,
    vx: 0,
    vy: 0,
    life: 30,
    maxLife: 30,
    size: Math.random() * 4 + 2,
    opacity: 1,
  });

  const createElectronProtonParticle = (
    x: number,
    y: number,
    type: "electron" | "proton"
  ): Particle => ({
    x: x + (Math.random() - 0.5) * 200,
    y: y + (Math.random() - 0.5) * 200,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    life: 120,
    maxLife: 120,
    size: type === "electron" ? 3 : 5,
    opacity: 1,
    charge: type === "electron" ? -1 : 1,
    type,
  });

  // Animation functions
  const updateBubbleParticles = () => {
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.life--;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy -= 0.02; // Gravity
      particle.opacity = particle.life / particle.maxLife;
      return particle.life > 0;
    });
  };

  const updateTrailParticles = () => {
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.life--;
      particle.opacity = particle.life / particle.maxLife;
      return particle.life > 0;
    });
  };

  const updateElectronProtonParticles = () => {
    const mouse = mouseRef.current;

    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.life--;

      // Physics simulation
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const force = (particle.charge! * 0.5) / (distance * 0.01);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        particle.vx += fx * 0.1;
        particle.vy += fy * 0.1;
      }

      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.opacity = particle.life / particle.maxLife;

      return particle.life > 0;
    });
  };

  const updateMagnetEffect = () => {
    const mouse = mouseRef.current;
    magnetElementsRef.current.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = mouse.x - centerX;
      const dy = mouse.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const strength = (150 - distance) / 150;
        const moveX = (dx / distance) * strength * 10;
        const moveY = (dy / distance) * strength * 10;

        (
          el as HTMLElement
        ).style.transform = `translate(${moveX}px, ${moveY}px)`;
      } else {
        (el as HTMLElement).style.transform = "translate(0px, 0px)";
      }
    });
  };

  // Render particles
  const renderParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    particlesRef.current.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;

      let color = colors[theme].particle;
      if (mode === "trail") color = colors[theme].trail;
      if (mode === "electron-proton") {
        color =
          particle.type === "electron"
            ? colors[theme].electron
            : colors[theme].proton;
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  // Main animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Update particles based on mode
    switch (mode) {
      case "bubble":
        updateBubbleParticles();
        break;
      case "trail":
        updateTrailParticles();
        break;
      case "electron-proton":
        updateElectronProtonParticles();
        break;
      case "magnet":
        updateMagnetEffect();
        break;
    }

    // Render particles (except for magnet mode)
    if (mode !== "magnet") {
      renderParticles(ctx);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Effect setup
  useEffect(() => {
    if (!shouldRender) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Setup canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Setup mouse tracking
    document.addEventListener("mousemove", handleMouseMove);

    // Setup magnet elements
    if (mode === "magnet") {
      const updateMagnetElements = () => {
        magnetElementsRef.current = Array.from(
          document.querySelectorAll(
            '[data-magnetic="true"], .magnetic, h1, h2, h3, button, a'
          )
        );
      };

      updateMagnetElements();
      const observer = new MutationObserver(updateMagnetElements);
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Reset transforms for magnet elements
      magnetElementsRef.current.forEach((el) => {
        (el as HTMLElement).style.transform = "";
      });
    };
  }, [shouldRender, mode, theme]);

  // Particle generation based on mouse movement
  useEffect(() => {
    if (!shouldRender || mode === "magnet") return;

    let lastParticleTime = 0;
    const particleInterval = mode === "trail" ? 16 : 100; // 60fps for trail, slower for others

    const generateParticles = () => {
      const now = Date.now();
      if (now - lastParticleTime < particleInterval) return;

      const mouse = mouseRef.current;
      if (mouse.x === 0 && mouse.y === 0) return;

      switch (mode) {
        case "bubble":
          if (Math.random() < 0.3) {
            particlesRef.current.push(createBubbleParticle(mouse.x, mouse.y));
          }
          break;
        case "trail":
          particlesRef.current.push(createTrailParticle(mouse.x, mouse.y));
          break;
        case "electron-proton":
          if (Math.random() < 0.4) {
            const type = Math.random() < 0.6 ? "electron" : "proton";
            particlesRef.current.push(
              createElectronProtonParticle(mouse.x, mouse.y, type)
            );
          }
          break;
      }

      lastParticleTime = now;
    };

    const interval = setInterval(generateParticles, 16);
    return () => clearInterval(interval);
  }, [shouldRender, mode]);

  if (!shouldRender) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    />
  );
};

export default CursorEffects;
