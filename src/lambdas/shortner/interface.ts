export interface URL {
  namespace?: string;
  short?: string;
  long: string;
  expiry?: number;
  metadata?: any;
}

export interface URLS {
  urls: URL[];
}
export interface URLStats {
  namespace: string;
  short: string;
  long: string;
  count: number;
  metadata?: any;
}
