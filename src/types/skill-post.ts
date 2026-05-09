export interface ISkillPostCreator {
  id: string;
  name: string;
  email?: string;
  reputationScore?: number;
  expertise?: string[];
}

export interface ISkillPostCount {
  reviews: number;
}

export interface ISkillPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  shortDescription: string;
  longDescription?: string;
  previewContent?: unknown;
  lockedContent?: unknown;
  durationHours?: number;
  level?: string;
  tokenPrice: number;
  images: string[];
  creatorId: string;
  creator: ISkillPostCreator;
  _count?: ISkillPostCount;
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
