// components/social-links.tsx
"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Download } from "lucide-react";
import Link from "next/link";

export default function SocialLinks() {
  const linkVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
    hover: { x: 15, transition: { duration: 0.3, ease: "easeOut" as const } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col space-y-4 p-4 z-50"
    >
      <motion.div variants={linkVariants} whileHover="hover">
        <Link
          href="https://www.linkedin.com/in/ismukeshkumar/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-foreground hover:text-primary transition-colors duration-200 group"
        >
          <Linkedin className="h-7 w-7 group-hover:scale-110 transition-transform" />
          <span className="ml-3 text-lg font-medium hidden md:inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            LinkedIn
          </span>
        </Link>
      </motion.div>
      <motion.div variants={linkVariants} whileHover="hover">
        <Link
          href="https://github.com/IM-Mukesh"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-foreground hover:text-primary transition-colors duration-200 group"
        >
          <Github className="h-7 w-7 group-hover:scale-110 transition-transform" />
          <span className="ml-3 text-lg font-medium hidden md:inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            GitHub
          </span>
        </Link>
      </motion.div>
      <motion.div variants={linkVariants} whileHover="hover">
        <Link
          href="mailto:mukeshk0326@gmail.com"
          className="flex items-center text-foreground hover:text-primary transition-colors duration-200 group"
        >
          <Mail className="h-7 w-7 group-hover:scale-110 transition-transform" />
          <span className="ml-3 text-lg font-medium hidden md:inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Email
          </span>
        </Link>
      </motion.div>
      <motion.div variants={linkVariants} whileHover="hover">
        <a
          href="https://img-projects.s3.eu-north-1.amazonaws.com/Mukesh_Resume.pdf"
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-foreground hover:text-primary transition-colors duration-200 group"
        >
          <Download className="h-7 w-7 group-hover:scale-110 transition-transform" />
          <span className="ml-3 text-lg font-medium hidden md:inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Resume
          </span>
        </a>
      </motion.div>
    </motion.div>
  );
}
