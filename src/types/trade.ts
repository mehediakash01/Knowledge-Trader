export interface ITradePostSummary {
  id: string;
  title: string;
  slug: string;
  tokenPrice: number;
}

export interface ITradeUserSummary {
  id: string;
  name?: string;
  email?: string;
}

export interface IMyTrade {
  id: string;
  postId: string;
  status: string;
  post: ITradePostSummary;
  learner?: ITradeUserSummary;
  teacher?: ITradeUserSummary;
}

export interface IMyTradesResponse {
  learningTrades: IMyTrade[];
  teachingTrades: IMyTrade[];
}
