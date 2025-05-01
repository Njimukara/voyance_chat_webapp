export interface Seer {
  id: number;
  imageUrl: string;
  user: string;
  name: string;
  rating: number;
  description: string;
  pricePerMinute: number;
  specialties: Specialty[];
}

export interface Specialty {
  id: number;
  name: string;
}
