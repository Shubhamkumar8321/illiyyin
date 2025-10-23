export interface Campaign {
  id: number;
  title: string;
  content: string;
  description?: string;
  category: string;
  goal: number;
  raised: number;
  status: "pending" | "approved" | "rejected" | "completed";
  endDate: string;
  creator?: {
    name: string;
    email: string;
  };
  isFeatured?: boolean;
  wordpressData?: any;
}

export interface User {
  id: number;
  name: string;
  email: string;
  organization?: string;
  role: "admin" | "fundraiser";
  documents?: Document[];
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface DashboardStats {
  totalCampaigns: number;
  pendingCampaigns: number;
  approvedCampaigns: number;
  rejectedCampaigns: number;
  completedCampaigns: number;
  totalRaised: number;
}
