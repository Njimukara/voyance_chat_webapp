export interface Seer {
  id: number;
  imageUrl: string;
  user: string;
  name: string;
  level: string;
  domain: string;
  rating: number;
  description: string;
  credit_per_message: number;
  specialties: Specialty[];
}

export interface Specialty {
  id: number;
  name: string;
}
