"use client";

// Check if we are running in the browser
const isBrowser = typeof window !== 'undefined';

export interface User {
  id: string;
  email: string;
  reputation: number;
  role: 'admin' | 'member';
  status: 'pending' | 'approved' | 'disallowed' | 'banned';
  joinedAt: string;
  deviceInfo: string;
  ipAddress: string;
  referralSource: string;
}

export interface Post {
  id: string;
  title: string;
  category: string;
  author: {
    username: string;
    avatar: string;
    reputation: number;
  };
  createdAt: string;
  upvotes: number;
  downvotes: number;
  views: number;
  impressions: number;
  reads: number;
  visits: number;
  peopleReadingNow: number;
  commentsCount: number;
  isBookmarked?: boolean;
  score: number; // dynamically computed or cached ranking score
}

export interface Answer {
  id: string;
  postId: string;
  content: string;
  author: {
    username: string;
    avatar: string;
    reputation: number;
  };
  createdAt: string;
  upvotes: number;
  downvotes: number;
  isTopInsight?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  answerId: string;
  content: string;
  author: {
    username: string;
    avatar: string;
    reputation: number;
  };
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  type: 'Full-time' | 'Freelance' | 'Internship';
  skills: string[];
  experience: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  createdAt: string;
  appliedUsers: string[]; // array of emails
}

export interface AuditLog {
  id: string;
  type: 'signup_request' | 'user_approved' | 'user_disallowed' | 'user_banned' | 'upvote' | 'post_created' | 'answer_created' | 'job_applied';
  details: string;
  timestamp: string;
}

export interface SimulatedEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  meta?: {
    userId?: string;
    type?: 'signup_request' | 'trending' | 'standard';
  };
}

// Initial Seed Data
const DEFAULT_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'kapilsaini.dm@gmail.com',
    reputation: 999,
    role: 'admin',
    status: 'approved',
    joinedAt: '2026-05-01T12:00:00Z',
    deviceInfo: 'Chrome 125, macOS 14.5',
    ipAddress: '192.168.1.1',
    referralSource: 'Direct'
  },
  {
    id: 'user-alex',
    email: 'alex.seo@growth.io',
    reputation: 345,
    role: 'member',
    status: 'approved',
    joinedAt: '2026-05-10T14:30:00Z',
    deviceInfo: 'Safari 17.4, iOS 17.4',
    ipAddress: '172.56.21.89',
    referralSource: 'Twitter/X'
  },
  {
    id: 'user-elena',
    email: 'elena.a@promptlabs.ai',
    reputation: 512,
    role: 'member',
    status: 'approved',
    joinedAt: '2026-05-15T09:15:00Z',
    deviceInfo: 'Chrome 124, Windows 11',
    ipAddress: '84.22.109.43',
    referralSource: 'Hacker News'
  },
  {
    id: 'user-devon',
    email: 'devon.t@techseo.net',
    reputation: 218,
    role: 'member',
    status: 'approved',
    joinedAt: '2026-05-18T18:45:00Z',
    deviceInfo: 'Firefox 126, Linux x86_64',
    ipAddress: '198.51.100.12',
    referralSource: 'Newsletter'
  }
];

