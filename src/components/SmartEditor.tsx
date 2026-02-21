import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Eye, Columns, X, Check, ArrowRight, AlertTriangle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Highlight {
  start: number;
  end: number;
  type: "grammar" | "clarity" | "style" | "consistency";
  original: string;
  suggestion: string;
  reason: string;
}

interface SmartEditorProps {
  text: string;
  setText: (v: string) => void;
  enhancedText: string;
  showDiff: boolean;
  highlights: Highlight[];
  isAnalyzed: boolean;
  wordCount: number;
  readingTime: number;
}

const typeColors: Record<string, string> = {
  grammar: "bg-destructive/10 text-destructive border-destructive/30",
  clarity: "bg-warning/10 text-warning border-warning/30",
  style: "bg-primary/10 text-primary border-primary/30",
  consistency: "bg-purple-100 text-purple-700 border-purple-300",
};

const typeDotColors: Record<string, string> = {
  grammar: "bg-destructive",
  clarity: "bg-warning",
  style: "bg-primary",
  consistency: "bg-purple-500",
};

const typeLabels: Record<string, string> = {
  grammar: "Grammar",
  clarity: "Clarity",
  style: "Style",
  consistency: "Consistency",
};

export function SmartEditor({
  text, setText, enhancedText, showDiff, highlights, isAnalyzed, wordCount, readingTime
}: SmartEditorProps) {
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);
  const [dismissedIndexes, setDismissedIndexes] = useState<Set<number>>(new Set());
  const [view, setView] = useState<"edit" | "preview" | "diff">("edit");

  const currentView = showDiff ? "diff" : view;

  const activeHighlights = useMemo(() =>
    highlights.filter((_, i) => !dismissedIndexes.has(i)),
    [highlights, dismissedIndexes]
  );

  const highlightCounts = useMemo(() => {
    const counts = { grammar: 0, clarity: 0, style: 0, consistency: 0 };
    activeHighlights.forEach(h => counts[h.type]++);
    return counts;
  }, [activeHighlights]);

  const handleAccept = (h: Highlight) => {
    const newText = text.replace(h.original, h.suggestion);
    setText(newText);
    const idx = highlights.indexOf(h);
    setDismissedIndexes(prev => new Set(prev).add(idx));
    setSelectedHighlight(null);
  };

  const handleReject = (h: Highlight) => {
    const idx = highlights.indexOf(h);
    setDismissedIndexes(prev => new Set(prev).add(idx));
    setSelectedHighlight(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex-1 flex flex-col min-w-0 h-full"
    >
      {/* Toolbar */}
      <div className="border-b border-border/50 glass px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
          {(["edit", "preview", "diff"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-xs px-3.5 py-1.5 rounded-md transition-all duration-200 capitalize flex items-center gap-1.5 font-medium ${
                currentView === v
                  ? "bg-primary text-primary-foreground shadow-glow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/80"
              }`}
            >
              {v === "edit" && <FileText className="w-3.5 h-3.5" />}
              {v === "preview" && <Eye className="w-3.5 h-3.5" />}
              {v === "diff" && <Columns className="w-3.5 h-3.5" />}
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {isAnalyzed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              {Object.entries(highlightCounts).map(([type, count]) => (
                count > 0 && (
                  <Badge key={type} variant="outline" className={`text-[10px] py-0.5 px-2 ${typeColors[type]} transition-all hover:scale-105`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${typeDotColors[type]} mr-1 inline-block`} />
                    {count} {typeLabels[type]}
                  </Badge>
                )
              ))}
            </motion.div>
          )}
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
            <span className="font-medium tabular-nums">{wordCount}</span>
            <span className="text-muted-foreground/60">words</span>
            <span className="text-border">·</span>
            <span className="font-medium tabular-nums">~{readingTime}</span>
            <span className="text-muted-foreground/60">min</span>
          </div>
        </div>
      </div>

      {/* Suggestions Bar */}
      <AnimatePresence>
        {isAnalyzed && activeHighlights.length > 0 && currentView === "edit" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border/30 bg-gradient-to-r from-warning/5 via-transparent to-primary/5 px-4 py-2.5 overflow-x-auto"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3 h-3 text-warning" />
              </div>
              <span className="text-xs text-muted-foreground shrink-0 mr-1 font-medium">{activeHighlights.length} suggestions</span>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
                {activeHighlights.map((h, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedHighlight(selectedHighlight === h ? null : h)}
                    className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-soft hover:scale-[1.02] ${typeColors[h.type]} ${selectedHighlight === h ? "ring-2 ring-primary/30 shadow-soft scale-[1.02]" : ""}`}
                  >
                    <span className="line-clamp-1 font-medium">"{h.original}"</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Suggestion detail */}
            <AnimatePresence>
              {selectedHighlight && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="mt-2.5 p-4 rounded-xl glass border-border/50 shadow-soft"
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <Badge className={`${typeColors[selectedHighlight.type]} font-medium`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${typeDotColors[selectedHighlight.type]} mr-1.5 inline-block`} />
                      {typeLabels[selectedHighlight.type]}
                    </Badge>
                    <button onClick={() => setSelectedHighlight(null)} className="p-1 rounded-md hover:bg-muted transition-colors">
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3 flex-wrap p-2.5 rounded-lg bg-muted/30">
                      <span className="text-destructive line-through opacity-70">{selectedHighlight.original}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-accent font-semibold">{selectedHighlight.suggestion}</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{selectedHighlight.reason}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="gap-1.5 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:shadow-glow-accent text-xs h-8 font-medium transition-all duration-200"
                      onClick={() => handleAccept(selectedHighlight)}
                    >
                      <Check className="w-3 h-3" /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs h-8 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all duration-200"
                      onClick={() => handleReject(selectedHighlight)}
                    >
                      <X className="w-3 h-3" /> Reject
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Area */}
      <div className="flex-1 relative overflow-hidden bg-background/50">
        {currentView === "diff" ? (
          <DiffView original={text} enhanced={enhancedText} />
        ) : (
          <div className="h-full relative">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your text here to begin analysis..."
              className="w-full h-full p-6 resize-none bg-transparent text-foreground text-[15px] leading-[1.8] focus:outline-none scrollbar-thin font-sans placeholder:text-muted-foreground/40"
              spellCheck={false}
            />
          </div>
        )}

        {/* Empty state */}
        {!text && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground/40 text-sm font-medium">Start writing or paste your content</p>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DiffView({ original, enhanced }: { original: string; enhanced: string }) {
  const origLines = original.split("\n");
  const enhLines = enhanced.split("\n");

  return (
    <div className="grid grid-cols-2 h-full divide-x divide-border/50">
      <div className="p-5 overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-destructive/60" />
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Original</p>
        </div>
        <div className="space-y-1 text-sm leading-relaxed">
          {origLines.map((line, i) => (
            <p key={i} className={line !== (enhLines[i] || "") ? "bg-destructive/8 px-3 py-1 rounded-md border-l-2 border-destructive/30" : "px-3 py-1"}>
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </div>
      <div className="p-5 overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent/60" />
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Enhanced</p>
        </div>
        <div className="space-y-1 text-sm leading-relaxed">
          {enhLines.map((line, i) => (
            <p key={i} className={line !== (origLines[i] || "") ? "bg-accent/8 px-3 py-1 rounded-md border-l-2 border-accent/30" : "px-3 py-1"}>
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
