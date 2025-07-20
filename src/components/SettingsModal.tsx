
import React, { useState } from 'react';
import { X, Volume2, Eye, Globe, Bell, Shield, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [settings, setSettings] = useState({
    voiceVolume: [75],
    preferredMama: 'nonna-lucia',
    voiceSpeed: 'normal',
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    defaultServings: '4',
    measurementUnit: 'metric',
    timerAlerts: true,
    cookingReminders: true,
    tipNotifications: true,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingSections = [
    {
      title: 'Voice & Audio',
      icon: Volume2,
      items: [
        {
          type: 'slider',
          key: 'voiceVolume',
          label: 'Voice Volume',
          description: 'Adjust how loud mama speaks to you',
          min: 0,
          max: 100,
          step: 5
        },
        {
          type: 'select',
          key: 'preferredMama',
          label: 'Preferred Mama Voice',
          description: 'Choose your favorite cooking companion',
          options: [
            { value: 'nonna-lucia', label: 'Nonna Lucia (Italian)' },
            { value: 'abuela-rosa', label: 'Abuela Rosa (Mexican)' },
            { value: 'yai-malee', label: 'Yai Malee (Thai)' }
          ]
        },
        {
          type: 'select',
          key: 'voiceSpeed',
          label: 'Voice Speed',
          description: 'How fast mama talks during cooking',
          options: [
            { value: 'slow', label: 'Slow & Steady' },
            { value: 'normal', label: 'Just Right' },
            { value: 'fast', label: 'Quick & Efficient' }
          ]
        }
      ]
    },
    {
      title: 'Accessibility',
      icon: Eye,
      items: [
        {
          type: 'toggle',
          key: 'highContrast',
          label: 'High Contrast Mode',
          description: 'Easier to read in bright kitchens'
        },
        {
          type: 'toggle',
          key: 'reducedMotion',
          label: 'Reduce Motion',
          description: 'Minimize animations and transitions'
        },
        {
          type: 'select',
          key: 'fontSize',
          label: 'Text Size',
          description: 'Adjust text size for better readability',
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
            { value: 'extra-large', label: 'Extra Large' }
          ]
        }
      ]
    },
    {
      title: 'Cooking Preferences',
      icon: Globe,
      items: [
        {
          type: 'select',
          key: 'defaultServings',
          label: 'Default Servings',
          description: 'How many people do you usually cook for?',
          options: [
            { value: '1', label: '1 person' },
            { value: '2', label: '2 people' },
            { value: '4', label: '4 people' },
            { value: '6', label: '6 people' },
            { value: '8', label: '8+ people' }
          ]
        },
        {
          type: 'select',
          key: 'measurementUnit',
          label: 'Measurement Units',
          description: 'Cups and tablespoons or grams and milliliters?',
          options: [
            { value: 'imperial', label: 'Imperial (cups, tbsp)' },
            { value: 'metric', label: 'Metric (grams, ml)' }
          ]
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          type: 'toggle',
          key: 'timerAlerts',
          label: 'Timer Alerts',
          description: 'Get notified when cooking timers finish'
        },
        {
          type: 'toggle',
          key: 'cookingReminders',
          label: 'Cooking Reminders',
          description: 'Gentle nudges to continue cooking sessions'
        },
        {
          type: 'toggle',
          key: 'tipNotifications',
          label: 'Cooking Tips',
          description: 'Receive helpful tips from your mamas'
        }
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="font-heading text-2xl" style={{ color: 'hsl(var(--logo-brown))' }}>
            Kitchen Settings
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-handwritten">
            Customize mama's help to your taste
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <section.icon className="w-5 h-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-foreground">
                          {item.label}
                        </label>
                        <p className="text-xs text-muted-foreground font-handwritten">
                          {item.description}
                        </p>
                      </div>
                      
                      {item.type === 'toggle' && (
                        <Switch
                          checked={settings[item.key as keyof typeof settings] as boolean}
                          onCheckedChange={(checked) => updateSetting(item.key, checked)}
                        />
                      )}
                      
                      {item.type === 'select' && (
                        <Select
                          value={settings[item.key as keyof typeof settings] as string}
                          onValueChange={(value) => updateSetting(item.key, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {item.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    
                    {item.type === 'slider' && (
                      <div className="px-3">
                        <Slider
                          value={settings[item.key as keyof typeof settings] as number[]}
                          onValueChange={(value) => updateSetting(item.key, value)}
                          min={item.min}
                          max={item.max}
                          step={item.step}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{item.min}%</span>
                          <span>{(settings[item.key as keyof typeof settings] as number[])[0]}%</span>
                          <span>{item.max}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Data & Privacy Section */}
          <Card className="border-destructive/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-heading flex items-center gap-2 text-destructive">
                <Shield className="w-5 h-5" />
                Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Trash className="w-4 h-4 mr-2" />
                Clear Cache
              </Button>
              <Button variant="destructive" className="w-full justify-start" size="sm">
                <Trash className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>

          <div className="text-center pt-4">
            <Button onClick={onClose} className="px-8">
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
