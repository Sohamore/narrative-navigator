import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function CTASection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.06),transparent_70%)]" />
      <motion.div
        className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fade}
        custom={0}
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Ready to Elevate
          <br />
          <span className="text-gradient">Your Writing?</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Paste your text, hit Analyze, and see measurable improvements in seconds.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
          {["No sign-up required", "Instant analysis", "Explainable edits"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              {t}
            </span>
          ))}
        </div>
        <Link to="/editor" className="mt-10">
          <Button size="lg" className="h-12 gap-2 rounded-full text-base px-10 shadow-lg shadow-primary/20">
            Open the Editor <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
