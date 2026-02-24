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

  useEffect(() => {
    const p = getProfile(DEMO_USER_ID) ?? ensureProfile({ 
      id: DEMO_USER_ID, 
      email: "demo@maligo.test", 
      fullName: "Demo User" 
    })
    setProfile(p)
    setMissions(listMissions())
    setGoals(listGoals(DEMO_USER_ID))
    setTx(listTransactions(DEMO_USER_ID))
  }, [])

  const handleCreateGoal = () => {
    if (!goalTitle.trim() || !goalTarget) return

    const target = parseFloat(goalTarget)
    if (isNaN(target) || target <= 0) return

    createGoal(DEMO_USER_ID, {
      title: goalTitle.trim(),
      targetAmount: target,
    })

    setGoalTitle("")
    setGoalTarget("200")
    setGoals(listGoals(DEMO_USER_ID))
    toast({
      title: "Goal created!",
      description: `Your goal "${goalTitle}" has been added.`,
    })
  }

  const handleUpdateGoal = (goalId: string, updates: Partial<Goal>) => {
    try {
      updateGoal(goalId, updates)
      setGoals(listGoals(DEMO_USER_ID))
      setEditingGoalId(null)
      toast({
        title: "Goal updated",
        description: "Your goal has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update goal.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGoal = (goalId: string) => {
    try {
      deleteGoal(goalId)
      setGoals(listGoals(DEMO_USER_ID))
      toast({
        title: "Goal deleted",
        description: "Your goal has been removed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete goal.",
        variant: "destructive",
      })
    }
  }

  const handleCompleteMission = (missionId: string) => {
    try {
      completeMission(DEMO_USER_ID, missionId)
      const updatedProfile = getProfile(DEMO_USER_ID)
      setProfile(updatedProfile)
      setMissions(listMissions())
      toast({
        title: "Mission completed! 🎉",
        description: `You earned XP! Keep up the great work.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete mission.",
        variant: "destructive",
      })
    }
  }

  const activeGoals = useMemo(() => goals.filter(g => g.status === "active"), [goals])
  const completedGoals = useMemo(() => goals.filter(g => g.status === "completed"), [goals])
  const activeMissions = useMemo(() => missions.filter(m => m.isActive), [missions])

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maligo-green"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-maligo-green mb-2">Welcome back, {profile.fullName}!</h1>
          <p className="text-gray-600">Here's your savings journey with Mali the Meerkat</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Total Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-maligo-green">{formatMoneyZAR(profile.totalSaved)}</div>
              <p className="text-sm text-gray-600">All time savings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-maligo-green">{profile.currentStreak} days</div>
              <p className="text-sm text-gray-600">Keep it going!</p>
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

              {/* Goals List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {activeGoals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-3">
                    {editingGoalId === goal.id ? (
                      <div className="space-y-2">
                        <Input
                          defaultValue={goal.title}
                          onBlur={(e) => handleUpdateGoal(goal.id, { title: e.target.value })}
                        />
                        <Input
                          type="number"
                          defaultValue={goal.targetAmount}
                          onBlur={(e) => handleUpdateGoal(goal.id, { targetAmount: parseFloat(e.target.value) })}
                        />
                        <Button size="sm" onClick={() => setEditingGoalId(null)}>
                          Done
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{goal.title}</h4>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => setEditingGoalId(goal.id)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteGoal(goal.id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progressPct(goal.savedAmount, goal.targetAmount)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-maligo-green h-2 rounded-full transition-all"
                              style={{ width: `${progressPct(goal.savedAmount, goal.targetAmount)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{formatMoneyZAR(goal.savedAmount)}</span>
                            <span>{formatMoneyZAR(goal.targetAmount)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {activeGoals.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No active goals. Create one above!</p>
                )}
              </div>
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
                {activeMissions.map((mission) => (
                  <div key={mission.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{mission.title}</h4>
                        <p className="text-sm text-gray-600">{mission.description}</p>
                      </div>
                      <Badge className="bg-maligo-green text-white">
                        +{mission.xpReward} XP
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleCompleteMission(mission.id)}
                      className="bg-maligo-green hover:bg-maligo-green-dark w-full"
                    >
                      Complete Mission
                    </Button>
                  </div>
                ))}

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
              {tx.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString("en-ZA")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${transaction.transactionType === "save" ? "text-maligo-green" : "text-maligo-orange"}`}>
                      {transaction.transactionType === "save" ? "+" : ""}{formatMoneyZAR(transaction.amount)}
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

        {/* Navigation */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/game">
            <Button variant="outline" className="border-maligo-green text-maligo-green">
              Play Budget Game
            </Button>
          </Link>
          <Link to="/chat">
            <Button variant="outline" className="border-maligo-green text-maligo-green">
              Chat with Mali
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
