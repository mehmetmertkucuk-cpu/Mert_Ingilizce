"use client"

import { useState, useCallback } from "react"
import {
  Shield,
  RefreshCw,
  Database,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Users,
  ChevronLeft,
  Brain,
  BookOpen,
  MessageSquare,
  Clock,
  Flame,
  Target,
  Ban,
  RotateCcw,
  TrendingUp,
  User,
} from "lucide-react"
import {
  resetWordPool,
  getTotalAiGenerated,
  getWordBankSize,
  getAllUsers,
  toggleUserBan,
  resetUserStats,
  getAggregateStats,
  type AppUser,
} from "@/lib/mock-data"

// ---------- User Detail View ----------

function UserDetailView({
  user,
  onBack,
  onBanToggle,
  onResetStats,
}: {
  user: AppUser
  onBack: () => void
  onBanToggle: (email: string) => void
  onResetStats: (email: string) => void
}) {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showBanConfirm, setShowBanConfirm] = useState(false)

  const joinDate = new Date(user.joinedAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const lastActive = new Date(user.lastActiveAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const studyHours = Math.floor(user.stats.totalStudyMinutes / 60)
  const studyMins = user.stats.totalStudyMinutes % 60

  return (
    <div className="flex flex-col gap-5 pb-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground active:scale-95 transition-transform cursor-pointer self-start"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Kullanicilara Don</span>
      </button>

      {/* User header */}
      <div className="flex items-center gap-4 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-5 shadow-sm">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold uppercase ${
            user.isBanned
              ? "bg-destructive/10 text-destructive"
              : user.isActive
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {user.name.charAt(0)}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground truncate">{user.name}</h2>
            {user.isBanned && (
              <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive uppercase">
                Engelli
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] text-muted-foreground">
              Katilim: {joinDate}
            </span>
          </div>
        </div>
      </div>

      {/* Status + Last Active */}
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
          <div
            className={`h-3 w-3 rounded-full ${
              user.isBanned
                ? "bg-destructive"
                : user.isActive
                  ? "bg-success"
                  : "bg-muted-foreground/40"
            }`}
          />
          <span className="text-xs font-medium text-foreground">
            {user.isBanned ? "Engelli" : user.isActive ? "Aktif" : "Pasif"}
          </span>
        </div>
        <div className="flex flex-[2] flex-col items-center gap-1 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
          <span className="text-xs text-muted-foreground">Son Aktivite</span>
          <span className="text-xs font-medium text-foreground">{lastActive}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Brain} label="Ogrenilen Kelime" value={user.stats.wordsLearned} color="text-primary" bg="bg-primary/10" />
        <StatCard icon={BookOpen} label="Calısilan Kelime" value={user.stats.wordsStudied} color="text-secondary-foreground" bg="bg-secondary" />
        <StatCard icon={TrendingUp} label="Tamamlanan Stage" value={user.stats.stagesCompleted} color="text-success" bg="bg-success/10" />
        <StatCard icon={Target} label="Dogruluk" value={`${user.stats.accuracy}%`} color="text-warning" bg="bg-warning/10" />
        <StatCard icon={BookOpen} label="Okunan Pasaj" value={user.stats.readingPassagesRead} color="text-chart-2" bg="bg-chart-2/10" />
        <StatCard icon={MessageSquare} label="AI Tutor Mesaj" value={user.stats.tutorMessages} color="text-chart-5" bg="bg-chart-5/10" />
        <StatCard icon={Clock} label="Calisma Suresi" value={`${studyHours}s ${studyMins}dk`} color="text-primary" bg="bg-primary/10" />
        <StatCard icon={Flame} label="Gunluk Seri" value={`${user.stats.streak} gun`} color="text-chart-4" bg="bg-chart-4/10" />
      </div>

      {/* Questions Breakdown */}
      <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-3">Soru Performansi</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            {user.stats.questionsCorrect} / {user.stats.questionsAnswered} dogru
          </span>
          <span className="text-xs font-bold text-primary">
            {user.stats.questionsAnswered > 0
              ? Math.round((user.stats.questionsCorrect / user.stats.questionsAnswered) * 100)
              : 0}
            %
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${
                user.stats.questionsAnswered > 0
                  ? (user.stats.questionsCorrect / user.stats.questionsAnswered) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      {/* Admin Actions */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Yonetici Islemleri</h3>

        {/* Ban/Unban */}
        {showBanConfirm ? (
          <div className="flex flex-col gap-3 rounded-xl bg-destructive/5 border border-destructive/20 p-4">
            <p className="text-sm font-medium text-foreground">
              {user.isBanned
                ? `${user.name} adli kullanicinin engelini kaldirmak istediginize emin misiniz?`
                : `${user.name} adli kullaniciyi engellemek istediginize emin misiniz?`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onBanToggle(user.email)
                  setShowBanConfirm(false)
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold active:scale-[0.97] transition-all cursor-pointer ${
                  user.isBanned
                    ? "bg-success text-success-foreground"
                    : "bg-destructive text-destructive-foreground"
                }`}
              >
                <Ban className="h-4 w-4" />
                <span>{user.isBanned ? "Engeli Kaldir" : "Engelle"}</span>
              </button>
              <button
                onClick={() => setShowBanConfirm(false)}
                className="flex flex-1 items-center justify-center rounded-xl bg-card border border-border py-3 text-sm font-semibold text-foreground active:scale-[0.97] transition-all cursor-pointer"
              >
                Iptal
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowBanConfirm(true)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold active:scale-[0.97] transition-transform cursor-pointer ${
              user.isBanned
                ? "bg-success/10 border border-success/20 text-success"
                : "bg-destructive/10 border border-destructive/20 text-destructive"
            }`}
          >
            <Ban className="h-4 w-4" />
            <span>{user.isBanned ? "Engeli Kaldir" : "Kullaniciyi Engelle"}</span>
          </button>
        )}

        {/* Reset Stats */}
        {showResetConfirm ? (
          <div className="flex flex-col gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm font-medium text-foreground">
              {user.name} adli kullanicinin tum istatistiklerini sifirlamak istediginize emin misiniz?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onResetStats(user.email)
                  setShowResetConfirm(false)
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-amber-900 active:scale-[0.97] transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Sifirla</span>
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex flex-1 items-center justify-center rounded-xl bg-card border border-border py-3 text-sm font-semibold text-foreground active:scale-[0.97] transition-all cursor-pointer"
              >
                Iptal
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 py-3.5 text-sm font-semibold text-amber-700 active:scale-[0.97] transition-transform cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Istatistikleri Sifirla</span>
          </button>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: typeof Brain
  label: string
  value: string | number
  color: string
  bg: string
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`h-4.5 w-4.5 ${color}`} />
      </div>
      <span className="text-xl font-bold text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground leading-tight">{label}</span>
    </div>
  )
}

// ---------- User List Item ----------

function UserListItem({
  user,
  onSelect,
}: {
  user: AppUser
  onSelect: (user: AppUser) => void
}) {
  return (
    <button
      onClick={() => onSelect(user)}
      className="flex items-center gap-3.5 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer w-full text-left"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold uppercase ${
          user.isBanned
            ? "bg-destructive/10 text-destructive"
            : user.isActive
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {user.name.charAt(0)}
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">{user.name}</span>
          {user.isBanned && (
            <span className="shrink-0 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold text-destructive uppercase">
              Engelli
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-sm font-bold text-foreground">{user.stats.wordsLearned}</span>
        <span className="text-[10px] text-muted-foreground">kelime</span>
      </div>
    </button>
  )
}

// ---------- Main Admin Panel ----------

type AdminTab = "overview" | "users"

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")
  const [totalGenerated, setTotalGenerated] = useState(() => getTotalAiGenerated())
  const [poolSize] = useState(() => getWordBankSize())
  const [isResetting, setIsResetting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [users, setUsers] = useState<AppUser[]>(() => getAllUsers())
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null)
  const [aggregateStats, setAggregateStats] = useState(() => getAggregateStats())

  const refreshAll = useCallback(() => {
    setTotalGenerated(getTotalAiGenerated())
    setUsers(getAllUsers())
    setAggregateStats(getAggregateStats())
  }, [])

  const handleReset = useCallback(() => {
    setIsResetting(true)
    setShowConfirm(false)
    setTimeout(() => {
      resetWordPool()
      setTotalGenerated(0)
      setIsResetting(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 2000)
  }, [])

  const handleBanToggle = useCallback(
    (email: string) => {
      toggleUserBan(email)
      refreshAll()
      // Update selected user view
      const updated = getAllUsers().find((u) => u.email === email)
      if (updated) setSelectedUser({ ...updated })
    },
    [refreshAll]
  )

  const handleResetStats = useCallback(
    (email: string) => {
      resetUserStats(email)
      refreshAll()
      const updated = getAllUsers().find((u) => u.email === email)
      if (updated) setSelectedUser({ ...updated })
    },
    [refreshAll]
  )

  // If viewing a single user detail
  if (selectedUser) {
    return (
      <UserDetailView
        user={selectedUser}
        onBack={() => {
          setSelectedUser(null)
          refreshAll()
        }}
        onBanToggle={handleBanToggle}
        onResetStats={handleResetStats}
      />
    )
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <span className="relative inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2.5 py-0.5 shadow-sm shadow-amber-200/50">
            <Shield className="h-3 w-3 text-amber-900" />
            <span className="text-[10px] font-bold text-amber-900 tracking-wide uppercase">Admin</span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-[shimmer_2s_infinite]" />
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Sistem yonetimi ve kullanici kontrolu</p>
      </div>

      {/* Tab switcher */}
      <div className="flex rounded-2xl bg-muted p-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Database className="h-4 w-4" />
          Genel Bakis
        </button>
        <button
          onClick={() => {
            setActiveTab("users")
            refreshAll()
          }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "users"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Kullanicilar
          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
            {users.length}
          </span>
        </button>
      </div>

      {/* ----- OVERVIEW TAB ----- */}
      {activeTab === "overview" && (
        <>
          {/* Aggregate Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-xl font-bold text-foreground">{aggregateStats.totalUsers}</span>
              <span className="text-[10px] text-muted-foreground text-center">Toplam Kullanici</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
              <User className="h-5 w-5 text-success" />
              <span className="text-xl font-bold text-foreground">{aggregateStats.activeUsers}</span>
              <span className="text-[10px] text-muted-foreground text-center">Aktif</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
              <Ban className="h-5 w-5 text-destructive" />
              <span className="text-xl font-bold text-foreground">{aggregateStats.bannedUsers}</span>
              <span className="text-[10px] text-muted-foreground text-center">Engelli</span>
            </div>
          </div>

          {/* AI Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">{totalGenerated}</span>
              <span className="text-xs text-muted-foreground leading-relaxed">
                AI uretilen kelime
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                <Database className="h-5 w-5 text-success" />
              </div>
              <span className="text-2xl font-bold text-foreground">{poolSize}</span>
              <span className="text-xs text-muted-foreground leading-relaxed">
                Havuz boyutu
              </span>
            </div>
          </div>

          {/* Platform-wide stats */}
          <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground mb-3">Platform Istatistikleri</h2>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Toplam Ogrenilen Kelime", value: aggregateStats.totalWordsLearned.toString() },
                { label: "Toplam Calisma", value: `${Math.floor(aggregateStats.totalStudyMinutes / 60)} saat ${aggregateStats.totalStudyMinutes % 60} dk` },
                { label: "Ortalama Dogruluk", value: `${aggregateStats.avgAccuracy}%` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3"
                >
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Progress */}
          <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">AI Uretim Ilerlemesi</h2>
              <button
                onClick={refreshAll}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted active:scale-95 transition-transform cursor-pointer"
                aria-label="Refresh stats"
              >
                <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min((totalGenerated / poolSize) * 100, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {totalGenerated} / {poolSize} kelime
              </span>
              <span className="text-xs font-medium text-primary">
                {Math.round((totalGenerated / poolSize) * 100)}%
              </span>
            </div>
          </div>

          {/* System Reset */}
          <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-amber-200/50 p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-semibold text-foreground">Sistemi Yenile</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tum kelime havuzunu sifirlar ve AI simulasyonu ile yeni mufredat olusturur.
                </p>
              </div>
            </div>

            {showConfirm ? (
              <div className="flex flex-col gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-medium text-amber-900">
                  Emin misiniz? Tum ilerleme sifirlanacak.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    disabled={isResetting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-amber-900 active:scale-[0.97] transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isResetting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-900/30 border-t-amber-900" />
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        <span>Evet, Sifirla</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isResetting}
                    className="flex flex-1 items-center justify-center rounded-xl bg-card border border-border py-3 text-sm font-semibold text-foreground active:scale-[0.97] transition-all disabled:opacity-60 cursor-pointer"
                  >
                    Iptal
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3.5 text-sm font-semibold text-amber-900 shadow-sm active:scale-[0.97] transition-transform cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Sistemi Yenile</span>
              </button>
            )}
          </div>

          {/* System Info */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">Sistem Bilgisi</h2>
            <div className="flex flex-col gap-2">
              {[
                { label: "Kelime Havuzu", value: `${poolSize} kelime` },
                { label: "Stage Boyutu", value: "10 kelime / stage" },
                { label: "AI Modeli", value: "Mert İngilizce v2.1 (sim)" },
                { label: "Zorluk", value: "YDS/YOKDiL Akademik" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3"
                >
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ----- USERS TAB ----- */}
      {activeTab === "users" && (
        <>
          {/* Search / filter bar */}
          <div className="rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {users.length} kayitli kullanici
              </span>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success" /> {aggregateStats.activeUsers} aktif
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> {aggregateStats.totalUsers - aggregateStats.activeUsers - aggregateStats.bannedUsers} pasif
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-destructive" /> {aggregateStats.bannedUsers} engelli
              </span>
            </div>
          </div>

          {/* User list */}
          <div className="flex flex-col gap-2.5">
            {users.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                onSelect={(u) => setSelectedUser(u)}
              />
            ))}
          </div>
        </>
      )}

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-2xl bg-success px-5 py-3 shadow-lg shadow-success/25 animate-in slide-in-from-top-2 fade-in duration-300">
          <CheckCircle2 className="h-5 w-5 text-success-foreground" />
          <span className="text-sm font-semibold text-success-foreground">
            Sistem basariyla yenilendi!
          </span>
        </div>
      )}
    </div>
  )
}
