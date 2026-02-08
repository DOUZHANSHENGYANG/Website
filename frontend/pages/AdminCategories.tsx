import React, { useEffect, useMemo, useState } from 'react';
import { Category, Post } from '../types';
import { Button, Input, Modal, Pagination } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { PagedResponse } from '../services/apiService';
import { ThemedSelect, ThemedSelectOption } from '../components/ThemedSelect';

interface AdminCategoriesProps {
  categories: Category[];
  posts: Post[];
  onSave: (category: Partial<Category>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onQueryPage: (params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    slug?: string;
  }) => Promise<PagedResponse<Category>>;
}

interface CategoryFilters {
  keyword: string;
  slug: string;
}

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];
const INITIAL_FILTERS: CategoryFilters = {
  keyword: '',
  slug: ''
};

const ICON_OPTIONS = [
  { value: 'folder', label: 'Folder' },
  { value: 'palette', label: 'Palette' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'science', label: 'Science' },
  { value: 'auto_stories', label: 'Stories' },
  { value: 'code_blocks', label: 'Code' },
  { value: 'design_services', label: 'Design' },
  { value: 'brush', label: 'Brush' },
  { value: 'lightbulb', label: 'Ideas' },
  { value: 'rocket_launch', label: 'Rocket' },
  { value: 'terminal', label: 'Terminal' },
  { value: 'category', label: 'Category' }
];

