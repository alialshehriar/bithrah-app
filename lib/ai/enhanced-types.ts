// Enhanced Evaluation Types with Global Standards

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface RiskItem {
  risk: string;
  likelihood: 'منخفض' | 'متوسط' | 'عالي';
  impact: 'منخفض' | 'متوسط' | 'عالي';
  mitigation: string;
  priority: 'منخفض' | 'متوسط' | 'عالي' | 'حرج';
}

export interface RiskMatrix {
  risks: RiskItem[];
  overallRiskLevel: 'منخفض' | 'متوسط' | 'عالي' | 'حرج';
}

export interface FinancialMetrics {
  estimatedROI: number; // %
  breakEvenMonths: number;
  monthlyBurnRate: number; // SAR
  projectedRevenue: {
    year1: number;
    year2: number;
    year3: number;
  };
  cashFlowAnalysis: string;
  profitMargin: number; // %
}

export interface MarketAnalysis {
  TAM: number; // Total Addressable Market (SAR)
  SAM: number; // Serviceable Available Market (SAR)
  SOM: number; // Serviceable Obtainable Market (SAR)
  marketGrowthRate: number; // %
  competitorCount: number;
  marketShare: number; // % expected
  marketTrends: string[];
}

export interface CompetitiveBenchmark {
  competitorName: string;
  strengths: string[];
  weaknesses: string[];
  marketPosition: string;
  differentiators: string[];
}

export interface SMARTCriteria {
  specific: {
    score: number;
    analysis: string;
  };
  measurable: {
    score: number;
    analysis: string;
  };
  achievable: {
    score: number;
    analysis: string;
  };
  relevant: {
    score: number;
    analysis: string;
  };
  timeBound: {
    score: number;
    analysis: string;
  };
  overallScore: number;
}

export interface InnovationScore {
  score: number; // 0-100
  uniqueness: number; // 0-100
  marketDisruption: number; // 0-100
  technologyAdvancement: number; // 0-100
  analysis: string;
}

export interface ScalabilityScore {
  score: number; // 0-100
  geographicExpansion: number; // 0-100
  productExpansion: number; // 0-100
  operationalScalability: number; // 0-100
  analysis: string;
}

export interface TeamReadinessScore {
  score: number; // 0-100
  technicalSkills: number; // 0-100
  businessExperience: number; // 0-100
  industryKnowledge: number; // 0-100
  leadershipQuality: number; // 0-100
  analysis: string;
}

export interface MarketTimingScore {
  score: number; // 0-100
  marketReadiness: number; // 0-100
  competitiveLandscape: number; // 0-100
  regulatoryEnvironment: number; // 0-100
  economicConditions: number; // 0-100
  analysis: string;
}

export interface EnhancedIdeaEvaluation {
  // Existing fields...
  overallScore: number;
  successProbability: number;
  investmentRecommendation: string;
  
  // Global Standards
  swotAnalysis: SWOTAnalysis;
  riskMatrix: RiskMatrix;
  financialMetrics: FinancialMetrics;
  marketAnalysis: MarketAnalysis;
  smartCriteria: SMARTCriteria;
  
  // Additional Scores
  innovationScore: InnovationScore;
  scalabilityScore: ScalabilityScore;
  teamReadinessScore: TeamReadinessScore;
  marketTimingScore: MarketTimingScore;
  
  // Competitive Analysis
  competitiveBenchmarks: CompetitiveBenchmark[];
  
  // Existing perspectives (keep all)
  strategicAnalyst?: any;
  financialExpert?: any;
  saudiMarketExpert?: any;
  operationsManager?: any;
  marketingExpert?: any;
  riskAnalyst?: any;
  
  // Existing recommendations (keep all)
  marketOpportunity?: any;
  financialViability?: any;
  executionReadiness?: any;
  immediateActions?: string[];
  shortTermSteps?: string[];
  longTermVision?: string[];
  estimatedFunding?: number;
  targetAudience?: string;
  keySuccessFactors?: string[];
  practicalSolutions?: string[];
  implementationPlan?: any[];
  successfulExamples?: any[];
}
