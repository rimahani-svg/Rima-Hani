export interface PolicySection {
  title: string;
  rules: string[];
}

export interface PolicyDocument {
  companyName: string;
  documentTitle: string;
  sections: PolicySection[];
  date: string;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  REVIEW = 'REVIEW',
  SIGNED = 'SIGNED',
}

export interface SignatureData {
  employeeName: string;
  employeeId: string;
  timestamp: string;
}