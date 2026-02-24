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

  const needs = useMemo(() => ITEMS.filter(item => item.category === "Needs"), [])
  const wants = useMemo(() => ITEMS.filter(item => item.category === "Wants"), [])

  const totalNeeds = useMemo(() => needs.reduce((sum, item) => sum + (selected[item.id] ? item.cost : 0), 0), [selected, needs])
  const totalWants = useMemo(() => wants.reduce((sum, item) => sum + (selected[item.id] ? item.cost : 0), 0), [selected, wants])
  const totalSelected = useMemo(() => totalNeeds + totalWants, [totalNeeds, totalWants])

  const remaining = useMemo(() => BUDGET - totalSelected, [totalSelected])
  const isOverBudget = useMemo(() => totalSelected > BUDGET, [totalSelected])

  const toggleItem = (id: string) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSubmit = () => {
    if (!profile) return

    const correctSelections = ITEMS.filter(item => {
      if (item.category === "Needs") return selected[item.id] === true
      return selected[item.id] !== true
    })

    const score = Math.round((correctSelections.length / ITEMS.length) * 100)
    let xp = 0

    if (score >= 80) {
      xp = 50
      toast({
        title: "Excellent! 🎉",
        description: `You scored ${score}%! You understand needs vs wants perfectly. +${xp} XP`,
      })
    } else if (score >= 60) {
      xp = 30
      toast({
        title: "Good job! 👍",
        description: `You scored ${score}%! You're getting the hang of this. +${xp} XP`,
      })
    } else if (score >= 40) {
      xp = 15
      toast({
        title: "Not bad! 📚",
        description: `You scored ${score}%! Keep learning about budgeting. +${xp} XP`,
      })
    } else {
      xp = 5
      toast({
        title: "Keep trying! 💪",
        description: `You scored ${score}%! Budgeting takes practice. +${xp} XP`,
      })
    }

    grantXp(DEMO_USER_ID, xp)
    setXpEarned(xp)
    setSubmitted(true)
    setProfile(getProfile(DEMO_USER_ID))
  }

  const resetGame = () => {
    setSelected({})
    setSubmitted(false)
    setXpEarned(0)
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maligo-green"></div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-4xl text-maligo-green mb-4">Game Complete! 🎉</CardTitle>
              <CardDescription className="text-lg">
                You earned <span className="font-bold text-maligo-green">+{xpEarned} XP</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-lg">
                <p className="mb-2">Great job learning about budgeting!</p>
                <p className="text-gray-600">
                  Remember: Needs are essentials you must pay for (rent, food, transport).<br />
                  Wants are nice-to-haves that can wait (takeaways, entertainment, new clothes).
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetGame} className="bg-maligo-green hover:bg-maligo-green-dark">
                  Play Again
                </Button>
                <Link to="/dashboard">
                  <Button variant="outline" className="border-maligo-green text-maligo-green">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-maligo-green mb-4">Budget Challenge Game</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn to distinguish between <span className="font-bold text-maligo-green">Needs</span> and{" "}
            <span className="font-bold text-maligo-orange">Wants</span> with R{BUDGET.toLocaleString("en-ZA")} monthly budget
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Budget Status</CardTitle>
              <CardDescription>Track your selections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monthly Budget:</span>
                  <span className="font-bold">{money(BUDGET)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected:</span>
                  <span className={`font-bold ${isOverBudget ? "text-red-500" : "text-maligo-green"}`}>
                    {money(totalSelected)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className={`font-bold text-lg ${isOverBudget ? "text-red-500" : "text-maligo-green"}`}>
                    {money(remaining)}
                  </span>
                </div>
              </div>

              {isOverBudget && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">
                    ⚠️ You're over budget! Unselect some items or focus on needs first.
                  </p>
                </div>
              )}

              <Button 
                onClick={handleSubmit} 
                disabled={totalSelected === 0 || isOverBudget}
                className="w-full bg-maligo-green hover:bg-maligo-green-dark disabled:bg-gray-400"
              >
                Submit Budget
              </Button>
            </CardContent>
          </Card>

          {/* Items Selection */}
          <div className="space-y-6">
            {/* Needs Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-maligo-green">Needs (Essentials)</CardTitle>
                <CardDescription>Items you must pay for each month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {needs.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selected[item.id] 
                        ? "border-maligo-green bg-maligo-green/10" 
                        : "border-gray-200 hover:border-maligo-green/50"
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.tip}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-maligo-green">{money(item.cost)}</div>
                        {selected[item.id] && (
                          <Badge className="bg-maligo-green text-white text-xs mt-1">Selected</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Wants Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-maligo-orange">Wants (Nice-to-haves)</CardTitle>
                <CardDescription>Items that can wait or be reduced</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {wants.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selected[item.id] 
                        ? "border-maligo-orange bg-maligo-orange/10" 
                        : "border-gray-200 hover:border-maligo-orange/50"
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.tip}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-maligo-orange">{money(item.cost)}</div>
                        {selected[item.id] && (
                          <Badge className="bg-maligo-orange text-white text-xs mt-1">Selected</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/dashboard">
            <Button variant="outline" className="border-maligo-green text-maligo-green">
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/chat">
            <Button variant="outline" className="border-maligo-green text-maligo-green">
              Ask Mali for Help
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
