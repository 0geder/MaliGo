import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import {
  listMissions,
  listGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  listTransactions,
  completeMission,
  getProfile,
  ensureProfile,
  type Goal,
  type Mission,
  type Transaction,
  type Profile,
} from "@/lib/mvpDb"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

function formatMoneyZAR(amount: number) {
  return `R${Math.round(amount).toLocaleString("en-ZA")}`
}

function progressPct(saved: number, target: number) {
  if (target <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((saved / target) * 100)))
}

export default function Dashboard() {
  const DEMO_USER_ID = "demo-user-001"
  const { toast } = useToast()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [missions, setMissions] = useState<Mission[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [tx, setTx] = useState<Transaction[]>([])

  // Goal form
  const [goalTitle, setGoalTitle] = useState("")
  const [goalTarget, setGoalTarget] = useState<string>("200")

  // Editing
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editTarget, setEditTarget] = useState<string>("")

  useEffect(() => {
    // Ensure profile exists
    const existing = getProfile(DEMO_USER_ID)
    const p = existing ?? ensureProfile({ id: DEMO_USER_ID, email: "demo@maligo.test", fullName: "Demo User" })
    setProfile(p)

    // Load data
    setMissions(listMissions())
    setGoals(listGoals(DEMO_USER_ID))
    setTx(listTransactions(DEMO_USER_ID))
  }, [])

  const stats = useMemo(() => {
    if (!profile) return null
    return {
      level: profile.maliLevel,
      xp: profile.xpPoints,
      streak: profile.currentStreak,
      totalSaved: profile.totalSaved,
      missionsCompleted: profile.missionsCompleted,
      longestStreak: profile.longestStreak,
    }
  }, [profile])

  function refreshAll() {
    setProfile(getProfile(DEMO_USER_ID))
    setGoals(listGoals(DEMO_USER_ID))
    setTx(listTransactions(DEMO_USER_ID))
    setMissions(listMissions())
  }

  function onCreateGoal() {
    const title = goalTitle.trim()
    const target = Number(goalTarget)

    if (!title) {
      toast({ title: "Goal title required", description: "Give your goal a name (e.g., School shoes)." })
      return
    }
    if (!Number.isFinite(target) || target <= 0) {
      toast({ title: "Invalid amount", description: "Target amount must be a number greater than 0." })
      return
    }

    createGoal(DEMO_USER_ID, title, target)
    setGoalTitle("")
    setGoalTarget("200")
    toast({ title: "Goal created", description: `Target set to ${formatMoneyZAR(target)}.` })
    refreshAll()
  }

  function startEdit(goal: Goal) {
    setEditingGoalId(goal.id)
    setEditTitle(goal.title)
    setEditTarget(String(goal.targetAmount))
  }

  function cancelEdit() {
    setEditingGoalId(null)
    setEditTitle("")
    setEditTarget("")
  }

  function saveEdit(goalId: string) {
    const title = editTitle.trim()
    const target = Number(editTarget)

    if (!title) {
      toast({ title: "Goal title required" })
      return
    }
    if (!Number.isFinite(target) || target <= 0) {
      toast({ title: "Invalid target amount" })
      return
    }

    updateGoal(DEMO_USER_ID, goalId, { title, targetAmount: target })
    toast({ title: "Goal updated" })
    cancelEdit()
    refreshAll()
  }

  function addToGoal(goal: Goal, amount: number) {
    const nextSaved = Math.max(0, goal.savedAmount + amount)
    updateGoal(DEMO_USER_ID, goal.id, { savedAmount: nextSaved })
    toast({ title: "Progress updated", description: `Added ${formatMoneyZAR(amount)} to "${goal.title}".` })
    refreshAll()
  }

  function removeGoal(goalId: string) {
    deleteGoal(DEMO_USER_ID, goalId)
    toast({ title: "Goal deleted" })
    refreshAll()
  }

  function doMission(m: Mission) {
    const res = completeMission(DEMO_USER_ID, m)
    setProfile(res.profile)
    setTx(listTransactions(DEMO_USER_ID))
    toast({ title: "Mission completed 🎉", description: `${m.title} — +${m.xpReward} XP` })
    // goals might change status if user uses amount elsewhere later, refresh anyway
    setGoals(listGoals(DEMO_USER_ID))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Top bar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">MaliGo Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Hi {profile?.fullName ?? "Friend"}! Mali’s watching your streak 👀
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link to="/game">Play Mini-Game</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/chat">Talk to Mali</Link>
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Level</CardTitle>
              <CardDescription>XP builds your Mali level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats?.level ?? 1}</div>
              <div className="text-xs text-muted-foreground">{stats?.xp ?? 0} XP</div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <CardDescription>Save daily to grow it</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats?.streak ?? 0} days</div>
              <div className="text-xs text-muted-foreground">Longest: {stats?.longestStreak ?? 0}</div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
              <CardDescription>Demo “wallet” tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{formatMoneyZAR(stats?.totalSaved ?? 0)}</div>
              <div className="text-xs text-muted-foreground">Logged savings from missions</div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Missions Done</CardTitle>
              <CardDescription>Consistency = rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats?.missionsCompleted ?? 0}</div>
              <div className="text-xs text-muted-foreground">Complete missions to earn XP</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 py-6 lg:grid-cols-3">
          {/* Missions */}
          <Card className="border-border/60 lg:col-span-1">
            <CardHeader>
              <CardTitle>Mali Missions</CardTitle>
              <CardDescription>Click complete to simulate saving + XP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {missions.map((m) => (
                <div key={m.id} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{m.title}</div>
                      <div className="text-xs text-muted-foreground">{m.description}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary">+{m.xpReward} XP</Badge>
                        {typeof m.amountSuggestion === "number" ? (
                          <Badge variant="outline">Suggest {formatMoneyZAR(m.amountSuggestion)}</Badge>
                        ) : null}
                      </div>
                    </div>
                    <Button size="sm" onClick={() => doMission(m)}>
                      Complete
                    </Button>
                  </div>
                </div>
              ))}

              <div className="text-xs text-muted-foreground">
                Tip: complete “Save R5 today” and watch your streak + XP change instantly.
              </div>
            </CardContent>
          </Card>

          {/* Goals CRUD */}
          <Card className="border-border/60 lg:col-span-2">
            <CardHeader>
              <CardTitle>Goals (CRUD)</CardTitle>
              <CardDescription>Create, update, delete goals — demo-ready</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Create */}
              <div className="grid gap-2 md:grid-cols-3">
                <Input
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Goal title (e.g., School shoes)"
                />
                <Input
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  placeholder="Target amount (e.g., 200)"
                  inputMode="numeric"
                />
                <Button onClick={onCreateGoal}>Create Goal</Button>
              </div>

              <Separator />

              {/* List */}
              <div className="space-y-3">
                {goals.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No goals yet — create one above (e.g., “R200 for school shoes”).
                  </div>
                ) : null}

                {goals.map((g) => {
                  const pct = progressPct(g.savedAmount, g.targetAmount)
                  const isEditing = editingGoalId === g.id
                  const isDone = g.status === "completed"

                  return (
                    <div key={g.id} className="rounded-lg border border-border/60 p-3">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          {!isEditing ? (
                            <>
                              <div className="flex items-center gap-2">
                                <div className="font-medium">{g.title}</div>
                                {isDone ? <Badge>Completed</Badge> : <Badge variant="secondary">Active</Badge>}
                              </div>

                              <div className="mt-1 text-xs text-muted-foreground">
                                {formatMoneyZAR(g.savedAmount)} / {formatMoneyZAR(g.targetAmount)} ({pct}%)
                              </div>

                              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div className="h-full w-[1%] bg-primary" style={{ width: `${pct}%` }} />
                              </div>
                            </>
                          ) : (
                            <div className="grid gap-2 md:grid-cols-2">
                              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                              <Input
                                value={editTarget}
                                onChange={(e) => setEditTarget(e.target.value)}
                                inputMode="numeric"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {!isEditing ? (
                            <>
                              <Button size="sm" variant="secondary" onClick={() => addToGoal(g, 5)} disabled={isDone}>
                                +R5
                              </Button>
                              <Button size="sm" variant="secondary" onClick={() => addToGoal(g, 10)} disabled={isDone}>
                                +R10
                              </Button>
                              <Button size="sm" variant="secondary" onClick={() => addToGoal(g, 20)} disabled={isDone}>
                                +R20
                              </Button>

                              <Button size="sm" variant="outline" onClick={() => startEdit(g)}>
                                Edit
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => removeGoal(g.id)}>
                                Delete
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" onClick={() => saveEdit(g.id)}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit}>
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>Shows “saving logs” + rewards (demo transactions)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tx.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No activity yet — complete a mission to generate your first log.
              </div>
            ) : null}

            {tx.slice(0, 8).map((t) => (
              <div key={t.id} className="flex items-start justify-between gap-3 rounded-lg border border-border/60 p-3">
                <div>
                  <div className="text-sm font-medium">
                    {t.transactionType === "save" ? "Saved" : "Reward"}{" "}
                    {t.transactionType === "save" ? formatMoneyZAR(t.amount) : ""}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.description}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(t.createdAt).toLocaleString("en-ZA")}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="py-8 text-center text-xs text-muted-foreground">
          MVP mode: data is stored locally in your browser (localStorage). Perfect for a live demo.
        </div>
      </div>
    </div>
  )
}