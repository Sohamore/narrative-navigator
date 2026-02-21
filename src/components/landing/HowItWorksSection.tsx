import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Paste Your Text",
    description: "Drop in any piece of writing — essays, articles, stories, or marketing copy.",
  },
  {
    number: "02",
    title: "Analyze Instantly",
    description: "Our AI scans for grammar, clarity, consistency, and style issues in seconds.",
  },
  {
    number: "03",
    title: "Review & Accept",
    description: "See every suggestion with clear explanations. Accept, reject, or tweak individually.",
  },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fade}
          custom={0}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Three Steps to Better Writing
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.number}
              className="relative text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fade}
              custom={i + 1}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/[0.06]">
                <span className="text-xl font-bold text-primary">{s.number}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+40px)] hidden h-px w-[calc(100%-80px)] bg-border md:block" />
              )}
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
