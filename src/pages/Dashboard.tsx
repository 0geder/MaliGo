import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-maligo-green mb-2">Welcome to MaliGo!</h1>
          <p className="text-gray-600">Your savings journey with Mali the Meerkat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Savings Overview</CardTitle>
              <CardDescription>Track your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-maligo-green mb-2">R 0.00</div>
              <p className="text-sm text-gray-600">Total saved so far</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Current Goals</CardTitle>
              <CardDescription>Your active savings goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-maligo-green mb-2">0</div>
              <p className="text-sm text-gray-600">Active goals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Streak</CardTitle>
              <CardDescription>Your saving streak</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-maligo-green mb-2">0 days</div>
              <p className="text-sm text-gray-600">Keep it going!</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-maligo-green">Quick Actions</CardTitle>
              <CardDescription>Get started with these actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-maligo-green hover:bg-maligo-green-dark">
                Create New Savings Goal
              </Button>
              <Button variant="outline" className="w-full">
                Add Savings
              </Button>
              <Button variant="outline" className="w-full">
                View History
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
