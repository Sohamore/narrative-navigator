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
    description: "AI-powered grammar, clarity, and style corrections with explainable reasoning for every suggestion.",
  },
  {
    icon: BarChart3,
    title: "Writing Analytics",
    description: "Track narrative health, character consistency, and style fingerprints with real-time dashboards.",
  },
  {
    icon: Shield,
    title: "Consistency Engine",
    description: "Detect pronoun ambiguity, tense shifts, and logical contradictions across your entire document.",
  },
  {
    icon: Zap,
    title: "One-Click Enhance",
    description: "Transform your writing with controlled creativity levels — from conservative polish to full creative rewrite.",
  },
  {
    icon: BookOpen,
    title: "Edit Transparency",
    description: "Every change is logged with operation type, original text, modification, and the reason behind it.",
  },
  {
    icon: Sparkles,
    title: "Style Control",
    description: "Choose from 9 writing modes including Academic, Storytelling, Marketing, and more.",
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
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/30 glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5 font-display font-semibold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-sm">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>
              AI <span className="text-gradient">Writer</span>
            </span>
          </div>
          <Link to="/editor">
            <Button size="sm" className="gap-1.5 bg-gradient-to-r from-primary to-primary/80 shadow-glow-sm hover:shadow-glow transition-all duration-300 btn-glow font-medium">
              Open Editor <ArrowRight className="ml-0.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center px-6 pt-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[100px]" />
          <div className="absolute top-1/2 left-0 h-[300px] w-[300px] rounded-full bg-warning/3 blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <motion.div
          className="relative z-10 mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={fade}
          custom={0}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground shadow-soft"
            variants={fade}
            custom={0}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Writing Enhancement
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-display"
            variants={fade}
            custom={1}
          >
            Write with{" "}
            <span className="text-gradient-vivid">Clarity & Confidence</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed"
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
              <Button size="lg" className="gap-2 text-base px-8 bg-gradient-to-r from-primary to-primary/80 shadow-glow hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300 btn-glow font-medium h-12">
                Start Writing <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="text-base px-8 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-300 h-12">
                See Features
              </Button>
            </a>
          </motion.div>

          {/* Metrics strip */}
          <motion.div
            className="mt-16 flex justify-center gap-6 sm:gap-10"
            variants={fade}
            custom={4}
          >
            {metrics.map((m) => (
              <div key={m.label} className="text-center glass rounded-xl px-6 py-4 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
                <p className="text-2xl font-bold font-display text-gradient">{m.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{m.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fade}
          custom={0}
        >
          <h2 className="text-3xl font-bold sm:text-4xl font-display">
            Everything You Need to Write Better
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            A research-grade NLP toolkit wrapped in a clean, intuitive interface.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group gradient-border rounded-xl p-6 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fade}
              custom={i}
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300 group-hover:shadow-glow-sm">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold font-display">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/30 bg-gradient-to-b from-card to-background">
        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fade}
          custom={0}
        >
          <h2 className="text-3xl font-bold sm:text-4xl font-display">
            Ready to Elevate Your Writing?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Paste your text, hit Analyze, and see measurable improvements in seconds.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {[
              "No sign-up required",
              "Instant analysis",
              "Explainable edits",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5 bg-muted/50 px-4 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {t}
              </span>
            ))}
          </div>
          <Link to="/editor" className="mt-10">
            <Button size="lg" className="gap-2 text-base px-10 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300 btn-glow font-medium h-12">
              Open the Editor <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>© {new Date().getFullYear()} AI Writer. Built with intelligence.</span>
        </div>
      </footer>
    </div>
  );
}
