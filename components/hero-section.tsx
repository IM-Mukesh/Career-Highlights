// components/hero-section.tsx
"use client";

import { motion } from "framer-motion";
import AnimatedButton from "./animated-button";
import Link from "next/link";
import { useTypewriter, Cursor } from "react-simple-typewriter";

export default function HeroSection() {
  const [text] = useTypewriter({
    words: [
      "React Native Developer",
      "Frontend Engineer",
      "Backend Developer",
      "Full Stack Web & Mobile Developer",
    ],
    loop: true,
    typeSpeed: 100,
    deleteSpeed: 50,
    delaySpeed: 1500,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center text-center px-4 py-12 overflow-hidden bg-gradient-to-br from-background to-muted-background"
    >
      <motion.div
        className="relative z-10 max-w-4xl mx-auto p-6 rounded-xl bg-card/30 backdrop-blur-lg border border-border/50 shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-4 leading-tight drop-shadow-lg"
        >
          Hi, I&apos;m <span className="text-primary">Mukesh </span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-2xl md:text-4xl font-semibold text-muted-foreground mb-8"
        >
          A <span className="text-primary">{text}</span>
          <Cursor cursorColor="#3b82f6" />
        </motion.p>
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-foreground max-w-2xl mx-auto mb-10"
        >
          Passionate about building intuitive and performant mobile
          applications. Let&apos;s create something amazing together.
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link href="#projects" passHref>
            <AnimatedButton>View My Work</AnimatedButton>
          </Link>
          <Link href="#contact" passHref>
            <AnimatedButton variant="outline">Get in Touch</AnimatedButton>
          </Link>
        </motion.div>
      </motion.div>
      {/* Subtle background animation/glassmorphism effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"
        ></motion.div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{
            duration: 2.5,
            delay: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"
        ></motion.div>
      </div>
    </section>
  );
}
