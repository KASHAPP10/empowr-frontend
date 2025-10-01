import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreditFeatures {
  credit_score: number;
  monthly_income: number;
  total_alternative_income: number;
  payment_reliability_score: number;
  cash_flow_consistency: number;
  platform_ratings: number;
  community_trust_score: number;
  financial_engagement_score: number;
  income_diversification: number;
  business_health: number;
}

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

// Feature importance weights (from the trained model)
const featureImportance = {
  credit_score: 0.25,
  monthly_income: 0.20,
  payment_reliability_score: 0.15,
  total_alternative_income: 0.12,
  community_trust_score: 0.10,
  financial_engagement_score: 0.08,
  cash_flow_consistency: 0.04,
  platform_ratings: 0.03,
  income_diversification: 0.02,
  business_health: 0.01,
};

function normalizeFeature(name: string, value: number): number {
  switch (name) {
    case 'credit_score':
      return (value - 300) / 550;
    case 'monthly_income':
    case 'total_alternative_income':
      return Math.min(Math.log(value / 1000) / 3, 1.0);
    default:
      return Math.min(value, 1.0);
  }
}

function calculateEmpowrScore(features: CreditFeatures): number {
  let score = 0;
  
  for (const [key, value] of Object.entries(features)) {
    const importance = featureImportance[key as keyof typeof featureImportance] || 0.1;
    const normalized = normalizeFeature(key, value);
    score += importance * normalized;
  }
  
  // Convert to 300-850 scale (like FICO)
  return Math.round(300 + (score * 550));
}

function assessCredit(features: CreditFeatures): AssessmentResult {
  // Calculate Empowr Score
  const empowrScore = calculateEmpowrScore(features);
  const ficoScore = features.credit_score;
  
  // Blended score (60% Empowr, 40% FICO)
  const blendedScore = Math.round(empowrScore * 0.6 + ficoScore * 0.4);
  
  // Calculate approval probability
  const approvalScore = (
    (features.credit_score - 300) / 550 * 0.3 +
    Math.log(features.monthly_income / 1000) / 3 * 0.25 +
    features.payment_reliability_score * 0.2 +
    features.community_trust_score / 3 * 0.1 +
    features.financial_engagement_score * 0.1 +
    features.cash_flow_consistency * 0.05
  );
  
  const approvalProbability = Math.min(Math.max(approvalScore, 0), 1);
  
  // Determine decision
  let decision: 'APPROVED' | 'CONDITIONAL' | 'DENIED';
  let confidence: 'High' | 'Medium' | 'Low';
  let riskLevel: 'low' | 'medium' | 'high';
  
  if (approvalProbability >= 0.7) {
    decision = 'APPROVED';
    confidence = 'High';
    riskLevel = 'low';
  } else if (approvalProbability >= 0.55) {
    decision = 'APPROVED';
    confidence = 'Medium';
    riskLevel = 'low';
  } else if (approvalProbability >= 0.4) {
    decision = 'CONDITIONAL';
    confidence = 'Medium';
    riskLevel = 'medium';
  } else if (approvalProbability >= 0.25) {
    decision = 'CONDITIONAL';
    confidence = 'Low';
    riskLevel = 'medium';
  } else {
    decision = 'DENIED';
    confidence = 'High';
    riskLevel = 'high';
  }
  
  // Calculate feature contributions
  const featureContributions = Object.entries(features).map(([name, value]) => {
    const importance = featureImportance[name as keyof typeof featureImportance] || 0.1;
    const normalized = normalizeFeature(name, value);
    const impact = importance * normalized;
    
    return {
      name: humanizeFeatureName(name),
      value,
      impact,
      importance,
    };
  });
  
  // Sort by impact and get top 5
  const keyFactors = featureContributions
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 5);
  
  // Generate recommendations
  const recommendations = generateRecommendations(features, decision);
  
  return {
    decision,
    confidence,
    empowrScore,
    ficoScore,
    blendedScore,
    approvalProbability,
    riskLevel,
    keyFactors,
    recommendations,
  };
}

