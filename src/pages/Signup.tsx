import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import TopNav from "@/components/TopNav"

const Signup = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  })
  
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.fullName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your full name",
        variant: "destructive"
      })
      return
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Error", 
        description: "Please enter your email address",
        variant: "destructive"
      })
      return
    }
    
    if (!formData.phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive"
      })
      return
    }
    
    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      })
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return
    }
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store user data (in real app, this would go to backend)
      localStorage.setItem('maligo_signup', JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        signedUpAt: new Date().toISOString()
      }))
      
      // Also create a profile for the user
      const { ensureProfile } = await import("@/lib/mvpDb")
      ensureProfile({
        userId: "demo-user-001",
        fullName: formData.fullName,
        totalSaved: 0,
        currentStreak: 0,
        longestStreak: 0,
        xpPoints: 50, // Give welcome XP
        maliLevel: 1,
        missionsCompleted: 0,
        badgesEarned: 1, // Welcome badge
      })
      
      toast({
        title: "Welcome to MaliGo! 🎉",
        description: "Your account has been created successfully. Start your savings journey now!",
      })
      
      // Redirect to dashboard after successful signup
      navigate('/dashboard')
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10\">
      <TopNav />
      <div className="max-w-md mx-auto p-6\">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-maligo-green text-center">Create Your Account</CardTitle>
            <CardDescription className="text-center">
              Join thousands of South Africans learning to save smarter
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create Your Account</CardTitle>
            <CardDescription className="text-center">
              Join thousands of South Africans learning to save smarter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+27 82 123 4567"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Separator />

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{' '}
                  <Link to="/terms" className="text-maligo-green hover:underline">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-maligo-green hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-maligo-green hover:bg-maligo-green-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-maligo-green hover:underline font-medium">
                    Sign In
                  </Link>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-maligo-green text-center">Why Join MaliGo?</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-3">
              <Badge className="bg-maligo-green text-white">🎯</Badge>
              <span className="text-sm">Daily missions to build saving habits</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-maligo-green text-white">🎮</Badge>
              <span className="text-sm">Fun games to learn budgeting</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-maligo-green text-white">🏆</Badge>
              <span className="text-sm">Earn rewards and track progress</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-maligo-green text-white">💬</Badge>
              <span className="text-sm">Chat with Mali for financial advice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
