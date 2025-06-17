
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Phone } from 'lucide-react';

interface ProfileCompletionProps {
  onComplete: () => void;
}

export function ProfileCompletion({ onComplete }: ProfileCompletionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone_number: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting to update user profile:', { 
        userId: user.id, 
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim()
      });

      const { data, error } = await supabase
        .from('users')
        .update({
          name: formData.name.trim(),
          phone_number: formData.phone_number.trim()
        })
        .eq('id', user.id)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No rows were updated. User profile may not exist.');
      }

      toast({
        title: "Success",
        description: "Profile completed successfully!",
      });

      // Give the database a moment to update before calling onComplete
      setTimeout(() => {
        onComplete();
      }, 100);
    } catch (error: any) {
      console.error('Profile completion error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <User className="h-6 w-6 text-blue-600" />
            <span>Complete Your Profile</span>
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Please complete your profile to access all features
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
                placeholder="Enter your phone number"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !formData.name.trim() || !formData.phone_number.trim()}
            >
              <Phone className="h-4 w-4 mr-2" />
              {loading ? 'Completing Profile...' : 'Complete Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
