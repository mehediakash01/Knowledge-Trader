export interface IUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  image?: string;
  bio?: string | null;
  tagline?: string | null;
  reputationScore?: number;
  ktBalance?: number;
  interests?: string[];
  socialLinks?: Array<{ platform: string; url: string }>;
  experience?: Array<{ title: string; company: string; duration: string }>;
  expertise?: Array<{ name: string; level: "Beginner" | "Intermediate" | "Expert" }>;
  learningPath?: Array<{ name: string; priority: number }>;
}

export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface IAuthPayload {
  user?: IUser | null;
  accessToken?: string | null;
  refreshToken?: string | null;
}
