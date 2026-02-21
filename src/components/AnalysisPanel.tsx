import { motion } from "framer-motion";
import {
  Activity, Users, Fingerprint, FileSearch, Layers,
  TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus, Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AnalysisPanelProps {
  isAnalyzed: boolean;
  overallScore: number;
  editLog: EditLogEntry[];
}

interface EditLogEntry {
  operation: string;
  original: string;
  modified: string;
  reason: string;
}

const narrativeMetrics = [
  { label: "Tense Consistency", score: 88 },
  { label: "Character Consistency", score: 72 },
  { label: "Pronoun Clarity", score: 65 },
  { label: "Logical Consistency", score: 91 },
  { label: "Coherence", score: 83 },
];

const characters = [
  { name: "Rahul", gender: "Male", role: "Engineer", mentions: 12, hasWarning: false },
  { name: "Priya", gender: "Female", role: "Designer", mentions: 8, hasWarning: true },
  { name: "Arjun", gender: "Male", role: "Manager", mentions: 5, hasWarning: false },
];

const styleMetrics = [
  { label: "Avg Sentence Length", value: "18 words", pct: 60 },
  { label: "Passive Voice", value: "12%", pct: 12 },
  { label: "Vocabulary Richness", value: "High", pct: 82 },
  { label: "Repetition Score", value: "Low", pct: 20 },
  { label: "Emotional Tone", value: "Neutral", pct: 50 },
];

const improvements = [
  { label: "Readability Score", from: "55", to: "72", trend: "up" as const },
  { label: "Repetition", from: "High", to: "Low", trend: "down" as const },
  { label: "Clarity", from: "Moderate", to: "High", trend: "up" as const },
  { label: "Engagement", from: "Low", to: "Moderate", trend: "up" as const },
];

const suggestions = [
  "Reduce average sentence length in paragraph 3",
  "Remove repeated phrase \"in order to\"",
  "Improve transition between sections 2 and 3",
  "Clarify subject in paragraph 5, sentence 2",
  "Strengthen conclusion with actionable takeaway",
];

const opColors: Record<string, string> = {
  REPLACE: "bg-primary/10 text-primary border-primary/20",
  INSERT: "bg-accent/10 text-accent border-accent/20",
  DELETE: "bg-destructive/10 text-destructive border-destructive/20",
  RESTRUCTURE: "bg-warning/10 text-warning border-warning/20",
};

function ScoreBar({ score, delay = 0 }: { score: number; delay?: number }) {
  const color =
    score >= 80 ? "bg-accent" :
    score >= 60 ? "bg-primary" :
    score >= 40 ? "bg-warning" : "bg-destructive";

  return (
    <div className="score-bar h-1.5 rounded-full bg-muted/80">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        className={`score-bar-fill ${color} rounded-full`}
      />
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "stroke-accent" :
    score >= 60 ? "stroke-primary" :
    score >= 40 ? "stroke-warning" : "stroke-destructive";

  return (
    <div className="relative w-28 h-28">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" className="stroke-muted/50" strokeWidth="5" />
        <motion.circle
          cx="48" cy="48" r={radius} fill="none"
          className={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-2xl font-bold font-display"
        >
          {score}
        </motion.span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">score</span>
      </div>
    </div>
  );
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function AnalysisPanel({ isAnalyzed, overallScore, editLog }: AnalysisPanelProps) {
  if (!isAnalyzed) {
    return (
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 border-l border-border/50 glass flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-4 p-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 text-muted-foreground/30" />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">No Analysis Yet</p>
            <p className="text-xs text-muted-foreground/60">Click <span className="font-semibold text-primary">Analyze</span> to see insights</p>
          </div>
        </motion.div>
      </motion.aside>
    );
  }

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="w-80 border-l border-border/50 glass flex flex-col h-full overflow-y-auto scrollbar-thin"
    >
      {/* Narrative Health Score */}
      <Section icon={<Activity className="w-4 h-4 text-primary" />} title="Narrative Health" delay={0}>
        <div className="flex items-center gap-4 mb-5">
          <ScoreCircle score={overallScore} />
          <div className="space-y-1.5">
            <p className="text-sm font-semibold font-display">Overall Score</p>
            <Badge
              variant="outline"
              className={`text-[10px] font-medium ${
                overallScore >= 80
                  ? "bg-accent/10 text-accent border-accent/30"
                  : overallScore >= 60
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-warning/10 text-warning border-warning/30"
              }`}
            >
              {overallScore >= 80 ? "Excellent" : overallScore >= 60 ? "Good" : "Needs Work"}
            </Badge>
          </div>
        </div>
        <div className="space-y-3.5">
          {narrativeMetrics.map((m, i) => (
            <div key={m.label} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">{m.label}</span>
                <span className="font-semibold tabular-nums">{m.score}%</span>
              </div>
              <ScoreBar score={m.score} delay={0.1 + i * 0.08} />
            </div>
          ))}
        </div>
      </Section>

      <Separator className="opacity-30" />

      {/* Character Memory */}
      <Section icon={<Users className="w-4 h-4 text-primary" />} title="Character Memory" delay={0.2}>
        <div className="space-y-2">
          {characters.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="metric-card flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary">
                  {c.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    {c.name}
                    {c.hasWarning && <AlertTriangle className="w-3 h-3 text-warning" />}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{c.gender} · {c.role} · {c.mentions} mentions</p>
                </div>
              </div>
              {c.hasWarning && (
                <Badge variant="outline" className="text-[9px] bg-warning/10 text-warning border-warning/30 px-2">
                  Inconsistency
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
      </Section>

      <Separator className="opacity-30" />

      {/* Style Fingerprint */}
      <Section icon={<Fingerprint className="w-4 h-4 text-primary" />} title="Style Fingerprint" delay={0.3}>
        <div className="space-y-3.5">
          {styleMetrics.map((m, i) => (
            <div key={m.label} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">{m.label}</span>
                <span className="font-semibold">{m.value}</span>
              </div>
              <ScoreBar score={m.pct} delay={0.3 + i * 0.06} />
            </div>
          ))}
        </div>
      </Section>

      <Separator className="opacity-30" />

      {/* Edit Log */}
      <Section icon={<FileSearch className="w-4 h-4 text-primary" />} title="Edit Operation Log" delay={0.4}>
        {editLog.length === 0 ? (
          <p className="text-xs text-muted-foreground/60 italic">No edits yet. Click Enhance to generate.</p>
        ) : (
          <div className="space-y-2">
            {editLog.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
                className="metric-card text-xs space-y-1.5"
              >
                <Badge variant="outline" className={`text-[9px] uppercase font-semibold tracking-wider ${opColors[e.operation] || ""}`}>
                  {e.operation}
                </Badge>
                <div className="flex items-center gap-1.5 mt-1.5 p-2 rounded-md bg-muted/30">
                  <span className="text-destructive/70 line-through text-[11px]">{e.original}</span>
                  <span className="text-muted-foreground/40">→</span>
                  <span className="text-accent font-medium text-[11px]">{e.modified}</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{e.reason}</p>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      <Separator className="opacity-30" />

      {/* Improvements */}
      <Section icon={<TrendingUp className="w-4 h-4 text-primary" />} title="Improvement Metrics" delay={0.5}>
        <div className="grid grid-cols-2 gap-2">
          {improvements.map((imp, i) => (
            <motion.div
              key={imp.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.06 }}
              className="metric-card text-center space-y-1.5 group hover:shadow-soft"
            >
              <p className="text-[10px] text-muted-foreground font-medium">{imp.label}</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xs text-muted-foreground/60">{imp.from}</span>
                {imp.trend === "up" ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                ) : imp.trend === "down" ? (
                  <ArrowDownRight className="w-3.5 h-3.5 text-accent" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className="text-xs font-bold text-accent">{imp.to}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Separator className="opacity-30" />

      {/* Suggestions */}
      <Section icon={<Layers className="w-4 h-4 text-primary" />} title="Smart Suggestions" delay={0.6}>
        <div className="space-y-1.5">
          {suggestions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="text-xs text-muted-foreground flex items-start gap-2.5 py-1.5 px-2 rounded-lg hover:bg-muted/50 transition-colors cursor-default group"
            >
              <span className="w-5 h-5 rounded-md bg-gradient-to-br from-primary/10 to-accent/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 group-hover:from-primary/20 group-hover:to-accent/20 transition-all">
                {i + 1}
              </span>
              <span className="leading-relaxed">{s}</span>
            </motion.div>
          ))}
        </div>
      </Section>
    </motion.aside>
  );
}

function Section({ icon, title, children, delay = 0 }: { icon: React.ReactNode; title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      variants={fadeUp}
      className="p-4 space-y-3.5"
    >
      <h3 className="section-label">
        {icon} {title}
      </h3>
      {children}
    </motion.div>
  );
}
