export interface AppUser {
  user_profile: any;
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  creditBalance?: number;
}

export interface Message {
  id: number;
  sender: number;
  body: string;
  creation_date: string;
  reciever?: number;
}

export type UserDTO = {
  id: number;
  user: string;
  email: string | null;
  userName: string | null;
  name?: string | null;
  password?: string | null;
  role?: string | null;
  user_profile?: {
    avatar: string | null;
    phoneNumber: string | null;
    user_type: number | undefined;
  };
  avatar: string | null;
  dateJoined?: Date | string;
  authToken?: string;
  dateOfBirth?: Date | string;
  age?: number | null;
  phoneNumber?: string | null;
  numberOfYears?: number | null;
  creditBalance?: number | null;
  unread_message_count?: number | null;
  rating?: number | null;
  bio?: string | null;
  description?: string | null;
  profilePicture?: string | null;
  startedDate?: Date;
  last_message?: string;
  last_action?: string;
  expertiseArea?: string;
  pricePerMinute?: string;
  sex?: string;
  customer_question?: string;
  soul_mate_birth_date?: string;
  concern?: string;
  status?: string;
};

export type UserType = "SEER" | "CLIENT" | "ADMIN";

export function formatLastAction(lastAction: string | Date) {
  const last = new Date(lastAction);
  const now = new Date();
  const diffMs = now.getTime() - last.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "à l'instant";
  if (diffMinutes < 60) return `${diffMinutes} min`;
  if (diffHours < 24) return `${diffHours} h`;
  return `${diffDays} j`;
}

export type CreditPackage = {
  id: number;
  features: string[];
  created: string;
  modified: string;
  name: string;
  amount: string;
  max_products: number;
  stripe_plan_id: string;
  credit: number;
};

export interface SelectedUser {
  name?: string | null;
}
