// lib/types.ts
export interface Project {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  href: string;
  techStack: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}
