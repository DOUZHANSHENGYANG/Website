import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Category, Config, Post, ViewState } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Language } from './utils/i18n';
import { api, PostMetricResult } from './services/apiService';

// Layouts
import { LayoutWrapper } from './layouts/LayoutWrapper';
import { AdminWrapper } from './layouts/AdminWrapper';

// Pages
import { PublicHome } from './pages/PublicHome';
import { PublicCategories } from './pages/PublicCategories';
import { PublicPostSearch } from './pages/PublicPostSearch';
import { PublicPost } from './pages/PublicPost';
import { PublicAbout } from './pages/PublicAbout';
import { LoginScreen } from './pages/LoginScreen';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminPosts } from './pages/AdminPosts';
import { AdminCategories } from './pages/AdminCategories';
import { AdminSettings } from './pages/AdminSettings';
import { AdminPostEditorPage } from './pages/AdminPostEditorPage';

const ADMIN_VIEWS: ViewState[] = ['admin-dashboard', 'admin-posts', 'admin-categories', 'admin-settings', 'post-editor'];

const App = () => {
  const [view, setView] = useState<ViewState>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [postBackView, setPostBackView] = useState<ViewState>('home');
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingSharedPostId, setPendingSharedPostId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('post');
  });
  const [publicSearchState, setPublicSearchState] = useState<{ categoryId?: number; seedToken: number }>({
    categoryId: undefined,
    seedToken: 0
  });

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const syncPostInUrl = useCallback((postId?: string) => {
    const url = new URL(window.location.href);
    if (postId) {
      url.searchParams.set('post', postId);
    } else {
      url.searchParams.delete('post');
    }
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({}, '', next);
  }, []);

  const applyMetricResult = useCallback((metric: PostMetricResult) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === metric.post_id
          ? { ...post, view_count: metric.view_count, like_count: metric.like_count }
          : post
      )
    );

    setActivePost((prevPost) =>
      prevPost && prevPost.id === metric.post_id
        ? { ...prevPost, view_count: metric.view_count, like_count: metric.like_count }
        : prevPost
    );
  }, []);

  const refreshData = useCallback(async () => {
    const [nextPosts, nextConfigs, nextCategories] = await Promise.all([
      api.getPosts(),
      api.getConfigs(),
      api.getCategories()
    ]);

    setPosts(nextPosts);
    setConfigs(nextConfigs);
    setCategories(nextCategories);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [loggedIn] = await Promise.all([
          api.isLoggedIn(),
          refreshData()
        ]);
        setIsLoggedIn(loggedIn);
      } catch (error) {
        console.error(error);
        alert(error instanceof Error ? error.message : '数据加载失败，请确认后端已启动。');
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [refreshData]);

  useEffect(() => {
    if (loading || !pendingSharedPostId) {
      return;
    }

    const targetPost = posts.find((post) => post.id === pendingSharedPostId);
    if (targetPost) {
      setActivePost(targetPost);
      setPostBackView('home');
      setView('post-detail');
      scrollToTop();
    } else {
      syncPostInUrl(undefined);
    }
    setPendingSharedPostId(null);
  }, [loading, pendingSharedPostId, posts, scrollToTop, syncPostInUrl]);

  const handleLogin = useCallback(async (username: string, password: string) => {
    const success = await api.login(username, password);
    if (success) {
      setIsLoggedIn(true);
      setView('admin-dashboard');
      await refreshData();
      return true;
    }
    return false;
  }, [refreshData]);

  const handleLogout = useCallback(async () => {
    await api.logout();
    setIsLoggedIn(false);
    syncPostInUrl(undefined);
    setView('home');
  }, [syncPostInUrl]);

  const savePost = useCallback(async (postData: Partial<Post>) => {
    await api.savePost(postData);
    await refreshData();
    setView('admin-posts');
    setEditingPost(null);
  }, [refreshData]);

  const queryPostPage = useCallback((params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    status?: 'draft' | 'published';
    categoryId?: number;
    createdFrom?: string;
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
  }) => api.getPostsPage(params), []);

  const deletePost = useCallback(async (id: string) => {
    if (confirm('Are you sure?')) {
      await api.deletePost(id);
      await refreshData();
    }
  }, [refreshData]);

  const saveCategory = useCallback(async (cat: Partial<Category>) => {
    await api.saveCategory(cat);
    await refreshData();
  }, [refreshData]);

  const queryCategoryPage = useCallback((params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    slug?: string;
  }) => api.getCategoriesPage(params), []);

  const openCreatePostPage = useCallback(() => {
    setEditingPost(null);
    setView('post-editor');
  }, []);

  const openEditPostPage = useCallback((post: Post) => {
    setEditingPost(post);
    setView('post-editor');
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    if (confirm('Delete Category?')) {
      await api.deleteCategory(id);
      await refreshData();
    }
  }, [refreshData]);

  const updateConfig = useCallback(async (key: string, value: string) => {
    await api.updateConfig(key, value);
    await refreshData();
  }, [refreshData]);

  const openPostDetail = useCallback((post: Post, fromView: ViewState, updateUrl = true) => {
    setActivePost(post);
    setPostBackView(fromView);
    setView('post-detail');
    scrollToTop();
    if (updateUrl) {
      syncPostInUrl(post.id);
    }
  }, [scrollToTop, syncPostInUrl]);

  const openCategorySearch = useCallback((categoryId: number) => {
    setPublicSearchState({
      categoryId,
      seedToken: Date.now()
    });
    syncPostInUrl(undefined);
    setView('post-search');
    scrollToTop();
  }, [scrollToTop, syncPostInUrl]);

  const trackPostView = useCallback(async (postId: string) => {
    const metric = await api.increasePostView(postId);
    applyMetricResult(metric);
    return metric;
  }, [applyMetricResult]);

  const likePost = useCallback(async (postId: string) => {
    const metric = await api.likePost(postId);
    applyMetricResult(metric);
    return metric;
  }, [applyMetricResult]);

  const unlikePost = useCallback(async (postId: string) => {
    const metric = await api.unlikePost(postId);
    applyMetricResult(metric);
    return metric;
  }, [applyMetricResult]);

  const handlePublicNavigate = useCallback((nextView: ViewState) => {
    if (nextView !== 'post-detail') {
      syncPostInUrl(undefined);
    }
    setView(nextView);
  }, [syncPostInUrl]);

  const currentLanguage = useMemo<Language>(() => {
    const lang = configs.find((c) => c.key === 'language')?.value;
    return lang === 'en' ? 'en' : 'zh';
  }, [configs]);

  const shouldShowLogin = view === 'login' || (ADMIN_VIEWS.includes(view) && !isLoggedIn);

  const renderView = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center text-slate-600 dark:text-white">
          Loading data...
        </div>
      );
    }

    if (shouldShowLogin) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    if (view === 'home') {
      return (
        <LayoutWrapper configs={configs} onNavigate={handlePublicNavigate} currentView={view}>
          <PublicHome
            posts={posts}
            categories={categories}
            configs={configs}
            onReadPost={(post) => openPostDetail(post, 'home')}
          />
        </LayoutWrapper>
      );
    }

    if (view === 'categories') {
      return (
        <LayoutWrapper configs={configs} onNavigate={handlePublicNavigate} currentView={view}>
          <PublicCategories
            categories={categories}
            posts={posts}
            configs={configs}
            onBrowseCategory={openCategorySearch}
          />
        </LayoutWrapper>
      );
    }

    if (view === 'post-search') {
      return (
        <LayoutWrapper configs={configs} onNavigate={handlePublicNavigate} currentView={view}>
          <PublicPostSearch
            categories={categories}
            onReadPost={(post) => openPostDetail(post, 'post-search')}
            onQueryPage={queryPostPage}
            initialCategoryId={publicSearchState.categoryId}
            seedToken={publicSearchState.seedToken}
            onBackToCategories={() => setView('categories')}
          />
        </LayoutWrapper>
      );
    }

    if (view === 'about') {
      return (
        <LayoutWrapper configs={configs} onNavigate={handlePublicNavigate} currentView={view}>
          <PublicAbout
            configs={configs}
            postCount={posts.filter((p) => p.status === 'published').length}
            categoryCount={categories.length}
          />
        </LayoutWrapper>
      );
    }

    if (view === 'post-detail' && activePost) {
      return (
        <LayoutWrapper configs={configs} onNavigate={handlePublicNavigate} currentView={view}>
          <PublicPost
            post={activePost}
            configs={configs}
            onTrackView={trackPostView}
            onLike={likePost}
            onUnlike={unlikePost}
            onBack={() => {
              syncPostInUrl(undefined);
              setView(postBackView);
            }}
          />
        </LayoutWrapper>
      );
    }

    if (view === 'admin-dashboard') {
      return (
        <AdminWrapper current="admin-dashboard" onChangeView={setView} onLogout={handleLogout}>
          <AdminDashboard posts={posts} />
        </AdminWrapper>
      );
    }

    if (view === 'admin-posts') {
      return (
        <AdminWrapper current="admin-posts" onChangeView={setView} onLogout={handleLogout}>
          <AdminPosts
            categories={categories}
            onDelete={deletePost}
            onQueryPage={queryPostPage}
            onCreatePost={openCreatePostPage}
            onEditPost={openEditPostPage}
          />
        </AdminWrapper>
      );
    }

    if (view === 'admin-categories') {
      return (
        <AdminWrapper current="admin-categories" onChangeView={setView} onLogout={handleLogout}>
          <AdminCategories
            categories={categories}
            posts={posts}
            onSave={saveCategory}
            onDelete={deleteCategory}
            onQueryPage={queryCategoryPage}
          />
        </AdminWrapper>
      );
    }

    if (view === 'admin-settings') {
      return (
        <AdminWrapper current="admin-settings" onChangeView={setView} onLogout={handleLogout}>
          <AdminSettings
            configs={configs}
            onUpdate={updateConfig}
          />
        </AdminWrapper>
      );
    }

    if (view === 'post-editor') {
      return (
        <AdminWrapper current="post-editor" onChangeView={setView} onLogout={handleLogout}>
          <AdminPostEditorPage
            post={editingPost}
            categories={categories}
            onBack={() => setView('admin-posts')}
            onSave={savePost}
          />
        </AdminWrapper>
      );
    }

    return <div>404 Not Found</div>;
  };

  return (
    <ThemeProvider>
      <LanguageProvider initialLang={currentLanguage}>
        {renderView()}
      </LanguageProvider>
    </ThemeProvider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
