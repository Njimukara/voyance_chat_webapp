export interface Seer {
  id: number;
  imageUrl: string;
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