export const AdminCategories: React.FC<AdminCategoriesProps> = ({ categories, posts, onSave, onDelete, onQueryPage }) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formCat, setFormCat] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    icon: 'folder',
    color: '#195de6'
  });

  const [draftFilters, setDraftFilters] = useState<CategoryFilters>(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<CategoryFilters>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(categories.length);
  const [pagedCategories, setPagedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    const query = async () => {
      setLoading(true);
      try {
        const result = await onQueryPage({
          page: currentPage,
          pageSize,
          keyword: appliedFilters.keyword || undefined,
          slug: appliedFilters.slug || undefined
        });

        if (!active) return;

        setPagedCategories(result.records);
        setTotal(result.total);
      } catch (error) {
        if (active) {
          alert(error instanceof Error ? error.message : 'Failed to query categories');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void query();
    return () => {
      active = false;
    };
  }, [appliedFilters, currentPage, pageSize, reloadToken, onQueryPage]);

  const handleOpenCreate = () => {
    setFormCat({ name: '', slug: '', description: '', icon: 'folder', color: '#195de6' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setFormCat({ ...category });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formCat.name?.trim()) {
      alert('分类名称不能为空');
      return;
    }

    try {
      await onSave(formCat);
      setIsModalOpen(false);
      setCurrentPage(1);
      setReloadToken((value) => value + 1);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save category');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await onDelete(id);
      setReloadToken((value) => value + 1);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete category');
    }
  };

  const handleExport = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(categories, null, 2))}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'liquid_glass_categories.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const getArticleCount = (id: number) => posts.filter((post) => post.category_id === id).length;

  const totalCategories = categories.length;
  const emptyCategories = categories.filter((category) => getArticleCount(category.id) === 0).length;
  const mostActive = categories.length > 0
    ? categories.reduce((prev, current) => (getArticleCount(prev.id) > getArticleCount(current.id) ? prev : current))
    : { name: 'N/A' };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentCategoryIds = useMemo(() => new Set(pagedCategories.map((category) => category.id)), [pagedCategories]);
  const selectedIcon = formCat.icon || 'folder';
  const iconOptions: Array<ThemedSelectOption<string>> = ICON_OPTIONS.map((item) => ({
    value: item.value,
    label: item.label,
    icon: item.value
  }));
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

  return (
    <div className="flex flex-col h-full gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4 glass-panel rounded-2xl px-8 py-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{t('admin.cat_mgmt')}</h2>
          <p className="text-sm text-slate-500 dark:text-white/40 font-medium">{t('admin.categories.subtitle')} · 共 {total} 条</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-primary px-6 py-2.5 rounded-2xl text-sm font-bold text-white shadow-[0_0_15px_rgba(25,93,230,0.3)] hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          {t('common.create')}
        </button>
      </header>

      <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4 shrink-0 relative z-40">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_auto_auto] gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40">关键词</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 text-[18px] group-focus-within:text-primary transition-colors">search</span>
              <input
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 focus:border-primary/50 focus:ring-0 outline-none text-sm transition-all duration-300 focus:shadow-[0_0_0_1px_rgba(25,93,230,0.35),0_10px_25px_-12px_rgba(25,93,230,0.6)]"
                placeholder={t('admin.categories.search_placeholder')}
                type="text"
                value={draftFilters.keyword}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') applyFilters();
                }}
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl border border-transparent group-focus-within:border-primary/35 transition-colors"></div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40">Slug</label>
            <input
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 focus:border-primary/50 focus:ring-0 outline-none text-sm"
              placeholder="按 slug 模糊查询"
              type="text"
              value={draftFilters.slug}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, slug: event.target.value }))}
              onKeyDown={(event) => {
                if (event.key === 'Enter') applyFilters();
              }}
            />
          </div>

          <button onClick={applyFilters} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:brightness-110 transition-all">查询</button>
          <button onClick={resetFilters} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading && (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 dark:text-white/40 text-sm">
            正在加载分类...
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pagedCategories.map((category) => (
              <div
                key={category.id}
                className={`glass-panel rounded-[2rem] p-8 relative overflow-hidden transition-all hover:shadow-xl ${currentCategoryIds.has(category.id) ? 'border-primary/20' : ''}`}
              >
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${category.color || '#195de6'}22, transparent 45%)` }} />

                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className="size-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: category.color || '#195de6' }}>
                    <span className="material-symbols-outlined text-2xl">{category.icon || 'folder'}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenEdit(category)} className="text-slate-400 dark:text-white/20 hover:text-primary transition-colors p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="text-slate-400 dark:text-white/20 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>

                <div className="relative z-10 mb-auto">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{category.name}</h3>
                  <p className="text-slate-500 dark:text-white/40 text-sm font-medium leading-relaxed line-clamp-2">{category.description || 'No description available for this category.'}</p>
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/30">slug · {category.slug}</p>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{getArticleCount(category.id)}</span>
                    <span className="text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest mt-2">{t('admin.categories.articles')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && pagedCategories.length === 0 && (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 dark:text-white/40 text-sm">
            未查询到分类，请调整筛选条件后重试。
          </div>
        )}

        <div className="mt-6 glass-panel rounded-2xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
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

      <div className="glass-panel rounded-2xl p-8 flex items-center justify-between border-slate-200 dark:border-white/10 mt-auto shrink-0">
        <div className="flex gap-16">
          <div>
            <p className="text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest mb-1">{t('admin.categories.total')}</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalCategories}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest mb-1">{t('admin.categories.empty')}</p>
            <p className="text-2xl font-extrabold text-orange-500 dark:text-orange-400">{emptyCategories}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest mb-1">{t('admin.categories.active')}</p>
            <p className="text-2xl font-extrabold text-primary">{mostActive.name || 'N/A'}</p>
          </div>
        </div>
        <button onClick={handleExport} className="px-6 py-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95">
          {t('admin.categories.export')}
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formCat.id ? t('admin.categories.edit_title') : t('admin.categories.new_title')}>
        <div className="flex flex-col gap-6 p-2">
          <div className="grid grid-cols-2 gap-6">
            <Input label={t('admin.categories.label_name')} value={formCat.name || ''} onChange={(value) => setFormCat({ ...formCat, name: value })} placeholder="e.g. Design Systems" />
            <Input label={t('admin.categories.label_slug')} value={formCat.slug || ''} onChange={(value) => setFormCat({ ...formCat, slug: value })} placeholder="e.g. design-systems" />

            <div className="col-span-1 space-y-2">
              <label className="block text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest ml-1">{t('admin.categories.label_icon')}</label>
              <ThemedSelect
                value={selectedIcon}
                options={iconOptions}
                onChange={(value) => setFormCat((prev) => ({ ...prev, icon: value }))}
              />
            </div>

            <Input label={t('admin.categories.label_color')} value={formCat.color || ''} onChange={(value) => setFormCat({ ...formCat, color: value })} placeholder="e.g. #3b82f6" />

            <div className="col-span-2">
              <Input label={t('admin.categories.label_desc')} value={formCat.description || ''} onChange={(value) => setFormCat({ ...formCat, description: value })} placeholder="Short description..." />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-white/5">
            <Button onClick={handleSave}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
