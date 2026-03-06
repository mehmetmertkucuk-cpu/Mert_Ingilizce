"use client"

import { BookOpen, Brain, TrendingUp, Target, ChevronRight, Bookmark } from "lucide-react"
import { useVocabularyBank } from "@/components/vocabulary-bank-context"

interface HomeScreenProps {
  onNavigate: (tab: string) => void
  userName: string
}

export function HomeScreen({ onNavigate, userName }: HomeScreenProps) {
  const { bank } = useVocabularyBank()
  const wordsToReview = bank.length
  return (
    <div className="flex flex-col gap-6 pb-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Welcome back, {userName}</p>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Ready to practice today?
        </h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">48</span>
          <span className="text-xs text-muted-foreground">Words Learned</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <span className="text-xl font-bold text-foreground">7</span>
          <span className="text-xs text-muted-foreground">Day Streak</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
            <Target className="h-5 w-5 text-warning" />
          </div>
          <span className="text-xl font-bold text-foreground">72%</span>
          <span className="text-xs text-muted-foreground">Accuracy</span>
        </div>
      </div>

      {/* Vocabulary bank summary */}
      <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10">
            <Bookmark className="h-5 w-5 text-warning" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">My Vocabulary Bank</span>
            <span className="text-sm font-medium text-foreground">
              You have {wordsToReview} word{wordsToReview !== 1 ? "s" : ""} waiting to be reviewed
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate("review")}
          className="rounded-xl bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary active:scale-[0.97] transition-transform cursor-pointer"
        >
          View
        </button>
      </div>

      {/* Daily Goal Progress */}
      <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Daily Goal</h2>
          <span className="text-sm text-primary font-medium">3/5 complete</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: "60%" }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Complete 2 more activities to reach your daily goal
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-foreground">Quick Start</h2>

        <button
          onClick={() => onNavigate("flashcards")}
          className="flex items-center gap-4 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Brain className="h-6 w-6" />
          </div>
          <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
            <span className="text-sm font-semibold text-foreground">AI Flashcards</span>
            <span className="text-xs text-muted-foreground">Review vocabulary with smart cards</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
        </button>

        <button
          onClick={() => onNavigate("reading")}
          className="flex items-center gap-4 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
            <span className="text-sm font-semibold text-foreground">Reading Practice</span>
            <span className="text-xs text-muted-foreground">Academic passages with questions</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
        </button>
      </div>

      {/* Recent Activity */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-foreground">Recent Words</h2>
        <div className="flex flex-wrap gap-2">
          {["Ubiquitous", "Mitigate", "Paradigm", "Facilitate", "Inherent"].map((word) => (
            <span
              key={word}
              className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium text-secondary-foreground"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
