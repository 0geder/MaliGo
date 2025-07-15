
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import GameMechanics from "@/components/GameMechanics";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10">
      <Hero />
      <Features />
      <GameMechanics />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
