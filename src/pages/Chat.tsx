import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"

import {
  addChatMessage,
  listChatMessages,
  getProfile,
  ensureProfile,
  listGoals,
  listMissions,
  type ChatMessage,
  type Profile,
  type Goal,
  type Mission,
} from "@/lib/mvpDb"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

function nowTimeZA(iso: string) {
  return new Date(iso).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })
}

function money(amount: number) {
  return `R${Math.round(amount).toLocaleString("en-ZA")}`
}

/**
 * MVP “AI”:
 * - Not a real LLM call (no external API).
 * - Feels intelligent by using user context (profile + goals + missions).
 * - Stores chat history in localStorage.
 */
function maliBrain(input: string, ctx: { profile: Profile; goals: Goal[]; missions: Mission[] }): string {
  const text = input.trim().toLowerCase()

  const { profile, goals, missions } = ctx
  const activeGoals = goals.filter((g) => g.status === "active")
  const topGoal = activeGoals[0]

  // tiny intent detection
  const asksStreak = /streak|days|consistent|habit/.test(text)
  const asksGoals = /goal|goals|target|save for|saving for/.test(text)
  const asksBudget = /budget|spend|expense|transport|takeaway|grocer/.test(text)
  const asksMission = /mission|challenge|today|task|what should i do/.test(text)
  const asksXp = /xp|level|points|badge/.test(text)
  const greeting = /hi|hello|hey|howzit|yo/.test(text)

  if (greeting) {
    return `Howzit! I’m Mali 🐾🙂 Quick check-in: you’re on a ${profile.currentStreak}-day streak and Level ${profile.maliLevel}. Want a mission, a budget tip, or goal progress?`
  }

  if (asksStreak) {
    const tip =
      profile.currentStreak === 0
        ? "Let’s start today with something tiny — even R5 counts."
        : "Keep it simple: one small save per day beats one big save once a month."
    return `Your streak is **${profile.currentStreak} days** (longest: ${profile.longestStreak}). ${tip}`
  }

  if (asksXp) {
    const toNext = 100 - (profile.xpPoints % 100)
    return `You’re **Level ${profile.maliLevel}** with **${profile.xpPoints} XP**. Earn about **${toNext} XP** to hit the next level. Missions and the mini-game are the fastest.`
  }

  if (asksGoals) {
    if (activeGoals.length === 0) {
      return `You don’t have an active goal yet. Create one like **“R200 for school shoes”** — then I’ll help you chip away daily.`
    }

    const lines = activeGoals
      .slice(0, 3)
      .map((g) => {
        const pct = g.targetAmount > 0 ? Math.round((g.savedAmount / g.targetAmount) * 100) : 0
        return `• ${g.title}: ${money(g.savedAmount)} / ${money(g.targetAmount)} (${Math.max(0, Math.min(100, pct))}%)`
      })
      .join("\n")

    const suggestion = topGoal
      ? `Tiny plan: try add **R5–R10** daily. If you add **R10** for 20 days, that’s **R200**.`
      : ""

    return `Here are your active goals:\n${lines}\n\n${suggestion}`
  }

  if (asksMission) {
    const today = missions[0]
    if (!today) return "I can’t find missions right now. Go back to the Dashboard and refresh."
    return `Today’s Mali Mission is: **${today.title}**.\n${today.description}\nReward: **+${today.xpReward} XP**.\n\nWant me to suggest a goal too?`
  }

  if (asksBudget) {
    return `Budget tip time 💡\n\nTry the **50/30/20** idea:\n• 50% Needs (rent, transport, groceries)\n• 30% Wants (outings, takeaways)\n• 20% Savings\n\nIf you’re tight, start with **5% savings** — consistency first. One easy win: cut **1 takeaway** per week and save that amount.`
  }

  // Fallback: give a helpful, short response with context
  if (topGoal) {
    const remaining = Math.max(0, topGoal.targetAmount - topGoal.savedAmount)
    return `I hear you 🙂 If your focus is **${topGoal.title}**, you’ve got **${money(remaining)}** left.\n\nQuick move: do a mission today, then add **R5** to the goal. Want a budget tip or another mission?`
  }

  return `I’m with you 🙂 Tell me what you want help with:\n• “Give me a mission”\n• “Show my goals”\n• “Budget tips”\n• “What’s my streak?”`
}