const DEFAULT_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Traffic volatility after Google May 2026 Core Update?',
    category: 'Google Update Reactions',
    author: {
      username: 'Devon_tech_seo_guru',
      avatar: '💻',
      reputation: 218
    },
    createdAt: '2026-05-24T18:30:00Z',
    upvotes: 142,
    downvotes: 2,
    views: 3210,
    impressions: 4120,
    reads: 2890,
    visits: 2950,
    peopleReadingNow: 8,
    commentsCount: 2,
    score: 0
  },
  {
    id: 'post-2',
    title: 'WordPress → Next.js migration caused 20–40% ranking drop?',
    category: 'Technical SEO Fixes',
    author: {
      username: 'Alex_ranking_wizard',
      avatar: '🧙‍♂️',
      reputation: 345
    },
    createdAt: '2026-05-24T16:15:00Z',
    upvotes: 98,
    downvotes: 1,
    views: 2150,
    impressions: 3120,
    reads: 1800,
    visits: 1950,
    peopleReadingNow: 4,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-3',
    title: 'Does AI-generated (human-reviewed) content risk penalty or de-indexing?',
    category: 'AI SEO Tactics',
    author: {
      username: 'Elena_ai_seo_architect',
      avatar: '🤖',
      reputation: 512
    },
    createdAt: '2026-05-24T14:40:00Z',
    upvotes: 210,
    downvotes: 4,
    views: 4120,
    impressions: 4950,
    reads: 3820,
    visits: 3900,
    peopleReadingNow: 15,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-4',
    title: 'No official SEO title but have HTML/Schema skills — how to stand out in interviews?',
    category: 'Technical SEO Fixes',
    author: {
      username: 'Sarah_vitals_expert',
      avatar: '⚡',
      reputation: 172
    },
    createdAt: '2026-05-24T12:00:00Z',
    upvotes: 78,
    downvotes: 1,
    views: 1850,
    impressions: 2450,
    reads: 1500,
    visits: 1600,
    peopleReadingNow: 2,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-5',
    title: 'Backlinks index instantly on Bing but take 15+ days on Google — why?',
    category: 'Ranking Experiments',
    author: {
      username: 'Marcus_crawl_master',
      avatar: '🕷️',
      reputation: 89
    },
    createdAt: '2026-05-24T08:10:00Z',
    upvotes: 64,
    downvotes: 2,
    views: 1420,
    impressions: 1980,
    reads: 1100,
    visits: 1200,
    peopleReadingNow: 3,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-6',
    title: 'Search Console links report showing incorrect or outdated data?',
    category: 'Indexing Problems Solved',
    author: {
      username: 'Devon_tech_seo_guru',
      avatar: '💻',
      reputation: 218
    },
    createdAt: '2026-05-23T20:30:00Z',
    upvotes: 52,
    downvotes: 0,
    views: 1250,
    impressions: 1680,
    reads: 980,
    visits: 1050,
    peopleReadingNow: 1,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-7',
    title: '50-day-old site — build backlinks or content authority first?',
    category: 'Ranking Experiments',
    author: {
      username: 'Alex_ranking_wizard',
      avatar: '🧙‍♂️',
      reputation: 345
    },
    createdAt: '2026-05-23T15:00:00Z',
    upvotes: 115,
    downvotes: 3,
    views: 2450,
    impressions: 3280,
    reads: 2100,
    visits: 2200,
    peopleReadingNow: 6,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-8',
    title: 'Separate product feeds for Google Ads vs Organic Shopping — industry standard?',
    category: 'Technical SEO Fixes',
    author: {
      username: 'Sarah_vitals_expert',
      avatar: '⚡',
      reputation: 172
    },
    createdAt: '2026-05-23T10:00:00Z',
    upvotes: 45,
    downvotes: 1,
    views: 980,
    impressions: 1410,
    reads: 780,
    visits: 850,
    peopleReadingNow: 0,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-9',
    title: 'Duplicate content problem in limited-keyword niche?',
    category: 'SEO Myth Destroyed',
    author: {
      username: 'Elena_ai_seo_architect',
      avatar: '🤖',
      reputation: 512
    },
    createdAt: '2026-05-22T16:00:00Z',
    upvotes: 128,
    downvotes: 2,
    views: 2850,
    impressions: 3680,
    reads: 2400,
    visits: 2500,
    peopleReadingNow: 5,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-10',
    title: 'When should an early-stage SaaS startup invest in SEO?',
    category: 'Ranking Experiments',
    author: {
      username: 'Alex_ranking_wizard',
      avatar: '🧙‍♂️',
      reputation: 345
    },
    createdAt: '2026-05-22T11:00:00Z',
    upvotes: 89,
    downvotes: 2,
    views: 1950,
    impressions: 2750,
    reads: 1600,
    visits: 1700,
    peopleReadingNow: 2,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-11',
    title: 'Is SEO dead or evolving in 2026?',
    category: 'SEO Myth Destroyed',
    author: {
      username: 'Elena_ai_seo_architect',
      avatar: '🤖',
      reputation: 512
    },
    createdAt: '2026-05-21T14:00:00Z',
    upvotes: 245,
    downvotes: 5,
    views: 4890,
    impressions: 5310,
    reads: 4210,
    visits: 4350,
    peopleReadingNow: 18,
    commentsCount: 2,
    score: 0
  },
  {
    id: 'post-12',
    title: 'How to do SEO as a beginner?',
    category: 'Ranking Experiments',
    author: {
      username: 'Marcus_crawl_master',
      avatar: '🕷️',
      reputation: 89
    },
    createdAt: '2026-05-20T09:00:00Z',
    upvotes: 110,
    downvotes: 3,
    views: 2310,
    impressions: 3100,
    reads: 1950,
    visits: 2000,
    peopleReadingNow: 3,
    commentsCount: 1,
    score: 0
  }
];

