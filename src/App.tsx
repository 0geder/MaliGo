import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import LandingAfterLogin from "./pages/LandingAfterLogin";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DashboardEnhanced from "./pages/Dashboard-enhanced";
import Game from "./pages/Game";
import Chat from "./pages/Chat";
import ChatTest from "./pages/ChatTest";
import ChatDebug from "./pages/ChatDebug";
import Signup from "./pages/Signup";
import Auth from "./pages/Auth";
import Glossary from "./pages/Glossary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/landing-after-login" element={<LandingAfterLogin />} />
            <Route path="/dashboard" element={<DashboardEnhanced />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Index />} />
            <Route path="/game" element={<Game />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat-test" element={<ChatTest />} />
            <Route path="/chat-debug" element={<ChatDebug />} />
            <Route path="/glossary" element={<Glossary />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
