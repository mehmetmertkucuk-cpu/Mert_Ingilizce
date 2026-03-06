"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import type { Flashcard } from "@/lib/mock-data"

interface VocabularyBankContextValue {
  bank: Flashcard[]
  addToBank: (card: Flashcard) => void
  removeFromBank: (id: number) => void
  clearBank: () => void
}

const VocabularyBankContext = createContext<VocabularyBankContextValue | undefined>(undefined)

export function VocabularyBankProvider({ children }: { children: ReactNode }) {
  const [bankMap, setBankMap] = useState<Map<number, Flashcard>>(() => new Map())

  const addToBank = useCallback((card: Flashcard) => {
    setBankMap((prev) => {
      const next = new Map(prev)
      if (!next.has(card.id)) {
        next.set(card.id, card)
      }
      return next
    })
  }, [])

  const removeFromBank = useCallback((id: number) => {
    setBankMap((prev) => {
      if (!prev.has(id)) return prev
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }, [])

  const clearBank = useCallback(() => {
    setBankMap(new Map())
  }, [])

  const value = useMemo(
    () => ({
      bank: Array.from(bankMap.values()),
      addToBank,
      removeFromBank,
      clearBank,
    }),
    [bankMap, addToBank, removeFromBank, clearBank],
  )

  return <VocabularyBankContext.Provider value={value}>{children}</VocabularyBankContext.Provider>
}

export function useVocabularyBank(): VocabularyBankContextValue {
  const ctx = useContext(VocabularyBankContext)
  if (!ctx) {
    throw new Error("useVocabularyBank must be used within a VocabularyBankProvider")
  }
  return ctx
}

