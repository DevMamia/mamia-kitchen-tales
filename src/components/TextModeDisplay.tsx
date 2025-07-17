import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MAMA_VOICES } from '@/services/voiceService';

interface TextModeDisplayProps {
  mamaId: string;
  currentText: string;
  isActive: boolean;
}

export const TextModeDisplay = ({ mamaId, currentText, isActive }: TextModeDisplayProps) => {
  const mama = MAMA_VOICES[mamaId];
  
  if (!mama || !isActive) {
    return null;
  }

  const getMamaAvatar = (mamaId: string) => {
    switch (mamaId) {
      case 'nonna':
        return '👵🏻'; // Italian grandmother
      case 'abuela':
        return '👵🏽'; // Latina grandmother
      case 'yai':
        return '👵🏼'; // Thai grandmother
      default:
        return '👵';
    }
  };

  const getMamaGreeting = (mamaId: string) => {
    switch (mamaId) {
      case 'nonna':
        return 'Ciao, tesoro!';
      case 'abuela':
        return '¡Hola, mi amor!';
      case 'yai':
        return 'สวัสดีค่ะ ลูกรัก! (Hello, my dear!)';
      default:
        return 'Hello, dear!';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Mama Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              {getMamaAvatar(mamaId)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{mama.name}</h3>
              <Badge variant="secondary" className="text-xs">
                Text Mode
              </Badge>
            </div>
            
            {/* Current Text */}
            <div className="bg-background rounded-lg p-3 border">
              <p className="text-sm leading-relaxed">
                {currentText || getMamaGreeting(mamaId)}
              </p>
            </div>

            {/* Character Indicator */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>{mama.name} is ready to help</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};