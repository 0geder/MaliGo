
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import GameMechanics from "@/components/GameMechanics";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  return (
  <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10">
    <Hero />

    {/* MVP Demo shortcuts (presentation-friendly) */}
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/70 px-3 py-1 text-xs text-muted-foreground">
          <Badge variant="secondary">MVP Demo</Badge>
          <span>Quick links for presentation</span>
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">Try the working MVP</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          These screens showcase the key ideas: <b>CRUD goals</b>, <b>mini-game</b>, and <b>Talk to Mali chatbot</b>.
          (Demo data is stored locally for now.)
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 bg-white/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Stats + Missions + Goals (CRUD)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Create goals, update progress, delete goals, and complete missions for XP & streak.
            </div>
            <Button asChild className="w-full">
              <Link to="/dashboard">Open Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-white/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Mini-Game</CardTitle>
            <CardDescription>Budget Boss Battle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Pick expenses under a budget and earn XP. Quick and fun.
            </div>
            <Button asChild className="w-full" variant="secondary">
              <Link to="/game">Play Game</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-white/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Talk to Mali</CardTitle>
            <CardDescription>Chatbot (AI-feel)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Chat replies use your streak, XP, goals and missions (no external API yet).
            </div>
            <Button asChild className="w-full" variant="secondary">
              <Link to="/chat">Open Chat</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

    <Features />
    <GameMechanics />
    <HowItWorks />
    <Testimonials />
    <Footer />
  </div>
);
};

export default Index;
