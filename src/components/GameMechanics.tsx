
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GameMechanics = () => {
  const games = [
    {
      name: "Mali's Mission of the Day",
      description: "Complete micro-challenges to earn points and build your saving streak",
      example: "Save R5 today",
      reward: "+10 XP",
      bgColor: "bg-gradient-to-r from-maligo-orange to-maligo-orange-light"
    },
    {
      name: "Budget Boss Battle",
      description: "Survive monthly expenses with limited budget in this strategic challenge",
      example: "Can you survive on R2000?",
      reward: "Unlock budgeting tips",
      bgColor: "bg-gradient-to-r from-maligo-blue to-maligo-blue-light"
    },
    {
      name: "Savings Streak Builder",
      description: "Maintain daily savings habits and watch your streak grow with Mali's encouragement",
      example: "7-day streak = Bonus XP",
      reward: "+50 XP Bonus",
      bgColor: "bg-gradient-to-r from-maligo-green to-maligo-green-light"
    },
    {
      name: "Spin the Wheel",
      description: "Complete tasks to spin for surprise rewards like airtime, coins, or Mali's secret tips",
      example: "Answer 5 quiz questions",
      reward: "R10 Airtime",
      bgColor: "bg-gradient-to-r from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-maligo-cream to-maligo-orange/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Game Mechanics That Work
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mali makes financial literacy fun through engaging games that teach real money skills 
            while rewarding progress with tangible benefits.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className={`h-2 ${game.bgColor}`}></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-gray-900">{game.name}</CardTitle>
                  <Badge variant="secondary" className="bg-maligo-green text-white">
                    {game.reward}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {game.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Example:</p>
                  <p className="text-maligo-green font-semibold">"{game.example}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameMechanics;
