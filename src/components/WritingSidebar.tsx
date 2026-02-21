import { useState } from "react";
import {
  Pen, Sliders, BarChart3, Upload, Download, History,
  GitCompare, Wand2, Search, RotateCcw, ChevronDown,
  FileText, Sparkles, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface WritingSidebarProps {
  onAnalyze: () => void;
  onEnhance: () => void;
  onShowDiff: () => void;
  onReset: () => void;
  writingMode: string;
  setWritingMode: (v: string) => void;
  creativity: number;
  setCreativity: (v: number) => void;
  enhancementLevel: string;
  setEnhancementLevel: (v: string) => void;
  isAnalyzing: boolean;
  isEnhancing: boolean;
}

const writingModes = [
  "Neutral", "Formal", "Casual", "Academic", "Technical",
  "Marketing", "Storytelling", "Business Email", "Research Paper"
];

const getCreativityLabel = (v: number) => {
  if (v <= 20) return "Minimal edits";
  if (v <= 40) return "Conservative";
  if (v <= 60) return "Balanced";
  if (v <= 80) return "Creative";
  return "Creative rewrite";
};

const getCreativityColor = (v: number) => {
  if (v <= 30) return "text-muted-foreground";
  if (v <= 60) return "text-primary";
  if (v <= 80) return "text-accent";
  return "text-warning";
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function WritingSidebar({
  onAnalyze, onEnhance, onShowDiff, onReset,
  writingMode, setWritingMode,
  creativity, setCreativity,
  enhancementLevel, setEnhancementLevel,
  isAnalyzing, isEnhancing
}: WritingSidebarProps) {
  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="w-72 border-r glass flex flex-col h-full overflow-y-auto scrollbar-thin"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-sm">
            <Sparkles className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-sm tracking-tight">AI Writer</h2>
            <p className="text-[11px] text-muted-foreground">Script Enhancement</p>
          </div>
        </div>
      </motion.div>

      <div className="p-4 space-y-5 flex-1">
        {/* Writing Mode */}
        <motion.div variants={fadeUp} className="space-y-2.5">
          <label className="section-label">
            <Pen className="w-3.5 h-3.5 text-primary" /> Writing Mode
          </label>
          <Select value={writingMode} onValueChange={setWritingMode}>
            <SelectTrigger className="bg-background/50 border-border/60 hover:bg-background transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border z-50">
              {writingModes.map(m => (
                <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Creativity Slider */}
        <motion.div variants={fadeUp} className="space-y-3">
          <label className="section-label">
            <Sliders className="w-3.5 h-3.5 text-primary" /> Creativity
          </label>
          <Slider
            value={[creativity]}
            onValueChange={([v]) => setCreativity(v)}
            max={100}
            step={1}
            className="py-1"
          />
          <div className="flex justify-between items-center">
            <span className={`text-sm font-semibold tabular-nums ${getCreativityColor(creativity)}`}>
              {creativity}
            </span>
            <Badge variant="secondary" className="text-[10px] font-medium px-2.5 py-0.5 rounded-full">
              {getCreativityLabel(creativity)}
            </Badge>
          </div>
        </motion.div>

        {/* Enhancement Level */}
        <motion.div variants={fadeUp} className="space-y-2.5">
          <label className="section-label">
            <BarChart3 className="w-3.5 h-3.5 text-primary" /> Enhancement Level
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {["conservative", "moderate", "aggressive"].map(level => (
              <button
                key={level}
                onClick={() => setEnhancementLevel(level)}
                className={`text-[11px] py-2 px-2 rounded-lg border transition-all duration-200 capitalize font-medium ${
                  enhancementLevel === level
                    ? "bg-primary text-primary-foreground border-primary shadow-glow-sm scale-[1.02]"
                    : "bg-background/50 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground hover:border-border"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </motion.div>

        <Separator className="opacity-50" />

        {/* Document Tools */}
        <motion.div variants={fadeUp} className="space-y-2.5">
          <label className="section-label">
            <FileText className="w-3.5 h-3.5 text-primary" /> Document Tools
          </label>
          <div className="space-y-1.5">
            {[
              { icon: Upload, label: "Upload .txt" },
              { icon: Download, label: "Download Enhanced" },
              { icon: History, label: "Version History" },
              { icon: GitCompare, label: "Compare Versions" },
            ].map(({ icon: Icon, label }) => (
              <Button
                key={label}
                variant="outline"
                size="sm"
                className="btn-action text-xs bg-background/30 border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-200 group"
              >
                <Icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> {label}
              </Button>
            ))}
          </div>
        </motion.div>

        <Separator className="opacity-50" />

        {/* Actions */}
        <motion.div variants={fadeUp} className="space-y-2.5">
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-glow-sm hover:shadow-glow transition-all duration-300 btn-glow font-medium"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {isAnalyzing ? "Analyzing…" : "Analyze"}
          </Button>
          <Button
            onClick={onEnhance}
            disabled={isEnhancing}
            className="w-full gap-2 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-glow-accent hover:shadow-glow-accent transition-all duration-300 btn-glow font-medium"
          >
            {isEnhancing ? (
              <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            {isEnhancing ? "Enhancing…" : "Enhance"}
          </Button>
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowDiff}
              className="gap-1 text-xs hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-200"
            >
              <GitCompare className="w-3.5 h-3.5" /> Diff
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-1 text-xs hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all duration-200"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div variants={fadeUp} className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <div className="status-dot" />
          <span className="font-medium">AI Engine Ready</span>
        </div>
      </motion.div>
    </motion.aside>
  );
}
