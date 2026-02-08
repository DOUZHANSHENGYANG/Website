import React from 'react';
import { motion } from 'framer-motion';
import { Post, Category, Config } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PublicHomeProps {
  posts: Post[];
  categories: Category[];
  configs: Config[];
  onReadPost: (post: Post) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ posts, configs, onReadPost }) => {
  const { t } = useLanguage();
  const publishedPosts = posts.filter(p => p.status === 'published');
  const featuredPost = publishedPosts[0];
  const gridPosts = publishedPosts.slice(1);
  const heroTag = configs.find((config) => config.key === 'hero_tag')?.value || t('hero.tag');
  const heroTitleStart = configs.find((config) => config.key === 'hero_title_start')?.value || t('hero.title_start');
  const heroTitleEnd = configs.find((config) => config.key === 'hero_title_end')?.value || t('hero.title_end');
  const heroSubtitle = configs.find((config) => config.key === 'hero_subtitle')?.value
    || t('hero.subtitle');

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center relative -mt-32 pt-32 pb-12">
        <div className="flex-1 flex flex-col justify-center items-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full glass-panel text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 shadow-[0_0_20px_rgba(25,93,230,0.2)]"
            >
              {heroTag}
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1] text-slate-900 dark:text-white"
            >
              {heroTitleStart} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400 animate-gradient-x">{heroTitleEnd}.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 dark:text-white/40 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
            >
              {heroSubtitle}
            </motion.p>
        </div>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 dark:text-white/30 animate-bounce cursor-pointer hover:text-primary transition-colors"
            onClick={handleScrollDown}
        >
            <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
        </motion.div>
      </section>

      {/* Latest Articles Section */}
      <section className="space-y-24">
          <div className="flex items-center gap-4 mb-12">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('hero.latest_articles')}</h2>
             <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
          </div>

          {/* Featured Article */}
          {featuredPost && (
            <motion.article 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => onReadPost(featuredPost)}
              className="glass-panel rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row gap-12 group cursor-pointer relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(25,93,230,0.15)] hover:border-primary/20 mb-12"
            >
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-full md:w-5/12 aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 mix-blend-overlay"></div>
                 <div className="w-full h-full bg-slate-50 dark:bg-white/5 group-hover:scale-105 transition-transform duration-700"></div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">{t('common.featured')}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">{new Date(featuredPost.created_at).toLocaleDateString()}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-500 dark:text-white/50 text-lg leading-relaxed mb-10 font-light line-clamp-3">
                  {featuredPost.summary}
                </p>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                   {t('common.read_article')} 
                   <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </motion.article>
          )}

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {gridPosts.map((post, idx) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                onClick={() => onReadPost(post)}
                className="glass-panel rounded-[2rem] p-8 group cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all flex flex-col duration-500 hover:-translate-y-2"
              >
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 relative">
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/20 dark:from-white/5 to-transparent"></div>
                   <div className="w-full h-full bg-slate-50 dark:bg-white/5 group-hover:scale-105 transition-transform duration-700"></div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">{t('common.category')} {post.category_id}</span>
                  <span className="size-1 rounded-full bg-slate-200 dark:bg-white/10"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">5 {t('common.min_read')}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-slate-500 dark:text-white/40 text-base leading-relaxed mb-6 font-light line-clamp-3 flex-1">
                  {post.summary}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-white/60 group-hover:text-primary transition-colors uppercase tracking-widest">
                    {t('common.continue_reading')}
                </div>
              </motion.article>
            ))}
          </div>
          
          <div className="flex justify-center pt-12">
            <button className="bg-white/80 dark:bg-white/5 hover:bg-primary hover:text-white text-slate-900 dark:text-white px-10 py-4 rounded-full font-bold transition-all duration-300 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-primary flex items-center gap-3 group shadow-lg">
              <span>{t('hero.load_more')}</span>
              <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>
            </button>
          </div>

          {/* Newsletter Section */}
           <motion.section 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="glass-panel rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden border-slate-200 dark:border-white/10"
           >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
             <div className="relative z-10 max-w-xl mx-auto">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">{t('about.newsletter_title')}</h2>
                <p className="text-slate-500 dark:text-white/40 text-lg mb-10 leading-relaxed">
                  {t('about.newsletter_desc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                   <input 
                     type="email" 
                     placeholder={t('about.enter_email')}
                     className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10 outline-none transition-all" 
                   />
                   <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-[0_0_30px_rgba(25,93,230,0.3)] hover:brightness-110 hover:scale-105 active:scale-95 transition-all">
                     {t('about.subscribe')}
                   </button>
                </div>
             </div>
           </motion.section>
      </section>
    </div>
  );
};
