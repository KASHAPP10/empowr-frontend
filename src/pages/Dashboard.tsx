import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle, Users, DollarSign, Award, Target, Moon, Sun } from "lucide-react";

interface AssessmentResult {
  decision: 'APPROVED' | 'CONDITIONAL' | 'DENIED';
  confidence: 'High' | 'Medium' | 'Low';
  empowrScore: number;
  ficoScore: number;
  blendedScore: number;
  approvalProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  keyFactors: Array<{
    name: string;
    value: number;
    impact: number;
    importance: number;
  }>;
  recommendations: string[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    // Load assessment result from localStorage
    const savedResult = localStorage.getItem("empowrai-result");
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        setResult(parsed);
      } catch (e) {
        console.error("Failed to parse assessment result");
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              No Assessment Found
            </CardTitle>
            <CardDescription>
              You need to complete the credit assessment first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/assessment")} className="w-full">
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'APPROVED': return 'text-success';
      case 'CONDITIONAL': return 'text-warning';
      case 'DENIED': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'APPROVED': return <CheckCircle className="w-8 h-8" />;
      case 'CONDITIONAL': return <AlertCircle className="w-8 h-8" />;
      case 'DENIED': return <AlertCircle className="w-8 h-8" />;
      default: return <AlertCircle className="w-8 h-8" />;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <Badge variant="success">Low Risk</Badge>;
      case 'medium': return <Badge variant="warning">Medium Risk</Badge>;
      case 'high': return <Badge variant="destructive">High Risk</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Decision Banner */}
        <Card className={`mb-8 border-2 shadow-glow animate-fade-in ${getDecisionColor(result.decision)}`}>
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={getDecisionColor(result.decision)}>
                  {getDecisionIcon(result.decision)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Application {result.decision}
                  </h1>
                  <p className="text-muted-foreground">
                    Confidence Level: {result.confidence} • {getRiskBadge(result.riskLevel)}
                  </p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground mb-1">Approval Probability</p>
                <p className="text-4xl font-bold">
                  {Math.round(result.approvalProbability * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-fade-in hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Empowr Score
              </CardTitle>
              <CardDescription>AI-enhanced assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-primary mb-4">
                {result.empowrScore}
              </div>
              <Progress value={(result.empowrScore - 300) / 5.5} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">Range: 300-850</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in hover-lift" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                FICO Score
              </CardTitle>
              <CardDescription>Traditional credit score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-secondary mb-4">
                {result.ficoScore}
              </div>
              <Progress value={(result.ficoScore - 300) / 5.5} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">Range: 300-850</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in hover-lift" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Blended Score
              </CardTitle>
              <CardDescription>Combined assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-accent mb-4">
                {result.blendedScore}
              </div>
              <Progress value={(result.blendedScore - 300) / 5.5} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">60% Empowr + 40% FICO</p>
            </CardContent>
          </Card>
        </div>

        {/* Key Factors & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Factors */}
          <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Key Factors
              </CardTitle>
              <CardDescription>Top factors impacting your assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.keyFactors.map((factor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{factor.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(factor.impact * 100)}% impact
                      </span>
                    </div>
                    <Progress value={factor.impact * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recommendations
              </CardTitle>
              <CardDescription>Steps to improve your credit profile</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => {
              localStorage.removeItem("empowrai-result");
              navigate("/assessment");
            }}
          >
            Take New Assessment
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate("/")}
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
