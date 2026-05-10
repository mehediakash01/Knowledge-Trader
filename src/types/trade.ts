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

export interface IBarterRequest {
  id: string;
  senderId: string;
  receiverId: string;
  skillOfferedId: string;
  skillRequestedId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  skillOffered: ITradePostSummary;
  skillRequested: ITradePostSummary;
  sender?: ITradeUserSummary;
  receiver?: ITradeUserSummary;
  createdAt: string;
}

export interface IMyTradesResponse {
  learningTrades: IMyTrade[];
  teachingTrades: IMyTrade[];
  sentBarters: IBarterRequest[];
  receivedBarters: IBarterRequest[];
}
