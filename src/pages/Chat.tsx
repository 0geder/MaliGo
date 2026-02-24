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
 * MVP "AI":
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

  // Greeting
  if (greeting) {
    const greetings = [
      `Hey ${profile.fullName}! 👋 How's your savings journey going?`,
      `Hi there! Ready to save some money with Mali? 💚`,
      `Hello! Your current streak is ${profile.currentStreak} days. Keep it up! 🔥`,
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  // Streak questions
  if (asksStreak) {
    return `You're on a ${profile.currentStreak}-day streak! Your longest was ${profile.longestStreak} days. Consistency is key to building wealth. 🎯`
  }

  // Goal questions
  if (asksGoals) {
    if (activeGoals.length === 0) {
      return "You don't have any active goals yet. Why not start with a small goal like saving R50 for something nice? 🎯"
    }
    if (topGoal) {
      const progress = Math.round((topGoal.savedAmount / topGoal.targetAmount) * 100)
      return `Your top goal is "${topGoal.title}". You're ${progress}% of the way there (${money(topGoal.savedAmount)} of ${money(topGoal.targetAmount)}). You can do it! 💪`
    }
    return `You have ${activeGoals.length} active goals. Which one are you most excited about? 🎉`
  }

  // Budget/spending questions
  if (asksBudget) {
    return `Great question! Remember the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings. Try the Budget Game to practice! 🎮`
  }

  // Mission questions
  if (asksMission) {
    const availableMissions = missions.filter(m => m.isActive)
    if (availableMissions.length === 0) {
      return "You've completed all available missions! Check back tomorrow for new challenges. 🌟"
    }
    const nextMission = availableMissions[0]
    return `Try this mission: "${nextMission.title}" - ${nextMission.description}. You'll earn ${nextMission.xpReward} XP! 🎯`
  }

  // XP/level questions
  if (asksXp) {
    const nextLevel = Math.floor(profile.xpPoints / 100) + 1
    const xpForNext = nextLevel * 100 - profile.xpPoints
    return `You're Level ${profile.maliLevel} with ${profile.xpPoints} XP. You need ${xpForNext} more XP to reach Level ${nextLevel}. Keep completing missions! 📈`
  }

  // Default helpful responses
  const defaultResponses = [
    "That's interesting! Remember, every small saving counts toward your goals. 🌱",
    "I'm here to help you build better financial habits. What would you like to know? 🤔",
    "Saving money is like planting seeds - small efforts grow into big results! 🌱",
    `Your total savings so far: ${money(profile.totalSaved)}. Every rand adds up! 💚`,
    "Try breaking big goals into smaller weekly targets. It makes saving less overwhelming! 🎯",
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

export default function Chat() {
  const DEMO_USER_ID = "demo-user-001"

  const [profile, setProfile] = useState<Profile | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const p = getProfile(DEMO_USER_ID) ?? ensureProfile({ 
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
    setGoals(listGoals(DEMO_USER_ID))
    setMissions(listMissions())
    setMessages(listChatMessages(DEMO_USER_ID))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || !profile) return

    const userMessage = addChatMessage(DEMO_USER_ID, {
      role: "user",
      content: input.trim(),
    })

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate "AI" thinking delay
    setTimeout(() => {
      const aiResponse = maliBrain(input.trim(), { profile, goals, missions })
      const assistantMessage = addChatMessage(DEMO_USER_ID, {
        role: "assistant",
        content: aiResponse,
      })

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maligo-green"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10 p-6">
      <div className="max-w-4xl mx-auto h-[calc(100vh-3rem)] flex flex-col">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-maligo-green">Chat with Mali 🐾</CardTitle>
            <CardDescription>Your financial literacy assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge className="bg-maligo-green text-white">Ask me anything!</Badge>
              <Badge variant="outline">Goals: {goals.filter(g => g.status === "active").length}</Badge>
              <Badge variant="outline">Streak: {profile.currentStreak} days</Badge>
              <Badge variant="outline">Level {profile.maliLevel}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card className="flex-1 mb-4 overflow-hidden">
          <CardContent className="h-full p-4">
            <div className="h-full overflow-y-auto space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-lg mb-2">👋 Hi! I'm Mali, your financial literacy assistant!</p>
                  <p>Ask me about your goals, streak, missions, or any money questions!</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-maligo-green text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {nowTimeZA(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Input Area */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Mali about your savings, goals, or any financial questions..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping}
                className="bg-maligo-green hover:bg-maligo-green-dark"
              >
                Send
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              💡 Try asking: "how's my streak?", "what are my goals?", "what mission should I do?"
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-4 flex gap-4 justify-center">
          <Link to="/dashboard">
            <Button variant="outline" className="border-maligo-green text-maligo-green">
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/game">
            <Button variant="outline" className="border-maligo-green text-maligo-green">
              Play Budget Game
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
