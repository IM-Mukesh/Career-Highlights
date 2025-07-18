"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  // Try to get project data from history state (if navigated from card)
  let projectFromState: Project | null = null;
  if (
    typeof window !== "undefined" &&
    window.history.state &&
    window.history.state.usr &&
    window.history.state.usr.project
  ) {
    projectFromState = window.history.state.usr.project;
  }
  const [project, setProject] = useState<Project | null>(projectFromState);
  const [loading, setLoading] = useState(!projectFromState);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) return;
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/id/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch project");
        return res.json();
      })
      .then((data) => setProject(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, project]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-20">{error}</div>;
  if (!project)
    return <div className="text-center py-20">Project not found.</div>;

  return (
    <section className="py-20 md:py-32 px-4 bg-background text-foreground min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">
          {project.title}
        </h1>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {project.techStack.map((tech, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="text-xs bg-secondary/50 backdrop-blur-sm"
            >
              {tech}
            </Badge>
          ))}
        </div>
        <div className="mb-8 text-lg text-center text-muted-foreground font-medium">
          {project.description}
        </div>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {project.images &&
            project.images.map((img, idx) => (
              <div
                key={idx}
                className="rounded overflow-hidden border border-border/30 shadow-lg bg-white flex items-center justify-center p-2"
                style={{ maxWidth: "100%", maxHeight: "400px" }}
              >
                <img
                  src={img}
                  alt={`Project image ${idx + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    height: "auto",
                    width: "auto",
                    display: "block",
                    objectFit: "contain",
                    borderRadius: "0.5rem",
                  }}
                />
              </div>
            ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xl shadow-lg border-2 border-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-colors"
            style={{ boxShadow: "0 2px 16px 0 rgba(0,0,0,0.15)" }}
            onClick={() => window.open(project.href, "_blank")}
          >
            Visit Project
          </button>
        </div>
      </div>
    </section>
  );
}
