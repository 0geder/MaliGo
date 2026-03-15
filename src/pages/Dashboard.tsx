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
  addTransaction,
  updateStreak,
  isMissionCompleted,
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
import TopNav from "@/components/TopNav"

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
  const [editTarget, setEditTarget] = useState("")

  useEffect(() => {
    const existingProfile = getProfile(DEMO_USER_ID)

    const p =
      existingProfile ??
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
    setMissions(listMissions())
    setGoals(listGoals(DEMO_USER_ID))
    setTx(listTransactions(DEMO_USER_ID))
  }, [])

  function refreshAll() {
    const updatedProfile = getProfile(DEMO_USER_ID)
    if (updatedProfile) setProfile(updatedProfile)

    setGoals(listGoals(DEMO_USER_ID))
    setTx(listTransactions(DEMO_USER_ID))
    setMissions(listMissions())
  }

  const handleCreateGoal = () => {
    const title = goalTitle.trim()
    const target = Number(goalTarget)

    if (!title) {
      toast({
        title: "Goal title required",
        description: "Please enter a goal title.",
        variant: "destructive",
      })
      return
    }

    if (!Number.isFinite(target) || target <= 0) {
      toast({
        title: "Invalid target",
        description: "Target amount must be greater than 0.",
        variant: "destructive",
      })
      return
    }

    createGoal(DEMO_USER_ID, {
      title,
      targetAmount: target,
      savedAmount: 0,
      status: "active",
    })

    setGoalTitle("")
    setGoalTarget("200")
    refreshAll()

    toast({
      title: "Goal created!",
      description: `Your goal "${title}" has been added.`,
    })
  }

  const startEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id)
    setEditTitle(goal.title)
    setEditTarget(String(goal.targetAmount))
  }

  const cancelEditGoal = () => {
    setEditingGoalId(null)
    setEditTitle("")
    setEditTarget("")
  }

  const handleUpdateGoal = (goalId: string) => {
    const title = editTitle.trim()
    const target = Number(editTarget)

    if (!title) {
      toast({
        title: "Goal title required",
        description: "Please enter a valid title.",
        variant: "destructive",
      })
      return
    }

    if (!Number.isFinite(target) || target <= 0) {
      toast({
        title: "Invalid target",
        description: "Target amount must be greater than 0.",
        variant: "destructive",
      })
      return
    }

    try {
      updateGoal(DEMO_USER_ID, goalId, {
        title,
        targetAmount: target,
      })

      refreshAll()
      cancelEditGoal()

      toast({
        title: "Goal updated",
        description: "Your goal has been updated successfully.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update goal.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGoal = (goalId: string) => {
    try {
      deleteGoal(DEMO_USER_ID, goalId)
      refreshAll()

      toast({
        title: "Goal deleted",
        description: "Your goal has been removed.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete goal.",
        variant: "destructive",
      })
    }
  }

  const handleAddToGoal = (goal: Goal, amount: number) => {
    try {
      const nextSaved = goal.savedAmount + amount
      const nextStatus = nextSaved >= goal.targetAmount ? "completed" : "active"

      updateGoal(DEMO_USER_ID, goal.id, {
        savedAmount: nextSaved,
        status: nextStatus,
      })

      addTransaction(DEMO_USER_ID, {
        transactionType: "save",
        amount,
        description: `Added ${formatMoneyZAR(amount)} to goal "${goal.title}"`,
      })

      refreshAll()

      toast({
        title: "Goal progress updated",
        description: `${formatMoneyZAR(amount)} added to "${goal.title}".`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update goal progress.",
        variant: "destructive",
      })
    }
  }

  const handleCompleteMission = (mission: Mission) => {
    try {
      if (isMissionCompleted(DEMO_USER_ID, mission.id)) {
        toast({
          title: "Mission already completed",
          description: "You already completed this mission in this demo session.",
        })
        return
      }

      const result = completeMission(DEMO_USER_ID, mission.id)

      if (!result.success) {
        toast({
          title: "Error",
          description: "Failed to complete mission.",
          variant: "destructive",
        })
        return
      }

      updateStreak(DEMO_USER_ID)

      addTransaction(DEMO_USER_ID, {
        transactionType: "save",
        amount: mission.amountSuggestion ?? 0,
        description: `${mission.title} (+${mission.xpReward} XP)`,
      })

      refreshAll()

      toast({
        title: "Mission completed! 🎉",
        description: `${mission.title} — +${mission.xpReward} XP`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to complete mission.",
        variant: "destructive",
      })
    }
  }

  const activeGoals = useMemo(() => goals.filter((g) => g.status === "active"), [goals])
  const completedGoals = useMemo(() => goals.filter((g) => g.status === "completed"), [goals])
  const activeMissions = useMemo(() => missions.filter((m) => m.isActive), [missions])

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maligo-green"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10">
      <TopNav />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-maligo-green mb-2">
              Welcome back, {profile.fullName}!
            </h1>
            <p className="text-gray-600">Here's your savings journey with Mali the Meerkat</p>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="secondary">
              <Link to="/game">Play Mini-Game</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/chat">Talk to Mali</Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Total Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-maligo-green">
                {formatMoneyZAR(profile.totalSaved)}
              </div>
              <p className="text-sm text-gray-600">All time savings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-maligo-green">{profile.currentStreak} days</div>
              <p className="text-sm text-gray-600">Longest: {profile.longestStreak} days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Mali Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-maligo-green">Level {profile.maliLevel}</div>
              <p className="text-sm text-gray-600">{profile.xpPoints} XP</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Missions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-maligo-green">{profile.missionsCompleted}</div>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Goals Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Savings Goals</CardTitle>
              <CardDescription>Track your savings targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Goal Form */}
              <div className="space-y-2">
                <Input
                  placeholder="Goal title..."
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Target amount"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                  />
                  <Button onClick={handleCreateGoal} className="bg-maligo-green hover:bg-maligo-green-dark">
                    Add Goal
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Active Goals */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {activeGoals.map((goal) => {
                  const isEditing = editingGoalId === goal.id
                  const pct = progressPct(goal.savedAmount, goal.targetAmount)

                  return (
                    <div key={goal.id} className="border rounded-lg p-3">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Goal title"
                          />
                          <Input
                            type="number"
                            value={editTarget}
                            onChange={(e) => setEditTarget(e.target.value)}
                            placeholder="Target amount"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateGoal(goal.id)}
                              className="bg-maligo-green hover:bg-maligo-green-dark"
                            >
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEditGoal}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{goal.title}</h4>
                              <p className="text-xs text-gray-500">
                                {formatMoneyZAR(goal.savedAmount)} / {formatMoneyZAR(goal.targetAmount)} ({pct}%)
                              </p>
                            </div>

                            <div className="flex gap-1 flex-wrap justify-end">
                              <Button size="sm" variant="ghost" onClick={() => startEditGoal(goal)}>
                                Edit
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteGoal(goal.id)}>
                                Delete
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-maligo-green h-2 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>

                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleAddToGoal(goal, 5)}
                              >
                                +R5
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleAddToGoal(goal, 20)}
                              >
                                +R20
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleAddToGoal(goal, 50)}
                              >
                                +R50
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {activeGoals.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No active goals. Create one above!</p>
                )}
              </div>

              {/* Completed Goals */}
              {completedGoals.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-semibold text-maligo-green">Completed Goals</h4>
                    {completedGoals.map((goal) => (
                      <div key={goal.id} className="border rounded-lg p-3 bg-green-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{goal.title}</h4>
                            <p className="text-sm text-gray-600">
                              {formatMoneyZAR(goal.savedAmount)} / {formatMoneyZAR(goal.targetAmount)}
                            </p>
                          </div>
                          <Badge className="bg-maligo-green text-white">Completed</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Missions Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Daily Missions</CardTitle>
              <CardDescription>Complete challenges to earn XP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activeMissions.map((mission) => {
                  const completed = isMissionCompleted(DEMO_USER_ID, mission.id)

                  return (
                    <div key={mission.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2 gap-3">
                        <div>
                          <h4 className="font-medium">{mission.title}</h4>
                          <p className="text-sm text-gray-600">{mission.description}</p>

                          {typeof mission.amountSuggestion === "number" && (
                            <p className="text-xs text-gray-500 mt-1">
                              Suggested save amount: {formatMoneyZAR(mission.amountSuggestion)}
                            </p>
                          )}
                        </div>

                        <Badge className="bg-maligo-green text-white">+{mission.xpReward} XP</Badge>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleCompleteMission(mission)}
                        className="bg-maligo-green hover:bg-maligo-green-dark w-full"
                        disabled={completed}
                      >
                        {completed ? "Completed" : "Complete Mission"}
                      </Button>
                    </div>
                  )
                })}

                {activeMissions.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No active missions. Check back tomorrow!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-maligo-green">Recent Activity</CardTitle>
            <CardDescription>Your latest savings and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tx
                .slice()
                .reverse()
                .slice(0, 10)
                .map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString("en-ZA")}
                      </p>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-bold ${
                          transaction.transactionType === "save" ? "text-maligo-green" : "text-maligo-orange"
                        }`}
                      >
                        {transaction.transactionType === "save" ? "+" : ""}
                        {formatMoneyZAR(transaction.amount)}
                      </div>

                      <Badge variant="outline" className="text-xs">
                        {transaction.transactionType}
                      </Badge>
                    </div>
                  </div>
                ))}

              {tx.length === 0 && (
                <p className="text-gray-500 text-center py-4">No transactions yet. Start saving!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}