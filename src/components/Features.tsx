
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "Daily Mali Missions",
      description: "Complete fun micro-challenges like 'Save R5 today' or 'Skip takeaway and log it!' Mali cheers you on every step.",
      icon: "🎯",
      color: "bg-maligo-orange/10 border-maligo-orange/20"
    },
    {
      title: "Mini-Games & Quizzes",
      description: "Learn budgeting through puzzles, trivia, and 'spending vs saving' games - all taught in Mali's witty voice.",
      icon: "🎮",
      color: "bg-maligo-blue/10 border-maligo-blue/20"
    },
    {
      title: "Streaks & Rewards",
      description: "Earn XP, badges, and real rewards like airtime or vouchers by maintaining consistent saving habits.",
      icon: "🏆",
      color: "bg-maligo-green/10 border-maligo-green/20"
    },
    {
      title: "Goal-Based Quests",
      description: "Set savings goals like 'R200 for school shoes' and let Mali track your progress with milestone celebrations.",
      icon: "🎯",
      color: "bg-maligo-orange/10 border-maligo-orange/20"
    },
    {
      title: "Peer Competitions",
      description: "Challenge friends in weekly save-offs and climb the leaderboards with Mali as your host and cheerleader.",
      icon: "👥",
      color: "bg-maligo-blue/10 border-maligo-blue/20"
    },
    {
      title: "USSD & SMS Access",
      description: "No smartphone? No problem! Access MaliGo through USSD codes and SMS for feature phone users.",
      icon: "📱",
      color: "bg-maligo-green/10 border-maligo-green/20"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why MaliGo Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mali the Meerkat makes saving money fun, accessible, and rewarding for everyone - 
            from smartphone users to those with feature phones.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`${feature.color} hover:shadow-lg transition-all duration-300 hover:scale-105`}
            >
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
