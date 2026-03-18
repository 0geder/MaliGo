import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Sparkles, Shield, TrendingUp, Users, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import GameMechanics from "@/components/GameMechanics";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-navy via-maligo-green/90 to-maligo-navy">
      <Hero />
      <Features />
      <GameMechanics />
      <HowItWorks />
      
      {/* Professional Trust & CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Trust Indicators */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                {/* <Badge className="mb-4 bg-maligo-green/20 text-maligo-green border-maligo-green/30 shadow-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Trusted by 10,000+ South Africans
                </Badge> */}
                <h2 className="text-3xl font-bold text-white mb-6">
                  Join the Financial Literacy Revolution
                </h2>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  MaliGo makes financial education engaging through gamified learning, 
                  practical challenges, and real rewards. Start building better money habits today.
                </p>
              </div>
              
              {/* Trust Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur-sm border-maligo-green/30 shadow-xl">
                  <CardContent className="pt-6 text-center">
                    <Shield className="w-10 h-10 text-maligo-green mx-auto mb-3" />
                    <h3 className="font-semibold text-maligo-navy mb-2">Bank-Level Security</h3>
                    <p className="text-sm text-maligo-navy/80">Your data is protected</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-maligo-gold/30 shadow-xl">
                  <CardContent className="pt-6 text-center">
                    <Users className="w-10 h-10 text-maligo-gold mx-auto mb-3" />
                    <h3 className="font-semibold text-maligo-navy mb-2">Growing Community</h3>
                    <p className="text-sm text-maligo-navy/80">Join thousands of savers</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-maligo-green/30 shadow-xl">
                  <CardContent className="pt-6 text-center">
                    <Target className="w-10 h-10 text-maligo-green mx-auto mb-3" />
                    <h3 className="font-semibold text-maligo-navy mb-2">Real Results</h3>
                    <p className="text-sm text-maligo-navy/80">Track your progress</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="text-center lg:text-left">
              <Card className="bg-gradient-to-br from-maligo-green/10 to-maligo-teal/10 border-maligo-green/20 shadow-2xl">
                <CardHeader className="text-center lg:text-left pb-6">
                  <CardTitle className="text-2xl font-bold text-maligo-green mb-2">
                    Start Your Financial Journey Today
                  </CardTitle>
                  <CardDescription className="text-lg text-maligo-navy">
                    Join thousands of South Africans building better financial futures. 
                    No credit card required. Start with just R5.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button 
                      size="lg" 
                      className="bg-maligo-green hover:bg-maligo-green-dark text-white px-8 py-4 text-lg font-semibold shadow-lg flex-1 transform hover:scale-105 transition-all duration-200"
                      onClick={() => navigate('/signup')}
                    >
                      Get Started Free
                      <Zap className="ml-2 w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-maligo-green/30 text-maligo-green hover:bg-maligo-green/10 px-8 py-4 text-lg flex-1"
                      onClick={() => navigate('/game')}
                    >
                      Try Demo Game
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-maligo-navy mb-4 font-medium">Already have an account?</p>
                    <Button 
                      variant="ghost" 
                      className="text-maligo-green hover:text-maligo-green-dark font-semibold text-base"
                      onClick={() => navigate('/auth')}
                    >
                      Sign In Here
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Landing;
