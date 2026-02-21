import { motion } from "framer-motion";
import {
  PenTool,
  BarChart3,
  Shield,
  Zap,
  BookOpen,
  Sparkles,
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
      "Transform your writing with controlled creativity — from conservative polish to full creative rewrite.",
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

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-28">
      <motion.div
        className="text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fade}
        custom={0}
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Features
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Everything You Need to Write Better
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          A research-grade NLP toolkit wrapped in a clean, intuitive interface.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="group relative rounded-2xl border border-border/60 bg-card p-7 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.04]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fade}
            custom={i}
          >
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
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
  );
}
