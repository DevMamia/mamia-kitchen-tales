
import React from 'react';
import { Timer, CheckCircle, AlertCircle, Thermometer } from 'lucide-react';

const Cook = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
          Cooking Mode
        </h2>
        <p className="text-muted-foreground font-handwritten text-lg">
          Step-by-step guidance
        </p>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-paper border border-border">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🍝</div>
          <h3 className="font-heading font-bold text-xl text-foreground mb-2">
            Nonna's Secret Carbonara
          </h3>
          <p className="text-muted-foreground">Step 3 of 8</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-accent/50 rounded-xl p-4 border-l-4 border-italian">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-italian mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-1">
                  Important Tip from Nonna
                </h4>
                <p className="text-sm text-muted-foreground font-handwritten">
                  "Never add cream to carbonara, caro mio! The creaminess comes from the eggs and cheese."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-xl p-4 border border-border">
            <h4 className="font-heading font-semibold text-foreground mb-3">
              Beat the eggs with cheese
            </h4>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              In a large bowl, whisk together 3 whole eggs and 1 egg yolk. Add freshly grated Pecorino Romano and black pepper. Mix until smooth and creamy.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Timer size={16} className="text-primary" />
                <span>5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer size={16} className="text-primary" />
                <span>Room temperature</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 bg-accent text-accent-foreground font-heading font-semibold py-3 rounded-xl hover:bg-accent/80 transition-colors min-h-[48px]">
            Previous Step
          </button>
          <button className="flex-1 bg-primary text-primary-foreground font-heading font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors min-h-[48px] flex items-center justify-center gap-2">
            <CheckCircle size={20} />
            Next Step
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-paper border border-border">
        <h4 className="font-heading font-semibold text-foreground mb-4">
          Cooking Timer
        </h4>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary font-heading mb-2">
            05:00
          </div>
          <div className="flex gap-3 justify-center">
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-heading font-semibold min-h-[48px]">
              Start Timer
            </button>
            <button className="bg-accent text-accent-foreground px-6 py-2 rounded-lg font-heading font-semibold min-h-[48px]">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cook;
