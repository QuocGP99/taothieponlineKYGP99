export type LeadStatus = 'new' | 'contacted' | 'closed';

export interface LeadData {
  id: string;
  fullName: string;
  phone: string;
  schoolClass: string;
  studentCount?: number | string;
  region: string;
  expectedMonth: string;
  notes?: string;
  createdAt: string;
  status: LeadStatus;
  discountCode?: string;
}
