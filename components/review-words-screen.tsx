"use client"

import { useMemo, useState } from "react"
import { Bookmark, PlayCircle, CheckCircle2 } from "lucide-react"
import { useVocabularyBank } from "@/components/vocabulary-bank-context"

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function ReviewWordsScreen() {
  const { bank, removeFromBank } = useVocabularyBank()
  const [isPracticing, setIsPracticing] = useState(false)
  const [practiceOrder, setPracticeOrder] = useState<number[]>([])
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)

  const hasWords = bank.length > 0

  const currentPracticeWord = useMemo(() => {
    if (!isPracticing || !hasWords || practiceOrder.length === 0) return null
    const idx = practiceOrder[practiceIndex]
    return bank[idx]
  }, [isPracticing, hasWords, practiceOrder, practiceIndex, bank])

  const startPracticeFromWord = (wordId: number) => {
    if (!hasWords) return
    const indices = bank.map((_, idx) => idx)
    const selectedIndex = bank.findIndex((w) => w.id === wordId)

    if (selectedIndex > -1) {
      indices.splice(selectedIndex, 1)
      const rest = shuffleArray(indices)
      const order = [selectedIndex, ...rest]
      setPracticeOrder(order)
    } else {
      setPracticeOrder(shuffleArray(indices))
    }

    setPracticeIndex(0)
    setShowMeaning(false)
    setIsPracticing(true)
  }

  const handleNext = () => {
    if (practiceIndex + 1 < practiceOrder.length) {
      setPracticeIndex((prev) => prev + 1)
      setShowMeaning(false)
    } else {
      setIsPracticing(false)
    }
  }

  const handleStop = () => {
    setIsPracticing(false)
  }

  if (!hasWords) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-16 pb-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-9 w-9 text-success" />
        </div>
        <div className="flex flex-col gap-1 max-w-xs">
          <h1 className="text-xl font-bold text-foreground">Great job!</h1>
          <p className="text-sm text-muted-foreground">
            Your vocabulary bank is empty. Keep practicing and mark words as{" "}
            <span className="font-semibold text-foreground">Study Later</span> to see them here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10">
            <Bookmark className="h-5 w-5 text-warning" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">Words to Review</h1>
            <p className="text-xs text-muted-foreground">
              You have {bank.length} word{bank.length !== 1 ? "s" : ""} waiting to be reviewed
            </p>
          </div>
        </div>
      </div>

      {/* Mini practice session */}
      <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
        {isPracticing && currentPracticeWord ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Practice {practiceIndex + 1} of {practiceOrder.length}
              </span>
              <button
                onClick={handleStop}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                End session
              </button>
            </div>
            <div className="rounded-2xl bg-background/80 border border-border/50 p-4 flex flex-col gap-2">
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                {currentPracticeWord.type}
              </span>
              <h2 className="text-xl font-bold text-foreground">{currentPracticeWord.word}</h2>
              {showMeaning && (
                <p className="text-sm text-muted-foreground">
                  {currentPracticeWord.meaning}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMeaning(true)}
                className="flex-1 rounded-xl bg-card/80 border border-border/50 py-2 text-xs font-semibold text-foreground active:scale-[0.97] transition-transform cursor-pointer"
              >
                Show meaning
              </button>
              <button
                onClick={handleNext}
                className="flex-1 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground active:scale-[0.97] transition-transform cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PlayCircle className="h-4 w-4" />
                Next word
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Start a quick review session</p>
            <p className="text-xs text-muted-foreground">
              Tap <span className="font-semibold text-foreground">Practice Now</span> next to any word below to review only
              your vocabulary bank words.
            </p>
          </div>
        )}
      </div>

      {/* Words list */}
      <div className="flex flex-col gap-3">
        {bank.map((word) => (
          <div
            key={word.id}
            className="flex flex-col gap-2 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{word.word}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground capitalize">
                    {word.type}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{word.meaning}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => startPracticeFromWord(word.id)}
                className="flex-1 rounded-xl bg-primary/90 py-2 text-xs font-semibold text-primary-foreground active:scale-[0.97] transition-transform cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PlayCircle className="h-4 w-4" />
                Practice Now
              </button>
              <button
                onClick={() => removeFromBank(word.id)}
                className="flex-1 rounded-xl bg-card/80 border border-border/60 py-2 text-xs font-semibold text-success active:scale-[0.97] transition-transform cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mastered
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

