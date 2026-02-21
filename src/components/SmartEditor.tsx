import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Eye, Columns, X, Check, ArrowRight, AlertTriangle } from "lucide-react";
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
  const [view, setView] = useState<"edit" | "preview" | "diff">("edit");

  const currentView = showDiff ? "diff" : view;

  const highlightCounts = useMemo(() => {
    const counts = { grammar: 0, clarity: 0, style: 0, consistency: 0 };
    highlights.forEach(h => counts[h.type]++);
    return counts;
  }, [highlights]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex-1 flex flex-col min-w-0 h-full"
    >
      {/* Toolbar */}
      <div className="border-b bg-card px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {(["edit", "preview", "diff"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-xs px-3 py-1.5 rounded-md transition-all capitalize flex items-center gap-1.5 ${
                currentView === v
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
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
            <div className="flex items-center gap-2">
              {Object.entries(highlightCounts).map(([type, count]) => (
                count > 0 && (
                  <Badge key={type} variant="outline" className={`text-[10px] py-0 ${typeColors[type]}`}>
                    {count} {typeLabels[type]}
                  </Badge>
                )
              ))}
            </div>
          )}
          <span>{wordCount} words</span>
          <span>~{readingTime} min read</span>
        </div>
      </div>

      {/* Suggestions Bar */}
      {isAnalyzed && highlights.length > 0 && currentView === "edit" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-b bg-muted/30 px-4 py-2 overflow-x-auto"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
            <span className="text-xs text-muted-foreground shrink-0 mr-1">{highlights.length} suggestions:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
              {highlights.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedHighlight(selectedHighlight === h ? null : h)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-md border transition-all hover:shadow-sm ${typeColors[h.type]} ${selectedHighlight === h ? "ring-2 ring-primary/30" : ""}`}
                >
                  <span className="line-clamp-1">"{h.original}"</span>
                </button>
              ))}
            </div>
          </div>

          {/* Suggestion detail */}
          <AnimatePresence>
            {selectedHighlight && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 rounded-lg bg-card border shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge className={typeColors[selectedHighlight.type]}>
                    {typeLabels[selectedHighlight.type]}
                  </Badge>
                  <button onClick={() => setSelectedHighlight(null)}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-destructive line-through">{selectedHighlight.original}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-accent font-medium">{selectedHighlight.suggestion}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">{selectedHighlight.reason}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="gap-1 bg-accent text-accent-foreground hover:bg-accent/90 text-xs h-7">
                    <Check className="w-3 h-3" /> Accept
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => setSelectedHighlight(null)}>
                    <X className="w-3 h-3" /> Reject
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        {currentView === "diff" ? (
          <DiffView original={text} enhanced={enhancedText} />
        ) : (
          <div className="h-full relative">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your text here to begin analysis..."
              className="w-full h-full p-6 resize-none bg-transparent text-foreground text-[15px] leading-relaxed focus:outline-none scrollbar-thin font-sans placeholder:text-muted-foreground/50"
              spellCheck={false}
            />
          </div>
        )}

        {/* Empty state */}
        {!text && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2">
              <FileText className="w-12 h-12 text-muted-foreground/20 mx-auto" />
              <p className="text-muted-foreground/40 text-sm">Start writing or paste your content</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DiffView({ original, enhanced }: { original: string; enhanced: string }) {
  const origLines = original.split("\n");
  const enhLines = enhanced.split("\n");
  const maxLines = Math.max(origLines.length, enhLines.length);

  return (
    <div className="grid grid-cols-2 h-full divide-x">
      <div className="p-4 overflow-y-auto scrollbar-thin">
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Original</p>
        <div className="space-y-1 text-sm leading-relaxed">
          {origLines.map((line, i) => (
            <p key={i} className={line !== (enhLines[i] || "") ? "bg-destructive/10 px-2 py-0.5 rounded" : "px-2 py-0.5"}>
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </div>
      <div className="p-4 overflow-y-auto scrollbar-thin">
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Enhanced</p>
        <div className="space-y-1 text-sm leading-relaxed">
          {enhLines.map((line, i) => (
            <p key={i} className={line !== (origLines[i] || "") ? "bg-accent/10 px-2 py-0.5 rounded" : "px-2 py-0.5"}>
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
