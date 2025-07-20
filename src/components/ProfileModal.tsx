
import React, { useState, useEffect } from 'react';
import { X, Camera, Edit2, Award, Heart, ChefHat } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && user) {
      fetchProfile();
    }
  }, [isOpen, user]);

  const getCookingLevelDisplay = (level: string) => {
    const levels = {
      beginner: { label: 'Nonna\'s Little Helper', icon: '🥄', color: 'text-green-600' },
      intermediate: { label: 'Kitchen Apprentice', icon: '👨‍🍳', color: 'text-orange-600' },
      advanced: { label: 'Master Chef', icon: '👑', color: 'text-purple-600' }
    };
    return levels[level as keyof typeof levels] || levels.beginner;
  };

  const stats = [
    { label: 'Recipes Completed', value: '12', icon: ChefHat },
    { label: 'Cooking Streak', value: '5 days', icon: Award },
    { label: 'Favorite Recipes', value: '8', icon: Heart },
  ];

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto bg-card border-border">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const cookingLevel = getCookingLevelDisplay(profile?.cooking_level || 'beginner');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="font-heading text-2xl" style={{ color: 'hsl(var(--logo-brown))' }}>
            My Cooking Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10">
                  {profile?.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                {profile?.username || 'Cooking Enthusiast'}
              </h3>
              <div className={`flex items-center justify-center gap-2 mt-2 ${cookingLevel.color}`}>
                <span className="text-lg">{cookingLevel.icon}</span>
                <span className="font-handwritten text-lg">{cookingLevel.label}</span>
              </div>
            </div>
          </div>

          {/* Cooking Stats */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-heading text-center">Cooking Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground font-handwritten">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-heading">Profile Details</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="h-8 px-2"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Favorite Mama</label>
                <p className="text-foreground font-handwritten">
                  {profile?.favorite_mama_id ? 'Nonna Lucia' : 'Not selected yet'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Dietary Preferences</label>
                <p className="text-foreground font-handwritten">
                  {profile?.dietary_preferences?.length > 0 
                    ? profile.dietary_preferences.join(', ') 
                    : 'No restrictions - ready for anything!'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cooking Goals</label>
                <p className="text-foreground font-handwritten italic">
                  "Master authentic family recipes and create memories in the kitchen"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-heading text-center flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/50">
                  <span className="text-2xl">🍝</span>
                  <div>
                    <p className="font-medium text-sm">Perfect Pasta Master</p>
                    <p className="text-xs text-muted-foreground">Completed your first carbonara!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/50">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="font-medium text-sm">Cultural Explorer</p>
                    <p className="text-xs text-muted-foreground">Tried recipes from 2 different mamas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
