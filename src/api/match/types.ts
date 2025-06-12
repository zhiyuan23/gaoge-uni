export interface MatchListParams {
  page?: number;
  pageSize?: number;
  type?: 'cup' | 'league' | 'champion';
  latestTime?: 'latest' | 'previous';
  status?: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
}

export interface MatchDetailParams {
  number?: number;
  name?: string;
  code?: string;
  call_name?: string;
  real_name?: string;
  avatar_url?: string;
  is_injured?: boolean;
  team?: string;
}