const DEFAULT_ANSWERS: Answer[] = [
  {
    id: 'ans-1-1',
    postId: 'post-1',
    content: `Core updates re-evaluate E-E-A-T signals site-wide. If you dropped, your content likely lost on "experience" or "trust" signals vs competitors — not a penalty, a re-ranking. 

Audit your top lost pages against current SERP winners and identify the intent gap.`,
    author: {
      username: 'Devon_tech_seo_guru',
      avatar: '💻',
      reputation: 218
    },
    createdAt: '2026-05-24T18:40:00Z',
    upvotes: 35,
    downvotes: 0,
    isTopInsight: true
  },
  {
    id: 'ans-2-1',
    postId: 'post-2',
    content: `Google re-crawls and re-evaluates your entire site post-migration. Likely culprits:
- Broken internal linking structure
- Changed URL patterns
- Slower Googlebot rendering of JS-heavy pages
- Lost signals from redirects

Check crawl coverage in Search Console immediately.`,
    author: {
      username: 'Alex_ranking_wizard',
      avatar: '🧙‍♂️',
      reputation: 345
    },
    createdAt: '2026-05-24T16:25:00Z',
    upvotes: 28,
    downvotes: 0,
    isTopInsight: true
  },
  {
    id: 'ans-3-1',
    postId: 'post-3',
    content: `No, if it genuinely helps users. Google targets low-quality, unreviewed AI spam — not AI-assisted content. 

Human review + original insight = safe. The risk is thin, repetitive content, not the production method itself.`,
    author: {
      username: 'Elena_ai_seo_architect',
      avatar: '🤖',
      reputation: 512
    },
    createdAt: '2026-05-24T14:55:00Z',
    upvotes: 84,
    downvotes: 1,
    isTopInsight: true
  },
  {
    id: 'ans-4-1',
    postId: 'post-4',
    content: `Lead with systems thinking, not tasks. Show a real case: "I identified a crawl budget leak that was wasting 40% of Googlebot's time." 

Coding skills are rare in SEO — that's your edge. Position it as technical SEO specialization, not general SEO.`,
    author: {
      username: 'Sarah_vitals_expert',
      avatar: '⚡',
      reputation: 172
    },
    createdAt: '2026-05-24T12:15:00Z',
    upvotes: 19,
    downvotes: 0
  },
  {
    id: 'ans-5-1',
    postId: 'post-5',
    content: `Bing crawls and indexes links aggressively. Google applies a trust evaluation layer before passing link equity — new links sit in a "pending trust" queue. 

Domain age, link source authority, and crawl frequency all affect speed. This is normal behavior.`,
    author: {
      username: 'Marcus_crawl_master',
      avatar: '🕷️',
      reputation: 89
    },
    createdAt: '2026-05-24T08:30:00Z',
    upvotes: 22,
    downvotes: 0
  },
  {
    id: 'ans-6-1',
    postId: 'post-6',
    content: `GSC's link report has a known ~3–4 week lag and doesn't show all links Google has discovered — only a sample. 

It's a reporting tool, not a real-time index. Use Ahrefs or Majestic for accurate link data.`,
    author: {
      username: 'Devon_tech_seo_guru',
      avatar: '💻',
      reputation: 218
    },
    createdAt: '2026-05-23T20:45:00Z',
    upvotes: 15,
    downvotes: 0
  },
  {
    id: 'ans-7-1',
    postId: 'post-7',
    content: `Content first, always. Without topical depth, backlinks land on thin pages and convert poorly into rankings. 

Build 10–15 strong topical cluster pages first, then earn/build links to content that deserves to rank.`,
    author: {
      username: 'Alex_ranking_wizard',
      avatar: '🧙‍♂️',
      reputation: 345
    },
    createdAt: '2026-05-23T15:20:00Z',
    upvotes: 42,
    downvotes: 1,
    isTopInsight: true
  },
  {
    id: 'ans-8-1',
    postId: 'post-8',
    content: `Yes. Paid feeds are optimized for ROAS (bid strategy, custom labels, price competitiveness). 

Organic feeds prioritize completeness, schema accuracy, and review signals. Same feed for both = underperforming in both channels.`,
    author: {
      username: 'Sarah_vitals_expert',
      avatar: '⚡',
      reputation: 172
    },
    createdAt: '2026-05-23T10:20:00Z',
    upvotes: 12,
    downvotes: 0
  },
  {
    id: 'ans-9-1',
    postId: 'post-9',
    content: `Use intent differentiation, not just wording changes. If two pages target the same query, consolidate them. 

If they serve different user stages (awareness vs decision), signal that clearly through structure, depth, and internal linking context.`,
    author: {
      username: 'Elena_ai_seo_architect',
      avatar: '🤖',
      reputation: 512
    },
    createdAt: '2026-05-22T16:20:00Z',
    upvotes: 38,
    downvotes: 0,
    isTopInsight: true
  },
  {
    id: 'ans-10-1',
    postId: 'post-10',
    content: `Not before product-market fit. SEO compounds slowly — start when you have stable core pages, a defined ICP, and at least 3–6 months of patience. 

Pre-PMF SEO is mostly wasted spend. Post-PMF, start with bottom-of-funnel comparison and solution-aware content first.`,
    author: {
      username: 'Alex_ranking_wizard',
      avatar: '🧙‍♂️',
      reputation: 345
    },
    createdAt: '2026-05-22T11:20:00Z',
    upvotes: 31,
    downvotes: 0,
    isTopInsight: true
  },
  {
    id: 'ans-11-1',
    postId: 'post-11',
    content: `Evolving, fast. AI Overviews now absorb informational clicks. 

The new SEO is about being cited by AI, owning branded search, and ranking for high-intent transactional queries AI won't replace. Zero-click is rising — visibility now ≠ traffic always.`,
    author: {
      username: 'Elena_ai_seo_architect',
      avatar: '🤖',
      reputation: 512
    },
    createdAt: '2026-05-21T14:20:00Z',
    upvotes: 95,
    downvotes: 2,
    isTopInsight: true
  },
  {
    id: 'ans-12-1',
    postId: 'post-12',
    content: `Start with one topic, go deep. Learn crawlability, search intent, and internal linking before tactics. 

Pick a small niche, publish 10 genuinely useful pages, build one quality link, then measure. Systems beat shortcuts every time.`,
    author: {
      username: 'Marcus_crawl_master',
      avatar: '🕷️',
      reputation: 89
    },
    createdAt: '2026-05-20T09:20:00Z',
    upvotes: 56,
    downvotes: 1,
    isTopInsight: true
  }
];

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: 'com-1',
    postId: 'post-1',
    answerId: 'ans-1-1',
    content: 'Do you think E-E-A-T re-evaluation is mostly based on off-site entity mentions or does page layout play a heavy role?',
    author: {
      username: 'Marcus_crawl_master',
      avatar: '🕷️',
      reputation: 89
    },
    createdAt: '2026-05-24T18:50:00Z'
  },
  {
    id: 'com-2',
    postId: 'post-1',
    answerId: 'ans-1-1',
    content: 'Google uses off-site brand authority metrics combined with layout quality estimators (like ad ratios and main content visibility).',
    author: {
      username: 'Devon_tech_seo_guru',
      avatar: '💻',
      reputation: 218
    },
    createdAt: '2026-05-24T19:05:00Z'
  },
  {
    id: 'com-3',
    postId: 'post-11',
    answerId: 'ans-11-1',
    content: 'Totally agree. The rise of Perplexity and Gemini means visibility optimization is moving towards LLM context windows.',
    author: {
      username: 'Sarah_vitals_expert',
      avatar: '⚡',
      reputation: 172
    },
    createdAt: '2026-05-21T15:30:00Z'
  }
];

