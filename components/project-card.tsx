// components/project-card.tsx
"use client";

import type { Project } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className={`block h-full cursor-pointer`}
        onClick={() => router.push(`/project/${project._id}`)}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${project.title}`}
      >
        <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group bg-card/70 backdrop-blur-sm border border-border/50">
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={project.thumbnail || "/placeholder.svg"}
              alt={project.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary group-hover:text-foreground transition-colors">
              {project.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 mt-auto">
            {project.techStack.map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-secondary/50 backdrop-blur-sm"
              >
                {tech}
              </Badge>
            ))}
          </CardContent>
          <div className="p-4 border-t border-border/30 bg-background/80 flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-base shadow-lg border-2 border-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-colors"
              style={{ boxShadow: "0 2px 16px 0 rgba(0,0,0,0.15)" }}
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.href, "_blank");
              }}
            >
              Visit Project
            </button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
