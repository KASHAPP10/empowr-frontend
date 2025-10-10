import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  ChartBar, 
  CheckCircle, 
  ArrowRight,
  FileText,
  TrendingUp,
  Shield,
  Users,
  DollarSign
} from "lucide-react";

const Tutorial = () => {
  const steps = [
    {
      number: "01",
      title: "Start Your Assessment",
      icon: ClipboardList,
      description: "Click 'Start Assessment' to begin your credit evaluation journey.",
      details: [
        "The assessment takes about 10-15 minutes to complete",
        "You'll answer questions across 7 different categories",
        "All data is encrypted and secure",
        "You can save your progress and return later"
      ]
    },
    {
      number: "02",
      title: "Complete All Sections",
      icon: FileText,
      description: "Provide accurate information across multiple evaluation areas.",
      details: [
        "Personal Information: Basic details about you and your business",
        "Financial Information: Income, expenses, and financial history",
        "Alternative Income: Gig work, freelancing, and non-traditional income",
        "Payment Reliability: Utility bills, rent, and recurring payments",
        "Community Trust: Social capital and network strength",
        "Financial Education: Understanding of financial concepts"
      ]
    },
    {
      number: "03",
      title: "Review & Submit",
      icon: CheckCircle,
      description: "Double-check your information before submitting for analysis.",
      details: [
        "Review all answers for accuracy",
        "Edit any section if needed",
        "Submit for instant AI-powered assessment",
        "Our model processes over 50+ data points"
      ]
    },
    {
      number: "04",
      title: "View Your Results",
      icon: ChartBar,
      description: "Get your comprehensive credit assessment instantly.",
      details: [
        "Empowr Score: Our AI-enhanced creditworthiness score",
        "FICO Score: Traditional credit score estimation",
        "Blended Score: Combined assessment (60% Empowr + 40% FICO)",
        "Key factors influencing your score",
        "Personalized recommendations for improvement"
      ]
    }
  ];

  const keyFeatures = [
    {
      icon: Shield,
      title: "Alternative Data Points",
      description: "We evaluate beyond traditional credit scores, including gig income, payment history, and community trust."
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Analysis",
      description: "Our proprietary Empowr Score uses machine learning to create fairer, more comprehensive assessments."
    },
    {
      icon: Users,
      title: "Inclusive Approach",
      description: "Designed specifically for minority and women-owned businesses underserved by traditional lenders."
    },
    {
      icon: DollarSign,
      title: "Actionable Insights",
      description: "Receive personalized recommendations to improve your credit profile and access to capital."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            How to Use EmpowrAI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Follow this simple guide to complete your AI-powered credit assessment and unlock fair access to capital
          </p>
          <Button size="lg" asChild>
            <Link to="/assessment">
              Start Your Assessment Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Steps Section */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index}
                className="hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-4xl font-bold text-primary/20">{step.number}</span>
                        <CardTitle className="text-2xl">{step.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {step.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 ml-22">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Key Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Makes EmpowrAI Different?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="hover-lift animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg gradient-secondary flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-2 border-primary/20 shadow-glow animate-fade-in">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who are accessing fair credit through our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/assessment">
                  Begin Assessment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">
                  Learn About Our Mission
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Tutorial;
