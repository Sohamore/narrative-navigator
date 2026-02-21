import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { WritingSidebar } from "@/components/WritingSidebar";
import { SmartEditor } from "@/components/SmartEditor";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { analyzeText, enhanceText } from "@/lib/api";

const sampleText = `The morning sun cast long shadows across the empty parking lot. Rahul walked quickly toward the building entrance, his laptop bag slung over one shoulder. He had been working on the project for three months now, and today was the day they would present their findings to the board.

Priya was already inside, setting up the conference room. She arranged the chairs in a semicircle and connected her laptop to the projector. She had spent the entire weekend refining the presentation slides, ensuring every data point was accurate and every chart was clear.

Arjun arrived last, carrying a tray of coffee cups. He distributed them to the team members who had gathered in the hallway. He was nervous about the presentation, but tried to hide it with small talk about the weather.

The presentation went smoothly. Rahul presented the technical findings while Priya handled the financial projections. Arjun managed the Q&A session with confidence. The board members seemed impressed, asking thoughtful questions and nodding approvingly.

After the meeting, the team gathered in Rahul's office to debrief. They discussed what went well and what could be improved for future presentations. The overall consensus was positive, and they celebrated with a lunch at their favorite restaurant.`;

type Highlight = { start: number; end: number; type: "grammar" | "clarity" | "style" | "consistency"; original: string; suggestion: string; reason: string };

function consistencyIssuesToHighlights(issues: { type: string; start: number; end: number; message: string; original?: string; suggestion?: string }[]): Highlight[] {
  const typeMap: Record<string, Highlight["type"]> = { pronoun: "consistency", tense: "grammar", character: "consistency" };
  return issues.map((i) => ({
    start: i.start,
    end: i.end,
    type: (typeMap[i.type] ?? "consistency") as Highlight["type"],
    original: i.original ?? "",
    suggestion: i.suggestion ?? i.original ?? "",
    reason: i.message,
  }));
}

export default function Index() {
  const [text, setText] = useState(sampleText);
  const [writingMode, setWritingMode] = useState("neutral");
  const [creativity, setCreativity] = useState(50);
  const [enhancementLevel, setEnhancementLevel] = useState("moderate");
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [enhancedText, setEnhancedText] = useState("");
  const [editLog, setEditLog] = useState<{ operation: string; original: string; modified: string; reason: string }[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const readingTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeText(text);
      setIsAnalyzed(true);
      setOverallScore(res.overall_score);
      setHighlights(consistencyIssuesToHighlights(res.consistency_issues));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  }, [text]);

  const handleEnhance = useCallback(async () => {
    setIsEnhancing(true);
    try {
      const res = await enhanceText(text, writingMode, enhancementLevel);
      setEnhancedText(res.enhanced_text);
      setEditLog(res.edit_log);
      setOverallScore(res.overall_score ?? 0);
      setIsAnalyzed(true);
      setShowDiff(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Enhancement failed");
    } finally {
      setIsEnhancing(false);
    }
  }, [text, writingMode, enhancementLevel]);

  const handleReset = useCallback(() => {
    setText(sampleText);
    setIsAnalyzed(false);
    setShowDiff(false);
    setEnhancedText("");
    setEditLog([]);
    setHighlights([]);
    setOverallScore(0);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <WritingSidebar
        onAnalyze={handleAnalyze}
        onEnhance={handleEnhance}
        onShowDiff={() => setShowDiff(!showDiff)}
        onReset={handleReset}
        writingMode={writingMode}
        setWritingMode={setWritingMode}
        creativity={creativity}
        setCreativity={setCreativity}
        enhancementLevel={enhancementLevel}
        setEnhancementLevel={setEnhancementLevel}
        isAnalyzing={isAnalyzing}
        isEnhancing={isEnhancing}
      />
      <SmartEditor
        text={text}
        setText={setText}
        enhancedText={enhancedText}
        showDiff={showDiff}
        highlights={isAnalyzed ? highlights : []}
        isAnalyzed={isAnalyzed}
        wordCount={wordCount}
        readingTime={readingTime}
      />
      <AnalysisPanel
        isAnalyzed={isAnalyzed}
        overallScore={overallScore}
        editLog={editLog}
      />
    </div>
  );
}
