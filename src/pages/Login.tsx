
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ProfileCompletion } from '@/components/ProfileCompletion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap } from 'lucide-react';

export default function Login() {
  const [signInData, setSignInData] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    signInMethod: 'email' 
  });
  const [signUpData, setSignUpData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    name: '', 
    role: '' 
  });
  const [loading, setLoading] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  
  const { signIn, signInWithName, signUp, user, profile, isProfileComplete, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile) {
      if (!isProfileComplete) {
        setShowProfileCompletion(true);
        return;
      }
      
      if (profile.role === 'teacher') {
        navigate('/dashboard/teacher');
      } else if (profile.role === 'student') {
        navigate('/dashboard/student');
      }
    }
  }, [user, profile, isProfileComplete, navigate]);

  const handleProfileComplete = async () => {
    await refreshProfile();
    setShowProfileCompletion(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let error;
      if (signInData.signInMethod === 'email') {
        ({ error } = await signIn(signInData.email, signInData.password));
      } else {
        ({ error } = await signInWithName(signInData.name, signInData.password));
      }
      
      if (!error) {
        // Navigation will be handled by useEffect
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signUp(
        signUpData.email, 
        signUpData.password, 
        signUpData.name, 
        signUpData.role
      );
      
      if (!error) {
        setSignUpData({ email: '', password: '', confirmPassword: '', name: '', role: '' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (showProfileCompletion) {
    return <ProfileCompletion onComplete={handleProfileComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 overflow-x-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Jaya LMS</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Access your learning dashboard</p>
        </div>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-method" className="text-sm font-medium">Sign In Method</Label>
                    <Select
                      value={signInData.signInMethod}
                      onValueChange={(value) => setSignInData({ ...signInData, signInMethod: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose sign in method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {signInData.signInMethod === 'email' ? (
                    <div>
                      <Label htmlFor="signin-email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        required
                        placeholder="Enter your email"
                        className="mt-1"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="signin-name" className="text-sm font-medium">Full Name</Label>
                      <Input
                        id="signin-name"
                        type="text"
                        value={signInData.name}
                        onChange={(e) => setSignInData({ ...signInData, name: e.target.value })}
                        required
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                      placeholder="Enter your password"
                      className="mt-1"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="name"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                      required
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                    <Select
                      value={signUpData.role}
                      onValueChange={(value) => setSignUpData({ ...signUpData, role: value })}
                      required
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                      placeholder="Enter your email"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      required
                      placeholder="Enter your password"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      required
                      placeholder="Confirm your password"
                      className="mt-1"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
