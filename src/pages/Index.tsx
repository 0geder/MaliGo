
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import GameMechanics from "@/components/GameMechanics";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import TopNav from "@/components/TopNav";

const Index = () => {
  const { loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maligo-green"></div>
      </div>
    );
  }

  // Dashboard landing page for logged-in users
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome Back to MaliGo! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Continue your financial journey with Mali. Track your progress, complete new missions, and build better saving habits.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Dashboard
                  </CardTitle>
                  <CardDescription>
                    View your savings progress, XP, and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-maligo-green hover:bg-maligo-green-dark">
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/game')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🎮</span>
                    Budget Game
                  </CardTitle>
                  <CardDescription>
                    Practice budgeting skills and earn XP
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-maligo-green text-maligo-green hover:bg-maligo-green hover:text-white">
                    Play Game
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/chat')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">💬</span>
                    Chat with Mali
                  </CardTitle>
                  <CardDescription>
                    Get personalized financial advice from Mali
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-maligo-green text-maligo-green hover:bg-maligo-green hover:text-white">
                    Start Chatting
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity Preview */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recent Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-maligo-green">7 days</div>
                  <p className="text-sm text-gray-600">Keep it going! 🔥</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-maligo-green">R2,450</div>
                  <p className="text-sm text-gray-600">Great progress! 💰</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mali Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-maligo-green">Level 3</div>
                  <p className="text-sm text-gray-600">250 XP to next level 📈</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
