import { useState } from 'react';
import { CalculatorForm } from '@/components/CalculatorForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { CalculatorInputs, CalculationResults } from '@/types/calculator';
import { calculateImpact } from '@/lib/calculations';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const Index = () => {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async (inputs: CalculatorInputs) => {
    setIsCalculating(true);
    
    // Simulate calculation delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const calculationResults = calculateImpact(inputs);
    setResults(calculationResults);
    setIsCalculating(false);
    
    // Smooth scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header text-white py-8 px-4 sm:px-6 lg:px-8 shadow-elevated">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-4xl">🌱</span>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Lahti Green Infrastructure Calculator
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-3">
                Supporting Nature Positive 2030 Goals
              </p>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1 hover:text-white transition-colors">
                        <Info className="h-4 w-4" />
                        <span>Evidence-based impact modeling</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Based on peer-reviewed research and Lahti Climate Programme 2023-2030</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <p className="text-white/90 text-sm sm:text-base max-w-3xl">
            Calculate environmental and economic returns for green roofs & vertical gardens
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Column: Form (40%) */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6 shadow-card border border-border lg:sticky lg:top-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Project Information</h2>
              <CalculatorForm onCalculate={handleCalculate} isCalculating={isCalculating} />
            </div>
          </div>

          {/* Right Column: Results (60%) */}
          <div className="lg:col-span-3" id="results-section">
            {results ? (
              <ResultsDisplay results={results} />
            ) : (
              <div className="bg-accent-light rounded-lg p-12 text-center border border-border">
                <div className="text-6xl mb-4">🏗️</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Ready to Calculate
                </h3>
                <p className="text-muted-foreground">
                  Fill out the form and click "Calculate Impact" to see your project's environmental and economic potential
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border mt-16 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">⚠️ DISCLAIMER</h4>
            <p>
              Calculations are estimates based on peer-reviewed research (Helsinki Cost-Benefit Analysis 2013, Finnish climate data, UK Biodiversity Metrics). Actual results vary by site conditions, maintenance, and species selection. Incentives subject to municipal approval. Contact Lahti City Planning for project-specific guidance.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">📚 METHODOLOGY</h4>
            <p>
              Based on: Finnish Museum of Natural History (2013), Lahti Climate Programme 2023-2030, UK Statutory Biodiversity Metric 4.0, Finnish energy efficiency data.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">🌱 ABOUT</h4>
            <p className="mb-2">
              Built for Nature Positive Lahti 2030 Hackathon. Supporting Lahti's journey to become nature-positive by 2030 and climate-neutral by 2025.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="text-primary hover:underline">GitHub</a>
              <a href="#" className="text-primary hover:underline">Documentation</a>
              <a href="#" className="text-primary hover:underline">Contact</a>
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
