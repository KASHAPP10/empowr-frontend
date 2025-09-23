import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  DollarSign, 
  TrendingUp, 
  Home, 
  Users, 
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Shield
} from "lucide-react";
import type { CreditAssessmentData } from "@/types/empowrai";

interface ReviewStepProps {
  data: Partial<CreditAssessmentData>;
  updateData: (section: keyof CreditAssessmentData, data: any) => void;
  onNext: () => void;
}

export function ReviewStep({ data }: ReviewStepProps) {
  const [showSensitive, setShowSensitive] = useState(false);

  // Calculate completion status for each section
  const getSectionCompletion = () => {
    const sections = [
      {
        name: "Personal Information",
        icon: User,
        completed: !!(data.personalInfo?.firstName && data.personalInfo?.lastName && data.personalInfo?.email),
        data: data.personalInfo
      },
      {
        name: "Financial Information", 
        icon: DollarSign,
        completed: !!(data.financialInfo?.monthlyIncome && data.financialInfo?.currentCreditScore),
        data: data.financialInfo
      },
      {
        name: "Alternative Income",
        icon: TrendingUp,
        completed: !!(data.alternativeIncome),
        data: data.alternativeIncome
      },
      {
        name: "Payment Reliability",
        icon: Home,
        completed: !!(data.paymentReliability?.rent?.monthlyAmount),
        data: data.paymentReliability
      },
      {
        name: "Community Trust",
        icon: Users,
        completed: !!(data.communityTrust?.endorsements || data.communityTrust?.references?.length),
        data: data.communityTrust
      },
      {
        name: "Financial Education",
        icon: GraduationCap,
        completed: !!(data.financialEducation?.financialLiteracy?.selfAssessed),
        data: data.financialEducation
      }
    ];

    return sections;
  };

  const sections = getSectionCompletion();
  const completedSections = sections.filter(s => s.completed).length;
  const totalSections = sections.length;
  const completionPercentage = (completedSections / totalSections) * 100;

  // Estimate scores based on provided data
  const estimateEmpowrScore = () => {
    let score = 0;
    
    // Traditional credit component (30%)
    if (data.financialInfo?.currentCreditScore) {
      score += (data.financialInfo.currentCreditScore - 300) / 550 * 30;
    }
    
    // Alternative income (25%)
    const altIncome = (data.alternativeIncome?.gig_work?.monthlyIncome || 0) + 
                     (data.alternativeIncome?.business?.monthlyRevenue || 0) +
                     (data.alternativeIncome?.otherIncome?.monthlyAmount || 0);
    if (altIncome > 0) {
      score += Math.min(altIncome / 2000, 1) * 25;
    }
    
    // Payment reliability (20%)
    const rentReliability = data.paymentReliability?.rent?.onTimePercentage || 0;
    const utilityReliability = data.paymentReliability?.utilities?.onTimePercentage || 0;
    const avgReliability = (rentReliability + utilityReliability) / 2;
    score += (avgReliability / 100) * 20;
    
    // Community trust (10%)
    const endorsements = Object.values(data.communityTrust?.endorsements || {}).reduce((a, b) => a + b, 0);
    const references = data.communityTrust?.references?.length || 0;
    score += Math.min((endorsements + references) / 10, 1) * 10;
    
    // Financial education (10%)
    const courses = data.financialEducation?.courses?.length || 0;
    const selfAssessed = data.financialEducation?.financialLiteracy?.selfAssessed || 0;
    score += Math.min((courses + selfAssessed) / 10, 1) * 10;
    
    // Business health (5%)
    if (data.alternativeIncome?.business?.hasBusinessRevenue) {
      score += Math.min(data.alternativeIncome.business.yearsInBusiness / 3, 1) * 5;
    }
    
    return Math.round(Math.min(score, 100));
  };

  const maskSensitive = (value: string) => {
    if (!showSensitive) {
      return '*'.repeat(value.length);
    }
    return value;
  };

  const empowrScore = estimateEmpowrScore();
  const ficoScore = data.financialInfo?.currentCreditScore || 0;
  const blendedScore = Math.round((empowrScore + ficoScore) / 2);

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Assessment Completion Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-primary">
                {completedSections}/{totalSections} Sections
              </div>
              <div className="text-sm text-muted-foreground">
                {completionPercentage.toFixed(0)}% Complete
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Ready to Submit</div>
              <div className="flex items-center space-x-1 text-success">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Assessment Complete</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="flex items-center space-x-2 p-2 bg-background rounded-lg">
                  {section.completed ? (
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-warning flex-shrink-0" />
                  )}
                  <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate">{section.name}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Estimated Scores */}
      <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
        <CardHeader>
          <CardTitle className="text-lg">Estimated Credit Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-primary mb-1">{ficoScore}</div>
              <div className="text-sm text-muted-foreground">FICO Score</div>
              <div className="text-xs text-muted-foreground mt-1">Traditional</div>
            </div>
            
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-success mb-1">{empowrScore}</div>
              <div className="text-sm text-muted-foreground">Empowr Score</div>
              <div className="text-xs text-muted-foreground mt-1">AI-Enhanced</div>
            </div>
            
            <div className="text-center p-4 bg-background rounded-lg border-2 border-accent">
              <div className="text-3xl font-bold text-accent mb-1">{blendedScore}</div>
              <div className="text-sm text-muted-foreground">Blended Score</div>
              <div className="text-xs text-muted-foreground mt-1">Final Assessment</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-background/50 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              <strong>Note:</strong> These are preliminary estimates. Final scores will be calculated 
              using our advanced AI model after submission.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal & Financial Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Personal & Financial Overview
              <button
                type="button"
                onClick={() => setShowSensitive(!showSensitive)}
                className="text-xs text-primary hover:underline"
              >
                {showSensitive ? 'Hide' : 'Show'} Sensitive Data
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium">Name</div>
              <div className="text-sm text-muted-foreground">
                {data.personalInfo?.firstName} {data.personalInfo?.lastName}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Email</div>
              <div className="text-sm text-muted-foreground">
                {showSensitive ? data.personalInfo?.email : maskSensitive(data.personalInfo?.email || '')}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Monthly Income</div>
              <div className="text-sm text-muted-foreground">
                ${data.financialInfo?.monthlyIncome?.toLocaleString()}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Employment Status</div>
              <div className="text-sm text-muted-foreground capitalize">
                {data.financialInfo?.employmentStatus}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Current Address</div>
              <div className="text-sm text-muted-foreground">
                {data.personalInfo?.address?.city}, {data.personalInfo?.address?.state}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Income Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alternative Income Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium">Gig Work Platforms</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.alternativeIncome?.gig_work?.platforms?.map(platform => (
                  <Badge key={platform} variant="secondary" className="text-xs">{platform}</Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                ${data.alternativeIncome?.gig_work?.monthlyIncome?.toLocaleString()}/month
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Business Revenue</div>
              <div className="text-sm text-muted-foreground">
                {data.alternativeIncome?.business?.hasBusinessRevenue ? 
                  `$${data.alternativeIncome.business.monthlyRevenue?.toLocaleString()}/month` : 
                  'No business revenue'
                }
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Other Income</div>
              <div className="text-sm text-muted-foreground">
                ${data.alternativeIncome?.otherIncome?.monthlyAmount?.toLocaleString()}/month
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Reliability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Reliability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium">Rent Payment History</div>
              <div className="text-sm text-muted-foreground">
                {data.paymentReliability?.rent?.onTimePercentage}% on-time • 
                ${data.paymentReliability?.rent?.monthlyAmount}/month
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Utility Payments</div>
              <div className="text-sm text-muted-foreground">
                {data.paymentReliability?.utilities?.onTimePercentage}% on-time
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Housing Stability</div>
              <div className="text-sm text-muted-foreground">
                {data.paymentReliability?.rent?.yearsAtAddress} years at current address
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community & Education */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Community & Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium">References</div>
              <div className="text-sm text-muted-foreground">
                {data.communityTrust?.references?.length || 0} professional/personal references
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Community Involvement</div>
              <div className="text-sm text-muted-foreground">
                {data.communityTrust?.socialCapital?.volunteerWork ? 'Active volunteer' : 'No volunteer work'}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Financial Education</div>
              <div className="text-sm text-muted-foreground">
                {data.financialEducation?.courses?.length || 0} courses completed
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Self-Assessed Financial Knowledge</div>
              <div className="text-sm text-muted-foreground">
                {data.financialEducation?.financialLiteracy?.selfAssessed}/10
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy & Terms */}
      <Card className="bg-muted/20">
        <CardContent className="pt-6">
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Data Privacy & Security</div>
                <div className="text-muted-foreground">
                  All information is encrypted and protected. We never share your personal data 
                  without explicit consent.
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="text-xs text-muted-foreground">
              By submitting this assessment, you agree to our Terms of Service and Privacy Policy. 
              You consent to the use of this information for credit assessment purposes and 
              acknowledge that results may be shared with authorized financial institutions 
              for loan processing.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}