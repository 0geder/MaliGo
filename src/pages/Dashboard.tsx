
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, Trophy, Target, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: missions, isLoading: missionsLoading } = useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('is_active', true)
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: userMissions } = useQuery({
    queryKey: ['user-missions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_missions')
        .select('*, missions(*)')
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: transactions } = useQuery({
    queryKey: ['recent-transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maligo-green"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/b55ce985-e17b-4728-82c2-a40c2b4b9479.png" 
                alt="Mali the Meerkat" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-maligo-green">MaliGo</h1>
                <p className="text-gray-600">Welcome back, {profile?.full_name || 'Friend'}!</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
              <Coins className="h-4 w-4 text-maligo-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{profile?.total_saved || 0}</div>
              <p className="text-xs text-muted-foreground">Keep saving with Mali!</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Target className="h-4 w-4 text-maligo-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.current_streak || 0} days</div>
              <p className="text-xs text-muted-foreground">Longest: {profile?.longest_streak || 0} days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">XP Points</CardTitle>
              <Trophy className="h-4 w-4 text-maligo-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.xp_points || 0} XP</div>
              <p className="text-xs text-muted-foreground">Mali Level {profile?.mali_level || 1}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Missions Done</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.missions_completed || 0}</div>
              <p className="text-xs text-muted-foreground">Badges earned: {profile?.badges_earned || 0}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Missions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-maligo-orange" />
                Mali's Daily Missions
              </CardTitle>
              <CardDescription>
                Complete these challenges to earn XP and build your streak!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {missionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : missions?.length ? (
                  missions.map((mission) => (
                    <div key={mission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{mission.title}</h4>
                        <p className="text-sm text-gray-600">{mission.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-maligo-green text-white">
                          +{mission.xp_reward} XP
                        </Badge>
                        <Button size="sm" variant="outline">
                          Start
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No missions available right now. Check back later!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-maligo-green" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest savings and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions?.length ? (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {transaction.transaction_type === 'save' ? 'Saved' : 
                           transaction.transaction_type === 'reward' ? 'Reward' : 'Transaction'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {transaction.description || 'No description'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          transaction.transaction_type === 'save' || transaction.transaction_type === 'reward' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.transaction_type === 'save' || transaction.transaction_type === 'reward' ? '+' : '-'}
                          R{transaction.amount}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No transactions yet!</p>
                    <Button className="bg-maligo-green hover:bg-maligo-green-dark">
                      Start Saving <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
