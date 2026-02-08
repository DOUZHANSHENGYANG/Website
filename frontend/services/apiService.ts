import { Category, Config, Post } from '../types';
import { apiRequest, clearAuthToken, getAuthToken, setAuthToken } from './apiClient';

interface LoginResult {
  token: string;
  username: string;
}

interface SessionResult {
  logged_in: boolean;
  username?: string | null;
}

export interface UploadedAsset {
  original_name: string;
  url: string;
  relative_path: string;
  size: number;
}

export interface PagedResponse<T> {
  records: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface PostMetricResult {
  post_id: string;
  view_count: number;
  like_count: number;
}

export const api = {
  async getPosts(): Promise<Post[]> {
    return apiRequest<Post[]>('/posts', { method: 'GET' }, false);
  },

  async getPostsPage(params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    status?: 'draft' | 'published';
    categoryId?: number;
    createdFrom?: string;
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
  }): Promise<PagedResponse<Post>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.pageSize) searchParams.set('page_size', String(params.pageSize));
    if (params?.keyword) searchParams.set('keyword', params.keyword);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.categoryId) searchParams.set('category_id', String(params.categoryId));
    if (params?.createdFrom) searchParams.set('created_from', params.createdFrom);
    if (params?.createdTo) searchParams.set('created_to', params.createdTo);
    if (params?.updatedFrom) searchParams.set('updated_from', params.updatedFrom);
    if (params?.updatedTo) searchParams.set('updated_to', params.updatedTo);

    const query = searchParams.toString();
    return apiRequest<PagedResponse<Post>>(`/posts/page${query ? `?${query}` : ''}`, { method: 'GET' }, false);
  },

  async savePost(post: Partial<Post>): Promise<Post> {
    return apiRequest<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(post)
    });
  },

  async deletePost(id: string): Promise<void> {
    await apiRequest<void>(`/posts/${id}`, {
      method: 'DELETE'
    });
  },

  async increasePostView(id: string): Promise<PostMetricResult> {
    return apiRequest<PostMetricResult>(`/posts/${id}/view`, {
      method: 'POST',
      body: JSON.stringify({})
    }, false);
  },

  async likePost(id: string): Promise<PostMetricResult> {
    return apiRequest<PostMetricResult>(`/posts/${id}/like`, {
      method: 'POST',
      body: JSON.stringify({})
    }, false);
  },

  async unlikePost(id: string): Promise<PostMetricResult> {
    return apiRequest<PostMetricResult>(`/posts/${id}/unlike`, {
      method: 'POST',
      body: JSON.stringify({})
    }, false);
  },

  async getCategories(): Promise<Category[]> {
    return apiRequest<Category[]>('/categories', { method: 'GET' }, false);
  },

  async getCategoriesPage(params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    slug?: string;
  }): Promise<PagedResponse<Category>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.pageSize) searchParams.set('page_size', String(params.pageSize));
    if (params?.keyword) searchParams.set('keyword', params.keyword);
    if (params?.slug) searchParams.set('slug', params.slug);

    const query = searchParams.toString();
    return apiRequest<PagedResponse<Category>>(`/categories/page${query ? `?${query}` : ''}`, { method: 'GET' }, false);
  },

  async saveCategory(category: Partial<Category>): Promise<Category> {
    return apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    });
  },

  async deleteCategory(id: number): Promise<void> {
    await apiRequest<void>(`/categories/${id}`, {
      method: 'DELETE'
    });
  },

  async uploadAssets(files: File[], folder?: string): Promise<UploadedAsset[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (folder) {
      formData.append('folder', folder);
    }

    return apiRequest<UploadedAsset[]>('/assets/upload', {
      method: 'POST',
      body: formData
    });
  },

  async getConfigs(): Promise<Config[]> {
    return apiRequest<Config[]>('/configs', { method: 'GET' }, false);
  },

  async updateConfig(key: string, value: string, type?: string): Promise<Config> {
    return apiRequest<Config>(`/configs/${key}`, {
      method: 'POST',
      body: JSON.stringify({ value, type })
    });
  },

  async login(username: string, password: string): Promise<boolean> {
    try {
      const result = await apiRequest<LoginResult>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      }, false);
      setAuthToken(result.token);
      return true;
    } catch {
      clearAuthToken();
      return false;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiRequest<void>('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({})
      });
    } finally {
      clearAuthToken();
    }
  },

  async isLoggedIn(): Promise<boolean> {
    if (!getAuthToken()) {
      return false;
    }

    try {
      const session = await apiRequest<SessionResult>('/auth/session', {
        method: 'GET'
      });
      return session.logged_in;
    } catch {
      clearAuthToken();
      return false;
    }
  }
};
