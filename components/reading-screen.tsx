"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { BookOpen, Clock, Sparkles, CheckCircle2, XCircle, BookmarkPlus, RefreshCw, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useVocabularyBank } from "@/components/vocabulary-bank-context"
import type { Flashcard } from "@/lib/mock-data"

type Level = "Intermediate" | "Advanced" | "Academic"
type Topic = "Science" | "Social Studies" | "Health" | "History" | "Technology"

type ReadingPractice = {
  id: string
  title: string
  passage: string
  questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
  }[]
  keyVocabulary: { word: string; pos: Flashcard["type"]; meaningTr: string; example: string }[]
  meta:
    | { level: Level; topic: Topic; estimatedMinutes: number; source: "llm" | "demo" }
    | { difficulty: Level; topic: string; estimatedMinutes: number; source: "llm" | "demo" }
}

type SentenceAnalysis = {
  sentence: string
  subject: string
  verb: string
  object: string
  notes?: string[]
}

function hashToInt(word: string): number {
  let h = 5381
  for (let i = 0; i < word.length; i++) h = (h * 33) ^ word.charCodeAt(i)
  return 1_000_000_000 + (Math.abs(h) % 900_000_000)
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+(?=[A-Z(])/)
    .filter(Boolean)
}

function tokenize(text: string): string[] {
  return text.split(/(\s+|(?=[.,;:!?])|(?<=[.,;:!?]))/).filter((p) => p.length > 0)
}

