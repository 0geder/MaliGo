import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProfile, ensureProfile, listChatMessages, addChatMessage } from "@/lib/mvpDb"
import TopNav from "@/components/TopNav"

const ChatDebug = () => {
  const [logs, setLogs] = useState<string[]>([])
  const DEMO_USER_ID = "demo-user-001"

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const runTests = async () => {
    addLog("Starting chat debug tests...")
    
    try {
      // Test 1: Profile creation
      addLog("Testing profile creation...")
      const profile = getProfile(DEMO_USER_ID)
      if (profile) {
        addLog(`✅ Profile found: ${profile.fullName}`)
      } else {
        addLog("⚠️ No profile found, creating one...")
        const newProfile = ensureProfile({ 
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
        addLog(`✅ Profile created: ${newProfile.fullName}`)
      }
      
      // Test 2: Chat messages
      addLog("Testing chat message functions...")
      const messages = listChatMessages(DEMO_USER_ID)
      addLog(`📝 Found ${messages.length} existing messages`)
      
      // Test 3: Add a test message
      addLog("Adding test message...")
      const testMessage = addChatMessage(DEMO_USER_ID, {
        role: "user",
        content: "Hello Mali! This is a test message.",
      })
      addLog(`✅ Message added: ${testMessage.content}`)
      
      // Test 4: Verify message was saved
      const updatedMessages = listChatMessages(DEMO_USER_ID)
      addLog(`📝 Now have ${updatedMessages.length} messages`)
      
      // Test 5: Add AI response
      addLog("Adding AI response...")
      const aiMessage = addChatMessage(DEMO_USER_ID, {
        role: "assistant",
        content: "Hello! I'm Mali the Meerkat. How can I help you with your savings journey today? 🐾",
      })
      addLog(`✅ AI response added: ${aiMessage.content}`)
      
      // Test 6: Final check
      const finalMessages = listChatMessages(DEMO_USER_ID)
      addLog(`📝 Final message count: ${finalMessages.length}`)
      
      // Test 7: Show last few messages
      addLog("Last few messages:")
      finalMessages.slice(-3).forEach((msg, index) => {
        addLog(`  ${index + 1}. ${msg.role}: ${msg.content.substring(0, 50)}...`)
      })
      
      addLog("✅ All tests completed successfully!")
      
    } catch (error) {
      addLog(`❌ Error: ${error}`)
    }
  }

  const clearData = () => {
    addLog("Clearing chat data...")
    localStorage.removeItem(`maligo:mvp:chat:${DEMO_USER_ID}`)
    addLog("✅ Chat data cleared")
  }

  const goToChat = () => {
    addLog("Navigating to chat page...")
    window.location.href = '/chat'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10\">
      <TopNav />
      <div className="max-w-4xl mx-auto p-6\">
        <Card>
          <CardHeader>
            <CardTitle className="text-maligo-green">Chat System Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={runTests} className="bg-maligo-green hover:bg-maligo-green-dark">
                Run Chat Tests
              </Button>
              <Button onClick={clearData} variant="outline">
                Clear Data
              </Button>
              <Button onClick={goToChat} variant="outline">
                Go to Chat
              </Button>
            </div>
            
            {logs.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold">Debug Logs:</h3>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold text-blue-900 mb-2">Manual Test Steps:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Click "Run Chat Tests" to verify functions work</li>
                <li>2. Click "Go to Chat" to test the actual chat interface</li>
                <li>3. Try sending a message like "hello" or "how's my streak?"</li>
                <li>4. Check if Mali responds after 1-2 seconds</li>
                <li>5. Verify messages are saved and displayed correctly</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ChatDebug
