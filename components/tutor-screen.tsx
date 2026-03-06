"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Sparkles, Bot, User } from "lucide-react"
import { getAIResponse, tutorResponses, type ChatMessage } from "@/lib/mock-data"

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 max-w-[85%]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="rounded-2xl rounded-bl-md bg-card/70 backdrop-blur-xl border border-border/50 px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""} max-w-[85%] ${isUser ? "ml-auto" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-secondary" : "bg-primary"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-secondary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-primary-foreground" />
        )}
      </div>
      <div
        className={`rounded-2xl px-4 py-3 ${
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card/70 backdrop-blur-xl border border-border/50 text-foreground"
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-line">{message.content}</div>
      </div>
    </div>
  )
}

const quickPrompts = [
  "Grammar tips",
  "Vocabulary help",
  "Reading strategies",
  "Exam tips",
]

export function TutorScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: tutorResponses.default,
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsTyping(true)

      // Simulate AI response delay
      setTimeout(() => {
        const response = getAIResponse(text)
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
      }, 800 + Math.random() * 700)
    },
    [isTyping]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      sendMessage(input)
    },
    [input, sendMessage]
  )

  return (
    <div className="flex flex-col h-[calc(100dvh-140px)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col gap-0">
          <h1 className="text-lg font-bold text-foreground">AI Tutor</h1>
          <p className="text-xs text-success font-medium">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4 -mx-5 px-5"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div className="flex gap-2 overflow-x-auto py-2 -mx-1 px-1 scrollbar-none">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="shrink-0 rounded-full bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground active:scale-95 transition-transform cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about YDS/YOKDiL..."
          className="flex-1 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary active:scale-95 transition-transform disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send className="h-5 w-5 text-primary-foreground" />
        </button>
      </form>
    </div>
  )
}
