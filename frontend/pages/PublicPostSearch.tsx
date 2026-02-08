import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Category, Post } from '../types';
import { PagedResponse } from '../services/apiService';
import { Pagination } from '../components/UI';
import { ThemedSelect, ThemedSelectOption } from '../components/ThemedSelect';

interface PublicPostSearchProps {
  categories: Category[];
  onReadPost: (post: Post) => void;
  onQueryPage: (params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    status?: 'draft' | 'published';
    categoryId?: number;
    createdFrom?: string;
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
  }) => Promise<PagedResponse<Post>>;
  initialCategoryId?: number;
  seedToken: number;
  onBackToCategories: () => void;
}

type StatusFilter = 'all' | 'draft' | 'published';
type CategoryFilter = 'all' | number;

interface SearchFilters {
  keyword: string;
  status: StatusFilter;
  categoryId: CategoryFilter;
  createdFrom: string;
  createdTo: string;
  updatedFrom: string;
  updatedTo: string;
}

const PAGE_SIZE_OPTIONS = [6, 9, 12, 20];

const DATE_INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.05] px-4 py-3 pl-10 text-sm text-slate-900 dark:text-white focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(25,93,230,0.12)] outline-none transition-all [color-scheme:light] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-75 dark:[&::-webkit-calendar-picker-indicator]:invert';

const buildDefaultFilters = (initialCategoryId?: number): SearchFilters => ({
  keyword: '',
  status: 'published',
  categoryId: initialCategoryId ?? 'all',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: ''
});

