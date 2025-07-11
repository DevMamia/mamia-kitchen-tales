import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const ShoppingItemSkeleton = () => (
  <Card className="p-4 mb-2">
    <div className="flex items-center space-x-3">
      <Skeleton className="h-5 w-5 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-4" />
    </div>
  </Card>
);

export const ShoppingListSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    
    <div className="space-y-2">
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex justify-between text-sm">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>

    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <ShoppingItemSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const RecipeCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center space-x-2 mt-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </Card>
);

export const CategorizationSkeleton = () => (
  <div className="space-y-4 p-4">
    <div className="flex items-center space-x-2">
      <Skeleton className="h-5 w-5" />
      <Skeleton className="h-5 w-32" />
    </div>
    
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="space-y-1">
            {Array.from({ length: 2 + i % 3 }).map((_, j) => (
              <Skeleton key={j} className="h-3 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
    
    <div className="flex space-x-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

export const LoadingSpinner = ({ size = "default" }: { size?: "sm" | "default" | "lg" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-muted-foreground border-t-primary`} />
    </div>
  );
};

export const PulseLoader = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex items-center space-x-2">
    <div className="flex space-x-1">
      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
    </div>
    <span className="text-sm text-muted-foreground">{text}</span>
  </div>
);

export const ProgressiveLoader = ({ steps, currentStep }: { steps: string[], currentStep: number }) => (
  <div className="space-y-3">
    {steps.map((step, index) => (
      <div key={index} className="flex items-center space-x-3">
        <div className={`h-2 w-2 rounded-full ${
          index < currentStep ? 'bg-primary' : 
          index === currentStep ? 'bg-primary animate-pulse' :
          'bg-muted'
        }`} />
        <span className={`text-sm ${
          index < currentStep ? 'text-foreground' :
          index === currentStep ? 'text-primary' :
          'text-muted-foreground'
        }`}>
          {step}
        </span>
      </div>
    ))}
  </div>
);