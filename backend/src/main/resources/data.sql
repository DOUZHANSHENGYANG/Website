INSERT OR IGNORE INTO admin_users (id, username, password)
VALUES (1, 'admin', 'admin');

INSERT OR IGNORE INTO configs (config_key, value, type)
VALUES
('site_title', 'Douzhan Thoughts', 'WEBSITE_SETTINGS'),
('hero_tag', '个人博客', 'WEBSITE_SETTINGS'),
('hero_title_start', '写下', 'WEBSITE_SETTINGS'),
('hero_title_end', '生活与代码', 'WEBSITE_SETTINGS'),
('hero_subtitle', '这是一个个人博客，记录我在技术、设计与生活中的灵感、踩坑与成长。', 'WEBSITE_SETTINGS'),
('categories_intro', '这里汇总了我在技术、设计、写作与生活中的真实记录，按主题浏览你感兴趣的内容。', 'WEBSITE_SETTINGS'),
('about_subtitle', '独立开发者、个人博主，持续记录技术与生活。', 'WEBSITE_SETTINGS'),
('about_focus_1_icon', 'terminal', 'WEBSITE_SETTINGS'),
('about_focus_1_title', 'Coding', 'WEBSITE_SETTINGS'),
('about_focus_1_desc', '专注前端工程、效率工具与可维护的代码实践。', 'WEBSITE_SETTINGS'),
('about_focus_2_icon', 'draw', 'WEBSITE_SETTINGS'),
('about_focus_2_title', 'Design', 'WEBSITE_SETTINGS'),
('about_focus_2_desc', '持续打磨界面细节、交互动效与视觉体验。', 'WEBSITE_SETTINGS'),
('about_focus_3_icon', 'auto_stories', 'WEBSITE_SETTINGS'),
('about_focus_3_title', 'Writing', 'WEBSITE_SETTINGS'),
('about_focus_3_desc', '记录真实经验、项目复盘与生活感悟。', 'WEBSITE_SETTINGS'),
('about_focus_order', '1,2,3', 'WEBSITE_SETTINGS'),
('admin_bio', '数字游民，咖啡爱好者，追求流动的界面美学。欢迎来到我的数字花园。', 'PERSONAL_INFO'),
('author_name', 'Douzhan', 'PERSONAL_INFO'),
('author_title', 'Personal Blogger', 'PERSONAL_INFO'),
('footer_text', '© 2026 Douzhan Thoughts · 个人博客，持续更新。', 'WEBSITE_SETTINGS'),
('language', 'zh', 'WEBSITE_SETTINGS');

INSERT OR IGNORE INTO categories (id, name, slug, description, icon, color)
VALUES
(1, 'Analytics', 'analytics', 'Data insights and metric visualization', 'analytics', '#3b82f6'),
(2, 'UX Design', 'ux-design', 'User experience and interface principles', 'architecture', '#a855f7'),
(3, 'Creative', 'creative', 'Artistic inspiration and creative direction', 'brush', '#22c55e'),
(4, 'Technology', 'technology', 'Emerging tech and future trends', 'rocket_launch', '#f97316'),
(5, 'Liquid Glass', 'liquid-glass', 'Design systems and aesthetics', 'bubble_chart', '#06b6d4');

INSERT OR IGNORE INTO posts (id, title, content, summary, status, category_id, created_at, updated_at)
VALUES
('1', 'Designing with glassmorphism', 'Glassmorphism is more than visual style. It helps communicate hierarchy and depth across modern interfaces.', 'A practical guide for balancing blur, opacity and contrast.', 'published', 5, '2026-01-28T10:00:00Z', '2026-02-07T10:00:00Z'),
('2', 'Vue vs React in real teams', 'Framework choice is not only about syntax. Team familiarity and ecosystem maturity matter for long-term delivery.', 'Why this prototype uses React while still appreciating Vue.', 'published', 4, '2026-01-25T10:00:00Z', '2026-02-07T10:00:00Z'),
('3', 'Late-night creative workflow', 'Quiet nighttime sessions can improve deep work and structured writing when notifications are minimal.', 'How to build reliable creative flow at night.', 'published', 3, '2026-01-20T10:00:00Z', '2026-02-07T10:00:00Z');
