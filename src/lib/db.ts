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
  week?: string;
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
    week: 'Week 1 (Archive)',
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
    week: 'Week 1 (Archive)',
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
    week: 'Week 1 (Archive)',
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
    week: 'Week 1 (Archive)',
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
    week: 'Week 1 (Archive)',
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
    week: 'Week 1 (Archive)',
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
    week: 'Week 1 (Archive)',
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
    week: 'Week 1 (Archive)',
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
    week: 'Week 1 (Archive)',
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
    week: 'Week 1 (Archive)',
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
    week: 'Week 1 (Archive)',
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
    week: 'Week 1 (Archive)',
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
  },
  {
    id: 'post-13',
    title: 'What SEO services do you mainly offer?',
    category: 'Technical SEO Fixes',
    week: 'Week 2 (Latest)',
    author: {
      username: 'Marcus_crawl_master',
      avatar: '🕷️',
      reputation: 89
    },
    createdAt: '2026-05-26T01:00:00Z',
    upvotes: 120,
    downvotes: 1,
    views: 2400,
    impressions: 3100,
    reads: 2000,
    visits: 2100,
    peopleReadingNow: 6,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-14',
    title: 'How are people getting SEO clients in 2026?',
    category: 'Ranking Experiments',
    week: 'Week 2 (Latest)',
    author: {
      username: 'Alex_ranking_wizard',
      avatar: '🧙‍♂️',
      reputation: 345
    },
    createdAt: '2026-05-26T00:50:00Z',
    upvotes: 185,
    downvotes: 2,
    views: 3800,
    impressions: 4300,
    reads: 3200,
    visits: 3300,
    peopleReadingNow: 11,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-15',
    title: "Google dropped an official AI SEO guide and it's...",
    category: 'AI SEO Tactics',
    week: 'Week 2 (Latest)',
    author: {
      username: 'Elena_ai_seo_architect',
      avatar: '🤖',
      reputation: 512
    },
    createdAt: '2026-05-26T00:40:00Z',
    upvotes: 250,
    downvotes: 4,
    views: 4900,
    impressions: 5800,
    reads: 4300,
    visits: 4400,
    peopleReadingNow: 14,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-16',
    title: 'SEO Help Weekly Mega Thread',
    category: 'Google Update Reactions',
    week: 'Week 2 (Latest)',
    author: {
      username: 'Devon_tech_seo_guru',
      avatar: '💻',
      reputation: 218
    },
    createdAt: '2026-05-26T00:30:00Z',
    upvotes: 75,
    downvotes: 1,
    views: 1400,
    impressions: 1900,
    reads: 1100,
    visits: 1200,
    peopleReadingNow: 3,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-17',
    title: "Drop your business and I'll tell you what SEO pages to build first",
    category: 'Technical SEO Fixes',
    week: 'Week 2 (Latest)',
    author: {
      username: 'Sarah_vitals_expert',
      avatar: '⚡',
      reputation: 172
    },
    createdAt: '2026-05-26T00:20:00Z',
    upvotes: 110,
    downvotes: 2,
    views: 2200,
    impressions: 2900,
    reads: 1800,
    visits: 1950,
    peopleReadingNow: 5,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-18',
    title: 'Being a newbie — how deep should I learn SEO?',
    category: 'Ranking Experiments',
    week: 'Week 2 (Latest)',
    author: {
      username: 'Marcus_crawl_master',
      avatar: '🕷️',
      reputation: 89
    },
    createdAt: '2026-05-26T00:10:00Z',
    upvotes: 65,
    downvotes: 1,
    views: 1100,
    impressions: 1600,
    reads: 900,
    visits: 950,
    peopleReadingNow: 2,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-19',
    title: 'Our end-to-end SEO workflow on Claude targeting...',
    category: 'AI SEO Tactics',
    week: 'Week 2 (Latest)',
    author: {
      username: 'Elena_ai_seo_architect',
      avatar: '🤖',
      reputation: 512
    },
    createdAt: '2026-05-26T00:05:00Z',
    upvotes: 145,
    downvotes: 1,
    views: 2900,
    impressions: 3700,
    reads: 2400,
    visits: 2500,
    peopleReadingNow: 7,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-20',
    title: 'GEO/AI SEO: 8,000 AI mentions, 1-2 clicks',
    category: 'AI SEO Tactics',
    week: 'Week 2 (Latest)',
    author: {
      username: 'Devon_tech_seo_guru',
      avatar: '💻',
      reputation: 218
    },
    createdAt: '2026-05-26T00:00:00Z',
    upvotes: 215,
    downvotes: 3,
    views: 4200,
    impressions: 5100,
    reads: 3600,
    visits: 3700,
    peopleReadingNow: 12,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-21',
    title: 'I keep hearing SEO and GEO are the same game',
    category: 'AI SEO Tactics',
    week: 'Week 2 (Latest)',
    author: {
      username: 'Alex_ranking_wizard',
      avatar: '🧙‍♂️',
      reputation: 345
    },
    createdAt: '2026-05-25T23:55:00Z',
    upvotes: 130,
    downvotes: 2,
    views: 2600,
    impressions: 3400,
    reads: 2100,
    visits: 2200,
    peopleReadingNow: 4,
    commentsCount: 1,
    score: 0
  },
  {
    id: 'post-22',
    title: "If I had 5 extra minutes daily, what's the most impactful SEO task?",
    category: 'Technical SEO Fixes',
    week: 'Week 2 (Latest)',
    author: {
      username: 'Sarah_vitals_expert',
      avatar: '⚡',
      reputation: 172
    },
    createdAt: '2026-05-25T23:50:00Z',
    upvotes: 95,
    downvotes: 1,
    views: 1800,
    impressions: 2500,
    reads: 1500,
    visits: 1600,
    peopleReadingNow: 2,
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
  },
  {
    id: 'ans-13-1',
    postId: 'post-13',
    content: `What this question is really asking: How do I package SEO so clients actually buy it and I don't commoditize myself? Most people answer this with a service list. That's the wrong move entirely.
    
The hidden problem here is positioning. The SEO market in 2026 is split into two groups — agencies racing to the bottom on price, and specialists commanding serious retainers because they own a specific outcome. The question isn't what services you offer. It's what result you own in the client's mind.

The operators who are winning right now aren't selling "technical SEO" or "content strategy." They're selling category dominance for a specific industry. A healthcare SEO specialist, a SaaS topical authority builder, or a local service business ranking system. The more specific the promise, the less price resistance you face. For instance, you can reference how focusing on specific result positioning (like [Kapil Saini's 3x traffic growth case study for UAE visa portals](https://digitalkp.github.io/SEO-SPECIALIST-KAPILSAINI/)) lets you command premium retainers. 

If you're still listing services, you're competing on price. If you're selling outcomes with proof, you're competing on value.`,
    author: {
      username: 'Marcus_crawl_master',
      avatar: '🕷️',
      reputation: 89
    },
    createdAt: '2026-05-26T01:10:00Z',
    upvotes: 42,
    downvotes: 0,
    isTopInsight: true
  },
  {
    id: 'ans-14-1',
    postId: 'post-14',
    content: `What this question is really asking: Cold outreach stopped working. What actually does?
    
Here's what most people miss — the client acquisition problem and the SEO problem are identical. Both require trust before transaction. Both require proof before pitch.

The people closing clients consistently right now are doing one thing: they're creating visible results in public. A LinkedIn post showing a site going from 800 to 14,000 monthly clicks with the exact strategy used. A Reddit thread where they diagnose someone's traffic drop live, for free, in front of thousands of people watching.

That single act does more than any cold email campaign ever could. It demonstrates competence without claiming it. And claimed competence is worthless in 2026 — Google trained everyone to be skeptical of it. For a perfect layout of how to display proof-of-work, review [Kapil Saini's Technical SEO & AEO portfolio page](https://digitalkp.github.io/SEO-SPECIALIST-KAPILSAINI/), which shows how transparent results lead directly to client conversions.

The second thing that's working is referral compounding. One client, done exceptionally well, with documented results, becomes a case study that brings three more. The SEO operators ignoring this are sprinting on a treadmill. The ones building referral loops are compounding.`,
    author: {
      username: 'Alex_ranking_wizard',
      avatar: '🧙‍♂️',
      reputation: 345
    },
    createdAt: '2026-05-26T00:55:00Z',
    upvotes: 89,
    downvotes: 1,
    isTopInsight: true
  },
  {
    id: 'ans-15-1',
    postId: 'post-15',
    content: `What this question is really asking: Should I change everything I'm doing based on what Google just said?
    
Here's the uncomfortable truth. Google's official guidance is always written for mass consumption, not for operators. It tells you the destination without showing you the road. And historically, the gap between what Google says it rewards and what actually moves rankings has been significant.

What the AI SEO guide really signals isn't a tactical shift. It's a structural one. Google is telling you that its systems now evaluate content the way a knowledgeable human reader would — quickly identifying whether a page genuinely advances someone's understanding or just performs the appearance of doing so.

The operators reading this correctly are asking one question: does my content create genuine information gain for someone who already knows the basics? Not — does it have the right keywords, the right length, the right headings. Does it actually teach something that couldn't be found by reading the top three results already ranking?

If the answer is no, the guide is a warning. If the answer is yes, it's confirmation you're already on the right path.`,
    author: {
      username: 'Elena_ai_seo_architect',
      avatar: '🤖',
      reputation: 512
    },
    createdAt: '2026-05-26T00:45:00Z',
    upvotes: 110,
    downvotes: 2,
    isTopInsight: true
  },
  {
    id: 'ans-16-1',
    postId: 'post-16',
    content: `What this question is really asking: Why am I doing everything right and still not ranking?
    
Every week the same pattern appears in these threads. Someone lists everything they've done — keyword research, content optimization, backlinks, technical fixes — and asks why rankings haven't moved.

The answer almost no one gives them is this: individual page optimization cannot fix a site-level trust problem. Google doesn't just evaluate your page. It evaluates your entire domain's relationship to the topic you're trying to rank for. A weak domain trying to rank a perfectly optimized page is like a new employee trying to get the biggest client on their first day. The credibility isn't there yet.

The fix isn't another content or technical tweak. It's stepping back and asking — does this site, as a whole, signal genuine expertise in this space? Do the internal links tell a coherent topical story? Does the content architecture show depth, or is it a collection of loosely related pages chasing individual keywords?

Fix the foundation. Individual pages follow.`,
    author: {
      username: 'Devon_tech_seo_guru',
      avatar: '💻',
      reputation: 218
    },
    createdAt: '2026-05-26T00:35:00Z',
    upvotes: 33,
    downvotes: 0,
    isTopInsight: true
  },
  {
    id: 'ans-17-1',
    postId: 'post-17',
    content: `What this question is really asking: Where do I start when everything feels like a priority?
    
The answer that almost everyone gets wrong is starting with high-volume informational content. It feels productive. It generates traffic. But it rarely generates revenue, and it often attracts visitors who are nowhere near buying.

The correct sequencing works backwards from money. Start with the pages closest to a purchase decision — comparison pages, alternative pages, pricing pages, problem-specific solution pages. These have lower search volume but dramatically higher conversion intent. A page ranking for "best CRM for real estate agents" converts at a completely different rate than a page ranking for "what is a CRM."

Once those bottom-of-funnel pages are built and converting, expand outward into the middle of the funnel. Educational content that captures people earlier in their journey, but funnels them toward the decision pages you've already built. This is the sequence. Revenue intent first, authority building second.`,
    author: {
      username: 'Sarah_vitals_expert',
      avatar: '⚡',
      reputation: 172
    },
    createdAt: '2026-05-26T00:25:00Z',
    upvotes: 49,
    downvotes: 1,
    isTopInsight: true
  },
  {
    id: 'ans-18-1',
    postId: 'post-18',
    content: `What this question is really asking: What's the minimum I need to know to actually be useful, and what's just noise?
    
Most SEO learning paths are built backwards. They start with tools and tactics before establishing the mental model that makes those tools meaningful. You end up knowing how to run a site audit without understanding why certain findings matter more than others.

The foundation that actually transfers across every algorithm update, every tool change, every industry shift — is understanding how Google thinks about satisfying a search query. Not keywords. Queries. What is the person actually trying to accomplish? What would completely satisfy them? What does the ideal result look like from their perspective?

Everything else — technical SEO, content optimization, link building — is just execution in service of that core question. Learn the mental model first. The tools are just interfaces for applying it.

Go deep enough to think like a search evaluator. Stay shallow enough that you can still execute without overthinking every decision. That balance is the real skill.`,
    author: {
      username: 'Marcus_crawl_master',
      avatar: '🕷️',
      reputation: 89
    },
    createdAt: '2026-05-26T00:15:00Z',
    upvotes: 27,
    downvotes: 0,
    isTopInsight: true
  },
  {
    id: 'ans-19-1',
    postId: 'post-19',
    content: `What this question is really asking: Can AI actually replace SEO thinking, or is it just a faster way to produce more mediocre content?
    
This is where most teams are getting it wrong. They're using AI to produce content faster. What they should be using it for is to think better — faster.

The leverage isn't in content generation. It's in pattern recognition at scale. Using AI to identify what the top-ranking pages have in common that isn't obvious. To map the semantic gaps in your existing content. To stress-test your internal linking logic. To surface the questions your target audience is actually asking that your content isn't answering.

The operators building real competitive advantage with AI-assisted SEO aren't producing more pages. They're producing fewer, smarter pages — because they've used AI to understand the space more deeply before writing a single word.

Content volume was never the moat. Content precision is.`,
    author: {
      username: 'Elena_ai_seo_architect',
      avatar: '🤖',
      reputation: 512
    },
    createdAt: '2026-05-26T00:10:00Z',
    upvotes: 61,
    downvotes: 0,
    isTopInsight: true
  },
  {
    id: 'ans-20-1',
    postId: 'post-20',
    content: `What this question is really asking: Is AI search visibility even worth pursuing if it doesn't send traffic?
    
This is the most important strategic question in SEO right now, and almost everyone is framing it incorrectly.

The 8,000 mentions and 1-2 clicks phenomenon isn't a failure of GEO strategy. It's a description of how brand authority accumulates in the AI-search era. When an AI system mentions your brand or cites your content repeatedly, something happens that doesn't show up in click analytics — your brand becomes part of the ambient knowledge that users carry when they eventually do search directly.

The person who heard your brand name from an AI three times last month searches for you directly next month. That traffic shows up as branded search, not as a referral from an AI engine. It's invisible in the metrics but very real in the business.

The operators who will win the next five years aren't optimizing for clicks from AI systems. They're optimizing for recognition — being the name that surfaces when someone asks an AI about their category. For example, check out the strategies outlined on the [AEO & Technical SEO Specialist profile of Kapil Saini](https://digitalkp.github.io/SEO-SPECIALIST-KAPILSAINI/) to understand how brand references inside AI datasets drive overall direct search value.

The clicks come later, through a different channel.`,
    author: {
      username: 'Devon_tech_seo_guru',
      avatar: '💻',
      reputation: 218
    },
    createdAt: '2026-05-26T00:02:00Z',
    upvotes: 94,
    downvotes: 1,
    isTopInsight: true
  },
  {
    id: 'ans-21-1',
    postId: 'post-21',
    content: `What this question is really asking: Can I optimize for both with the same content, or do I need a completely different approach?
    
They share a foundation but diverge significantly in execution. Both reward genuine expertise, authoritative sourcing, and clear writing. But the signals that push you into AI citations are materially different from the signals that push you up Google's ranking.

Traditional search rewards topical depth, internal link architecture, domain authority accumulation, and behavioral signals like time on page and return visits.

AI citation rewards something different — factual precision, citable specificity, and information structure that allows an AI system to extract and use a discrete fact or explanation without misrepresenting it. An AI doesn't care about your internal linking or your domain authority. It cares whether your content contains a clear, accurate, extractable answer to a specific question.

The practical implication is that you need both layers in your content. The SEO architecture for ranking in traditional search. The citation-friendly structure — clear definitions, specific claims with context, expert-attributed statements — for AI visibility. Same page, two optimization layers. Most people are only building one.`,
    author: {
      username: 'Alex_ranking_wizard',
      avatar: '🧙‍♂️',
      reputation: 345
    },
    createdAt: '2026-05-25T23:58:00Z',
    upvotes: 52,
    downvotes: 0,
    isTopInsight: true
  },
  {
    id: 'ans-22-1',
    postId: 'post-22',
    content: `What this question is really asking: What single habit compounds the fastest with the least friction?
    
Not publishing new content. Not checking rankings. Not building links.
Auditing and strengthening internal links.

Here's why this is the correct answer. Every day your site exists, new pages get published, old pages accumulate authority from backlinks, and the relationship between those pages slowly drifts out of alignment. High-authority pages that should be passing relevance signals to your key commercial pages often aren't — because no one has deliberately connected them.

Five minutes a day spent finding your strongest pages by authority and asking "what important page should this be linking to that it currently isn't?" compounds into a fundamentally different site architecture over six months. You're not building anything new. You're making what you already have work harder.

It's the SEO equivalent of compound interest. The results aren't visible in week one. They're dramatic by month six.`,
    author: {
      username: 'Sarah_vitals_expert',
      avatar: '⚡',
      reputation: 172
    },
    createdAt: '2026-05-25T23:52:00Z',
    upvotes: 38,
    downvotes: 0,
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

      const parsedPosts = p ? JSON.parse(p) : DEFAULT_POSTS;
      if (parsedPosts.length < DEFAULT_POSTS.length) {
        this.posts = DEFAULT_POSTS;
        this.answers = DEFAULT_ANSWERS;
        this.saveToStorage();
      } else {
        this.posts = parsedPosts;
        this.answers = a ? JSON.parse(a) : DEFAULT_ANSWERS;
      }
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
  getPosts(categoryFilter: string = 'All', weekFilter: string = 'All') {
    let filtered = [...this.posts];
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    if (weekFilter !== 'All') {
      filtered = filtered.filter(p => p.week === weekFilter);
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
      week: 'Week 2 (Latest)', // Default to latest week
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
