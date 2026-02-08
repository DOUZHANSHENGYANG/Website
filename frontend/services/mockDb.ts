import { Post, Config, Category } from '../types';

const STORAGE_KEYS = {
  USERS: 'blog_users',
  POSTS: 'blog_posts',
  CONFIGS: 'blog_configs',
  SESSION: 'blog_session',
  CATEGORIES: 'blog_categories'
};

const DEFAULT_CONFIGS: Config[] = [
  { key: 'site_title', value: 'Liquid Thoughts', type: 'WEBSITE_SETTINGS' },
  { key: 'admin_bio', value: '数字游民，咖啡爱好者，追求流动的界面美学。欢迎来到我的数字花园。', type: 'PERSONAL_INFO' },
  { key: 'footer_text', value: '© 2024 Crafted with fluid dreams.', type: 'WEBSITE_SETTINGS' },
  { key: 'language', value: 'zh', type: 'WEBSITE_SETTINGS' }
];

export const DEFAULT_CATEGORIES: Category[] = [
  { 
    id: 1, 
    name: 'Analytics', 
    slug: 'analytics', 
    description: 'Data insights and metric visualization', 
    icon: 'analytics', 
    color: '#3b82f6' // Blue
  },
  { 
    id: 2, 
    name: 'UX Design', 
    slug: 'ux-design', 
    description: 'User experience and interface principles', 
    icon: 'architecture', 
    color: '#a855f7' // Purple
  },
  { 
    id: 3, 
    name: 'Creative', 
    slug: 'creative', 
    description: 'Artistic inspiration and creative direction', 
    icon: 'brush', 
    color: '#22c55e' // Green
  },
  { 
    id: 4, 
    name: 'Technology', 
    slug: 'technology', 
    description: 'Emerging tech and future trends', 
    icon: 'rocket_launch', 
    color: '#f97316' // Orange
  },
  { 
    id: 5, 
    name: 'Liquid Glass', 
    slug: 'liquid-glass', 
    description: 'Design systems and aesthetics', 
    icon: 'bubble_chart', 
    color: '#06b6d4' // Cyan
  }
];

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: '毛玻璃美学的艺术',
    summary: '探索现代 UI 设计中模糊、透明度和深度的微妙平衡。',
    content: "Glassmorphism 不仅仅是一个趋势，它是一种通过深度引入层级关系的方式。\n\n通过使用 **backdrop-filter: blur()**，我们模仿了磨砂玻璃的属性。\n\n### 关键原则：\n- **半透明**：创造悬浮感。\n- **层级**：物体越近，背景模糊度越低。\n- **微妙**：边框应该是低透明度的1px白色。\n\n这种感觉很自然，就像透过雨窗看世界。",
    status: 'published',
    category_id: 5,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Vue vs React: 流动的视角',
    summary: '为什么我选择用 React 构建这个项目，尽管我喜爱 Vue。生态系统实在太庞大了。',
    content: "虽然 **Vue 3** 通过组合式 API 提供了令人难以置信的开发体验，但 **React** 仍然是生态系统之王。\n\n在这个项目中，我们使用 `localStorage` 模拟后端。这是一个有趣的实验，看看我们在没有真实服务器的情况下能将静态 SPA 推多远。\n\n> '代码像水一样，它呈现出容器的形状。'",
    status: 'published',
    category_id: 4,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: '午夜咖啡',
    summary: '当世界沉睡时的生产力思考。',
    content: "凌晨2点有一种独特的寂静。通知停止了，邮件暂停了，只有你和发光的屏幕。\n\n我经常发现我最好的心流状态发生在世界其他地方正在做梦的时候。深色模式不仅仅是UI选择；它是一种生活方式。",
    status: 'published',
    category_id: 3,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString()
  }
];

class MockDB {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CONFIGS)) {
      localStorage.setItem(STORAGE_KEYS.CONFIGS, JSON.stringify(DEFAULT_CONFIGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(MOCK_POSTS));
    }
  }

  getConfigs(): Config[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIGS) || '[]');
  }

  updateConfig(key: string, value: string) {
    const configs = this.getConfigs();
    const idx = configs.findIndex(c => c.key === key);
    if (idx !== -1) {
      configs[idx].value = value;
    } else {
      const type = key === 'admin_bio' || key === 'avatar' ? 'PERSONAL_INFO' : 'WEBSITE_SETTINGS';
      configs.push({ key, value, type });
    }
    localStorage.setItem(STORAGE_KEYS.CONFIGS, JSON.stringify(configs));
  }

  getPosts(): Post[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
  }

  savePost(post: Partial<Post>): Post {
    const posts = this.getPosts();
    let savedPost: Post;

    if (post.id) {
      const idx = posts.findIndex(p => p.id === post.id);
      if (idx !== -1) {
        posts[idx] = { ...posts[idx], ...post, updated_at: new Date().toISOString() } as Post;
        savedPost = posts[idx];
      } else {
        savedPost = { ...post } as Post;
      }
    } else {
      savedPost = {
        ...post,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Post;
      posts.unshift(savedPost);
    }
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return savedPost;
  }

  deletePost(id: string) {
    const posts = this.getPosts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }

  getCategories(): Category[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
  }

  saveCategory(category: Partial<Category>) {
    const categories = this.getCategories();
    if (category.id) {
       // update
       const idx = categories.findIndex(c => c.id === category.id);
       if (idx !== -1) categories[idx] = { ...categories[idx], ...category } as Category;
    } else {
       // create
       const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
       categories.push({ 
         id: newId, 
         name: category.name!, 
         slug: category.slug || category.name!.toLowerCase().replace(/\s+/g, '-'),
         description: category.description || '',
         icon: category.icon || 'folder',
         color: category.color || '#195de6'
       });
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  deleteCategory(id: number) {
    const categories = this.getCategories().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem(STORAGE_KEYS.SESSION, 'true');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SESSION) === 'true';
  }
}

export const db = new MockDB();
