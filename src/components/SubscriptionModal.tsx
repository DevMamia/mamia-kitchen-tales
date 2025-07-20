
import React from 'react';
import { Crown, Check, Zap, Users, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserTier } from '@/hooks/useUserTier';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  const { tier, isPremium, usageCount, maxUsage } = useUserTier();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out mama\'s recipes',
      icon: Heart,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      features: [
        'Access to 15 authentic recipes',
        'Basic voice guidance (text-to-speech)',
        'Step-by-step instructions',
        'Shopping list creation',
        'Offline recipe access'
      ],
      limitations: [
        'No conversational voice chat',
        'Limited cultural stories',
        'Basic cooking tips only'
      ]
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      description: 'The full mama experience with conversational AI',
      icon: Crown,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      popular: true,
      features: [
        'Everything in Free',
        'Conversational voice chat with mamas',
        'Unlimited cultural stories & tips',
        'Advanced cooking guidance',
        'Photo feedback from mamas',
        'Smart ingredient substitutions',
        'Priority customer support'
      ]
    },
    {
      name: 'Family',
      price: '$19.99',
      period: 'per month',
      description: 'Share the joy of cooking with up to 6 family members',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      features: [
        'Everything in Premium',
        'Up to 6 family accounts',
        'Shared recipe collections',
        'Family cooking challenges',
        'Group meal planning',
        'Advanced analytics'
      ]
    }
  ];

  const getCurrentPlanDetails = () => {
    return plans.find(plan => plan.name.toLowerCase() === tier) || plans[0];
  };

  const currentPlan = getCurrentPlanDetails();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="font-heading text-2xl" style={{ color: 'hsl(var(--logo-brown))' }}>
            Your MAMIA Plan
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-handwritten">
            Enhance your cooking journey with mama's wisdom
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Plan Status */}
          <Card className={`${currentPlan.bgColor} ${currentPlan.borderColor} border-2`}>
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-2">
                <currentPlan.icon className={`w-8 h-8 ${currentPlan.color}`} />
              </div>
              <CardTitle className="font-heading text-xl">
                {currentPlan.name} Plan
                {currentPlan.name === 'Premium' && (
                  <Badge className="ml-2 bg-orange-500 hover:bg-orange-600">Current</Badge>
                )}
              </CardTitle>
              <p className="text-sm font-handwritten text-muted-foreground">
                {currentPlan.description}
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'hsl(var(--logo-brown))' }}>
                {currentPlan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /{currentPlan.period}
                </span>
              </div>
              
              {tier === 'premium' && (
                <div className="mt-4 p-3 bg-white/70 rounded-lg">
                  <p className="text-sm font-medium">This Month's Usage</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">Voice conversations</span>
                    <span className="text-sm font-bold">{usageCount}/{maxUsage}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all" 
                      style={{ width: `${(usageCount / maxUsage) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plan Comparison */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg text-center" style={{ color: 'hsl(var(--logo-brown))' }}>
              Choose Your Cooking Adventure
            </h3>
            
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`${plan.bgColor} ${plan.borderColor} border relative ${
                  plan.popular ? 'ring-2 ring-orange-300' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 hover:bg-orange-600 px-3">
                      <Zap className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <plan.icon className={`w-5 h-5 ${plan.color}`} />
                      <CardTitle className="font-heading text-lg">{plan.name}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{plan.price}</div>
                      <div className="text-xs text-muted-foreground">/{plan.period}</div>
                    </div>
                  </div>
                  <p className="text-sm font-handwritten text-muted-foreground">
                    {plan.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {tier === plan.name.toLowerCase() ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => {
                        // Placeholder for subscription logic
                        console.log(`Upgrading to ${plan.name}`);
                      }}
                    >
                      {tier === 'free' ? 'Upgrade' : 'Switch'} to {plan.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Billing History Placeholder */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg">Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-handwritten">
                  {tier === 'free' 
                    ? "No billing history yet. Upgrade to premium to start cooking with mama's full wisdom!" 
                    : "Your billing history will appear here"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Support Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h4 className="font-heading font-bold mb-2">Need Help?</h4>
                <p className="text-sm font-handwritten text-muted-foreground mb-4">
                  Our support team is here to help you make the most of your cooking journey.
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
