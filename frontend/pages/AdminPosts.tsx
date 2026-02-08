import React, { useEffect, useMemo, useState } from 'react';
import { Category, Post } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Pagination } from '../components/UI';
import { PagedResponse } from '../services/apiService';
import { ThemedSelect, ThemedSelectOption } from '../components/ThemedSelect';

interface AdminPostsProps {
  categories: Category[];
  onDelete: (id: string) => Promise<void>;
  onQueryPage: (params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    status?: 'draft' | 'published';
    categoryId?: number;
  }) => Promise<PagedResponse<Post>>;
  onCreatePost: () => void;
  onEditPost: (post: Post) => void;
}

interface PostFilters {
  keyword: string;
  status: 'all' | 'draft' | 'published';
  categoryId: 'all' | number;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const INITIAL_FILTERS: PostFilters = {
  keyword: '',
  status: 'all',
  categoryId: 'all'
};

export const AdminPosts: React.FC<AdminPostsProps> = ({ categories, onDelete, onQueryPage, onCreatePost, onEditPost }) => {
  const { t } = useLanguage();

  const [draftFilters, setDraftFilters] = useState<PostFilters>(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<PostFilters>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [pagedPosts, setPagedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const categoryNameMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  useEffect(() => {
    let active = true;

    const fetchPage = async () => {
      setLoading(true);
      try {
        const result = await onQueryPage({
          page: currentPage,
          pageSize,
          keyword: appliedFilters.keyword || undefined,
          status: appliedFilters.status === 'all' ? undefined : appliedFilters.status,
          categoryId: appliedFilters.categoryId === 'all' ? undefined : appliedFilters.categoryId
        });

        if (!active) return;
        setPagedPosts(result.records);
        setTotal(result.total);
      } catch (error) {
        if (active) {
          alert(error instanceof Error ? error.message : 'Failed to query posts');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchPage();
    return () => {
      active = false;
    };
  }, [appliedFilters, currentPage, pageSize, reloadToken, onQueryPage]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const statusOptions: Array<ThemedSelectOption<PostFilters['status']>> = [
    { value: 'all', label: '全部状态' },
    { value: 'published', label: t('admin.editor.status_published') },
    { value: 'draft', label: t('admin.editor.status_draft') }
  ];

  const categoryOptions: Array<ThemedSelectOption<'all' | number>> = [
    { value: 'all', label: '全部分类' },
    ...categories.map((category) => ({ value: category.id, label: category.name }))
  ];

  const pageSizeOptions: Array<ThemedSelectOption<number>> = PAGE_SIZE_OPTIONS.map((option) => ({
    value: option,
    label: String(option)
  }));

  const applyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters(draftFilters);
  };

  const resetFilters = () => {
    setDraftFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      setReloadToken((value) => value + 1);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete post');
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4 glass-panel rounded-2xl px-8 py-4 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('admin.posts.title')}</h2>
          <p className="text-sm text-slate-500 dark:text-white/40">{t('admin.posts.subtitle')} · 共 {total} 条</p>
        </div>
        <button
          onClick={onCreatePost}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary rounded-xl font-bold text-sm text-white shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {t('admin.posts.new_post')}
        </button>
      </header>

      <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4 shrink-0 relative z-40">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr_auto_auto] gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40">关键词</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 text-[18px] group-focus-within:text-primary transition-colors">search</span>
              <input
                value={draftFilters.keyword}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') applyFilters();
                }}
                placeholder="按标题/摘要搜索"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 focus:border-primary/50 focus:ring-0 outline-none text-sm transition-all duration-300 focus:shadow-[0_0_0_1px_rgba(25,93,230,0.35),0_10px_25px_-12px_rgba(25,93,230,0.6)]"
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl border border-transparent group-focus-within:border-primary/35 transition-colors"></div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40">状态</label>
            <ThemedSelect
              value={draftFilters.status}
              options={statusOptions}
              onChange={(value) => setDraftFilters((prev) => ({ ...prev, status: value }))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40">分类</label>
            <ThemedSelect
              value={draftFilters.categoryId}
              options={categoryOptions}
              onChange={(value) => setDraftFilters((prev) => ({ ...prev, categoryId: value }))}
            />
          </div>

          <button onClick={applyFilters} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:brightness-110 transition-all">查询</button>
          <button onClick={resetFilters} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">重置</button>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col relative z-10 min-h-[420px]">
        <div className="grid grid-cols-[1fr_170px_120px_130px_100px] gap-4 px-8 py-5 border-b border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest bg-slate-50/60 dark:bg-white/[0.02]">
          <div>{t('admin.posts.table_title')}</div>
          <div>{t('admin.posts.table_category')}</div>
          <div>{t('admin.posts.table_status')}</div>
          <div>{t('admin.posts.table_date')}</div>
          <div className="text-right">{t('admin.posts.table_actions')}</div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          {loading && (
            <div className="p-12 text-center text-slate-400 dark:text-white/40 text-sm">正在加载文章...</div>
          )}

          {!loading && pagedPosts.map((post) => (
            <div key={post.id} className="grid grid-cols-[1fr_170px_120px_130px_100px] gap-4 px-4 py-5 items-center rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors border-b border-slate-200 dark:border-white/5 last:border-0">
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-10 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 flex items-center justify-center text-slate-400 dark:text-white/20">
                  <span className="material-symbols-outlined">article</span>
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-sm text-slate-900 dark:text-white truncate block">{post.title}</span>
                  <span className="text-xs text-slate-500 dark:text-white/40 truncate block">{post.summary}</span>
                </div>
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-600 dark:text-white/60">
                  {categoryNameMap.get(post.category_id) || `${t('admin.posts.category_prefix')} ${post.category_id}`}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${post.status === 'published' ? 'bg-green-500 dark:bg-green-400' : 'bg-yellow-500 dark:bg-yellow-400'}`}></span>
                  <span className={`text-xs font-bold ${post.status === 'published' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {post.status === 'published' ? t('admin.editor.status_published') : t('admin.editor.status_draft')}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-white/40 font-medium">{new Date(post.updated_at).toLocaleDateString()}</div>

              <div className="flex justify-end gap-2">
                <button onClick={() => onEditPost(post)} className="size-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 hover:text-primary hover:border-primary/50 transition-all">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button onClick={() => handleDelete(post.id)} className="size-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/50 transition-all">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}

          {!loading && pagedPosts.length === 0 && (
            <div className="p-12 text-center text-slate-400 dark:text-white/40 text-sm">
              未查询到文章，请调整筛选条件后重试。
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/50">
            每页
            <ThemedSelect
              value={pageSize}
              options={pageSizeOptions}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
              size="sm"
              placement="top"
              className="w-20"
            />
            条，共 {total} 条
          </div>
          <Pagination current={Math.min(currentPage, totalPages)} total={totalPages} onChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
};
