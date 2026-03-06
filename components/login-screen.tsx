"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowRight, User, Mail, Lock } from "lucide-react"

interface LoginScreenProps {
  onLogin: (name: string, email: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.")
      return
    }

    if (isSignUp && !name.trim()) {
      setError("Please enter your name.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLogin(isSignUp ? name.trim() : email.split("@")[0], email.trim())
    }, 800)
  }

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      {/* Top decorative area */}
      <div className="relative flex flex-col items-center justify-center px-6 pt-20 pb-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
        </div>

        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-card shadow-lg shadow-primary/25 border border-border/40 overflow-hidden">
          <img
            src="/app-logo.webp"
            alt="Mert İngilizce logo"
            className="h-full w-full object-contain"
            height={80}
            width={80}
          />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-foreground text-balance text-center">Mert İngilizce</h1>
        <p className="mt-1.5 text-sm text-muted-foreground text-center text-balance">
          Eğlenerek İngilizce
        </p>
      </div>

      {/* Form area */}
      <div className="flex flex-1 flex-col px-6 pb-10">
        {/* Tab switcher */}
        <div className="flex rounded-2xl bg-muted p-1 mb-6">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError("") }}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer ${
              !isSignUp
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError("") }}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer ${
              isSignUp
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name field (sign up only) */}
          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl bg-card/70 backdrop-blur-xl border border-border/50 py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-card/70 backdrop-blur-xl border border-border/50 py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl bg-card/70 backdrop-blur-xl border border-border/50 py-3.5 pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 active:scale-[0.97] transition-all disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            ) : (
              <>
                {isSignUp ? "Create Account" : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or continue with</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Social login */}
        <button
          type="button"
          onClick={() => onLogin("User", "user@example.com")}
          className="flex items-center justify-center gap-2 rounded-xl bg-card/70 backdrop-blur-xl border border-border/50 py-3.5 text-sm font-semibold text-foreground shadow-sm active:scale-[0.97] transition-all cursor-pointer"
        >
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
          {"By continuing, you agree to our "}
          <span className="text-foreground font-medium underline underline-offset-2 cursor-pointer">Terms of Service</span>
          {" and "}
          <span className="text-foreground font-medium underline underline-offset-2 cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
