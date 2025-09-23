// EmpowrAI Credit Assessment Types
// These align with the Python model's feature requirements

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface FinancialInfo {
  monthlyIncome: number;
  currentCreditScore: number;
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired';
  employmentLength: number; // in months
  bankAccountBalance: number;
  monthlyExpenses: number;
}

export interface AlternativeIncome {
  gig_work: {
    platforms: string[];
    monthlyIncome: number;
    averageRating: number;
    yearsActive: number;
    consistency: 'high' | 'medium' | 'low'; // Based on income variability
  };
  business: {
    hasBusinessRevenue: boolean;
    monthlyRevenue: number;
    businessType: string;
    yearsInBusiness: number;
    seasonality: 'none' | 'low' | 'high';
  };
  otherIncome: {
    sources: string[];
    monthlyAmount: number;
  };
}

export interface PaymentReliability {
  rent: {
    monthlyAmount: number;
    onTimePercentage: number; // 0-100
    yearsAtAddress: number;
  };
  utilities: {
    onTimePercentage: number; // 0-100
    averageMonthlyAmount: number;
  };
  otherRecurring: {
    type: string;
    onTimePercentage: number;
    monthlyAmount: number;
  }[];
}

export interface CommunityTrust {
  endorsements: {
    professional: number;
    personal: number;
    community: number;
  };
  references: {
    name: string;
    relationship: string;
    yearsKnown: number;
    contact: string;
  }[];
  socialCapital: {
    volunteerWork: boolean;
    communityInvolvement: string;
    leadershipRoles: number;
  };
}

export interface FinancialEducation {
  courses: {
    name: string;
    provider: string;
    completionDate: string;
    certificateUrl?: string;
  }[];
  businessTraining: {
    programs: string[];
    hoursCompleted: number;
  };
  financialLiteracy: {
    selfAssessed: number; // 1-10 scale
    certifications: string[];
  };
}

// Combined assessment data structure
export interface CreditAssessmentData {
  personalInfo: PersonalInfo;
  financialInfo: FinancialInfo;
  alternativeIncome: AlternativeIncome;
  paymentReliability: PaymentReliability;
  communityTrust: CommunityTrust;
  financialEducation: FinancialEducation;
}

// Model features that align with Python implementation
export interface EmpowrAIFeatures {
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

// Assessment results
export interface CreditAssessment {
  id: string;
  userId: string;
  submittedAt: string;
  ficoScore: number;
  empowrScore: number;
  blendedScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  approvalProbability: number;
  features: EmpowrAIFeatures;
  recommendations: string[];
  status: 'pending' | 'completed' | 'failed';
}

// Form step states
export interface AssessmentFormState {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  data: Partial<CreditAssessmentData>;
  isValid: boolean;
  errors: Record<string, string>;
}

// Dashboard data
export interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
  };
  latestAssessment: CreditAssessment | null;
  assessmentHistory: CreditAssessment[];
  creditTrend: {
    date: string;
    ficoScore: number;
    empowrScore: number;
  }[];
  insights: {
    type: 'strength' | 'improvement' | 'tip';
    title: string;
    description: string;
    impact: number; // potential score improvement
  }[];
}