const DEFAULT_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Lead Technical SEO Specialist',
    company: 'Airtable',
    salary: '$140K - $185K',
    location: 'Remote (US)',
    type: 'Full-time',
    skills: ['React', 'Next.js', 'Log Analysis', 'Crawl Budgeting'],
    experience: 'Lead',
    createdAt: '2026-05-20T10:00:00Z',
    appliedUsers: []
  },
  {
    id: 'job-2',
    title: 'AI SEO Content Engineer',
    company: 'Jasper AI',
    salary: '$110K - $140K',
    location: 'Hybrid (Austin, TX)',
    type: 'Full-time',
    skills: ['LLMs', 'Prompt Engineering', 'Python', 'Topical Authority'],
    experience: 'Senior',
    createdAt: '2026-05-22T14:30:00Z',
    appliedUsers: []
  },
  {
    id: 'job-3',
    title: 'Freelance Outreach Specialist',
    company: 'SaaS Growth Ltd',
    salary: '$5,000 - $8,000 / Mo',
    location: 'Remote (Global)',
    type: 'Freelance',
    skills: ['Link Building', 'Cold Email', 'PR Outreach', 'Negotiation'],
    experience: 'Mid',
    createdAt: '2026-05-23T11:15:00Z',
    appliedUsers: []
  },
  {
    id: 'job-4',
    title: 'SEO Technical Intern',
    company: 'Vercel',
    salary: '$40 - $60 / Hr',
    location: 'Remote',
    type: 'Internship',
    skills: ['Next.js', 'Web Vitals', 'SSR', 'TypeScript'],
    experience: 'Junior',
    createdAt: '2026-05-24T09:00:00Z',
    appliedUsers: []
  }
];

// Helper to compute Smart Ranking Score
export function calculatePostScore(post: Post): number {
  // Score formula: (Upvotes - Downvotes) * 10 + Views * 1 + Impressions * 0.2 + CommentsCount * 5 + PeopleReadingNow * 2
  const up = post.upvotes || 0;
  const down = post.downvotes || 0;
  const netVotes = up - down;
  const views = post.views || 0;
  const impressions = post.impressions || 0;
  const comments = post.commentsCount || 0;
  const activeReading = post.peopleReadingNow || 0;
  
  return netVotes * 10 + views * 1 + impressions * 0.2 + comments * 5 + activeReading * 2;
}

