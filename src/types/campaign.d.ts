export interface Campaign {
  _id: string;
  title: string;
  description: string;
  images: string[];
  organizer?: string;
  raised: number;
  goal: number;
  tags?: string[];
  donations?: { heading: string; amount: number; text: string }[];
  supporters?: {
    name: string;
    amount: number;
    avatar?: string;
    daysAgo?: number;
  }[];
}
