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

const LandingAfterLogin = () => {
  const { loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maligo-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      <Hero />
      <Features />
      <GameMechanics />
      <HowItWorks />
      {/* Testimonials - Commented out until we have real users */}
      {/* <Testimonials /> */}
      
      {/* Final Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Welcome Back! Ready to Continue Your Journey?
          </h2>
          <p className="text-xl text-white/60 mb-8 max-w-3xl mx-auto">
            You're all set up! Continue building your financial habits with Mali. 
            Track your progress, complete missions, and reach your savings goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-teal-light text-primary-foreground px-8 py-4 text-lg"
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
              onClick={() => navigate('/game')}
            >
              Play Budget Game
            </Button>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-white/40 mb-4">Need financial advice?</p>
            <Button 
              variant="ghost" 
              className="text-white hover:text-primary"
              onClick={() => navigate('/chat')}
            >
              Chat with Mali
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LandingAfterLogin;
