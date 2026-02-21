import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Sparkles,
  PenTool,
  BarChart3,
  Shield,
  Zap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: PenTool,
    title: "Smart Editing",
    description:
      "AI-powered grammar, clarity, and style corrections with explainable reasoning for every suggestion.",
  },
  {
    icon: BarChart3,
    title: "Writing Analytics",
    description:
      "Track narrative health, character consistency, and style fingerprints with real-time dashboards.",
  },
  {
    icon: Shield,
    title: "Consistency Engine",
    description:
      "Detect pronoun ambiguity, tense shifts, and logical contradictions across your entire document.",
  },
  {
    icon: Zap,
    title: "One-Click Enhance",
    description:
      "Transform your writing with controlled creativity levels — from conservative polish to full creative rewrite.",
  },
  {
    icon: BookOpen,
    title: "Edit Transparency",
    description:
      "Every change is logged with operation type, original text, modification, and the reason behind it.",
  },
  {
    icon: Sparkles,
    title: "Style Control",
    description:
      "Choose from 9 writing modes including Academic, Storytelling, Marketing, and more.",
  },
];

const metrics = [
  { label: "Readability Boost", value: "+31%" },
  { label: "Clarity Score", value: "94/100" },
  { label: "Time Saved", value: "3× faster" },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>
              AI <span className="text-primary">Writer</span>
            </span>
          </div>
          <Link to="/editor">
            <Button size="sm">
              Open Editor <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center px-6 pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <motion.div
          className="relative z-10 mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={fade}
          custom={0}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground"
            variants={fade}
            custom={0}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Writing Enhancement
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            variants={fade}
            custom={1}
          >
            Write with{" "}
            <span className="text-gradient">Clarity & Confidence</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
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
              <Button size="lg" className="gap-2 text-base px-8">
                Start Writing <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="text-base px-8">
                See Features
              </Button>
            </a>
          </motion.div>

          {/* Metrics strip */}
          <motion.div
            className="mt-16 flex justify-center gap-8 sm:gap-12"
            variants={fade}
            custom={4}
          >
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-2xl font-bold text-primary">{m.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fade}
          custom={0}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything You Need to Write Better
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            A research-grade NLP toolkit wrapped in a clean, intuitive
            interface.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fade}
              custom={i}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card">
        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fade}
          custom={0}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Elevate Your Writing?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Paste your text, hit Analyze, and see measurable improvements in
            seconds.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
            {[
              "No sign-up required",
              "Instant analysis",
              "Explainable edits",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {t}
              </span>
            ))}
          </div>
          <Link to="/editor" className="mt-8">
            <Button size="lg" className="gap-2 text-base px-10">
              Open the Editor <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AI Writer. Built with intelligence.
      </footer>
    </div>
  );
}
