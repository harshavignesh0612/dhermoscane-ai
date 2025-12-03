export enum RiskLevel {
  LOW = 'Low Risk',
  MODERATE = 'Moderate Risk',
  HIGH = 'High Risk'
}

export enum Classification {
  BENIGN = 'Likely Benign',
  INDETERMINATE = 'Indeterminate',
  MALIGNANT = 'Potentially Malignant'
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  classification: Classification;
  confidence: number;
  findings: string[];
  recommendation: string;
}

export enum AppState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  RESULTS = 'RESULTS'
}

export enum Page {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  DOCTORS = 'DOCTORS',
  PREDICTION = 'PREDICTION',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  PROFILE = 'PROFILE'
}

export interface Doctor {
  name: string;
  address?: string;
  rating?: string;
  uri?: string;
}

export interface UserProfileData {
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  avatar?: string;
}

export interface PredictionHistoryItem {
  id: string;
  date: string;
  imageUrl: string;
  result: AnalysisResult;
}