import React from 'react';
import { motion } from 'framer-motion';
import { Config } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PublicAboutProps {
  configs: Config[];
  postCount: number;
  categoryCount: number;
}

interface FocusCard {
  icon: string;
  title: string;
  desc: string;
}

export const PublicAbout: React.FC<PublicAboutProps> = ({ configs, postCount, categoryCount }) => {
  const { t } = useLanguage();
  const getConfig = (key: string) => configs.find((config) => config.key === key)?.value || '';

  const bio = getConfig('admin_bio') || 'Digital explorer.';
  const avatarUrl = getConfig('avatar');
  const aboutSubtitle = getConfig('about_subtitle') || '独立开发者、个人博主，持续记录技术与生活。';
  const authorName = getConfig('author_name') || getConfig('site_title') || 'Douzhan';
  const authorTitle = getConfig('author_title') || 'Personal Blogger';

  const focusCardsById: Record<string, FocusCard> = {
    '1': {
      icon: getConfig('about_focus_1_icon'),
      title: getConfig('about_focus_1_title'),
      desc: getConfig('about_focus_1_desc')
    },
    '2': {
      icon: getConfig('about_focus_2_icon'),
      title: getConfig('about_focus_2_title'),
      desc: getConfig('about_focus_2_desc')
    },
    '3': {
      icon: getConfig('about_focus_3_icon'),
      title: getConfig('about_focus_3_title'),
      desc: getConfig('about_focus_3_desc')
    }
  };

  const fallbackCardsById: Record<string, FocusCard> = {
    '1': { icon: 'terminal', title: 'Coding', desc: '专注前端工程、效率工具与可维护的代码实践。' },
    '2': { icon: 'draw', title: 'Design', desc: '持续打磨界面细节、交互动效与视觉体验。' },
    '3': { icon: 'auto_stories', title: 'Writing', desc: '记录真实经验、项目复盘与生活感悟。' }
  };

  const orderRaw = getConfig('about_focus_order');
  const orderList = orderRaw
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is '1' | '2' | '3' => item === '1' || item === '2' || item === '3');
  const normalizedOrder = orderList.length === 3 ? orderList : ['1', '2', '3'];

  const normalizedCards = normalizedOrder.map((key) => {
    const card = focusCardsById[key];
    const fallback = fallbackCardsById[key];
    return {
      icon: card.icon || fallback.icon,
      title: card.title || fallback.title,
      desc: card.desc || fallback.desc
    };
  });

  return (
    <div className="space-y-16">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 border border-slate-200/70 dark:border-white/10 bg-gradient-to-br from-white via-sky-50/70 to-indigo-50/70 dark:from-white/[0.04] dark:via-white/[0.02] dark:to-transparent shadow-[0_30px_80px_-40px_rgba(14,116,255,0.35)]"
      >
        <div className="absolute -top-24 -right-24 size-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-20 size-72 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-white/80 dark:bg-white/10 border border-primary/20 mb-6">
            Profile
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">{t('about.title')}</h2>
          <p className="text-slate-600 dark:text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">{aboutSubtitle}</p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8"
      >
        <div className="glass-panel rounded-[2rem] p-8 text-center lg:text-left border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.02]">
          <div className="mx-auto lg:mx-0 size-36 rounded-full bg-gradient-to-br from-primary to-purple-500 p-1 shadow-xl">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Author avatar" className="size-full rounded-full object-cover bg-white/80 dark:bg-slate-900/70" />
            ) : (
              <div className="size-full rounded-full bg-white/80 dark:bg-slate-900/70 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-primary">person</span>
              </div>
            )}
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-6">{authorName}</h3>
          <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary mt-2">{authorTitle}</p>
          <p className="text-slate-600 dark:text-white/50 mt-4 leading-relaxed">{bio}</p>
        </div>

        <div className="glass-panel rounded-[2rem] p-8 md:p-10 border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.02]">
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-2xl p-5 border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/[0.02]">
              <p className="text-[11px] uppercase tracking-widest font-bold text-slate-500 dark:text-white/40">{t('about.articles_written')}</p>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{postCount}</p>
            </div>
            <div className="rounded-2xl p-5 border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/[0.02]">
              <p className="text-[11px] uppercase tracking-widest font-bold text-slate-500 dark:text-white/40">{t('about.topics_covered')}</p>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{categoryCount}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {normalizedCards.map((item) => (
              <div key={item.title} className="rounded-2xl p-4 border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.02]">
                <span className="material-symbols-outlined text-primary">{item.icon}</span>
                <h4 className="mt-2 font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-sm text-slate-500 dark:text-white/50 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass-panel rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden border border-slate-200 dark:border-white/10 bg-gradient-to-br from-white/80 to-slate-50/70 dark:from-white/[0.03] dark:to-white/[0.01]"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">{t('about.newsletter_title')}</h2>
          <p className="text-slate-500 dark:text-white/40 text-lg mb-10 leading-relaxed font-medium">
            {t('about.newsletter_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder={t('about.enter_email')}
              className="flex-1 bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:border-primary/50 focus:bg-white dark:focus:bg-white/10 outline-none transition-all shadow-sm"
            />
            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-[0_0_30px_rgba(25,93,230,0.3)] hover:brightness-110 hover:scale-105 active:scale-95 transition-all">
              {t('about.subscribe')}
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
