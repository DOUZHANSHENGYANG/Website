import React, { useMemo } from 'react';
import { Post } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AdminDashboardProps {
  posts: Post[];
}

interface ActivityPoint {
  label: string;
  count: number;
  percent: number;
}

const buildActivitySeries = (posts: Post[]): ActivityPoint[] => {
  const days = 12;
  const now = new Date();
  const bucketMap = new Map<string, number>();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    bucketMap.set(key, 0);
  }

  posts.forEach((post) => {
    const date = (post.updated_at || post.created_at || '').slice(0, 10);
    if (bucketMap.has(date)) {
      bucketMap.set(date, (bucketMap.get(date) || 0) + 1);
    }
  });

  const values = Array.from(bucketMap.values());
  const maxCount = Math.max(...values, 1);

  return Array.from(bucketMap.entries()).map(([date, count]) => ({
    label: date.slice(5).replace('-', '/'),
    count,
    percent: Math.max(8, Math.round((count / maxCount) * 100))
  }));
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ posts }) => {
  const { t } = useLanguage();
  const publishedCount = posts.filter((post) => post.status === 'published').length;
  const draftCount = posts.filter((post) => post.status === 'draft').length;
  const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0);
  const totalLikes = posts.reduce((sum, post) => sum + (post.like_count || 0), 0);
  const topMetricPosts = [...posts]
    .sort((a, b) => ((b.view_count || 0) + (b.like_count || 0)) - ((a.view_count || 0) + (a.like_count || 0)))
    .slice(0, 5);
  const activitySeries = useMemo(() => buildActivitySeries(posts), [posts]);

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-2 gap-6">
      <header className="flex items-center justify-between glass-panel rounded-2xl px-8 py-4 shrink-0">
        <div className="relative group w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 group-focus-within:text-primary transition-colors">search</span>
          <input
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 focus:border-primary/50 focus:ring-0 outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-white/25 text-slate-900 dark:text-white font-medium transition-all duration-300 focus:shadow-[0_0_0_1px_rgba(25,93,230,0.35),0_10px_25px_-12px_rgba(25,93,230,0.6)]"
            placeholder={t('admin.stats.search')}
            type="text"
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-focus-within:border-primary/35 transition-colors"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest">{t('admin.stats.system_status')}</p>
            <p className="text-sm font-bold text-green-500 dark:text-green-400">{t('admin.stats.optimal')}</p>
          </div>
          <div className="size-3 rounded-full bg-green-500 dark:bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.4)]"></div>
        </div>
      </header>

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-6">
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-all"></div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-white/40 text-xs font-bold uppercase tracking-widest">{t('admin.stats.total_posts')}</span>
            <span className="material-symbols-outlined text-primary text-xl">article</span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{posts.length}</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-green-500 dark:text-green-400 text-sm">trending_up</span>
              <span className="text-green-500 dark:text-green-400 text-xs font-bold">+12%</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-white/40 text-xs font-bold uppercase tracking-widest">{t('admin.stats.published')}</span>
            <span className="material-symbols-outlined text-slate-400 dark:text-white/60 text-xl">publish</span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{publishedCount}</h3>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-white/40 text-xs font-bold uppercase tracking-widest">{t('admin.stats.drafts')}</span>
            <span className="material-symbols-outlined text-slate-400 dark:text-white/60 text-xl">edit_note</span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{draftCount}</h3>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-white/40 text-xs font-bold uppercase tracking-widest">Total Views</span>
            <span className="material-symbols-outlined text-slate-400 dark:text-white/60 text-xl">visibility</span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{totalViews}</h3>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-white/40 text-xs font-bold uppercase tracking-widest">Total Likes</span>
            <span className="material-symbols-outlined text-slate-400 dark:text-white/60 text-xl">favorite</span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{totalLikes}</h3>
          </div>
        </div>

      </div>

      <div className="flex-1 glass-panel rounded-2xl p-8 flex flex-col min-h-[320px] relative">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">{t('admin.stats.activity_map')}</h2>
        <p className="text-sm text-slate-500 dark:text-white/40 font-medium mb-6">{t('admin.stats.activity_desc')}</p>

        <div className="h-56 mt-auto">
          <div className="grid grid-cols-12 gap-2 h-full items-end">
            {activitySeries.map((item) => (
              <div key={item.label} className="h-full flex flex-col justify-end items-center gap-2">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-primary/60 to-purple-500/50 border border-primary/30 hover:from-primary hover:to-purple-400 transition-colors relative group" style={{ height: `${item.percent}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-900 dark:bg-black text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-white/40 font-bold tracking-wide">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">热门文章表现</h3>
          <span className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-white/40 font-bold">Views + Likes</span>
        </div>
        <div className="space-y-2">
          {topMetricPosts.map((post, index) => (
            <div key={post.id} className="grid grid-cols-[36px_1fr_100px_90px] items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.05]">
              <div className="text-xs font-black text-primary">{index + 1}</div>
              <div className="truncate text-sm font-semibold text-slate-800 dark:text-white/85">{post.title}</div>
              <div className="text-xs text-slate-500 dark:text-white/45 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">visibility</span>{post.view_count || 0}
              </div>
              <div className="text-xs text-slate-500 dark:text-white/45 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">favorite</span>{post.like_count || 0}
              </div>
            </div>
          ))}
          {topMetricPosts.length === 0 && (
            <div className="text-sm text-slate-500 dark:text-white/45 py-4">暂无文章数据</div>
          )}
        </div>
      </div>
    </div>
  );
};