function humanizeFeatureName(name: string): string {
  const mapping: Record<string, string> = {
    credit_score: 'Traditional Credit Score',
    monthly_income: 'Monthly Income',
    total_alternative_income: 'Alternative Income Sources',
    payment_reliability_score: 'Payment History',
    cash_flow_consistency: 'Business Cash Flow Stability',
    platform_ratings: 'Gig Platform Performance',
    community_trust_score: 'Community Trust',
    financial_engagement_score: 'Financial Education',
    income_diversification: 'Income Diversification',
    business_health: 'Overall Business Health',
  };
  return mapping[name] || name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function generateRecommendations(features: CreditFeatures, decision: string): string[] {
  const recommendations: string[] = [];
  
  if (features.credit_score < 650) {
    recommendations.push('Focus on improving traditional credit score by paying bills on time');
  }
  
  if (features.payment_reliability_score < 0.8) {
    recommendations.push('Build stronger payment history with rent and utilities');
  }
  
  if (features.financial_engagement_score < 0.5) {
    recommendations.push('Complete financial literacy courses to strengthen your profile');
  }
  
  if (features.community_trust_score < 2) {
    recommendations.push('Seek community endorsements and professional references');
  }
  
  if (features.total_alternative_income < 500) {
    recommendations.push('Consider diversifying income with gig work or side business');
  }
  
  if (decision === 'APPROVED') {
    recommendations.push('Consider applying for credit to continue building financial strength');
  }
  
  return recommendations.slice(0, 4);
}

function extractFeatures(assessmentData: any): CreditFeatures {
  const { financialInfo, alternativeIncome, paymentReliability, communityTrust, financialEducation } = assessmentData;
  
  // Calculate total alternative income
  const total_alternative_income = 
    (alternativeIncome?.gig_work?.monthlyIncome || 0) +
    (alternativeIncome?.business?.monthlyRevenue || 0) +
    (alternativeIncome?.otherIncome?.monthlyAmount || 0);
  
  // Calculate payment reliability score (0-1)
  const payment_reliability_score = (
    (paymentReliability?.rent?.onTimePercentage || 0) / 100 * 0.5 +
    (paymentReliability?.utilities?.onTimePercentage || 0) / 100 * 0.5
  );
  
  // Calculate cash flow consistency (0-1)
  const consistencyMap = { high: 0.9, medium: 0.6, low: 0.3 };
  const cash_flow_consistency = consistencyMap[alternativeIncome?.gig_work?.consistency as keyof typeof consistencyMap] || 0.5;
  
  // Platform ratings (1-5 scale, normalize to 0-1)
  const platform_ratings = (alternativeIncome?.gig_work?.averageRating || 3) / 5;
  
  // Community trust score (log scale)
  const totalEndorsements = 
    (communityTrust?.endorsements?.professional || 0) +
    (communityTrust?.endorsements?.personal || 0) +
    (communityTrust?.endorsements?.community || 0);
  const community_trust_score = Math.log1p(totalEndorsements + (communityTrust?.references?.length || 0));
  
  // Financial engagement score (0-1)
  const coursesCompleted = financialEducation?.courses?.length || 0;
  const financial_engagement_score = Math.min(coursesCompleted / 10, 1);
  
  // Income diversification (0-1)
  const hasMultipleSources = (alternativeIncome?.gig_work?.platforms?.length || 0) > 1 ? 0.3 : 0;
  const hasBusinessIncome = alternativeIncome?.business?.hasBusinessRevenue ? 0.4 : 0;
  const hasOtherIncome = (alternativeIncome?.otherIncome?.sources?.length || 0) > 0 ? 0.3 : 0;
  const income_diversification = hasMultipleSources + hasBusinessIncome + hasOtherIncome;
  
  // Business health (0-1)
  const business_health = alternativeIncome?.business?.hasBusinessRevenue
    ? cash_flow_consistency * 0.7 + (alternativeIncome.business.yearsInBusiness / 10) * 0.3
    : 0;
  
  return {
    credit_score: financialInfo?.currentCreditScore || 650,
    monthly_income: financialInfo?.monthlyIncome || 3000,
    total_alternative_income,
    payment_reliability_score,
    cash_flow_consistency,
    platform_ratings,
    community_trust_score,
    financial_engagement_score,
    income_diversification,
    business_health,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const assessmentData = await req.json();
    console.log('Received assessment data:', JSON.stringify(assessmentData, null, 2));
    
    // Extract features from form data
    const features = extractFeatures(assessmentData);
    console.log('Extracted features:', features);
    
    // Perform credit assessment
    const result = assessCredit(features);
    console.log('Assessment result:', result);
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Assessment error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Assessment failed',
        details: error instanceof Error ? error.stack : String(error)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
