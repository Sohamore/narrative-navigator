import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/[0.04] blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.06),transparent_50%)]" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-4xl text-center"
        initial="hidden"
        animate="visible"
        variants={fade}
        custom={0}
      >
        <motion.div
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-medium text-primary"
          variants={fade}
          custom={0}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          AI-Powered Writing Enhancement
        </motion.div>

        <motion.h1
          className="text-5xl font-bold tracking-tight leading-[1.1] sm:text-6xl lg:text-7xl"
          variants={fade}
          custom={1}
        >
          Write with
          <br />
          <span className="text-gradient">Clarity & Confidence</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          variants={fade}
          custom={2}
        >
          Go beyond grammar. Analyze narrative consistency, transform style,
          and get transparent, measurable improvements — all in one
          intelligent editor.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          variants={fade}
          custom={3}
        >
          <Link to="/editor">
            <Button size="lg" className="h-12 gap-2 rounded-full text-base px-8 shadow-lg shadow-primary/20">
              Start Writing Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="ghost" size="lg" className="h-12 gap-2 rounded-full text-base px-8 text-muted-foreground">
              <Play className="h-4 w-4" /> See How It Works
            </Button>
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p
          className="mt-12 text-sm text-muted-foreground"
          variants={fade}
          custom={4}
        >
          Trusted by <span className="font-semibold text-foreground">10,000+</span> writers, researchers, and content creators
        </motion.p>
      </motion.div>
    </section>
  );
}
