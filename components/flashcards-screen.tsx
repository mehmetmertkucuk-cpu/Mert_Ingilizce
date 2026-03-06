"use client"

import { useState, useCallback } from "react"
import { Check, RotateCcw, Shuffle, Sparkles, RefreshCw, Zap } from "lucide-react"
import { fetchNewStageWords, type Flashcard } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useVocabularyBank } from "@/components/vocabulary-bank-context"

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function FlipCard({ card, isFlipped, onFlip }: { card: Flashcard; isFlipped: boolean; onFlip: () => void }) {
  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: "1000px", minHeight: "320px" }}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? `${card.word}: ${card.meaning}` : `Tap to reveal meaning of ${card.word}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onFlip()
        }
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          minHeight: "320px",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-card/70 backdrop-blur-xl border border-border/50 p-8 shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">AI Generated</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground">{card.word}</h2>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground capitalize">
            {card.type}
          </span>
          <p className="text-sm text-muted-foreground mt-2">Tap to flip</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-primary/5 backdrop-blur-xl border border-primary/20 p-8 shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
            {card.type}
          </span>
          <h2 className="text-2xl font-bold text-foreground text-center">{card.meaning}</h2>
          <div className="mt-2 rounded-2xl bg-card/80 border border-border/50 p-4 w-full">
            <p className="text-xs text-muted-foreground mb-1">Example:</p>
            <p className="text-sm text-foreground leading-relaxed italic">
              {'"'}{card.example}{'"'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* AI Loading Notification */
function AiLoadingNotification({ show, isPoolReset }: { show: boolean; isPoolReset: boolean }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-card/90 backdrop-blur-xl border border-primary/20 p-8 shadow-2xl mx-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <Zap className="h-7 w-7 text-primary animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-base font-bold text-foreground">
            {isPoolReset ? "Havuz Yenilendi!" : "Yeni Kelimeler Hazirlaniyor..."}
          </h3>
          <p className="text-sm text-muted-foreground text-center text-balance">
            {isPoolReset
              ? "Tum kelimeler sifirlandi. Yeni mufredat AI tarafindan olusturuldu!"
              : "Yeni kelimeler AI tarafindan hazirlandi!"}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FlashcardsScreen() {
  // Initialize with first stage from the AI pool
  const [deck, setDeck] = useState<Flashcard[]>(() => {
    const { words } = fetchNewStageWords()
    return shuffleArray(words)
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set())
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set())
  const [stage, setStage] = useState(1)
  const [totalSeen, setTotalSeen] = useState(0)
  const [showRoundSummary, setShowRoundSummary] = useState(false)
  const [showAiLoading, setShowAiLoading] = useState(false)
  const [isPoolReset, setIsPoolReset] = useState(false)
  const { toast } = useToast()
  const { addToBank } = useVocabularyBank()

  const currentCard = deck[currentIndex]
  const progress = ((currentIndex + 1) / deck.length) * 100
  const masteredCount = deck.filter((card) => masteredIds.has(card.id)).length
  const pendingCount = deck.filter((card) => pendingIds.has(card.id)).length
  const remainingCount = deck.length - masteredCount - pendingCount

  const goToNext = useCallback(() => {
    setIsFlipped(false)
    setTotalSeen((prev) => prev + 1)

    setTimeout(() => {
      if (currentIndex + 1 >= deck.length) {
        setShowRoundSummary(true)
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    }, 150)
  }, [currentIndex, deck.length])

  const startNextStage = useCallback(() => {
    setShowRoundSummary(false)

    // Show AI loading notification
    setShowAiLoading(true)

    // Capture pending words from the current deck to prioritize them in the next round
    const pendingForNextStage = deck.filter((card) => pendingIds.has(card.id))

    // Simulate AI delay
    setTimeout(() => {
      const cardsNeeded = Math.max(0, 10 - pendingForNextStage.length)
      const { words, isPoolReset: poolReset } = fetchNewStageWords(cardsNeeded)
      setIsPoolReset(poolReset)

      const nextDeck = shuffleArray([...pendingForNextStage, ...words])
      setDeck(nextDeck)
      setCurrentIndex(0)
      setStage((prev) => prev + 1)

      // Show the "ready" notification briefly
      setTimeout(() => {
        setShowAiLoading(false)
        setIsPoolReset(false)
      }, 1500)
    }, 1200)
  }, [deck, pendingIds])

  const handleKnow = useCallback(() => {
    setMasteredIds((prev) => {
      const next = new Set(prev)
      next.add(currentCard.id)
      return next
    })

    setPendingIds((prev) => {
      if (!prev.has(currentCard.id)) return prev
      const next = new Set(prev)
      next.delete(currentCard.id)
      return next
    })

    goToNext()
  }, [currentCard.id, goToNext])

  const handleStudyLater = useCallback(() => {
    setPendingIds((prev) => {
      if (prev.has(currentCard.id)) return prev
      const next = new Set(prev)
      next.add(currentCard.id)
      return next
    })

    addToBank(currentCard)

    toast({
      title: "Study later",
      description: "This word will appear again soon.",
    })

    goToNext()
  }, [addToBank, currentCard, goToNext, toast])

  const handleShuffle = useCallback(() => {
    setIsFlipped(false)
    setDeck((prev) => shuffleArray(prev))
    setCurrentIndex(0)
  }, [])

  // Stage summary screen
  if (showRoundSummary) {
    const knownPercent = deck.length ? Math.round((masteredCount / deck.length) * 100) : 0
    return (
      <div className="flex flex-col items-center gap-6 pb-4 pt-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <RefreshCw className="h-10 w-10 text-primary" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-bold text-foreground">Stage {stage} Complete!</h2>
          <p className="text-sm text-muted-foreground text-center text-balance">
            You mastered {masteredCount} words, but you still need to review {pendingCount} words.
          </p>
          <p className="text-xs text-muted-foreground text-center text-balance mt-1">
            {totalSeen} cards studied in total
          </p>
        </div>

        {/* Round stats */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 px-6 py-4 shadow-sm">
            <span className="text-2xl font-bold text-success">{masteredCount}</span>
            <span className="text-xs text-muted-foreground">Mastered</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 px-6 py-4 shadow-sm">
            <span className="text-2xl font-bold text-warning">{pendingCount}</span>
            <span className="text-xs text-muted-foreground">To Review</span>
          </div>
        </div>

        {/* Accuracy bar */}
        <div className="w-full rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Accuracy</span>
            <span className="text-sm font-bold text-primary">{knownPercent}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${knownPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-primary/5 border border-primary/15 p-4 w-full">
          <Zap className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-foreground leading-relaxed">
            Bir sonraki asamada AI tarafindan olusturulmus <strong>oncelikli tekrar</strong> ve
            <strong> yeni</strong> kelimeler seni bekliyor!
          </p>
        </div>

        <button
          onClick={startNextStage}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 shadow-lg shadow-primary/25 active:scale-[0.97] transition-transform cursor-pointer w-full"
        >
          <Sparkles className="h-5 w-5 text-primary-foreground" />
          <span className="text-sm font-semibold text-primary-foreground">
            Stage {stage + 1} - Yeni Kelimeler
          </span>
        </button>
      </div>
    )
  }

  return (
    <>
      <AiLoadingNotification show={showAiLoading} isPoolReset={isPoolReset} />

      <div className="flex flex-col gap-5 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">AI Flashcards</h1>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                Stage {stage}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentIndex + 1} of {deck.length}
            </p>
          </div>
          <button
            onClick={handleShuffle}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card/70 backdrop-blur-xl border border-border/50 shadow-sm active:scale-95 transition-transform cursor-pointer"
            aria-label="Shuffle cards"
          >
            <Shuffle className="h-4.5 w-4.5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress */}
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Flip Card */}
        <FlipCard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleStudyLater}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 py-4 shadow-sm active:scale-[0.97] transition-transform cursor-pointer"
          >
            <RotateCcw className="h-5 w-5 text-warning" />
            <span className="text-sm font-semibold text-foreground">Study Later</span>
          </button>
          <button
            onClick={handleKnow}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-4 shadow-sm active:scale-[0.97] transition-transform cursor-pointer"
          >
            <Check className="h-5 w-5 text-primary-foreground" />
            <span className="text-sm font-semibold text-primary-foreground">I Know</span>
          </button>
        </div>

        {/* Score */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-bold text-success">{masteredCount}</span>
            <span className="text-xs text-muted-foreground">Mastered</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-bold text-warning">{pendingCount}</span>
            <span className="text-xs text-muted-foreground">Study Later</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-bold text-foreground">
              {remainingCount}
            </span>
            <span className="text-xs text-muted-foreground">Remaining</span>
          </div>
        </div>
      </div>
    </>
  )
}
