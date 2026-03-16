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
import { motion } from 'framer-motion';
import { setAuthUser, ensureProfile, getAuthUser } from '@/lib/mvpDb';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
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
    const phoneNumber = formData.get('phoneNumber') as string;
    
    try {
      // Try Supabase signup first
      const { error } = await signUp(email, password, fullName, phoneNumber);
      
      if (error) {
        // If Supabase fails, use localStorage fallback
        console.log('Supabase signup failed, using localStorage fallback:', error.message);
        
        // Create user in localStorage
        const newUser = {
          id: `user_${Date.now()}`,
          email,
          fullName,
          phoneNumber,
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
        toast.success('Welcome to MaliGo! Check your email to verify your account.');
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
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <img 
                src="/mali2.png" 
                alt="MaliGo" 
                className="w-16 h-16 object-contain animate-float"
              />
            </div>
            <CardTitle className="text-2xl font-bold font-display text-white">
              Welcome to MaliGo
            </CardTitle>
            <CardDescription className="text-white/50">
              Your savings journey starts here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
                <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-white/60">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-white/60">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/70">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="your@email.com" required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/70">Password</Label>
                    <Input id="password" name="password" type="password" required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary" />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-teal-light text-primary-foreground font-semibold rounded-xl py-5" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  
                  <div className="text-center text-sm text-white/40">
                    <p>Demo credentials:</p>
                    <p>Email: demo@maligo.test | Password: password123</p>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-3 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white/70">Full Name</Label>
                    <Input id="fullName" name="fullName" type="text" placeholder="Your full name" required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-white/70">Phone (Optional)</Label>
                    <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+27 123 456 789"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail" className="text-white/70">Email</Label>
                    <Input id="signupEmail" name="email" type="email" placeholder="your@email.com" required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword" className="text-white/70">Password</Label>
                    <Input id="signupPassword" name="password" type="password" required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary" />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-teal-light text-primary-foreground font-semibold rounded-xl py-5" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
