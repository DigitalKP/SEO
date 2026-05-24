"use client";

import React, { useEffect, useState } from 'react';
import { db, User, Post } from '@/lib/db';
import { 
  Flame, Shield, Users, Wrench, Eye, Sparkles, HelpCircle, 
  CheckCircle, ShieldAlert, ArrowDown, ArrowUp, AlertTriangle, Monitor, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ 
  onPostSelect,
  activeCategory,
  onCategorySelect 
}: { 
  onPostSelect: (postId: string) => void;
  activeCategory: string;
  onCategorySelect: (cat: string) => void;
}) {
  const [contributors, setContributors] = useState<User[]>([]);
  const [onlineCount, setOnlineCount] = useState(42);
  const [volatility, setVolatility] = useState({ score: 8.4, votes: { hit: 48, recovered: 12, stable: 115 } });

  // SERP simulator states
  const [serpTitle, setSerpTitle] = useState('Google Core Update Recovery Strategy | SEO Mastermind');
  const [serpDesc, setSerpDesc] = useState('Learn how we recovered organic traffic for 5 enterprise sites hit by core updates. Read the checklists, scripts, and content loops.');
  const [serpUrl, setSerpUrl] = useState('https://seopulse.io/core-update-fix');
  const [isMobile, setIsMobile] = useState(false);

  // Myth Buster State
  const [activeMyth, setActiveMyth] = useState<number | null>(null);

  useEffect(() => {
    const loadData = () => {
      const allUsers = [...db.getUsers()].sort((a, b) => b.reputation - a.reputation);
      setContributors(allUsers.slice(0, 4));
      
      setVolatility(db.getVolatility());
    };

    loadData();
    const unsubscribe = db.subscribe(loadData);

    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const offset = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + offset;
        return Math.max(30, Math.min(80, newCount));
      });
    }, 7000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleVoteVolatility = (type: 'hit' | 'recovered' | 'stable') => {
    db.voteVolatility(type);
  };

  const categories = [
    'All',
    'Ranking Experiments',
    'AI SEO Tactics',
    'Technical SEO Fixes',
    'Indexing Problems Solved',
    'SEO Myth Destroyed'
  ];

  const myths = [
    {
      question: "Is LCP / Core Web Vitals a heavy ranking factor?",
      verdict: "DEPENDS ⚠️",
      answer: "No, it is a tie-breaker. A fast site won't save thin, low-quality content, but if two pages have identical content quality, the faster one wins."
    },
    {
      question: "Does keyword density percentage trigger ranking boosts?",
      verdict: "MYTH ❌",
      desc: "Google relies on semantic entity mapping, BERT, and MUM instead of matching exact keyword occurrences. Writing naturally is key."
    },
    {
      question: "Are social shares a direct Google ranking signal?",
      verdict: "MYTH ❌",
      desc: "Googlebot does not crawl/use Facebook or Twitter share numbers. However, high social shares drive brand queries, which indirecty boosts ranking."
    }
  ];

  return (
    <div className="space-y-6">

      {/* Google Core Update Volatility Sensor Widget */}
      <div className="glass-panel border-red-500/20 p-5 rounded-2xl bg-gradient-to-br from-red-950/10 to-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500/30 animate-pulse" />
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-red-500 animate-pulse" />
            SERP VOLATILITY SENSOR
          </h3>
          <span className="text-[9px] font-mono text-red-400 font-bold bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30 animate-pulse">
            HIGH FLUX
          </span>
        </div>

        {/* Gauge index display */}
        <div className="flex items-center gap-4 py-1.5">
          <div className="text-center">
            <span className="text-2xl font-black text-red-400 font-outfit block tracking-tight">
              {volatility.score} <span className="text-xs font-medium text-slate-500">/ 10</span>
            </span>
            <span className="text-[8px] font-mono text-slate-500 uppercase block tracking-wider mt-0.5">Algorithm Volatility</span>
          </div>

          <div className="flex-1">
            {/* Visual Progress Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-500" 
                style={{ width: `${volatility.score * 10}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] font-mono text-slate-600 mt-1">
              <span>STABLE</span>
              <span>DANGER</span>
            </div>
          </div>
        </div>

        {/* Volatility Voting Grid */}
        <div className="mt-4 pt-3 border-t border-slate-900/60">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2 text-center">
            Report Your Site Impact:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleVoteVolatility('hit')}
              className="py-1.5 bg-red-950/20 hover:bg-red-950/45 border border-red-900/30 hover:border-red-500/40 text-[10px] font-mono font-bold text-red-400 rounded-xl flex items-center justify-center gap-1 transition-all"
            >
              <ArrowDown className="h-3 w-3" /> Hit ({volatility.votes.hit})
            </button>
            <button
              onClick={() => handleVoteVolatility('recovered')}
              className="py-1.5 bg-emerald-950/20 hover:bg-emerald-950/45 border border-emerald-900/30 hover:border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-400 rounded-xl flex items-center justify-center gap-1 transition-all"
            >
              <ArrowUp className="h-3 w-3" /> Up ({volatility.votes.recovered})
            </button>
            <button
              onClick={() => handleVoteVolatility('stable')}
              className="py-1.5 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] font-mono font-bold text-slate-400 rounded-xl flex items-center justify-center gap-1 transition-all"
            >
              Flat ({volatility.votes.stable})
            </button>
          </div>
        </div>
      </div>

      {/* Category selector */}
      <div className="glass-panel border-slate-800/80 p-5 rounded-2xl">
        <h3 className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase mb-3.5 flex items-center gap-1.5">
          <Wrench className="h-3.5 w-3.5 text-emerald-400" />
          DISCOVERY CHANNELS
        </h3>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-between ${
                activeCategory === cat 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/20 border border-transparent hover:border-slate-800/60'
              }`}
            >
              <span>{cat}</span>
              {activeCategory === cat && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SERP Simulator (Desktop & Mobile viewports toggles) */}
      <div className="glass-panel border-slate-800/80 p-5 rounded-2xl">
        <div className="flex justify-between items-center mb-3.5 border-b border-slate-900 pb-2">
          <h3 className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            SERP VISUALIZER
          </h3>
          
          {/* Mobile vs Desktop Toggle Switch */}
          <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800 shrink-0 select-none">
            <button
              onClick={() => setIsMobile(false)}
              className={`p-1 rounded-md transition-colors ${!isMobile ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:text-slate-350'}`}
              title="Desktop View"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsMobile(true)}
              className={`p-1 rounded-md transition-colors ${isMobile ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:text-slate-350'}`}
              title="Mobile View"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        
        {/* Editor Inputs */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
              <span>SEO TITLE</span>
              <span className={serpTitle.length > 60 ? 'text-amber-400' : 'text-slate-500'}>
                {serpTitle.length} / 60 char
              </span>
            </div>
            <input
              type="text"
              value={serpTitle}
              onChange={(e) => setSerpTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-900 rounded-lg text-[11px] text-slate-300 outline-none focus:border-cyan-500/30 font-sans"
            />
          </div>

          <div>
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
              <span>META DESCRIPTION</span>
              <span className={serpDesc.length > 160 ? 'text-amber-400' : 'text-slate-500'}>
                {serpDesc.length} / 160 char
              </span>
            </div>
            <textarea
              rows={2}
              value={serpDesc}
              onChange={(e) => setSerpDesc(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-900 rounded-lg text-[11px] text-slate-300 outline-none focus:border-cyan-500/30 font-sans resize-none"
            />
          </div>

          <div>
            <span className="text-[9px] font-mono text-slate-500 block mb-1">TARGET URL</span>
            <input
              type="text"
              value={serpUrl}
              onChange={(e) => setSerpUrl(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-900 rounded-lg text-[11px] text-slate-400 font-mono outline-none"
            />
          </div>
        </div>

        {/* Google Result Preview */}
        {isMobile ? (
          /* Mobile View Screen Wrapper */
          <div className="mx-auto max-w-[260px] bg-[#171717] border border-slate-800 p-3.5 rounded-2xl font-sans text-left leading-normal relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-900 rounded-b-lg border-b border-x border-slate-800" />
            <div className="text-[10px] text-[#9aa0a6] truncate mb-1 mt-2 font-medium flex items-center gap-1">
              <span className="bg-[#2a2a2a] text-[#8ab4f8] text-[8px] px-1 rounded">URL</span>
              {serpUrl.replace('https://', '').split('/')[0]}
            </div>
            <h4 className="text-[13px] text-[#8ab4f8] hover:underline cursor-pointer font-medium line-clamp-2 leading-tight mb-1 font-sans">
              {serpTitle || 'Please enter title...'}
            </h4>
            <p className="text-[11px] text-[#bdc1c6] line-clamp-3 leading-snug">
              {serpDesc || 'Please enter description...'}
            </p>
          </div>
        ) : (
          /* Desktop View Preview */
          <div className="bg-[#171717] border border-slate-800 p-4 rounded-xl font-sans text-left leading-normal">
            <div className="text-[10px] text-[#dadce0] truncate mb-1">
              {serpUrl.replace('https://', '').split('/')[0]}
              <span className="text-[#9aa0a6] text-[9px] ml-1">
                {serpUrl.includes('/') ? ` › ${serpUrl.split('/').slice(3).join(' › ')}` : ''}
              </span>
            </div>
            <h4 className="text-[14px] text-[#8ab4f8] hover:underline cursor-pointer font-medium line-clamp-1 leading-tight mb-1">
              {serpTitle || 'Please enter title...'}
            </h4>
            <p className="text-[12px] text-[#bdc1c6] line-clamp-2 leading-relaxed">
              {serpDesc || 'Please enter description...'}
            </p>
          </div>
        )}
      </div>

      {/* Interactive SEO Myth Buster Panel */}
      <div className="glass-panel border-slate-800/80 p-5 rounded-2xl">
        <h3 className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase mb-3 flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
          SEO MYTH BUSTER
        </h3>

        <div className="space-y-2">
          {myths.map((myth, idx) => (
            <div 
              key={idx}
              className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col cursor-pointer transition-all hover:border-slate-800"
              onClick={() => setActiveMyth(activeMyth === idx ? null : idx)}
            >
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs font-semibold text-slate-350 leading-snug">
                  {myth.question}
                </span>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  myth.verdict.includes('MYTH') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {myth.verdict}
                </span>
              </div>

              <AnimatePresence>
                {activeMyth === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-2.5 pt-2.5 border-t border-slate-900">
                      {myth.desc || myth.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors Leaderboard */}
      <div className="glass-panel border-slate-800/80 p-5 rounded-2xl">
        <h3 className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase mb-3.5 flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-amber-500" />
          TOP CONTRIBUTORS
        </h3>
        
        <div className="space-y-3">
          {contributors.map((u, i) => (
            <div key={u.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/30 border border-slate-900/60 hover:border-slate-800 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xs font-mono text-slate-600 font-extrabold w-4">{i + 1}</span>
                <span className="text-base select-none shrink-0">
                  {u.role === 'admin' ? '👑' : u.email.includes('alex') ? '🧙‍♂️' : u.email.includes('elena') ? '🤖' : '💻'}
                </span>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-300 block truncate font-sans">
                    {u.email.split('@')[0]}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    Joined {new Date(u.joinedAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-extrabold font-mono text-amber-400">{u.reputation}</span>
                <span className="text-[8px] text-slate-500 font-mono block uppercase">rep</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active members & Live stats */}
      <div className="glass-panel border-slate-800/80 p-5 rounded-2xl relative overflow-hidden bg-gradient-to-br from-slate-900/30 to-slate-950">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-cyan-400" />
            LIVE METRICS
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-mono">{onlineCount} Online</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 text-center">
          <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
            <span className="text-[9px] font-mono text-slate-500 uppercase block">MEMBERS</span>
            <span className="text-lg font-black text-slate-200 mt-1 block font-outfit">3,482</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
            <span className="text-[9px] font-mono text-slate-500 uppercase block">DAILY VIEWS</span>
            <span className="text-lg font-black text-emerald-400 mt-1 block font-outfit">48.9K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