// Helper to compute User Ranks based on Reputation
export function getUserRank(reputation: number): { title: string; color: string; icon: string } {
  if (reputation >= 500) {
    return { title: 'Algorithm Whisperer', color: 'text-amber-400 border-amber-500/20 bg-amber-950/20', icon: '👑' };
  }
  if (reputation >= 300) {
    return { title: 'Traffic Engineer', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-950/20', icon: '⚡' };
  }
  if (reputation >= 100) {
    return { title: 'Indexation Master', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20', icon: '🚀' };
  }
  return { title: 'Junior Crawler', color: 'text-slate-400 border-slate-800 bg-slate-900/40', icon: '🕷️' };
}

// Database Class/Controller
class LocalDatabase {
  private users: User[] = [];
  private posts: Post[] = [];
  private answers: Answer[] = [];
  private comments: Comment[] = [];
  private jobs: Job[] = [];
  private logs: AuditLog[] = [];
  private emails: SimulatedEmail[] = [];
  private currentUser: User | null = null;
  private changeListeners: Set<() => void> = new Set();
  
  // Volatility sensor properties
  private volatilityScore: number = 8.4;
  private volatilityVotes = { hit: 48, recovered: 12, stable: 115 };

  constructor() {
    this.loadFromStorage();
  }

  subscribe(listener: () => void) {
    this.changeListeners.add(listener);
    return () => {
      this.changeListeners.delete(listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.changeListeners.forEach(listener => listener());
  }

  private loadFromStorage() {
    if (!isBrowser) return;

    try {
      const u = localStorage.getItem('seo_users');
      const p = localStorage.getItem('seo_posts');
      const a = localStorage.getItem('seo_answers');
      const c = localStorage.getItem('seo_comments');
      const j = localStorage.getItem('seo_jobs');
      const l = localStorage.getItem('seo_logs');
      const e = localStorage.getItem('seo_emails');
      const cu = localStorage.getItem('seo_current_user');
      
      const vs = localStorage.getItem('seo_volatility_score');
      const vv = localStorage.getItem('seo_volatility_votes');

      this.users = u ? JSON.parse(u) : DEFAULT_USERS;
      this.posts = p ? JSON.parse(p) : DEFAULT_POSTS;
      this.answers = a ? JSON.parse(a) : DEFAULT_ANSWERS;
      this.comments = c ? JSON.parse(c) : DEFAULT_COMMENTS;
      this.jobs = j ? JSON.parse(j) : DEFAULT_JOBS;
      this.logs = l ? JSON.parse(l) : [];
      this.emails = e ? JSON.parse(e) : [];
      this.currentUser = cu ? JSON.parse(cu) : null;
      
      this.volatilityScore = vs ? parseFloat(vs) : 8.4;
      this.volatilityVotes = vv ? JSON.parse(vv) : { hit: 48, recovered: 12, stable: 115 };

      // Ensure scores are calculated
      this.posts.forEach(post => {
        post.score = calculatePostScore(post);
      });
    } catch (err) {
      console.error('Error loading LocalStorage db:', err);
    }
  }

  private saveToStorage() {
    if (!isBrowser) return;

    try {
      localStorage.setItem('seo_users', JSON.stringify(this.users));
      localStorage.setItem('seo_posts', JSON.stringify(this.posts));
      localStorage.setItem('seo_answers', JSON.stringify(this.answers));
      localStorage.setItem('seo_comments', JSON.stringify(this.comments));
      localStorage.setItem('seo_jobs', JSON.stringify(this.jobs));
      localStorage.setItem('seo_logs', JSON.stringify(this.logs));
      localStorage.setItem('seo_emails', JSON.stringify(this.emails));
      
      localStorage.setItem('seo_volatility_score', this.volatilityScore.toString());
      localStorage.setItem('seo_volatility_votes', JSON.stringify(this.volatilityVotes));

      
      if (this.currentUser) {
        localStorage.setItem('seo_current_user', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('seo_current_user');
      }
    } catch (err) {
      console.error('Error saving LocalStorage db:', err);
    }
  }

  // User Actions
  signUp(email: string, referral: string) {
    const isFirst = this.users.length === 0;
    const isAdminEmail = email.toLowerCase() === 'kapilsaini.dm@gmail.com';
    const role = isAdminEmail ? 'admin' : 'member';
    
    // Default admin is approved instantly, others start as pending
    const status = isAdminEmail ? 'approved' : 'pending';

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      reputation: isFirst || isAdminEmail ? 100 : 10,
      role,
      status,
      joinedAt: new Date().toISOString(),
      deviceInfo: isBrowser ? navigator.userAgent : 'Unknown Device',
      ipAddress: '24.108.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
      referralSource: referral || 'Organic',
    };

    // Add user
    this.users.push(newUser);

    // Auto set current user
    this.currentUser = newUser;

    // Log this action
    this.addLog('signup_request', `New registration request from ${email}`);

    // Send email to admin
    this.sendEmail(
      'kapilsaini.dm@gmail.com',
      'New SEO Community Registration Pending Approval',
      `Admin, a new user has requested membership on the SEO Intelligence platform.
      
      User Details:
      Email: ${email}
      Timestamp: ${newUser.joinedAt}
      IP Address: ${newUser.ipAddress}
      Device/Browser: ${newUser.deviceInfo}
      Referral Source: ${newUser.referralSource}
      
      Review this request directly below or in the Admin Control Panel.`,
      { userId: newUser.id, type: 'signup_request' }
    );

    // Call server API route to send a real email alert to the admin
    if (isBrowser) {
      fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUser.email,
          timestamp: newUser.joinedAt,
          ipAddress: newUser.ipAddress,
          deviceInfo: newUser.deviceInfo,
          referralSource: newUser.referralSource
        })
      }).catch(err => console.error('Failed to send admin email API:', err));
    }

    this.notify();
    return newUser;
  }

  logIn(email: string) {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      if (user.status === 'banned') {
        throw new Error('This account has been banned due to spam or terms violations.');
      }
      this.currentUser = user;
      this.notify();
      return user;
    } else {
      // Auto sign up if not found
      return this.signUp(email, 'Direct Login');
    }
  }

  logOut() {
    this.currentUser = null;
    this.notify();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUsers() {
    return this.users;
  }

  // Admin Actions
  approveUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = 'approved';
      this.addLog('user_approved', `Approved membership for ${user.email}`);
      this.sendEmail(
        user.email,
        'Welcome to the SEO War Room! Access Approved',
        `Congratulations! Your membership request has been reviewed and approved by the administrator.
        
        You now have full platform access:
        - Post SEO ranking experiments
        - Upvote high-quality ranking strategies
        - Apply for premium SEO opportunities
        - Participate in live SEO case studies
        
        Explore discussions now: http://localhost:3000/`
      );
      this.notify();
    }
  }

  disallowUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = 'disallowed';
      this.addLog('user_disallowed', `Rejected membership for ${user.email}`);
      this.notify();
    }
  }

  banUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = 'banned';
      this.addLog('user_banned', `Banned account ${user.email}`);
      if (this.currentUser?.id === userId) {
        this.currentUser = null;
      }
      this.notify();
    }
  }

  // Posts & Feedback
  getPosts(categoryFilter: string = 'All') {
    let filtered = [...this.posts];
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    // Sort by computed score descending (smart answer ranking engine)
    return filtered.sort((a, b) => b.score - a.score);
  }

  getPostById(postId: string) {
    return this.posts.find(p => p.id === postId);
  }

  addPost(title: string, category: string, body: string) {
    if (!this.currentUser) throw new Error('Authentication required.');
    if (this.currentUser.status !== 'approved') {
      throw new Error('Your account is under review and cannot post yet.');
    }

    const newPostId = `post-${Date.now()}`;
    const newPost: Post = {
      id: newPostId,
      title,
      category,
      author: {
        username: this.currentUser.email.split('@')[0],
        avatar: '🚀',
        reputation: this.currentUser.reputation
      },
      createdAt: new Date().toISOString(),
      upvotes: 1,
      downvotes: 0,
      views: 1,
      impressions: 1,
      reads: 1,
      visits: 1,
      peopleReadingNow: 1,
      commentsCount: 1,
      score: 0
    };

    newPost.score = calculatePostScore(newPost);
    this.posts.push(newPost);

    // Create the first answer automatically containing the body
    const firstAnswer: Answer = {
      id: `ans-${Date.now()}`,
      postId: newPostId,
      content: body,
      author: {
        username: this.currentUser.email.split('@')[0],
        avatar: '🚀',
        reputation: this.currentUser.reputation
      },
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0
    };
    this.answers.push(firstAnswer);

    this.addLog('post_created', `User ${this.currentUser.email} created post: ${title}`);
    this.notify();
    return newPost;
  }

  addAnswer(postId: string, content: string) {
    if (!this.currentUser) throw new Error('Authentication required.');
    if (this.currentUser.status !== 'approved') {
      throw new Error('Your account is under review and cannot post yet.');
    }

    const newAnswer: Answer = {
      id: `ans-${Date.now()}`,
      postId,
      content,
      author: {
        username: this.currentUser.email.split('@')[0],
        avatar: '💡',
        reputation: this.currentUser.reputation
      },
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0
    };

    this.answers.push(newAnswer);

    // Update post count
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1;
      post.score = calculatePostScore(post);
    }

    this.addLog('answer_created', `User ${this.currentUser.email} answered thread ${postId}`);
    this.notify();
    return newAnswer;
  }

  getAnswers(postId: string) {
    return this.answers
      .filter(a => a.postId === postId)
      .sort((a, b) => b.upvotes - a.upvotes); // Top answers win visibility
  }

  addComment(postId: string, answerId: string, content: string) {
    if (!this.currentUser) throw new Error('Authentication required.');
    if (this.currentUser.status !== 'approved') {
      throw new Error('Your account is under review.');
    }

    const comment: Comment = {
      id: `com-${Date.now()}`,
      postId,
      answerId,
      content,
      author: {
        username: this.currentUser.email.split('@')[0],
        avatar: '💬',
        reputation: this.currentUser.reputation
      },
      createdAt: new Date().toISOString()
    };

    this.comments.push(comment);
    
    // Increment comments counts on post
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1;
      post.score = calculatePostScore(post);
    }

    this.notify();
    return comment;
  }

  getComments(answerId: string) {
    return this.comments.filter(c => c.answerId === answerId);
  }

  // Voting
  upvotePost(postId: string) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.upvotes += 1;
      post.score = calculatePostScore(post);

      // Award reputation to author
      const authorUser = this.users.find(u => u.email.split('@')[0] === post.author.username);
      if (authorUser) {
        authorUser.reputation += 10;
      }
      post.author.reputation += 10;

      this.addLog('upvote', `Upvoted discussion ${postId}`);
      this.checkTriggers(post);
      this.notify();
    }
  }

  downvotePost(postId: string) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.downvotes += 1;
      post.score = calculatePostScore(post);
      this.notify();
    }
  }

  upvoteAnswer(answerId: string) {
    const answer = this.answers.find(a => a.id === answerId);
    if (answer) {
      answer.upvotes += 1;
      
      // Check if it should become a "Top Performing SEO Insight"
      // Threshold: e.g. 20 upvotes
      if (answer.upvotes >= 20 && !answer.isTopInsight) {
        answer.isTopInsight = true;
        
        // Award reputation to author
        const authorUser = this.users.find(u => u.email.split('@')[0] === answer.author.username);
        if (authorUser) {
          authorUser.reputation += 50;
        }
        answer.author.reputation += 50;

        // Trigger notification
        this.sendEmail(
          authorUser?.email || `${answer.author.username}@seointel.com`,
          'Your SEO insight has been awarded: Top Performing SEO Insight!',
          `Incredible work! Your answer on thread "${this.getPostById(answer.postId)?.title}" has received high upvotes and is now featured with a golden glow and top visibility badge.
          
          View your trending answer: http://localhost:3000/post/${answer.postId}`
        );
      }
      this.notify();
    }
  }

  // Clicks, Reads & Impressions Simulation
  recordPostClick(postId: string) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.views += 1;
      post.visits += 1;
      post.reads += Math.random() > 0.3 ? 1 : 0;
      post.peopleReadingNow = Math.floor(Math.random() * 8) + 2;
      post.score = calculatePostScore(post);
      
      this.checkTriggers(post);
      this.notify();
    }
  }

  // Generate automated impressions/views under 5K to make it look active
  tickImpressions() {
    this.posts.forEach(post => {
      post.impressions += Math.floor(Math.random() * 4) + 1;
      post.views += Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : 0;
      if (post.peopleReadingNow > 0 && Math.random() > 0.7) {
        post.peopleReadingNow += Math.random() > 0.5 ? 1 : -1;
      }
      post.score = calculatePostScore(post);
      this.checkTriggers(post);
    });
    this.notify();
  }

  // Email Notification System Triggers
  private checkTriggers(post: Post) {
    // If post reaches specific milestones, send alerts to the author
    const authorUser = this.users.find(u => u.email.split('@')[0] === post.author.username);
    if (!authorUser) return;

    const emailPrefix = authorUser.email;
    const storageKeySent = `sent_milestone_${post.id}`;
    let sentMilestones = [];
    if (isBrowser) {
      try {
        const stored = localStorage.getItem(storageKeySent);
        sentMilestones = stored ? JSON.parse(stored) : [];
      } catch {}
    }

    // Check impressions milestones
    if (post.impressions >= 4500 && !sentMilestones.includes('4.5k')) {
      sentMilestones.push('4.5k');
      this.sendEmail(
        emailPrefix,
        'Your SEO insight received the highest impressions today!',
        `Sensational news! Your post "${post.title}" is currently dominant, climbing past 4,500 organic impressions.
        
        Analytics:
        - Impressions: ${post.impressions}
        - Total Reads: ${post.reads}
        - Active Readers: ${post.peopleReadingNow}
        
        Keep writing high-performing answers to maintain your visibility! http://localhost:3000/post/${post.id}`
      );
    } else if (post.impressions >= 3000 && !sentMilestones.includes('3k')) {
      sentMilestones.push('3k');
      this.sendEmail(
        emailPrefix,
        'Your discussion is now ranking at the top!',
        `Your discussion "${post.title}" has climbed to the top of its category. Excellent technical detail!
        
        Our smart ranking engine has shifted your post into premium visibility.
        
        View Stats: http://localhost:3000/post/${post.id}`
      );
    } else if (post.upvotes >= 150 && !sentMilestones.includes('150up')) {
      sentMilestones.push('150up');
      this.sendEmail(
        emailPrefix,
        'Your answer is trending.',
        `Alert: Your SEO strategy outline in "${post.title}" has gathered over 150 upvotes from verified industry experts.
        
        Reputation awarded: +150
        
        Engage with the comment replies here: http://localhost:3000/post/${post.id}`
      );
    }

    if (isBrowser) {
      try {
        localStorage.setItem(storageKeySent, JSON.stringify(sentMilestones));
      } catch {}
    }
  }

  // Jobs Actions
  getJobs() {
    return this.jobs;
  }

  applyToJob(jobId: string, email: string, resumeLink: string, coverLetter: string) {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      if (!job.appliedUsers.includes(email)) {
        job.appliedUsers.push(email);
      }
      
      this.addLog('job_applied', `${email} applied for ${job.title} at ${job.company}`);

      // Send confirmation to candidate
      this.sendEmail(
        email,
        `Application Received: ${job.title} at ${job.company}`,
        `Hello,
        
        We have received your application for the ${job.title} position.
        
        Application details:
        Portfolio / CV: ${resumeLink}
        Short Pitch: ${coverLetter}
        
        Recruiters at ${job.company} have been notified. We will update you as soon as they review your submission.`
      );

      // Send notification to recruiter (simulated admin)
      this.sendEmail(
        'kapilsaini.dm@gmail.com',
        `New Candidate Application: ${job.title} at ${job.company}`,
        `Admin, a new candidate has applied for the SEO opportunity.
        
        Job: ${job.title}
        Company: ${job.company}
        Candidate Email: ${email}
        Portfolio URL: ${resumeLink}
        Cover Letter:
        "${coverLetter}"`
      );

      this.notify();
    }
  }

  // Admin Logs
  getLogs() {
    return this.logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addLog(type: AuditLog['type'], details: string) {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      type,
      details,
      timestamp: new Date().toISOString()
    };
    this.logs.push(newLog);
    // Limit log size to 100 entries
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }

  // Email System
  getEmails() {
    return this.emails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  sendEmail(to: string, subject: string, body: string, meta?: SimulatedEmail['meta']) {
    const email: SimulatedEmail = {
      id: `email-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      to,
      subject,
      body,
      timestamp: new Date().toISOString(),
      read: false,
      meta
    };
    this.emails.push(email);
    // Limit size
    if (this.emails.length > 50) {
      this.emails.shift();
    }

    // Trigger local CustomEvent to show a real-time email popup in client UI
    if (isBrowser) {
      const event = new CustomEvent('simulated-email-sent', { detail: email });
      window.dispatchEvent(event);
    }
  }

  getVolatility() {
    return {
      score: this.volatilityScore,
      votes: this.volatilityVotes
    };
  }

  voteVolatility(type: 'hit' | 'recovered' | 'stable') {
    this.volatilityVotes[type] += 1;
    
    // Dynamically adjust score slightly based on crowdsourced hit reports!
    if (type === 'hit') {
      this.volatilityScore = Math.min(10, parseFloat((this.volatilityScore + 0.15).toFixed(2)));
    } else if (type === 'stable') {
      this.volatilityScore = Math.max(1, parseFloat((this.volatilityScore - 0.08).toFixed(2)));
    } else if (type === 'recovered') {
      this.volatilityScore = Math.max(1, Math.min(10, parseFloat((this.volatilityScore - 0.03).toFixed(2))));
    }
    
    this.addLog('upvote', `Recorded crowdsourced Google Core Update impact vote: ${type.toUpperCase()}`);
    this.notify();
  }

  clearAllData() {
    if (!isBrowser) return;
    localStorage.removeItem('seo_users');
    localStorage.removeItem('seo_posts');
    localStorage.removeItem('seo_answers');
    localStorage.removeItem('seo_comments');
    localStorage.removeItem('seo_jobs');
    localStorage.removeItem('seo_logs');
    localStorage.removeItem('seo_emails');
    localStorage.removeItem('seo_current_user');
    this.loadFromStorage();
    this.notify();
  }
}

// Export singleton database instance
export const db = new LocalDatabase();

// In browser, trigger automated impression ticks every 10 seconds to make feed feel live
if (isBrowser) {
  setInterval(() => {
    db.tickImpressions();
  }, 10000);
}