export default function Chat() {
  const DEMO_USER_ID = "demo-user-001"

  const [profile, setProfile] = useState<Profile | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const p = getProfile(DEMO_USER_ID) ?? ensureProfile({ id: DEMO_USER_ID, email: "demo@maligo.test", fullName: "Demo User" })
    setProfile(p)
    setGoals(listGoals(DEMO_USER_ID))
    setMissions(listMissions())

    const hist = listChatMessages(DEMO_USER_ID)
    if (hist.length === 0) {
      // seed a friendly first message
      const seed = addChatMessage({
        userId: DEMO_USER_ID,
        role: "assistant",
        content: `Hey ${p.fullName}! I’m Mali 🐾🙂 Ask me about your streak, goals, or missions.`,
      })
      setMessages([seed])
    } else {
      setMessages(hist)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const ctx = useMemo(() => {
    if (!profile) return null
    return { profile, goals, missions }
  }, [profile, goals, missions])

  function send(text: string) {
    if (!ctx) return
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg = addChatMessage({ userId: DEMO_USER_ID, role: "user", content: trimmed })
    setMessages((prev) => [...prev, userMsg])

    // "AI" reply
    const reply = maliBrain(trimmed, ctx)
    const botMsg = addChatMessage({ userId: DEMO_USER_ID, role: "assistant", content: reply })
    setMessages((prev) => [...prev, botMsg])

    // refresh profile in case other screens changed it
    const p = getProfile(DEMO_USER_ID)
    if (p) setProfile(p)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input
    setInput("")
    send(text)
  }

  function quickAsk(text: string) {
    send(text)
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Talk to Mali</h1>
            <p className="text-sm text-muted-foreground">
              MVP chatbot that uses your goals + streak to feel “AI-powered”.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/game">Mini-Game</Link>
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Context card */}
          <Card className="border-border/60 lg:col-span-1">
            <CardHeader>
              <CardTitle>Mali Context</CardTitle>
              <CardDescription>What Mali knows (demo)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-border/60 p-3">
                <div className="text-xs text-muted-foreground">Level</div>
                <div className="text-lg font-semibold">{profile?.maliLevel ?? 1}</div>
                <div className="text-xs text-muted-foreground">{profile?.xpPoints ?? 0} XP</div>
              </div>

              <div className="rounded-lg border border-border/60 p-3">
                <div className="text-xs text-muted-foreground">Streak</div>
                <div className="text-lg font-semibold">{profile?.currentStreak ?? 0} days</div>
                <div className="text-xs text-muted-foreground">Longest: {profile?.longestStreak ?? 0}</div>
              </div>

              <div className="rounded-lg border border-border/60 p-3">
                <div className="text-xs text-muted-foreground">Active Goals</div>
                <div className="text-lg font-semibold">{goals.filter((g) => g.status === "active").length}</div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-medium text-muted-foreground">Quick prompts</div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => quickAsk("Give me a mission")}>
                    Today’s mission
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => quickAsk("Show my goals")}>
                    My goals
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => quickAsk("What’s my streak?")}>
                    My streak
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => quickAsk("Budget tips")}>
                    Budget tips
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => quickAsk("XP and level")}>
                    XP / level
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Presentation note: this is “AI-feel” using context rules. Later you can plug in a real LLM (OpenAI) or
                WhatsApp bot.
              </div>
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="border-border/60 lg:col-span-2">
            <CardHeader>
              <CardTitle>Chat</CardTitle>
              <CardDescription>Messages are saved locally for the demo</CardDescription>
            </CardHeader>

            <CardContent className="flex h-[70vh] flex-col gap-3">
              <div className="flex-1 overflow-auto rounded-lg border border-border/60 p-3">
                <div className="space-y-3">
                  {messages.map((m) => {
                    const isUser = m.role === "user"
                    return (
                      <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{m.content}</div>
                          <div className={`mt-1 text-[10px] ${isUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {nowTimeZA(m.createdAt)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>
              </div>

              <form onSubmit={onSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Try: "Give me a mission", "Show my goals", "Budget tips"...'
                />
                <Button type="submit">Send</Button>
              </form>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">MVP</Badge>
                <Badge variant="outline">LocalStorage</Badge>
                <Badge variant="outline">Context-based replies</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="py-8 text-center text-xs text-muted-foreground">
          Want a real AI next? We can plug in OpenAI API for proper natural language and keep the same UI.
        </div>
      </div>
    </div>
  )
}