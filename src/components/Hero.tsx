
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleGetStarted = () => {
    navigate(user ? '/dashboard' : '/auth');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-navy" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy opacity-90" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-56 h-56 bg-gold/10 rounded-full blur-3xl" />
      
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-teal-glow">Now Live in South Africa</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-[1.1]">
              Save Smarter,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-glow">
                Play Better
              </span>
              <br />
              <span className="text-gold">Grow Together</span>
            </h1>
            
            <p className="text-lg text-white/60 mb-8 max-w-xl leading-relaxed">
              Meet Mali the Meerkat — your financial companion making saving fun through 
              challenges, mini-games, and real rewards. Start with just R5.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg"
                className="bg-primary hover:bg-teal-light text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl shadow-glow-teal"
                onClick={handleGetStarted}
              >
                {user ? 'View Dashboard' : 'Get Started Free'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              {!user && location.pathname !== '/dashboard' && (
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base rounded-xl"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-10">
              <div className="flex items-center gap-2 text-white/40">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm">Bank-grade security</span>
              </div>
              <div className="flex items-center gap-2 text-white/40">
                <TrendingUp className="w-4 h-4 text-gold" />
                <span className="text-sm">10K+ savers</span>
              </div>
            </div>
          </motion.div>

          {/* Mali Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-3xl scale-110" />
              <img 
                src="/mali2.png" 
                alt="Mali the Meerkat — MaliGo Mascot" 
                className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-contain animate-float drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
