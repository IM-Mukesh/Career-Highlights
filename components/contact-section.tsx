// components/contact-section.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AnimatedButton from "./animated-button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must be less than 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    })
    .trim()
    .refine((val) => val.length > 0, { message: "Name is required." }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(5, { message: "Email must be at least 5 characters." })
    .max(100, { message: "Email must be less than 100 characters." })
    .toLowerCase()
    .trim(),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Optional field
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(val.replace(/[\s\-\(\)]/g, ""));
      },
      { message: "Please enter a valid phone number." }
    )
    .refine(
      (val) => {
        if (!val) return true;
        return val.length >= 10 && val.length <= 15;
      },
      { message: "Phone number must be between 10-15 digits." }
    ),

  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(1000, { message: "Message must be less than 1000 characters." })
    .trim()
    .refine((val) => val.length > 0, { message: "Message is required." }),
});

type ContactFormInputs = z.infer<typeof formSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ContactFormInputs) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to send message");
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon.",
        variant: "default",
      });
      reset();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-32 px-4 bg-card text-foreground"
    >
      <div className="container mx-auto max-w-3xl">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary drop-shadow-md"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-background/70 backdrop-blur-md p-8 rounded-xl shadow-xl border border-border/50"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div>
            <Input
              id="name"
              placeholder="Your Name"
              {...register("name")}
              className={`w-full p-3 rounded-md border transition-all bg-input/50 ${
                errors.name
                  ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  : "border-input focus:ring-2 focus:ring-primary focus:border-transparent"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Input
              id="email"
              type="email"
              placeholder="Your Email"
              {...register("email")}
              className={`w-full p-3 rounded-md border transition-all bg-input/50 ${
                errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  : "border-input focus:ring-2 focus:ring-primary focus:border-transparent"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Input
              id="phone"
              type="tel"
              placeholder="Your Phone (Optional) - e.g., +1234567890"
              {...register("phone")}
              className={`w-full p-3 rounded-md border transition-all bg-input/50 ${
                errors.phone
                  ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  : "border-input focus:ring-2 focus:ring-primary focus:border-transparent"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <div className="relative">
              <Textarea
                id="message"
                placeholder="Your Message (10-1000 characters)"
                {...register("message")}
                rows={6}
                className={`w-full p-3 rounded-md border transition-all bg-input/50 ${
                  errors.message
                    ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    : "border-input focus:ring-2 focus:ring-primary focus:border-transparent"
                }`}
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {watch("message")?.length || 0}/1000
              </div>
            </div>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.message.message}
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <AnimatedButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </AnimatedButton>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
