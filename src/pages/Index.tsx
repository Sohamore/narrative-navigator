import { useState, useMemo, useCallback } from "react";
import { WritingSidebar } from "@/components/WritingSidebar";
import { SmartEditor } from "@/components/SmartEditor";
import { AnalysisPanel } from "@/components/AnalysisPanel";

const sampleText = `The morning sun cast long shadows across the empty parking lot. Rahul walked quickly toward the building entrance, his laptop bag slung over one shoulder. He had been working on the project for three months now, and today was the day they would present their findings to the board.

Priya was already inside, setting up the conference room. She arranged the chairs in a semicircle and connected her laptop to the projector. She had spent the entire weekend refining the presentation slides, ensuring every data point was accurate and every chart was clear.

Arjun arrived last, carrying a tray of coffee cups. He distributed them to the team members who had gathered in the hallway. He was nervous about the presentation, but tried to hide it with small talk about the weather.

The presentation went smoothly. Rahul presented the technical findings while Priya handled the financial projections. Arjun managed the Q&A session with confidence. The board members seemed impressed, asking thoughtful questions and nodding approvingly.

After the meeting, the team gathered in Rahul's office to debrief. They discussed what went well and what could be improved for future presentations. The overall consensus was positive, and they celebrated with a lunch at their favorite restaurant.`;

const mockHighlights = [
  { start: 0, end: 10, type: "style" as const, original: "The morning sun cast long shadows", suggestion: "Long shadows stretched across", reason: "More active voice creates stronger imagery" },
  { start: 100, end: 120, type: "clarity" as const, original: "He had been working on the project", suggestion: "He had dedicated three months to the project", reason: "Clearer time reference and stronger verb" },
  { start: 250, end: 270, type: "grammar" as const, original: "She arranged the chairs", suggestion: "She had arranged the chairs", reason: "Past perfect tense for action completed before main event" },
  { start: 450, end: 480, type: "consistency" as const, original: "He was nervous about the presentation", suggestion: "He felt anxious about the presentation", reason: "Consistent emotional vocabulary with prior paragraphs" },
  { start: 600, end: 630, type: "style" as const, original: "seemed impressed, asking thoughtful questions", suggestion: "responded with engaged curiosity, posing incisive questions", reason: "Stronger descriptive language" },
  { start: 700, end: 730, type: "clarity" as const, original: "The overall consensus was positive", suggestion: "The team unanimously viewed the outcome as a success", reason: "More specific and impactful conclusion" },
];

const mockEditLog = [
  { operation: "REPLACE", original: "cast long shadows", modified: "stretched long shadows", reason: "Active voice improvement" },
  { operation: "INSERT", original: "", modified: "with renewed confidence", reason: "Emotional depth enhancement" },
  { operation: "RESTRUCTURE", original: "She arranged... connected...", modified: "Having arranged... she connected...", reason: "Sentence variety improvement" },
  { operation: "DELETE", original: "in order to", modified: "", reason: "Redundant phrase removal" },
  { operation: "REPLACE", original: "seemed impressed", modified: "responded with engaged curiosity", reason: "Stronger descriptive language" },
];

const enhancedSample = `Long shadows stretched across the empty parking lot as the morning sun rose. Rahul strode toward the building entrance, his laptop bag slung over one shoulder. He had dedicated three months to the project, and today marked the moment they would unveil their findings to the board.

Priya was already inside, meticulously preparing the conference room. Having arranged the chairs in a semicircle, she connected her laptop to the projector with practiced efficiency. She had invested the entire weekend in refining the presentation slides, ensuring every data point was precise and every chart communicated its message clearly.

Arjun arrived last, carrying a tray of steaming coffee cups. He distributed them to the team members gathered in the hallway, masking his pre-presentation anxiety with lighthearted remarks about the weather.

The presentation unfolded seamlessly. Rahul delivered the technical findings with renewed confidence while Priya commanded the financial projections. Arjun navigated the Q&A session with poise. The board members responded with engaged curiosity, posing incisive questions and nodding approvingly.

After the meeting, the team convened in Rahul's office for a debrief. They reflected on their strengths and identified opportunities for future improvement. The team unanimously viewed the outcome as a success, celebrating with a well-earned lunch at their favorite restaurant.`;

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
  const [editLog, setEditLog] = useState<typeof mockEditLog>([]);
  const [overallScore, setOverallScore] = useState(0);

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const readingTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);

  const handleAnalyze = useCallback(() => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzed(true);
      setOverallScore(76);
      setIsAnalyzing(false);
    }, 1500);
  }, []);

  const handleEnhance = useCallback(() => {
    setIsEnhancing(true);
    setTimeout(() => {
      setEnhancedText(enhancedSample);
      setEditLog(mockEditLog);
      setOverallScore(89);
      setIsEnhancing(false);
      setShowDiff(true);
    }, 2000);
  }, []);

  const handleReset = useCallback(() => {
    setText(sampleText);
    setIsAnalyzed(false);
    setShowDiff(false);
    setEnhancedText("");
    setEditLog([]);
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
        highlights={isAnalyzed ? mockHighlights : []}
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
