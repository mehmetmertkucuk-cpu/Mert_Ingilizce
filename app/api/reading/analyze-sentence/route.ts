import { NextResponse } from "next/server"
import { z } from "zod"
import { GoogleGenerativeAI } from "@google/generative-ai"

const AnalyzeRequestSchema = z.object({
  sentence: z.string().min(4).max(800),
  provider: z.enum(["gemini"]).optional(),
})

const AnalyzeResponseSchema = z.object({
  sentence: z.string(),
  subject: z.string().min(1),
  verb: z.string().min(1),
  object: z.string().min(1),
  notes: z.array(z.string()).optional(),
})

export const runtime = "nodejs"

function env(name: string): string | undefined {
  const v = process.env[name]
  return v && v.trim() ? v.trim() : undefined
}

function extractJson(text: string): unknown {
  const trimmed = text.trim()
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return JSON.parse(trimmed)
  const start = trimmed.indexOf("{")
  const end = trimmed.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) throw new Error("Model did not return JSON")
  return JSON.parse(trimmed.slice(start, end + 1))
}

function pickProvider(requested?: "gemini"): "gemini" | "demo" {
  if (requested === "gemini") return env("GOOGLE_API_KEY") ? "gemini" : "demo"
  if (env("GOOGLE_API_KEY")) return "gemini"
  return "demo"
}

async function callGemini(jsonPrompt: string): Promise<string> {
  const apiKey = env("GOOGLE_API_KEY")
  if (!apiKey) throw new Error("GOOGLE_API_KEY is not set")
  const modelName = env("GEMINI_MODEL") ?? "gemini-1.5-flash"
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: modelName })

  const res = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "You do grammatical analysis for English sentences. " +
              "Output must be valid JSON only, no extra text. Follow the JSON shape described in this prompt.\n\n" +
              jsonPrompt,
          },
        ],
      },
    ],
  })

  const text = res.response.text()
  if (!text) throw new Error("Gemini response missing text")
  return text
}

function demoAnalyze(sentence: string) {
  // Very naive fallback: subject = text before first verb-like token; verb = first verb-like token; object = rest.
  const tokens = sentence.replace(/\s+/g, " ").trim().split(" ")
  const verbLike = new Set([
    "is",
    "are",
    "was",
    "were",
    "be",
    "being",
    "been",
    "has",
    "have",
    "had",
    "do",
    "does",
    "did",
    "can",
    "could",
    "will",
    "would",
    "should",
    "may",
    "might",
    "must",
  ])
  let verbIdx = tokens.findIndex((t) => verbLike.has(t.toLowerCase().replace(/[.,;:!?()"']/g, "")))
  if (verbIdx === -1) {
    verbIdx = tokens.length === 0 ? 0 : Math.min(1, tokens.length - 1)
  }
  const subject = tokens.slice(0, verbIdx).join(" ") || tokens[0] || "—"
  const verb = tokens[verbIdx] || "—"
  const object = tokens.slice(verbIdx + 1).join(" ") || "—"
  return AnalyzeResponseSchema.parse({
    sentence,
    subject,
    verb,
    object,
    notes: ["Demo mode analysis (heuristic). Add an API key for more accurate parsing."],
  })
}

export async function POST(req: Request) {
  try {
    const parsedReq = AnalyzeRequestSchema.parse(await req.json())
    const provider = pickProvider(parsedReq.provider as "gemini" | undefined)

    if (provider === "demo") {
      return NextResponse.json(demoAnalyze(parsedReq.sentence))
    }

    const jsonPrompt = JSON.stringify(
      {
        task: "Extract Subject-Verb-Object for the given sentence (English).",
        constraints: [
          "Return JSON only, no extra keys beyond: sentence, subject, verb, object, notes (optional).",
          "subject/verb/object should be surface spans from the sentence (not lemmas).",
          "If passive voice: treat grammatical subject as subject; include main verb phrase as verb; object can be agent phrase or '—' if none.",
          "If complex: choose the main clause SVO and mention ambiguities in notes.",
        ],
        sentence: parsedReq.sentence,
        outputShape: {
          sentence: "string",
          subject: "string",
          verb: "string",
          object: "string",
          notes: ["string (optional)"],
        },
      },
      null,
      2,
    )

    const raw = await callGemini(jsonPrompt)
    const candidate = extractJson(raw)
    const validated = AnalyzeResponseSchema.parse(candidate)
    return NextResponse.json(validated)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      {
        error: "SENTENCE_ANALYSIS_FAILED",
        message,
        hint:
          "Set GOOGLE_API_KEY (and optionally GEMINI_MODEL) to enable full sentence analysis.",
      },
      { status: 500 },
    )
  }
}

