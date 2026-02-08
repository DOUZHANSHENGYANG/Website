import React from 'react';
import { motion } from 'framer-motion';
import { Category, Config, Post } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PublicCategoriesProps {
  categories: Category[];
  posts: Post[];
  configs: Config[];
  onBrowseCategory: (categoryId: number) => void;
}

export const PublicCategories: React.FC<PublicCategoriesProps> = ({ categories, posts, configs, onBrowseCategory }) => {
  const { t } = useLanguage();
  const getPostCount = (catId: number) => posts.filter(p => p.category_id === catId && p.status === 'published').length;
  const categoriesIntro = configs.find((config) => config.key === 'categories_intro')?.value
    || '这里汇总了我在技术、设计、写作与生活中的真实记录，按主题浏览你感兴趣的内容。';

  return (
    <div className="space-y-16">
       {/* Header */}
       <div className="text-center mb-16 pt-8">
           <motion.span 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block px-4 py-1.5 rounded-full glass-panel text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6 shadow-lg shadow-primary/10 border-primary/20"
           >
             {t('categories.discovery')}
           </motion.span>
           <motion.h2 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight"
           >
             {t('categories.explore_title')}
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-slate-500 dark:text-white/40 text-lg max-w-2xl mx-auto leading-relaxed font-medium"
           >
             {categoriesIntro}
           </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
             <motion.div
               key={cat.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 + 0.3 }}
               className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group hover:bg-white/80 dark:hover:bg-white/[0.03] transition-all duration-500 border border-white/40 dark:border-white/5 hover:border-primary/20 dark:hover:border-white/10 hover:shadow-xl dark:hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
             >
                {/* Background Gradient/Glow - Stronger in light mode for vibrance */}
                <div 
                  className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none mix-blend-multiply dark:mix-blend-normal"
                  style={{ backgroundColor: cat.color }}
                ></div>

                {/* Decorative Watermark Icon - Darker in light mode */}
                <span 
                  className="material-symbols-outlined absolute right-[-20px] top-10 text-[180px] opacity-[0.03] dark:opacity-[0.02] group-hover:opacity-[0.06] dark:group-hover:opacity-[0.05] transition-all duration-700 rotate-12 select-none pointer-events-none text-slate-900 dark:text-white" 
                  style={{ color: cat.color }}
                >
                   {cat.icon}
                </span>
                
                <div className="relative z-10 flex flex-col h-full">
                   {/* Icon Box */}
                   <div 
                     className="size-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" 
                     style={{ backgroundColor: `${cat.color}15`, color: cat.color, boxShadow: `0 8px 20px -5px ${cat.color}30`, border: `1px solid ${cat.color}30` }}
                   >
                      <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                   </div>
                   
                   <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{cat.name}</h3>
                   <p className="text-slate-500 dark:text-white/50 mb-12 text-lg leading-relaxed line-clamp-3 min-h-[4rem] font-medium">
                     {cat.description || `Explore the latest thoughts and perspectives on ${cat.name}.`}
                   </p>
                   
                   <div className="mt-auto flex items-center justify-between pt-8 border-t border-slate-200/50 dark:border-white/5">
                      <span 
                        className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm" 
                        style={{ backgroundColor: `${cat.color}10`, color: cat.color, border: `1px solid ${cat.color}20` }}
                      >
                         {getPostCount(cat.id)} {t('categories.posts_count')}
                      </span>
                      
                      <button
                        onClick={() => onBrowseCategory(cat.id)}
                        className="flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-white/40 group-hover:text-slate-900 dark:group-hover:text-white transition-colors uppercase tracking-widest"
                      >
                         {t('categories.browse')} <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </button>
                   </div>
                </div>
             </motion.div>
          ))}
        </div>

      {/* Newsletter Section */}
      <section className="glass-panel rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden border-white/40 dark:border-white/10 mt-12 shadow-lg">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">{t('about.newsletter_title')}</h2>
            <p className="text-slate-500 dark:text-white/40 text-lg mb-10 leading-relaxed font-medium">
              {t('categories.newsletter_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
               <input 
                 type="email" 
                 placeholder={t('about.enter_email')} 
                 className="flex-1 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:border-primary/50 focus:bg-white dark:focus:bg-white/10 outline-none transition-all shadow-sm" 
               />
               <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:brightness-110 hover:scale-105 active:scale-95 transition-all">
                 {t('about.subscribe')}
               </button>
            </div>
         </div>
      </section>
    </div>
  );
};
