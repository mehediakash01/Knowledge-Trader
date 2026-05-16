export interface ISkillPostCreator {
  id: string;
  name: string;
  email?: string;
  reputationScore?: number;
  expertise?: string[];
  image?: string;
}

export interface ISkillPostCount {
  reviews: number;
  questions?: number;
}

export interface ISyllabusModule {
  moduleNumber: number;
  title: string;
  description: string;
  topics: string[];
  estimatedTime: string;
}

export interface IQuestion {
  id: string;
  postId: string;
  askerId: string;
  asker: { id: string; name: string; image?: string };
  answeredBy?: string;
  answerer?: { id: string; name: string; image?: string } | null;
  body: string;
  answer?: string | null;
  createdAt: string;
  answeredAt?: string | null;
}

export interface ISkillPostReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: string;
    name?: string;
    image?: string;
  };
}

export type RoadmapType = "DAILY" | "HOURLY" | "SEVEN_DAY" | "THIRTY_DAY";

export interface ISkillPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];

  // Public marketing
  shortDescription: string;
  thumbnail?: string;
  teaserAsset?: string;
  roadmapType?: RoadmapType;
  outcomes?: string[];
  targetAudience?: string;
  prerequisites?: string;
  valueProp?: string;

  // Vault (only present when access is granted)
  longDescription?: string;
  syllabus?: ISyllabusModule[];
  resourceLinks?: string[];
  lockedContent?: unknown;

  tokenPrice: number;
  images: string[];
  creatorId: string;
  creator: ISkillPostCreator;
  _count?: ISkillPostCount;
  questions?: IQuestion[];
  reviews?: ISkillPostReview[];

  hasReviewed?: boolean;
  isAccessible?: boolean;
  isOwned?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Legacy / computed
  durationHours?: number;
  level?: string;
}

export interface ISkillPostPaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ISkillPostListResponse {
  meta: ISkillPostPaginationMeta;
  data: ISkillPost[];
}
