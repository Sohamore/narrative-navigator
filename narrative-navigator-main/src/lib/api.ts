/**
 * API client for Narrative Navigator backend.
 * Uses Vite proxy: /api -> http://localhost:8001
 */

export interface ConsistencyIssue {
  type: string;
  start: number;
  end: number;
  message: string;
  original?: string;
  suggestion?: string;
}

export interface AnalyzeResponse {
  overall_score: number;
  consistency_issues: ConsistencyIssue[];
  tense_consistency: boolean | null;
  readability_score: number | null;
}

export interface EditLogEntry {
  operation: string;
  original: string;
  modified: string;
  reason: string;
}

export interface EnhanceResponse {
  enhanced_text: string;
  edit_log: EditLogEntry[];
  overall_score: number | null;
}

const API_BASE = "/api";

async function post<T>(path: string, body: object): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    let msg = errText || `API error: ${res.status}`;
    try {
      const parsed = JSON.parse(errText);
      if (parsed.detail) msg = typeof parsed.detail === "string" ? parsed.detail : JSON.stringify(parsed.detail);
    } catch {
      // use errText as-is
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function analyzeText(text: string): Promise<AnalyzeResponse> {
  return post<AnalyzeResponse>("/analyze", { text });
}

export async function enhanceText(
  text: string,
  style: string,
  enhancementLevel: string = "moderate"
): Promise<EnhanceResponse> {
  // Map frontend level names to backend
  const levelMap: Record<string, string> = {
    conservative: "light",
    moderate: "moderate",
    aggressive: "heavy",
  };
  const level = levelMap[enhancementLevel] ?? "moderate";
  return post<EnhanceResponse>("/enhance", { text, style, enhancement_level: level });
}
