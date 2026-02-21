import { motion } from "framer-motion";

const metrics = [
  { label: "Readability Boost", value: "+31%", description: "Average improvement" },
  { label: "Clarity Score", value: "94", suffix: "/100", description: "Median output score" },
  { label: "Time Saved", value: "3×", description: "Faster than manual editing" },
  { label: "Suggestions", value: "50+", description: "Checks per analysis" },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function MetricsSection() {
  return (
    <section id="metrics" className="relative border-y border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fade}
              custom={i}
            >
              <p className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                {m.value}
                {m.suffix && <span className="text-2xl text-muted-foreground sm:text-3xl">{m.suffix}</span>}
              </p>
              <p className="mt-2 font-medium text-foreground">{m.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
