"use client"

import { useState, useCallback, useMemo } from "react"
import { Home, Brain, BookOpen, Sparkles, LogOut, Shield, Bookmark } from "lucide-react"
import { HomeScreen } from "@/components/home-screen"
import { FlashcardsScreen } from "@/components/flashcards-screen"
import { ReadingScreen } from "@/components/reading-screen"
import { TutorScreen } from "@/components/tutor-screen"
import { LoginScreen } from "@/components/login-screen"
import { AdminPanel } from "@/components/admin-panel"
import { ReviewWordsScreen } from "@/components/review-words-screen"
import { VocabularyBankProvider } from "@/components/vocabulary-bank-context"

const ADMIN_EMAILS = ["admin@example.com", "mehmetmertkucuk@gmail.com"]

const baseTabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "flashcards", label: "Flashcards", icon: Brain },
  { id: "reading", label: "Reading", icon: BookOpen },
  { id: "tutor", label: "AI Tutor", icon: Sparkles },
  { id: "review", label: "Words to Review", icon: Bookmark },
] as const

type TabId = "home" | "flashcards" | "reading" | "tutor" | "review" | "admin"

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>("home")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  const isAdmin = ADMIN_EMAILS.includes(userEmail.toLowerCase())

  const tabs = useMemo(() => {
    const t: { id: TabId; label: string; icon: typeof Home }[] = [...baseTabs]
    if (isAdmin) {
      t.push({ id: "admin", label: "Admin", icon: Shield })
    }
    return t
  }, [isAdmin])

  const handleNavigate = useCallback((tab: string) => {
    setActiveTab(tab as TabId)
  }, [])

  const handleLogin = useCallback((name: string, email: string) => {
    setUserName(name)
    setUserEmail(email)
    setIsLoggedIn(true)
  }, [])

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false)
    setUserName("")
    setUserEmail("")
    setActiveTab("home")
  }, [])

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <VocabularyBankProvider>
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      {/* Top bar with logo, user info + logout */}
      <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-5 pt-3">
        <div className="flex items-center gap-3">
          {/* App logo + name, clickable to go to dashboard */}
          <button
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 rounded-xl bg-card/70 backdrop-blur-xl border border-border/40 px-3 py-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
            aria-label="Go to dashboard"
          >
            <img
              src="/app-logo.webp"
              alt="Mert İngilizce logo"
              className="h-10 w-10 object-contain"
              height={40}
              width={40}
            />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-50">Mert İngilizce</span>
          </button>

          {/* User name + admin badge */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary uppercase">
              {userName.charAt(0)}
            </div>
            <span className="text-sm font-medium text-foreground">{userName}</span>
            {isAdmin && <AdminBadge />}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-card/70 backdrop-blur-xl border border-border/50 shadow-sm active:scale-95 transition-transform cursor-pointer"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-5 pt-14 pb-24">
          {activeTab === "home" && <HomeScreen onNavigate={handleNavigate} userName={userName} />}
          {activeTab === "flashcards" && <FlashcardsScreen />}
          {activeTab === "reading" && <ReadingScreen />}
          {activeTab === "tutor" && <TutorScreen />}
          {activeTab === "review" && <ReviewWordsScreen />}
          {activeTab === "admin" && isAdmin && <AdminPanel />}
        </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-3 mb-3 flex items-center justify-around rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg px-2 py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? tab.id === "admin" ? "bg-amber-500/10" : "bg-primary/10"
                    : "hover:bg-muted/50"
                }`}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive
                      ? tab.id === "admin" ? "text-amber-600" : "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive
                      ? tab.id === "admin" ? "text-amber-600" : "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
      </div>
    </VocabularyBankProvider>
  )
}

/* ---------- Gold Admin Badge ---------- */

function AdminBadge() {
  return (
    <span className="relative inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2.5 py-0.5 shadow-sm shadow-amber-200/60 ring-1 ring-amber-300/80 animate-pulse">
      <Shield className="h-3 w-3 text-amber-900 drop-shadow-[0_0_4px_rgba(251,191,36,0.7)]" />
      <span className="text-[10px] font-bold text-amber-900 tracking-wide uppercase">Admin</span>
      {/* Glow overlay */}
      <span className="pointer-events-none absolute inset-0 rounded-full bg-amber-200/20" />
    </span>
  )
}
