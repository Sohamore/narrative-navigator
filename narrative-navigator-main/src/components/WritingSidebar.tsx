import { useState } from "react";
import {
  Pen, Sliders, BarChart3, Upload, Download, History,
  GitCompare, Wand2, Search, RotateCcw, ChevronDown,
  FileText, Sparkles
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

// Backend-supported styles (value = lowercase for API)
const writingModes = [
  { label: "Neutral", value: "neutral" },
  { label: "Formal", value: "formal" },
  { label: "Casual", value: "casual" },
  { label: "Academic", value: "academic" },
  { label: "Storytelling", value: "storytelling" },
  { label: "Persuasive", value: "persuasive" },
];

const getCreativityLabel = (v: number) => {
  if (v <= 20) return "Minimal edits";
  if (v <= 40) return "Conservative";
  if (v <= 60) return "Balanced";
  if (v <= 80) return "Creative";
  return "Creative rewrite";
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-72 border-r bg-card flex flex-col h-full overflow-y-auto scrollbar-thin"
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">AI Writer</h2>
            <p className="text-xs text-muted-foreground">Script Enhancement</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Writing Mode */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Pen className="w-3.5 h-3.5" /> Writing Mode
          </label>
          <Select value={writingMode} onValueChange={setWritingMode}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border z-50">
              {writingModes.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Creativity Slider */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> Creativity
          </label>
          <Slider
            value={[creativity]}
            onValueChange={([v]) => setCreativity(v)}
            max={100}
            step={1}
            className="py-1"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{creativity}</span>
            <Badge variant="secondary" className="text-xs">{getCreativityLabel(creativity)}</Badge>
          </div>
        </div>

        {/* Enhancement Level */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> Enhancement Level
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["conservative", "moderate", "aggressive"] as const).map(level => (
              <button
                key={level}
                onClick={() => setEnhancementLevel(level)}
                className={`text-xs py-1.5 px-2 rounded-md border transition-all capitalize ${
                  enhancementLevel === level
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Document Tools */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Document Tools
          </label>
          <div className="space-y-1.5">
            <Button variant="outline" size="sm" className="btn-action text-xs">
              <Upload className="w-3.5 h-3.5" /> Upload .txt
            </Button>
            <Button variant="outline" size="sm" className="btn-action text-xs">
              <Download className="w-3.5 h-3.5" /> Download Enhanced
            </Button>
            <Button variant="outline" size="sm" className="btn-action text-xs">
              <History className="w-3.5 h-3.5" /> Version History
            </Button>
            <Button variant="outline" size="sm" className="btn-action text-xs">
              <GitCompare className="w-3.5 h-3.5" /> Compare Versions
            </Button>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
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
            className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isEnhancing ? (
              <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            {isEnhancing ? "Enhancing…" : "Enhance"}
          </Button>
          <div className="grid grid-cols-2 gap-1.5">
            <Button variant="outline" size="sm" onClick={onShowDiff} className="gap-1 text-xs">
              <GitCompare className="w-3.5 h-3.5" /> Diff
            </Button>
            <Button variant="outline" size="sm" onClick={onReset} className="gap-1 text-xs">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          AI Engine Ready
        </div>
      </div>
    </motion.aside>
  );
}
