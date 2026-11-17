export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string | null;
  avatar?: string | null;
  location?: string | null;
  website?: string | null;
  phone?: string | null;
  isVerified: boolean;
  membershipTier?: "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE";
  createdAt: Date;
  updatedAt: Date;
}
