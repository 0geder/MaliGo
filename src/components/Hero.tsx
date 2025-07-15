
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-maligo-green/5 to-maligo-orange/5"></div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <Badge className="mb-4 bg-maligo-green text-white hover:bg-maligo-green-dark">
            🚀 Coming Soon to South Africa
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            MaliGo: Financial Literacy &<br />
            <span className="text-maligo-green">Gamified Savings</span><br />
            for South Africa
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Meet Mali the Meerkat! Your friendly financial companion helping you build 
            saving habits through fun challenges, mini-games, and real rewards. 
            Start your savings journey with just R5!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-maligo-green hover:bg-maligo-green-dark text-white px-8 py-3 text-lg"
            >
              Join the Waitlist
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-maligo-green text-maligo-green hover:bg-maligo-green hover:text-white px-8 py-3 text-lg"
            >
              Watch Demo
            </Button>
          </div>
          
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/b55ce985-e17b-4728-82c2-a40c2b4b9479.png" 
              alt="Mali the Meerkat - MaliGo Mascot" 
              className="w-80 h-80 object-contain animate-bounce-gentle"
            />
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-maligo-green" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
