
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Meet Mali",
      description: "Download the app or dial the USSD code. Mali the Meerkat welcomes you and helps set up your first savings goal.",
      color: "bg-maligo-orange"
    },
    {
      step: "2", 
      title: "Choose Your Wallet",
      description: "Link your mobile wallet, bank account, or start with manual savings tracking - we meet you where you are.",
      color: "bg-maligo-blue"
    },
    {
      step: "3",
      title: "Start Small",
      description: "Begin with micro-challenges like saving R5. Mali celebrates every victory and keeps you motivated with streaks and rewards.",
      color: "bg-maligo-green"
    },
    {
      step: "4",
      title: "Grow Together",
      description: "As you build habits, unlock advanced features, compete with friends, and work toward bigger financial goals.",
      color: "bg-purple-500"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How MaliGo Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started with MaliGo is easy. Mali guides you through every step of your 
            financial journey, from your first R5 to your biggest savings goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl mb-4`}>
                    {step.step}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className="w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-7 -mt-1"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
