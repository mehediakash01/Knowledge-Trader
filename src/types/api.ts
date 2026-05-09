export interface IErrorSource {
  path: string | number;
  message: string;
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: any;
  data: T;
}

export interface IApiError {
  success?: boolean;
  message?: string;
  errorSources?: IErrorSource[];
}
