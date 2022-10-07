export interface URL {
  workspace?: string;
  url: string;
  alias: string;
  expiry?: number;
  properties?: any;
  tags?: string[];
}

export interface URLS {
  urls: URL[];
}
export interface URLStats {
  workspace: string;
  url: string;
  count: number;
  metadata?: any;
}
