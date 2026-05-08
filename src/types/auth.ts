export interface IUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  image?: string;
  ktBalance?: number;
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
