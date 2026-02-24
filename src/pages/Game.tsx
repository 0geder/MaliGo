import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { grantXp, getProfile, ensureProfile, type Profile } from "@/lib/mvpDb"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

type ExpenseItem = {
  id: string
  name: string
  cost: number
  category: "Needs" | "Wants"
  tip: string
}

const BUDGET = 2000

const ITEMS: ExpenseItem[] = [
  { id: "rent", name: "Rent / Room", cost: 900, category: "Needs", tip: "Try share accommodation to reduce rent." },
  { id: "transport", name: "Transport", cost: 450, category: "Needs", tip: "Compare monthly pass vs daily trips." },
  { id: "groceries", name: "Groceries", cost: 600, category: "Needs", tip: "Plan meals, buy staples, avoid small daily buys." },
  { id: "data", name: "Data / Airtime", cost: 200, category: "Needs", tip: "Bundles are cheaper than out-of-bundle rates." },

  { id: "takeaway", name: "Takeaways", cost: 350, category: "Wants", tip: "Cook 2–3 days/week and save the difference." },
  { id: "streaming", name: "Streaming", cost: 120, category: "Wants", tip: "Cancel unused subscriptions." },
  { id: "clothes", name: "New clothes", cost: 300, category: "Wants", tip: "Delay big wants until you hit a goal milestone." },
  { id: "weekend", name: "Weekend outing", cost: 400, category: "Wants", tip: "Set a weekend cap and stick to it." },
]

function money(amount: number) {
  return `R${Math.round(amount).toLocaleString("en-ZA")}`
}

export default function Game() {
  const DEMO_USER_ID = "demo-user-001"
  const { toast } = useToast()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)

  useEffect(() => {
    const p = getProfile(DEMO_USER_ID) ?? ensureProfile({ id: DEMO_USER_ID, email: "demo@maligo.test", fullName: "Demo User" })
    setProfile(p)
  }, [])

  const total = useMemo(() => {
    return ITEMS.reduce((sum, item) => (selected[item.id] ? sum + item.cost : sum), 0)
  }, [selected])

  const remaining = useMemo(() => BUDGET - total, [total])

  const breakdown = useMemo(() => {
    const picked = ITEMS.filter((i) => selected[i.id])
    const needs = picked.filter((i) => i.category === "Needs").reduce((s, i) => s + i.cost, 0)
    const wants = picked.filter((i) => i.category === "Wants").reduce((s, i) => s + i.cost, 0)
    return { needs, wants, picked }
  }, [selected])

  function toggle(id: string) {
    if (submitted) return
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function reset() {
    setSelected({})
    setSubmitted(false)
    setXpEarned(0)
  }

  function scoreAndSubmit() {
    if (submitted) return

    // Simple scoring:
    // - must include at least 2 needs to be considered "stable"
    // - staying within budget gives more XP
    // - picking fewer wants gives bonus XP
    const needsCount = breakdown.picked.filter((i) => i.category === "Needs").length
    const wantsCount = breakdown.picked.filter((i) => i.category === "Wants").length

    let xp = 0

    if (needsCount >= 2) xp += 25
    else xp += 10

    if (total <= BUDGET) {
      // closer to 0 remaining => okay, but still within budget is good
      xp += 35
      if (remaining >= 100) xp += 10 // left something for savings
      if (remaining >= 250) xp += 10
    } else {
      // over budget penalty
      xp += 10
    }

    // Encourage limiting wants
    if (wantsCount === 0) xp += 20
    else if (wantsCount === 1) xp += 12
    else if (wantsCount === 2) xp += 6

    // Cap XP for MVP
    xp = Math.max(10, Math.min(100, xp))

    const next = grantXp(DEMO_USER_ID, xp, `Budget Boss Battle: +${xp} XP`)
    setProfile(next)
    setSubmitted(true)
    setXpEarned(xp)

    toast({
      title: "Game complete 🎮",
      description: total <= BUDGET ? `Nice! You stayed within budget. +${xp} XP` : `Over budget — still learned! +${xp} XP`,
    })
  }

  const verdict = useMemo(() => {
    if (!submitted) return null
    if (total <= BUDGET && remaining >= 200) return { label: "Budget Boss", desc: "Within budget + money left to save." }
    if (total <= BUDGET) return { label: "Balanced", desc: "Within budget — now try leave extra for savings." }
    return { label: "Budget Trouble", desc: "Over budget — cut wants or reduce a need cost." }
  }, [submitted, total, remaining])

  if (!profile) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Budget Boss Battle</h1>
            <p className="text-sm text-muted-foreground">
              Build a monthly plan under <span className="font-medium">{money(BUDGET)}</span>. Earn XP and learn.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/chat">Talk to Mali</Link>
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Pick list */}
          <Card className="border-border/60 lg:col-span-2">
            <CardHeader>
              <CardTitle>Pick your expenses</CardTitle>
              <CardDescription>Tap items to include them. Try cover needs first.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                {ITEMS.map((item) => {
                  const isOn = !!selected[item.id]
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className={`text-left rounded-lg border p-3 transition ${
                        isOn ? "border-primary bg-primary/5" : "border-border/60 hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.tip}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={item.category === "Needs" ? "secondary" : "outline"}>{item.category}</Badge>
                          <div className="text-sm font-medium">{money(item.cost)}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={scoreAndSubmit} disabled={submitted}>
                  Submit & Score
                </Button>
                <Button variant="outline" onClick={reset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Your plan + result</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-border/60 p-3">
                <div className="text-xs text-muted-foreground">Current Level</div>
                <div className="text-lg font-semibold">{profile?.maliLevel ?? 1}</div>
                <div className="text-xs text-muted-foreground">{profile?.xpPoints ?? 0} XP</div>
              </div>

              <div className="rounded-lg border border-border/60 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Total</div>
                  <div className="text-sm font-semibold">{money(total)}</div>
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Remaining</div>
                  <div className={`text-xs font-medium ${remaining >= 0 ? "" : "text-destructive"}`}>
                    {money(remaining)}
                  </div>
                </div>

                <div className="mt-2 flex gap-2">
                  <Badge variant="secondary">Needs {money(breakdown.needs)}</Badge>
                  <Badge variant="outline">Wants {money(breakdown.wants)}</Badge>
                </div>
              </div>

              {submitted ? (
                <div className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{verdict?.label}</div>
                    <Badge>+{xpEarned} XP</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{verdict?.desc}</div>

                  <div className="mt-3 text-xs text-muted-foreground">
                    Mali tip: If you can consistently leave even <span className="font-medium">R200</span> monthly,
                    that’s a savings habit.
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Submit to earn XP. Try include at least 2 “Needs” and keep wants low.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="py-8 text-center text-xs text-muted-foreground">
          This mini-game is a demo of MaliGo’s “learn by playing” idea — no real money is moved.
        </div>
      </div>
    </div>
  )
}