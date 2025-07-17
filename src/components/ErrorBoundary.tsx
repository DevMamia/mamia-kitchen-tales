import React, { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Track error in analytics
    try {
      const analyticsData = {
        event: 'error_boundary_triggered',
        properties: {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack
        },
        timestamp: new Date().toISOString()
      };
      
      const existing = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      existing.push(analyticsData);
      localStorage.setItem('analytics_events', JSON.stringify(existing));
    } catch (trackingError) {
      console.warn('Failed to track error:', trackingError);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({ error, resetError }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    // Simulate retry delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRetrying(false);
    resetError();
  };

  const getCulturalMessage = () => {
    const messages = [
      { character: '👵🏻', message: "Nonna says: 'Even the best recipes sometimes need a second try!'" },
      { character: '👵🏽', message: "Abuela says: 'No te preocupes, mijo. Let's try again!'" },
      { character: '👵🏻', message: "Yai says: 'Patience, dear one. Good things take time.'" }
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const culturalMessage = getCulturalMessage();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">{culturalMessage.character}</div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Oops! Something went wrong
          </h2>
        </div>

        <Alert className="border-primary/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-handwritten text-base">
            {culturalMessage.message}
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button 
            onClick={handleRetry} 
            disabled={isRetrying}
            className="w-full"
            size="lg"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Trying again...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </>
            )}
          </Button>

          <details className="text-sm text-muted-foreground">
            <summary className="cursor-pointer hover:text-foreground">
              Technical details
            </summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              {error.message}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;