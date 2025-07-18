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
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormInputs = z.infer<typeof formSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
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
              className="w-full p-3 rounded-md border border-input focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-input/50"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              id="email"
              type="email"
              placeholder="Your Email"
              {...register("email")}
              className="w-full p-3 rounded-md border border-input focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-input/50"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Input
              id="phone"
              type="tel"
              placeholder="Your Phone (Optional)"
              {...register("phone")}
              className="w-full p-3 rounded-md border border-input focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-input/50"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <Textarea
              id="message"
              placeholder="Your Message"
              {...register("message")}
              rows={6}
              className="w-full p-3 rounded-md border border-input focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-input/50"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
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
