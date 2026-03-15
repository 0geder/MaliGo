import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { grantXp, getProfile, ensureProfile, addTransaction, type Profile } from "@/lib/mvpDb"

import TopNav from "@/components/TopNav"
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
    const existing = getProfile(DEMO_USER_ID)

    const p =
      existing ??
      ensureProfile({
        userId: DEMO_USER_ID,
        fullName: "Demo User",
        totalSaved: 0,
        currentStreak: 0,
        longestStreak: 0,
        xpPoints: 0,
        maliLevel: 1,
        missionsCompleted: 0,
        badgesEarned: 0,
      })

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

  function refreshProfile() {
    const updated = getProfile(DEMO_USER_ID)
    if (updated) setProfile(updated)
  }

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

    const needsCount = breakdown.picked.filter((i) => i.category === "Needs").length
    const wantsCount = breakdown.picked.filter((i) => i.category === "Wants").length

    let xp = 0

    if (needsCount >= 2) xp += 25
    else xp += 10

    if (total <= BUDGET) {
      xp += 35
      if (remaining >= 100) xp += 10
      if (remaining >= 250) xp += 10
    } else {
      xp += 10
    }

    if (wantsCount === 0) xp += 20
    else if (wantsCount === 1) xp += 12
    else if (wantsCount === 2) xp += 6

    xp = Math.max(10, Math.min(100, xp))

    grantXp(DEMO_USER_ID, xp)

    addTransaction(DEMO_USER_ID, {
      transactionType: "reward",
      amount: 0,
      description: `Budget Boss Battle completed (+${xp} XP)`,
    })

    refreshProfile()
    setSubmitted(true)
    setXpEarned(xp)

    toast({
      title: "Game complete 🎮",
      description:
        total <= BUDGET
          ? `Nice! You stayed within budget. +${xp} XP`
          : `Over budget — still learned! +${xp} XP`,
    })
  }

  const verdict = useMemo(() => {
    if (!submitted) return null
    if (total <= BUDGET && remaining >= 200) {
      return { label: "Budget Boss", desc: "Within budget + money left to save." }
    }
    if (total <= BUDGET) {
      return { label: "Balanced", desc: "Within budget — now try leave extra for savings." }
    }
    return { label: "Budget Trouble", desc: "Over budget — cut wants or reduce a need cost." }
  }, [submitted, total, remaining])

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maligo-green"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10">
      <TopNav />

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Hero / Intro */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-maligo-green/20 bg-white/80 shadow-sm backdrop-blur">
          <div className="grid gap-6 p-6 md:grid-cols-2 md:items-center">
            <div>
              <Badge className="mb-3 bg-maligo-green text-white">Mini-Game</Badge>
              <h1 className="text-3xl font-bold text-maligo-green">Budget Boss Battle</h1>
              <p className="mt-2 text-sm text-gray-600">
                Build a monthly plan under <span className="font-semibold">{money(BUDGET)}</span>. Learn the
                difference between <span className="font-medium">Needs</span> and <span className="font-medium">Wants</span>,
                stay within budget, and earn XP with Mali.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="secondary">
                  <Link to="/dashboard">Back to Dashboard</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/chat">Talk to Mali</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl bg-maligo-green/10 p-5">
              <div className="text-sm text-gray-600 mb-2">Your Mali Progress</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="text-xs text-gray-500">Level</div>
                  <div className="text-xl font-bold text-maligo-green">{profile.maliLevel}</div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="text-xs text-gray-500">XP</div>
                  <div className="text-xl font-bold text-maligo-green">{profile.xpPoints}</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-600">
                Good budgeting choices earn XP and reinforce smart savings habits.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pick list */}
          <Card className="border-maligo-green/20 bg-white/80 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-maligo-green">Pick your expenses</CardTitle>
              <CardDescription>Choose items for the month. Try cover needs first, then keep wants under control.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                {ITEMS.map((item) => {
                  const isOn = !!selected[item.id]

                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className={`text-left rounded-xl border p-4 transition-all ${
                        isOn
                          ? "border-maligo-green bg-maligo-green/10 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-maligo-cream/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="mt-1 text-xs text-gray-600">{item.tip}</div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            className={
                              item.category === "Needs"
                                ? "bg-maligo-green text-white"
                                : "bg-maligo-orange text-white"
                            }
                          >
                            {item.category}
                          </Badge>
                          <div className="text-sm font-semibold text-gray-800">{money(item.cost)}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  onClick={scoreAndSubmit}
                  disabled={submitted}
                  className="bg-maligo-green hover:bg-maligo-green-dark"
                >
                  Submit & Score
                </Button>
                <Button variant="outline" onClick={reset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-maligo-green/20 bg-white/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-maligo-green">Summary</CardTitle>
              <CardDescription>Your budget choices and result</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-maligo-green/20 bg-maligo-green/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700">Budget Limit</div>
                  <div className="text-lg font-bold text-maligo-green">{money(BUDGET)}</div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Total Selected</div>
                  <div className="text-sm font-semibold">{money(total)}</div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">Remaining</div>
                  <div className={`text-xs font-semibold ${remaining >= 0 ? "text-maligo-green" : "text-red-500"}`}>
                    {money(remaining)}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="bg-maligo-green text-white">Needs {money(breakdown.needs)}</Badge>
                  <Badge className="bg-maligo-orange text-white">Wants {money(breakdown.wants)}</Badge>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-xs text-gray-500">How to win</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Include at least 2 needs</li>
                  <li>• Stay within budget</li>
                  <li>• Leave money unspent if possible</li>
                  <li>• Keep wants low</li>
                </ul>
              </div>

              {submitted ? (
                <div className="rounded-xl border border-maligo-green/20 bg-maligo-green/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-maligo-green">{verdict?.label}</div>
                    <Badge className="bg-maligo-green text-white">+{xpEarned} XP</Badge>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">{verdict?.desc}</div>

                  <div className="mt-3 text-xs text-gray-600">
                    Mali tip: If you can consistently leave even <span className="font-semibold">R200</span> monthly,
                    that’s the start of a real savings habit.
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-4 text-xs text-gray-500">
                  Submit your budget to get your result and XP reward.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="py-8 text-center text-xs text-gray-500">
          This mini-game demonstrates MaliGo’s learn-by-playing approach. No real money is moved in this MVP demo.
        </div>
      </div>
    </div>
  )
}