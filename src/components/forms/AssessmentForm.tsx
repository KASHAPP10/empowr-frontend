import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from "lucide-react";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { FinancialInfoStep } from "./steps/FinancialInfoStep";
import { AlternativeIncomeStep } from "./steps/AlternativeIncomeStep";
import { PaymentReliabilityStep } from "./steps/PaymentReliabilityStep";
import { CommunityTrustStep } from "./steps/CommunityTrustStep";
import { FinancialEducationStep } from "./steps/FinancialEducationStep";
import { ReviewStep } from "./steps/ReviewStep";
import type { CreditAssessmentData } from "@/types/empowrai";

const STEPS = [
  { 
    id: 1, 
    title: "Personal Information", 
    description: "Basic contact and identity details",
    component: PersonalInfoStep 
  },
  { 
    id: 2, 
    title: "Financial Overview", 
    description: "Income, credit score, and employment",
    component: FinancialInfoStep 
  },
  { 
    id: 3, 
    title: "Alternative Income", 
    description: "Gig work, business revenue, other sources",
    component: AlternativeIncomeStep 
  },
  { 
    id: 4, 
    title: "Payment History", 
    description: "Rent, utilities, and recurring payments",
    component: PaymentReliabilityStep 
  },
  { 
    id: 5, 
    title: "Community Trust", 
    description: "References, endorsements, social capital",
    component: CommunityTrustStep 
  },
  { 
    id: 6, 
    title: "Financial Education", 
    description: "Courses, training, and certifications",
    component: FinancialEducationStep 
  },
  { 
    id: 7, 
    title: "Review & Submit", 
    description: "Verify your information and submit",
    component: ReviewStep 
  },
];

export function AssessmentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<Partial<CreditAssessmentData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("empowrai-assessment");
    const savedStep = localStorage.getItem("empowrai-step");
    const savedCompleted = localStorage.getItem("empowrai-completed");
    
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved data");
      }
    }
    
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
    
    if (savedCompleted) {
      try {
        setCompletedSteps(JSON.parse(savedCompleted));
      } catch (e) {
        console.error("Failed to parse completed steps");
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("empowrai-assessment", JSON.stringify(formData));
    localStorage.setItem("empowrai-step", currentStep.toString());
    localStorage.setItem("empowrai-completed", JSON.stringify(completedSteps));
  }, [formData, currentStep, completedSteps]);

  const updateFormData = (section: keyof CreditAssessmentData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const markStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const handleNext = () => {
    markStepComplete(currentStep);
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigation to completed steps or the next step
    if (completedSteps.includes(stepNumber) || stepNumber <= Math.max(...completedSteps, 0) + 1) {
      setCurrentStep(stepNumber);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Here you would send the data to your backend
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear saved data
      localStorage.removeItem("empowrai-assessment");
      localStorage.removeItem("empowrai-step");
      localStorage.removeItem("empowrai-completed");
      
      // Redirect to results page
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Assessment submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = STEPS[currentStep - 1];
  const StepComponent = currentStepData.component;
  const progress = (completedSteps.length / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            EmpowrAI Credit Assessment
          </h1>
          <p className="text-muted-foreground">
            Complete assessment to get your personalized Empowr Score
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const isAccessible = completedSteps.includes(step.id) || step.id <= Math.max(...completedSteps, 0) + 1;

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                disabled={!isAccessible}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth
                  ${isCurrent 
                    ? "bg-primary text-primary-foreground shadow-glow" 
                    : isCompleted 
                    ? "bg-success text-success-foreground hover-lift" 
                    : isAccessible
                    ? "bg-muted text-muted-foreground hover:bg-muted/80"
                    : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.id}</span>
              </button>
            );
          })}
        </div>

        {/* Step Content */}
        <Card className="shadow-soft animate-fade-in">
          <CardHeader>
            <CardTitle>{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <StepComponent 
              data={formData}
              updateData={updateFormData}
              onNext={handleNext}
            />
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentStep === STEPS.length ? (
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={isSubmitting || completedSteps.length < STEPS.length - 1}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{isSubmitting ? "Processing..." : "Submit Assessment"}</span>
            </Button>
          ) : (
            <Button
              variant="fintech"
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}