import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Config, Post } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton
} from 'react-share';

interface PostMetricPayload {
  post_id: string;
  view_count: number;
  like_count: number;
}

interface PublicPostProps {
  post: Post;
  configs: Config[];
  onTrackView: (postId: string) => Promise<PostMetricPayload>;
  onLike: (postId: string) => Promise<PostMetricPayload>;
  onUnlike: (postId: string) => Promise<PostMetricPayload>;
  onBack: () => void;
}

export const PublicPost: React.FC<PublicPostProps> = ({ post, configs, onTrackView, onLike, onUnlike, onBack }) => {
  const { t } = useLanguage();

  const avatarUrl = configs.find((config) => config.key === 'avatar')?.value || '';
  const authorName = configs.find((config) => config.key === 'author_name')?.value
    || configs.find((config) => config.key === 'site_title')?.value
    || 'Douzhan';
  const authorTitle = configs.find((config) => config.key === 'author_title')?.value || 'Personal Blogger';

  const [metrics, setMetrics] = useState({
    viewCount: post.view_count ?? 0,
    likeCount: post.like_count ?? 0
  });
  const [liked, setLiked] = useState(false);
  const [submittingLike, setSubmittingLike] = useState(false);
  const trackedPostRef = useRef<string | null>(null);

  const likeStorageKey = `douzhan-post-liked-${post.id}`;

  useEffect(() => {
    setMetrics({
      viewCount: post.view_count ?? 0,
      likeCount: post.like_count ?? 0
    });
  }, [post.id, post.like_count, post.view_count]);

  useEffect(() => {
    const likedBefore = window.localStorage.getItem(likeStorageKey) === '1';
    setLiked(likedBefore);
  }, [likeStorageKey]);

  useEffect(() => {
    if (trackedPostRef.current === post.id) {
      return;
    }
    trackedPostRef.current = post.id;

    const trackView = async () => {
      try {
        const result = await onTrackView(post.id);
        setMetrics({
          viewCount: result.view_count,
          likeCount: result.like_count
        });
      } catch (error) {
        console.error(error);
      }
    };

    void trackView();
  }, [onTrackView, post.id]);

  const shareUrl = useMemo(() => {
    const current = new URL(window.location.href);
    current.searchParams.set('post', post.id);
    return current.toString();
  }, [post.id]);

  const shareTitle = `${post.title} | ${authorName}`;

  const handleLikeToggle = async () => {
    if (submittingLike) return;
    setSubmittingLike(true);
    try {
      const result = liked
        ? await onUnlike(post.id)
        : await onLike(post.id);

      setMetrics({
        viewCount: result.view_count,
        likeCount: result.like_count
      });

      const nextLiked = !liked;
      setLiked(nextLiked);
      if (nextLiked) {
        window.localStorage.setItem(likeStorageKey, '1');
      } else {
        window.localStorage.removeItem(likeStorageKey);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '点赞操作失败，请稍后重试');
    } finally {
      setSubmittingLike(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <button onClick={onBack} className="mb-8 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 font-bold transition-colors text-sm uppercase tracking-wider group">
        <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span> {t('common.back')}
      </button>

      <div className="glass-panel rounded-t-3xl p-8 lg:p-16 flex flex-col items-center text-center border-b-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60"></div>
        <div className="flex items-center gap-3 mb-8">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-[0.2em] uppercase">{t('common.category')} {post.category_id}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20"></span>
          <span className="text-slate-400 dark:text-white/40 text-xs font-medium uppercase tracking-widest">{new Date(post.created_at).toLocaleDateString()}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20"></span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-white/40 font-medium uppercase tracking-wider">
            <span className="material-symbols-outlined text-base">visibility</span>
            {metrics.viewCount}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-white/40 font-medium uppercase tracking-wider">
            <span className="material-symbols-outlined text-base">favorite</span>
            {metrics.likeCount}
          </span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full border border-white/20 bg-gradient-to-br from-primary to-purple-500 shadow-lg p-[2px] overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={authorName} className="w-full h-full rounded-full object-cover bg-white" />
            ) : (
              <div className="w-full h-full rounded-full bg-white/90 dark:bg-slate-900/70 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-base">person</span>
              </div>
            )}
          </div>
          <div className="text-left">
            <p className="text-slate-900 dark:text-white font-bold text-sm">{authorName}</p>
            <p className="text-slate-500 dark:text-white/40 text-[10px] uppercase tracking-wider font-bold">{authorTitle}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-b-3xl p-8 lg:p-16 border-t-0 shadow-2xl">
        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-extrabold prose-p:leading-relaxed prose-img:rounded-2xl prose-img:shadow-xl prose-pre:rounded-2xl prose-a:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-white/5 flex items-center justify-center gap-6">
          <span className="text-slate-400 dark:text-white/30 text-[10px] uppercase font-bold tracking-[0.3em]">{t('common.share')}</span>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <TwitterIcon size={42} round />
            </TwitterShareButton>
            <FacebookShareButton url={shareUrl} hashtag="#DouzhanThoughts">
              <FacebookIcon size={42} round />
            </FacebookShareButton>
            <LinkedinShareButton url={shareUrl} title={shareTitle} summary={post.summary}>
              <LinkedinIcon size={42} round />
            </LinkedinShareButton>
            <RedditShareButton url={shareUrl} title={shareTitle}>
              <RedditIcon size={42} round />
            </RedditShareButton>

            <button
              onClick={handleLikeToggle}
              disabled={submittingLike}
              className={`h-[42px] px-4 rounded-full border flex items-center gap-2 text-sm font-bold transition-all disabled:cursor-not-allowed ${
                liked
                  ? 'bg-red-500/20 border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-500/25'
                  : 'bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500'
              }`}
            >
              <span className="material-symbols-outlined text-lg">favorite</span>
              {metrics.likeCount}
              <span className="text-[11px] opacity-80">{liked ? '已点赞' : '点赞'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