function cleanWord(token: string): string {
  return token.replace(/[.,;:!?"'()]/g, "")
}

function toFlashcardFromVocab(v: ReadingPractice["keyVocabulary"][number]): Flashcard {
  return {
    id: hashToInt(v.word.toLowerCase()),
    word: v.word,
    meaning: v.meaningTr,
    type: v.pos,
    example: v.example,
  }
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

function AiLoadingOverlay({ show, label }: { show: boolean; label: string }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-card/90 backdrop-blur-xl border border-primary/20 p-8 shadow-2xl mx-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <Wand2 className="h-7 w-7 text-primary animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-base font-bold text-foreground">{label}</h3>
          <p className="text-sm text-muted-foreground text-center text-balance">
            Creating a fresh YDS/YÖKDİL-style passage and questions…
          </p>
        </div>
      </div>
    </div>
  )
}

function QuestionCard({
  question,
  options,
  correctAnswer,
  questionNumber,
  onAnswered,
}: {
  question: string
  options: string[]
  correctAnswer: number
  questionNumber: number
  onAnswered?: (isCorrect: boolean) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const isAnswered = selected !== null
  const isCorrect = selected === correctAnswer

  return (
    <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-5 shadow-sm">
      <p className="text-sm font-semibold text-foreground mb-4">
        <span className="text-primary mr-1.5">Q{questionNumber}.</span>
        {question}
      </p>
      <div className="flex flex-col gap-2.5">
        {options.map((option, index) => {
          let optionStyle = "bg-muted/50 border-border/50 text-foreground"
          if (isAnswered) {
            if (index === correctAnswer) {
              optionStyle = "bg-success/10 border-success/30 text-foreground"
            } else if (index === selected && !isCorrect) {
              optionStyle = "bg-destructive/10 border-destructive/30 text-foreground"
            } else {
              optionStyle = "bg-muted/30 border-border/30 text-muted-foreground"
            }
          }

          return (
            <button
              key={index}
              onClick={() => {
                if (isAnswered) return
                setSelected(index)
                onAnswered?.(index === correctAnswer)
              }}
              disabled={isAnswered}
              className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer active:scale-[0.98] disabled:cursor-default ${optionStyle}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background/60 text-xs font-semibold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm leading-relaxed flex-1">{option}</span>
              {isAnswered && index === correctAnswer && (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              )}
              {isAnswered && index === selected && !isCorrect && (
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ReadingScreen() {
  const [level, setLevel] = useState<Level>("Advanced")
  const [topic, setTopic] = useState<Topic>("Technology")
  const [practice, setPractice] = useState<ReadingPractice | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const [analysis, setAnalysis] = useState<SentenceAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { toast } = useToast()
  const { bank, addToBank } = useVocabularyBank()

  const vocabIndex = useMemo(() => {
    const m = new Map<string, ReadingPractice["keyVocabulary"][number]>()
    for (const v of practice?.keyVocabulary ?? []) {
      m.set(v.word.toLowerCase(), v)
    }
    return m
  }, [practice?.keyVocabulary])

  const estimatedSeconds = useMemo(() => {
    const minutes = practice?.meta.estimatedMinutes ?? 12
    return minutes * 60
  }, [practice?.meta.estimatedMinutes])

  useEffect(() => {
    if (!practice) return
    setSecondsLeft(estimatedSeconds)
    setIsTimerRunning(true)
    setAnsweredCount(0)
    setCorrectCount(0)
    setAnalysis(null)
  }, [practice, estimatedSeconds])

  useEffect(() => {
    if (!isTimerRunning) return
    if (secondsLeft === null) return
    if (secondsLeft <= 0) return
    const t = setInterval(() => setSecondsLeft((s) => (s === null ? s : Math.max(0, s - 1))), 1000)
    return () => clearInterval(t)
  }, [isTimerRunning, secondsLeft])

  const generateNewPractice = useCallback(async () => {
    setError(null)
    setIsGenerating(true)
    setPractice(null)
    try {
const res = await fetch("/api/reading/generate", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ level: level, topic: topic }), // difficulty yerine level kullanmıştık
})
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message ?? `Request failed (${res.status})`)
      }
      const data = (await res.json()) as ReadingPractice
      setPractice(data)
      toast({
        title: "New practice ready",
        description:
          data.meta.source === "demo"
            ? "Running in demo mode (No Google Gemini API key detected)."
            : "AI generated a brand-new passage.",
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate practice")
      toast({
        title: "Generation failed",
        description: "Please check your API key setup or try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }, [level, topic, toast])

  const addWordToStudyLater = useCallback(
    (rawToken: string) => {
      const token = cleanWord(rawToken)
      const w = token.trim()
      if (!w) return

      const key = w.toLowerCase()
      const vocab = vocabIndex.get(key)
      const card: Flashcard = vocab
        ? toFlashcardFromVocab(vocab)
        : { id: hashToInt(key), word: w, meaning: "—", type: "noun", example: "" }

      const already = bank.some((b) => b.id === card.id)
      addToBank(card)
      toast({
        title: already ? "Already saved" : "Added to Study Later",
        description: already ? `${w} is already in your vocabulary bank.` : `${w} was added to your vocabulary bank.`,
      })
    },
    [addToBank, bank, toast, vocabIndex],
  )

  const analyzeSentence = useCallback(
    async (sentence: string) => {
      setError(null)
      setIsAnalyzing(true)
      try {
        const res = await fetch("/api/reading/analyze-sentence", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sentence }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.message ?? `Request failed (${res.status})`)
        }
        const data = (await res.json()) as SentenceAnalysis
        setAnalysis(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to analyze sentence")
        toast({
          title: "Analysis failed",
          description: "Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsAnalyzing(false)
      }
    },
    [toast],
  )

  const questionProgress = practice?.questions?.length ? (answeredCount / practice.questions.length) * 100 : 0
  const timeProgress = secondsLeft === null ? 0 : (secondsLeft / estimatedSeconds) * 100

  return (
    <>
      <AiLoadingOverlay show={isGenerating} label="Generating practice…" />

      <div className="flex flex-col gap-5 pb-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-bold text-foreground">Reading Practice</h1>
            <p className="text-sm text-muted-foreground">Mert İngilizce ile eğlenerek, YDS/YÖKDİL tarzı okuma pratiği.</p>
          </div>
          <button
            onClick={generateNewPractice}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm active:scale-[0.97] transition-transform disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className="h-4.5 w-4.5" />
            Generate New Passage
          </button>
        </div>

        {/* Setup */}
        <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Level</span>
              <div className="flex gap-2">
                {(["Intermediate", "Advanced", "Academic"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer active:scale-[0.98] ${
                      level === l ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}
                    aria-pressed={level === l}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Topic</span>
              <div className="grid grid-cols-2 gap-2">
                {(["Science", "Social Studies", "Health", "History", "Technology"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer active:scale-[0.98] ${
                      topic === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}
                    aria-pressed={topic === t}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Timer: {practice ? `${practice.meta.estimatedMinutes} min` : "—"}</span>
              </div>
              <button
                onClick={() => practice && setIsTimerRunning((p) => !p)}
                disabled={!practice}
                className="rounded-xl bg-card/80 border border-border/60 px-3 py-2 text-xs font-semibold text-foreground active:scale-[0.98] transition-transform disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                {isTimerRunning ? "Pause" : "Resume"}
              </button>
            </div>
          </div>
        </div>

        {!!error && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-4">
            <p className="text-sm font-semibold text-foreground">Something went wrong</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
        )}

        {/* Reader Mode */}
        {practice ? (
          <div className="flex flex-col gap-4">
            {/* Progress + Timer */}
            <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground text-balance">{practice.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {"level" in practice.meta ? practice.meta.level : practice.meta.difficulty} • {practice.meta.topic} •{" "}
                      {practice.meta.source === "demo" ? "Demo" : "AI"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">
                      {secondsLeft === null ? "—" : formatTime(secondsLeft)}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {answeredCount}/{practice.questions.length} answered • {correctCount} correct
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground">Time remaining</span>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {secondsLeft === null ? "—" : `${Math.round(timeProgress)}%`}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.min(100, timeProgress))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] font-medium text-muted-foreground">Question progress</span>
                  <span className="text-[11px] font-semibold text-muted-foreground">{Math.round(questionProgress)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-success transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.min(100, questionProgress))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Passage */}
            <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border/50 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">Reader Mode</span>
                  <span className="text-[10px] rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
                    Click a sentence to analyze
                  </span>
                </div>
                <button
                  onClick={generateNewPractice}
                  disabled={isGenerating}
                  className="flex items-center gap-2 rounded-xl bg-card/80 border border-border/60 px-3 py-2 text-xs font-semibold text-foreground active:scale-[0.98] transition-transform disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <RefreshCw className="h-4 w-4" />
                  New passage
                </button>
              </div>

              <div className="space-y-3 text-[15px] leading-8 text-foreground/90">
                {practice.passage.split("\n\n").map((paragraph, pIdx) => (
                  <div key={pIdx} className="space-y-2">
                    {splitSentences(paragraph).map((sentence, sIdx) => (
                      <span
                        key={`${pIdx}-${sIdx}`}
                        onClick={() => analyzeSentence(sentence)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            analyzeSentence(sentence)
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-disabled={isAnalyzing}
                        className={`block text-left w-full rounded-xl px-2 py-1 hover:bg-muted/40 transition-colors ${
                          isAnalyzing ? "cursor-wait opacity-80" : "cursor-pointer"
                        }`}
                        aria-label="Analyze sentence"
                      >
                        {tokenize(sentence).map((tok, i) => {
                          const w = cleanWord(tok)
                          const isWord = /[A-Za-z]/.test(w)
                          if (!isWord) return <span key={i}>{tok}</span>
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                addWordToStudyLater(tok)
                              }}
                              className="underline decoration-primary/25 decoration-dotted underline-offset-4 hover:decoration-primary/60 text-foreground cursor-pointer"
                              aria-label={`Add ${w} to Study Later`}
                            >
                              {tok}
                            </button>
                          )
                        })}
                      </span>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-secondary/40 px-3 py-2">
                <BookmarkPlus className="h-4 w-4 text-warning" />
                <span className="text-xs text-muted-foreground">
                  Click any word to add it to <span className="font-semibold text-foreground">Study Later</span>.
                </span>
              </div>
            </div>

            {/* Sentence analysis */}
            {analysis && (
              <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h2 className="text-base font-semibold text-foreground">Analyze Sentence</h2>
                  </div>
                  <button
                    onClick={() => setAnalysis(null)}
                    className="rounded-xl bg-card/80 border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.sentence}</p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <div className="rounded-xl bg-background/80 border border-border/50 p-3">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Subject</span>
                    <p className="text-sm font-semibold text-foreground mt-1">{analysis.subject}</p>
                  </div>
                  <div className="rounded-xl bg-background/80 border border-border/50 p-3">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Verb</span>
                    <p className="text-sm font-semibold text-foreground mt-1">{analysis.verb}</p>
                  </div>
                  <div className="rounded-xl bg-background/80 border border-border/50 p-3">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Object</span>
                    <p className="text-sm font-semibold text-foreground mt-1">{analysis.object}</p>
                  </div>
                </div>
                {!!analysis.notes?.length && (
                  <div className="mt-3 rounded-xl bg-secondary/40 px-3 py-2">
                    <p className="text-xs text-muted-foreground">{analysis.notes.join(" ")}</p>
                  </div>
                )}
              </div>
            )}

            {/* Key vocabulary */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">Key Vocabulary</h2>
                <span className="text-xs text-muted-foreground">{practice.keyVocabulary.length} words</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {practice.keyVocabulary.map((v) => {
                  const card = toFlashcardFromVocab(v)
                  const saved = bank.some((b) => b.id === card.id)
                  return (
                    <div
                      key={v.word}
                      className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-foreground">{v.word}</span>
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground capitalize">
                              {v.pos}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">{v.meaningTr}</span>
                        </div>
                        <button
                          onClick={() => addWordToStudyLater(v.word)}
                          className={`rounded-xl px-3 py-2 text-xs font-semibold active:scale-[0.98] transition-transform cursor-pointer ${
                            saved ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {saved ? "Saved" : "Add"}
                        </button>
                      </div>
                      <div className="mt-3 rounded-xl bg-background/80 border border-border/50 p-3">
                        <p className="text-xs text-muted-foreground mb-1">Example</p>
                        <p className="text-sm text-foreground leading-relaxed italic">{v.example}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Questions */}
            <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Comprehension Questions</h2>
              <span className="text-xs text-muted-foreground">
                {practice.questions.length} question{practice.questions.length !== 1 ? "s" : ""}
              </span>
            </div>
              {practice.questions.map((q, i) => (
                <QuestionCard
                  key={`${practice.id}-${q.id}`}
                  question={q.question}
                  options={q.options}
                  correctAnswer={q.correctAnswer}
                  questionNumber={i + 1}
                  onAnswered={(isCorrect) => {
                    setAnsweredCount((c) => Math.min(practice.questions.length, c + 1))
                    if (isCorrect) setCorrectCount((c) => c + 1)
                  }}
                />
              ))}
              <button
                onClick={generateNewPractice}
                disabled={isGenerating}
                className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 shadow-lg shadow-primary/25 active:scale-[0.97] transition-transform cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-5 w-5 text-primary-foreground" />
                <span className="text-sm font-semibold text-primary-foreground">Next Practice (Infinite)</span>
              </button>
              <div className="flex items-center gap-2 rounded-2xl bg-primary/5 border border-primary/15 p-4">
                <Wand2 className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm text-foreground leading-relaxed">
                  Tip: Click any sentence for SVO breakdown, and click any word to save it for later flashcard review.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-foreground">Choose a level & topic</p>
                <p className="text-xs text-muted-foreground">
                  Then tap <span className="font-semibold text-foreground">Generate New Passage</span> to generate an exam-style passage.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
