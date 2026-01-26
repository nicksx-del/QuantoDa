export interface SubscriptionItem {
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
  category: string;
  confidence: number;
  recommendation?: string;
}

export interface AnalysisResult {
  totalMonthly: number;
  totalYearly: number;
  subscriptionCount: number;
  items: SubscriptionItem[];
  insights: string[];
}

export enum FileType {
  PDF = 'application/pdf',
  CSV = 'text/csv',
}

// Gemini specific types for Schema
export enum SchemaType {
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN'
}