"use client";

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";

// Types
interface BubbleOrbProps {
  className?: string;
  orbCount?: number;
  springStrength?: number;
  dampening?: number;
  maxSpeed?: number;
  enableGlow?: boolean;
  enableReflection?: boolean;
  enableDepth?: boolean;
}

interface Orb {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  depth: number;
  life: number;
  maxLife: number;
  hue: number;
  delay: number;
  elasticity: number;
}

// Custom hooks
const useTheme = () => {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  useEffect(() => {
    const updateTheme = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        (window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setTheme(isDark ? "dark" : "light");
    };

    updateTheme();

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
  const [isMobile, setIsMobile] = React.useState(false);

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

// Utility functions
const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

// Main component
const BubbleCursorTrail: React.FC<BubbleOrbProps> = ({
  className = "fixed inset-0 pointer-events-none z-30",
  orbCount = 12,
  springStrength = 0.15,
  dampening = 0.8,
  maxSpeed = 20,
  enableGlow = true,
  enableReflection = true,
  enableDepth = true,
}) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const orbsRef = useRef<Orb[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 });
  const timeRef = useRef(0);

  // Only render on homepage and non-mobile devices
  const shouldRender = pathname === "/" && !isMobile;

  // Theme-based color schemes
  const colorSchemes = useMemo(
    () => ({
      light: {
        primary: { h: 210, s: 100, l: 60 }, // Blue
        secondary: { h: 280, s: 80, l: 70 }, // Purple
        accent: { h: 160, s: 90, l: 55 }, // Teal
        ambient: { r: 255, g: 255, b: 255, a: 0.1 },
        glow: "rgba(59, 130, 246, 0.4)",
      },
      dark: {
        primary: { h: 200, s: 100, l: 70 }, // Light blue
        secondary: { h: 270, s: 90, l: 80 }, // Light purple
        accent: { h: 150, s: 100, l: 65 }, // Light teal
        ambient: { r: 30, g: 30, b: 50, a: 0.2 },
        glow: "rgba(147, 197, 253, 0.6)",
      },
    }),
    []
  );

  // Initialize orbs
  const initializeOrbs = useCallback(() => {
    orbsRef.current = Array.from({ length: orbCount }, (_, i) => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      vx: 0,
      vy: 0,
      size: lerp(8, 20, Math.random()),
      depth: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
      life: 1,
      maxLife: 1,
      hue: Math.random() * 360,
      delay: i * 0.08, // Staggered delay
      elasticity: lerp(0.3, 0.8, Math.random()),
    }));
  }, [orbCount]);

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.lastX = mouseRef.current.x;
    mouseRef.current.lastY = mouseRef.current.y;
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  // Create glossy orb with 3D effects
  const renderOrb = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      orb: Orb,
      colors: typeof colorSchemes.light
    ) => {
      const { x, y, size, depth, life } = orb;
      const adjustedSize = size * depth;
      const opacity = life * (0.6 + depth * 0.4);

      ctx.save();

      // Apply depth-based scaling and positioning
      const scale = 0.5 + depth * 0.5;
      ctx.scale(scale, scale);
      const adjustedX = x / scale;
      const adjustedY = y / scale;

      // Glow effect
      if (enableGlow) {
        const glowGradient = ctx.createRadialGradient(
          adjustedX,
          adjustedY,
          0,
          adjustedX,
          adjustedY,
          adjustedSize * 2.5
        );
        glowGradient.addColorStop(
          0,
          colors.glow.replace(/[\d.]+\)$/g, `${opacity * 0.8})`)
        );
        glowGradient.addColorStop(1, "transparent");

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(adjustedX, adjustedY, adjustedSize * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Main orb body with metallic gradient
      const mainGradient = ctx.createRadialGradient(
        adjustedX - adjustedSize * 0.3,
        adjustedY - adjustedSize * 0.3,
        0,
        adjustedX,
        adjustedY,
        adjustedSize
      );

      // Dynamic color based on theme and orb properties
      const baseHue =
        (colors.primary.h + orb.hue + timeRef.current * 0.5) % 360;
      const lightness = theme === "dark" ? 75 : 65;
      const saturation = theme === "dark" ? 90 : 80;

      mainGradient.addColorStop(
        0,
        `hsla(${baseHue}, ${saturation}%, ${lightness + 15}%, ${opacity})`
      );
      mainGradient.addColorStop(
        0.3,
        `hsla(${baseHue}, ${saturation}%, ${lightness}%, ${opacity})`
      );
      mainGradient.addColorStop(
        0.7,
        `hsla(${baseHue}, ${saturation - 20}%, ${lightness - 20}%, ${opacity})`
      );
      mainGradient.addColorStop(
        1,
        `hsla(${baseHue}, ${saturation - 30}%, ${lightness - 35}%, ${
          opacity * 0.8
        })`
      );

      ctx.fillStyle = mainGradient;
      ctx.beginPath();
      ctx.arc(adjustedX, adjustedY, adjustedSize, 0, Math.PI * 2);
      ctx.fill();

      // Highlight (glossy effect)
      const highlightGradient = ctx.createRadialGradient(
        adjustedX - adjustedSize * 0.4,
        adjustedY - adjustedSize * 0.4,
        0,
        adjustedX - adjustedSize * 0.4,
        adjustedY - adjustedSize * 0.4,
        adjustedSize * 0.6
      );
      highlightGradient.addColorStop(
        0,
        `hsla(${baseHue}, 30%, 95%, ${opacity * 0.9})`
      );
      highlightGradient.addColorStop(
        0.5,
        `hsla(${baseHue}, 40%, 85%, ${opacity * 0.4})`
      );
      highlightGradient.addColorStop(1, "transparent");

      ctx.fillStyle = highlightGradient;
      ctx.beginPath();
      ctx.arc(
        adjustedX - adjustedSize * 0.4,
        adjustedY - adjustedSize * 0.4,
        adjustedSize * 0.6,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Reflection effect
      if (enableReflection) {
        const reflectionGradient = ctx.createLinearGradient(
          adjustedX,
          adjustedY - adjustedSize,
          adjustedX,
          adjustedY + adjustedSize * 0.3
        );
        reflectionGradient.addColorStop(
          0,
          `hsla(0, 0%, 100%, ${opacity * 0.6})`
        );
        reflectionGradient.addColorStop(1, "transparent");

        ctx.fillStyle = reflectionGradient;
        ctx.beginPath();
        ctx.ellipse(
          adjustedX,
          adjustedY - adjustedSize * 0.2,
          adjustedSize * 0.8,
          adjustedSize * 0.4,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.restore();
    },
    [enableGlow, enableReflection, theme]
  );

  // Physics and animation update
  const updateOrbs = useCallback(() => {
    const mouse = mouseRef.current;
    const currentTime = Date.now() * 0.001;
    timeRef.current = currentTime;

    orbsRef.current.forEach((orb, i) => {
      // Calculate delayed target position with organic offset
      const delayFactor = Math.max(0, 1 - orb.delay * i);
      const organicOffset = {
        x: Math.sin(currentTime * 0.8 + i * 0.5) * orb.size * 0.3,
        y: Math.cos(currentTime * 0.6 + i * 0.7) * orb.size * 0.2,
      };

      orb.targetX = lerp(
        orb.targetX,
        mouse.x + organicOffset.x,
        delayFactor * 0.1
      );
      orb.targetY = lerp(
        orb.targetY,
        mouse.y + organicOffset.y,
        delayFactor * 0.1
      );

      // Spring physics with elastic easing
      const dx = orb.targetX - orb.x;
      const dy = orb.targetY - orb.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0.1) {
        // Apply spring force with elasticity
        const springForce = springStrength * orb.elasticity;
        const forceX = dx * springForce;
        const forceY = dy * springForce;

        orb.vx += forceX;
        orb.vy += forceY;

        // Apply elastic easing for natural motion
        const easingFactor = easeOutElastic(Math.min(distance / 100, 1));
        orb.vx *= easingFactor;
        orb.vy *= easingFactor;
      }

      // Velocity damping
      orb.vx *= dampening;
      orb.vy *= dampening;

      // Speed limiting
      const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
      if (speed > maxSpeed) {
        orb.vx = (orb.vx / speed) * maxSpeed;
        orb.vy = (orb.vy / speed) * maxSpeed;
      }

      // Update position
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Update depth based on movement speed for dynamic effect
      const targetDepth = 0.3 + (speed / maxSpeed) * 0.7;
      orb.depth = lerp(orb.depth, targetDepth, 0.1);

      // Life and hue animation
      orb.life = Math.min(1, orb.life + 0.02);
      orb.hue = (orb.hue + 0.5) % 360;
    });
  }, [springStrength, dampening, maxSpeed]);

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with subtle trail effect
    ctx.fillStyle =
      theme === "dark" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateOrbs();

    const colors = colorSchemes[theme];

    // Render orbs in depth order (back to front)
    const sortedOrbs = [...orbsRef.current].sort((a, b) => a.depth - b.depth);

    sortedOrbs.forEach((orb) => {
      renderOrb(ctx, orb, colors);
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [theme, colorSchemes, updateOrbs, renderOrb]);

  // Setup and cleanup
  useEffect(() => {
    if (!shouldRender) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Canvas setup
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("mousemove", handleMouseMove);

    // Initialize orbs and start animation
    initializeOrbs();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shouldRender, animate, handleMouseMove, initializeOrbs]);

  if (!shouldRender) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        filter: "blur(0px)", // Force GPU acceleration
      }}
    />
  );
};

export default BubbleCursorTrail;
