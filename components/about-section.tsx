// components/about-section.tsx
"use client";

import { motion, easeOut } from "framer-motion";
import Image from "next/image";
import {
  Code,
  Database,
  Layout,
  Smartphone,
  GitBranch,
  Cloud,
} from "lucide-react";
import { FaReact, FaNodeJs, FaAws, FaGithub } from "react-icons/fa";
import {
  SiNextdotjs,
  SiExpress,
  SiMongodb,
  SiTypescript,
} from "react-icons/si";

export default function AboutSection() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <section
      id="about"
      className="py-20 md:py-32 px-4 bg-card text-foreground relative overflow-hidden"
    >
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary drop-shadow-md"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-background/70 backdrop-blur-md p-8 rounded-xl shadow-xl border border-border/50">
          <motion.div
            className="flex justify-center md:justify-end"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Image
              src="https://img-projects.s3.eu-north-1.amazonaws.com/mukesh_image.jpg"
              alt="John Doe"
              width={400}
              height={400}
              className="rounded-full object-cover aspect-square shadow-lg border-4 border-primary/30 transform hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
          <motion.div
            className="text-lg leading-relaxed"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="mb-6 text-muted-foreground">
              Hi, I&apos;m Mukesh Kumar — a passionate full stack developer with{" "}
              <strong className="text-primary">
                2.5+ years of work experience
              </strong>{" "}
              and a strong focus on mobile app development using{" "}
              <strong className="text-primary">React Native</strong>. I've built
              and deployed real-world projects like fantasy sports apps, admin
              dashboards, and location-based systems using technologies like{" "}
              <strong className="text-primary">Node.js</strong>,{" "}
              <strong className="text-primary">Express</strong>,{" "}
              <strong className="text-primary">MongoDB</strong>, and{" "}
              <strong className="text-primary">AWS</strong>.
            </p>
            <p className="mb-6 text-muted-foreground">
              I love turning complex requirements into scalable, clean, and
              user-friendly apps. Whether it&apos;s a frontend in{" "}
              <strong className="text-primary">React</strong> or a backend API
              with <strong className="text-primary">TypeScript</strong>, I care
              deeply about performance, clean architecture, and a great user
              experience.
            </p>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              My Tech Stack
            </h3>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              <motion.div
                variants={iconVariants}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.5 }}
              >
                <div className="flex flex-col items-center text-center">
                  <FaReact className="h-10 w-10 text-primary mb-2" />
                  <span className="text-sm font-bold text-primary">
                    React Native
                  </span>
                </div>
              </motion.div>
              <motion.div
                variants={iconVariants}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex flex-col items-center text-center">
                  <SiTypescript className="h-10 w-10 text-primary mb-2" />
                  <span className="text-sm font-bold text-primary">
                    TypeScript
                  </span>
                </div>
              </motion.div>
              <motion.div
                variants={iconVariants}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-col items-center text-center">
                  <FaReact className="h-10 w-10 text-primary mb-2" />
                  <span className="text-sm font-bold text-primary">
                    ReactJs
                  </span>
                </div>
              </motion.div>
              <motion.div
                variants={iconVariants}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-col items-center text-center">
                  <SiNextdotjs className="h-10 w-10 text-primary mb-2" />
                  <span className="text-sm font-bold text-primary">NextJs</span>
                </div>
              </motion.div>
              <motion.div
                variants={iconVariants}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-col items-center text-center">
                  <FaNodeJs className="h-10 w-10 text-primary mb-2" />
                  <span className="text-sm font-bold text-primary">NodeJs</span>
                </div>
              </motion.div>
              <motion.div
                variants={iconVariants}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex flex-col items-center text-center">
                  <SiExpress className="h-10 w-10 text-primary mb-2" />
                  <span className="text-sm font-bold text-primary">
                    ExpressJs
                  </span>
                </div>
              </motion.div>
              <motion.div
                variants={iconVariants}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex flex-col items-center text-center">
                  <SiMongodb className="h-10 w-10 text-primary mb-2" />
                  <span className="text-sm font-bold text-primary">
                    MongoDB
                  </span>
                </div>
              </motion.div>
              <motion.div
                variants={iconVariants}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex flex-col items-center text-center">
                  <FaAws className="h-10 w-10 text-primary mb-2" />
                  <span className="text-sm font-bold text-primary">AWS</span>
                </div>
              </motion.div>
              <motion.div
                variants={iconVariants}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex flex-col items-center text-center">
                  <FaGithub className="h-10 w-10 text-primary mb-2" />
                  <span className="text-sm font-medium text-foreground">
                    Git/GitHub
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
