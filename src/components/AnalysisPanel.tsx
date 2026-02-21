import { motion } from "framer-motion";
import {
  Activity, Users, Fingerprint, FileSearch, Layers,
  TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus
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

function ScoreBar({ score, delay = 0 }: { score: number; delay?: number }) {
  const color =
    score >= 80 ? "bg-accent" :
    score >= 60 ? "bg-primary" :
    score >= 40 ? "bg-warning" : "bg-destructive";

  return (
    <div className="score-bar">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        className={`score-bar-fill ${color}`}
      />
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "stroke-accent" :
    score >= 60 ? "stroke-primary" :
    score >= 40 ? "stroke-warning" : "stroke-destructive";

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" className="stroke-muted" strokeWidth="6" />
        <motion.circle
          cx="40" cy="40" r={radius} fill="none"
          className={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold">{score}</span>
      </div>
    </div>
  );
}

export function AnalysisPanel({ isAnalyzed, overallScore, editLog }: AnalysisPanelProps) {
  if (!isAnalyzed) {
    return (
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 border-l bg-card flex items-center justify-center"
      >
        <div className="text-center space-y-3 p-6">
          <Activity className="w-10 h-10 text-muted-foreground/20 mx-auto" />
          <p className="text-sm text-muted-foreground">Click <span className="font-medium text-foreground">Analyze</span> to see insights</p>
        </div>
      </motion.aside>
    );
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-80 border-l bg-card flex flex-col h-full overflow-y-auto scrollbar-thin"
    >
      {/* Narrative Health Score */}
      <Section icon={<Activity className="w-4 h-4" />} title="Narrative Health">
        <div className="flex items-center gap-4 mb-4">
          <ScoreCircle score={overallScore} />
          <div className="space-y-1">
            <p className="text-sm font-medium">Overall Score</p>
            <p className="text-xs text-muted-foreground">
              {overallScore >= 80 ? "Excellent" : overallScore >= 60 ? "Good" : "Needs work"}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {narrativeMetrics.map((m, i) => (
            <div key={m.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{m.label}</span>
                <span className="font-medium">{m.score}%</span>
              </div>
              <ScoreBar score={m.score} delay={i * 0.1} />
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Character Memory */}
      <Section icon={<Users className="w-4 h-4" />} title="Character Memory">
        <div className="space-y-2">
          {characters.map(c => (
            <div key={c.name} className="metric-card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium flex items-center gap-1.5">
                  {c.name}
                  {c.hasWarning && <AlertTriangle className="w-3 h-3 text-warning" />}
                </p>
                <p className="text-[11px] text-muted-foreground">{c.gender} · {c.role} · {c.mentions} mentions</p>
              </div>
              {c.hasWarning && (
                <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/30">
                  Inconsistency
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Style Fingerprint */}
      <Section icon={<Fingerprint className="w-4 h-4" />} title="Style Fingerprint">
        <div className="space-y-3">
          {styleMetrics.map((m, i) => (
            <div key={m.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{m.label}</span>
                <span className="font-medium">{m.value}</span>
              </div>
              <ScoreBar score={m.pct} delay={i * 0.08} />
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Edit Log */}
      <Section icon={<FileSearch className="w-4 h-4" />} title="Edit Operation Log">
        {editLog.length === 0 ? (
          <p className="text-xs text-muted-foreground">No edits yet. Click Enhance to generate.</p>
        ) : (
          <div className="space-y-2">
            {editLog.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="metric-card text-xs space-y-1"
              >
                <Badge variant="outline" className="text-[10px] uppercase">{e.operation}</Badge>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-destructive line-through text-[11px]">{e.original}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-accent text-[11px]">{e.modified}</span>
                </div>
                <p className="text-muted-foreground text-[11px]">{e.reason}</p>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      <Separator />

      {/* Improvements */}
      <Section icon={<TrendingUp className="w-4 h-4" />} title="Improvement Metrics">
        <div className="grid grid-cols-2 gap-2">
          {improvements.map(imp => (
            <div key={imp.label} className="metric-card text-center space-y-1">
              <p className="text-[11px] text-muted-foreground">{imp.label}</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-xs text-muted-foreground">{imp.from}</span>
                {imp.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3 text-accent" />
                ) : imp.trend === "down" ? (
                  <ArrowDownRight className="w-3 h-3 text-accent" />
                ) : (
                  <Minus className="w-3 h-3 text-muted-foreground" />
                )}
                <span className="text-xs font-medium text-accent">{imp.to}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Suggestions */}
      <Section icon={<Layers className="w-4 h-4" />} title="Smart Suggestions">
        <div className="space-y-1.5">
          {suggestions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="text-xs text-muted-foreground flex items-start gap-2 py-1"
            >
              <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-medium shrink-0 mt-0.5">
                {i + 1}
              </span>
              {s}
            </motion.div>
          ))}
        </div>
      </Section>
    </motion.aside>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 space-y-3">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}
