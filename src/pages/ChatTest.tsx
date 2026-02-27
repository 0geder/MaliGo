import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProfile, ensureProfile, listChatMessages, addChatMessage } from "@/lib/mvpDb"

const ChatTest = () => {
  const [testResults, setTestResults] = useState<string[]>([])
  const DEMO_USER_ID = "demo-user-001"

  const runTests = async () => {
    const results = []
    
    try {
      // Test 1: Profile creation
      const profile = getProfile(DEMO_USER_ID) ?? ensureProfile({ 
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
      results.push(`✅ Profile created: ${profile.fullName}`)
      
      // Test 2: Add chat message
      const userMessage = addChatMessage(DEMO_USER_ID, {
        role: "user",
        content: "Test message",
      })
      results.push(`✅ User message added: ${userMessage.content}`)
      
      // Test 3: List messages
      const messages = listChatMessages(DEMO_USER_ID)
      results.push(`✅ Messages retrieved: ${messages.length} total`)
      
      // Test 4: Add AI response
      const aiMessage = addChatMessage(DEMO_USER_ID, {
        role: "assistant",
        content: "Test AI response",
      })
      results.push(`✅ AI message added: ${aiMessage.content}`)
      
      // Test 5: Final message count
      const finalMessages = listChatMessages(DEMO_USER_ID)
      results.push(`✅ Final message count: ${finalMessages.length}`)
      
    } catch (error) {
      results.push(`❌ Error: ${error}`)
    }
    
    setTestResults(results)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-maligo-green">Chat Functionality Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runTests} className="bg-maligo-green hover:bg-maligo-green-dark">
              Run Chat Tests
            </Button>
            
            {testResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold">Test Results:</h3>
                {testResults.map((result, index) => (
                  <div key={index} className="p-2 bg-gray-100 rounded">
                    {result}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                onClick={() => window.location.href = '/chat'}
                variant="outline"
                className="border-maligo-green text-maligo-green"
              >
                Go to Chat Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ChatTest
