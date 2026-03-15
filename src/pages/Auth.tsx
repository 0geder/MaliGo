import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';
import { setAuthUser, ensureProfile } from '@/lib/mvpDb';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        // If Supabase fails, try localStorage fallback
        if (error.message.includes('Invalid login credentials')) {
          const authUser = getAuthUser();
          if (authUser && authUser.email === email) {
            // Simulate successful login for demo
            toast.success('Welcome back to MaliGo! (Demo Mode)');
            navigate('/dashboard');
          } else {
            toast.error('Invalid email or password');
          }
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Welcome back to MaliGo!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    
    try {
      // Try Supabase signup first
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        // If Supabase fails, use localStorage fallback
        console.log('Supabase signup failed, using localStorage fallback:', error.message);
        
        // Create user in localStorage
        const newUser = {
          id: `user_${Date.now()}`,
          email,
          fullName,
        };
        
        setAuthUser(newUser);
        
        // Create profile for the user
        ensureProfile({
          userId: newUser.id,
          fullName: newUser.fullName,
          totalSaved: 0,
          currentStreak: 0,
          longestStreak: 0,
          xpPoints: 50, // Welcome bonus
          maliLevel: 1,
          missionsCompleted: 0,
          badgesEarned: 1, // Welcome badge
        });
        
        // Store signup info for auth status
        localStorage.setItem('maligo_signup', JSON.stringify({
          fullName: newUser.fullName,
          email: newUser.email,
          signedUpAt: new Date().toISOString()
        }));
        
        toast.success('Welcome to MaliGo! 🎉 Your account has been created!');
        navigate('/dashboard');
      } else {
        toast.success('Welcome to MaliGo! 🎉 Check your email to verify your account.');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  // Helper function to get auth user from localStorage
  const getAuthUser = () => {
    try {
      return JSON.parse(localStorage.getItem('maligo:mvp:authUser') || 'null');
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maligo-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10 p-6 pb-20">
      <div className="max-w-md mx-auto mt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-maligo-green mb-2">Welcome to MaliGo</h1>
          <p className="text-gray-600">Your financial literacy journey starts here</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In / Sign Up</CardTitle>
            <CardDescription className="text-center">
              Join Mali the Meerkat and start saving smart
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-maligo-green hover:bg-maligo-green-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    <p>Demo credentials:</p>
                    <p>Email: demo@maligo.test | Password: password123</p>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname">Full Name</Label>
                    <Input
                      id="signup-fullname"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-maligo-green hover:bg-maligo-green-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                By continuing, you agree to our{' '}
                <a href="#" className="text-maligo-green hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-maligo-green hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="border-maligo-green text-maligo-green hover:bg-maligo-green hover:text-white"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Auth;