export const PublicPostSearch: React.FC<PublicPostSearchProps> = ({
  categories,
  onReadPost,
  onQueryPage,
  initialCategoryId,
  seedToken,
  onBackToCategories
}) => {
  const [draftFilters, setDraftFilters] = useState<SearchFilters>(() => buildDefaultFilters(initialCategoryId));
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(() => buildDefaultFilters(initialCategoryId));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const currentCategoryName = appliedFilters.categoryId === 'all'
    ? '全部分类'
    : categoryMap.get(appliedFilters.categoryId) || `分类 ${appliedFilters.categoryId}`;

  useEffect(() => {
    const next = buildDefaultFilters(initialCategoryId);
    setDraftFilters(next);
    setAppliedFilters(next);
    setCurrentPage(1);
  }, [initialCategoryId, seedToken]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const page = await onQueryPage({
          page: currentPage,
          pageSize,
          keyword: appliedFilters.keyword || undefined,
          status: appliedFilters.status === 'all' ? undefined : appliedFilters.status,
          categoryId: appliedFilters.categoryId === 'all' ? undefined : appliedFilters.categoryId,
          createdFrom: appliedFilters.createdFrom || undefined,
          createdTo: appliedFilters.createdTo || undefined,
          updatedFrom: appliedFilters.updatedFrom || undefined,
          updatedTo: appliedFilters.updatedTo || undefined
        });

        if (!active) return;
        setRecords(page.records);
        setTotal(page.total);
      } catch (error) {
        if (active) {
          alert(error instanceof Error ? error.message : '查询文章失败');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [appliedFilters, currentPage, pageSize, onQueryPage]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const statusOptions: Array<ThemedSelectOption<StatusFilter>> = [
    { value: 'all', label: '全部状态' },
    { value: 'published', label: '已发布' },
    { value: 'draft', label: '草稿' }
  ];

  const categoryOptions: Array<ThemedSelectOption<CategoryFilter>> = [
    { value: 'all', label: '全部分类' },
    ...categories.map((category) => ({ value: category.id, label: category.name, icon: category.icon }))
  ];

  const pageSizeOptions: Array<ThemedSelectOption<number>> = PAGE_SIZE_OPTIONS.map((size) => ({
    value: size,
    label: `${size} / 页`
  }));

  const applyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters(draftFilters);
  };

  const resetFilters = () => {
    const next = buildDefaultFilters(initialCategoryId);
    setDraftFilters(next);
    setAppliedFilters(next);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-white/10"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={onBackToCategories}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 hover:text-primary transition-colors mb-4"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              返回分类页
            </button>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              分类文章检索
            </h2>
            <p className="text-slate-500 dark:text-white/45 mt-3 text-sm md:text-base">
              当前分类：<span className="font-bold text-primary">{currentCategoryName}</span> · 共匹配 {total} 篇文章
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 relative z-40">
          <div className="md:col-span-2">
            <label className="block mb-2 text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-white/40">文章标题</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 text-lg">search</span>
              <input
                value={draftFilters.keyword}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                placeholder="输入标题关键字进行模糊搜索"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.05] px-10 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/25 focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(25,93,230,0.12)] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-white/40">发布状态</label>
            <ThemedSelect
              value={draftFilters.status}
              options={statusOptions}
              onChange={(value) => setDraftFilters((prev) => ({ ...prev, status: value }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-white/40">文章分类</label>
            <ThemedSelect
              value={draftFilters.categoryId}
              options={categoryOptions}
              onChange={(value) => setDraftFilters((prev) => ({ ...prev, categoryId: value }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-white/40">创建时间（起）</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 text-lg">calendar_month</span>
              <input
                type="date"
                value={draftFilters.createdFrom}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, createdFrom: event.target.value }))}
                className={DATE_INPUT_CLASS}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-white/40">创建时间（止）</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 text-lg">calendar_month</span>
              <input
                type="date"
                value={draftFilters.createdTo}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, createdTo: event.target.value }))}
                className={DATE_INPUT_CLASS}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-white/40">更新时间（起）</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 text-lg">event_repeat</span>
              <input
                type="date"
                value={draftFilters.updatedFrom}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, updatedFrom: event.target.value }))}
                className={DATE_INPUT_CLASS}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-white/40">更新时间（止）</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 text-lg">event_repeat</span>
              <input
                type="date"
                value={draftFilters.updatedTo}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, updatedTo: event.target.value }))}
                className={DATE_INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={applyFilters}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
          >
            查询文章
          </button>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-sm font-bold text-slate-600 dark:text-white/65 hover:text-slate-900 dark:hover:text-white hover:border-primary/30 transition-all"
          >
            重置条件
          </button>
        </div>
      </motion.section>

      <section className="glass-panel rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10">
        <div className="grid grid-cols-[1fr_130px_130px_130px] gap-4 px-8 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-white/40">
          <span>文章</span>
          <span>状态</span>
          <span>创建时间</span>
          <span>更新时间</span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-white/5">
          {loading && (
            <div className="px-8 py-16 text-center text-sm text-slate-500 dark:text-white/45">正在加载文章...</div>
          )}

          {!loading && records.map((post) => (
            <article
              key={post.id}
              onClick={() => onReadPost(post)}
              className="grid grid-cols-[1fr_130px_130px_130px] gap-4 px-8 py-5 items-center hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{post.title}</h3>
                <p className="text-sm text-slate-500 dark:text-white/45 truncate mt-1">{post.summary}</p>
                <div className="mt-2 text-[11px] uppercase tracking-wider font-bold text-primary">
                  {categoryMap.get(post.category_id) || `分类 ${post.category_id}`}
                </div>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                    post.status === 'published'
                      ? 'bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {post.status === 'published' ? '已发布' : '草稿'}
                </span>
              </div>
              <div className="text-sm text-slate-600 dark:text-white/55">{new Date(post.created_at).toLocaleDateString()}</div>
              <div className="text-sm text-slate-600 dark:text-white/55">{new Date(post.updated_at).toLocaleDateString()}</div>
            </article>
          ))}

          {!loading && records.length === 0 && (
            <div className="px-8 py-16 text-center text-sm text-slate-500 dark:text-white/45">
              没有匹配到文章，请调整筛选条件后重试。
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/55">
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
              className="w-28"
            />
            共 {total} 条
          </div>
          <Pagination current={Math.min(currentPage, totalPages)} total={totalPages} onChange={setCurrentPage} />
        </div>
      </section>
    </div>
  );
};
