export interface PlayerListParams {
  page?: number;
  pageSize?: number;
  team?: 'real' | 'inter' | 'united';
}

export interface PlayerDetailParams {
  number?: number;
  name?: string;
  code?: string;
  call_name?: string;
  real_name?: string;
  avatar_url?: string;
  is_injured?: boolean;
  team?: string;
}
