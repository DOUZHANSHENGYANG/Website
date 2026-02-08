export interface Post {
  id: string;
  title: string;
  content: string;
  summary: string;
  status: 'draft' | 'published';
  category_id: number;
  created_at: string;
  updated_at: string;
  view_count?: number;
  like_count?: number;
}

export interface Config {
  key: string;
  value: string;
  type: 'WEBSITE_SETTINGS' | 'PERSONAL_INFO';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

export type ViewState = 
  | 'home' 
  | 'categories'
  | 'post-search'
  | 'post-detail' 
  | 'about' 
  | 'login' 
  | 'admin-dashboard' 
  | 'admin-posts' 
  | 'admin-categories' 
  | 'admin-settings' 
  | 'post-editor';
