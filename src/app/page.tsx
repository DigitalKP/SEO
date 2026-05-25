"use client";

import React, { useEffect, useState } from 'react';
import { db, User } from '@/lib/db';
import Hero from '@/components/Hero';
import DiscussionFeed from '@/components/DiscussionFeed';
import Sidebar from '@/components/Sidebar';
import JobBoard from '@/components/JobBoard';
import NotificationCenter from '@/components/NotificationCenter';
import AdminPanel from '@/components/AdminPanel';
import AskQuestionDialog from '@/components/AskQuestionDialog';
import AuthDialog from '@/components/AuthDialog';
import { ShieldAlert, LogOut, Shield, Briefcase, MessageSquare, Terminal, Eye, Cpu } from 'lucide-react';
import PromptLibrary from '@/components/PromptLibrary';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'jobs' | 'prompts'>('feed');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modals & Drawers Toggles
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Live status ticker variables
  const [tickerMessage, setTickerMessage] = useState('SYSTEM SECURE // ESTABLISHING HANDSHAKE PROTOCOLS');

  useEffect(() => {
    setCurrentUser(db.getCurrentUser());
    
    // Subscribe to DB updates
    const unsubscribe = db.subscribe(() => {
      setCurrentUser(db.getCurrentUser());
    });

    // Random status message ticks for cyber/mastermind atmosphere
    const tickerNotes = [
      "COMPUTING SEMANTIC TOPIC MAPS...",
      "REVERSE-ENGINEERING GOOGLEBOT USER AGENT SIGNATURES...",
      "SCANNING INDEXING BARRIERS FOR 12 DOMAINS...",
      "WARNING: CORE ALGORITHM FLUX ENGAGED (SERP VOLATILITY HIGH)",
      "PIPELINE INTRUSION DETECTED: SPAM POST REMOVED",
      "SMTP MAIL GATEWAY ONLINE // VERIFYING OUTBOX...",
      "ELENA_AI_SEO_ARCHITECT UPDATED SEMANTIC PYTHON SCRIPT"
    ];

    const interval = setInterval(() => {
      const msg = tickerNotes[Math.floor(Math.random() * tickerNotes.length)];
      setTickerMessage(msg);
    }, 12000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleScrollToFeed = () => {
    const el = document.getElementById('main-workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJoinSEOCommunity = () => {
    setIsAuthOpen(true);
  };

  const handleTrendingFilter = () => {
    setCategoryFilter('AI SEO Tactics'); // Shift to a trending category
    handleScrollToFeed();
  };

  const handleAuthSuccess = () => {
    // Refresh user state
    setCurrentUser(db.getCurrentUser());
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Top Header Glassmorphism Nav */}
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-900/60 bg-slate-950/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="font-extrabold text-sm tracking-widest text-slate-100 font-mono flex items-center gap-1.5">
              SEO PULSE <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-950">// INTEL FEED</span>
            </h1>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-900/40 border border-slate-900 rounded-xl">
            <button
              onClick={() => { setActiveTab('feed'); handleScrollToFeed(); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'feed' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              WAR ROOM FEED
            </button>
            <button
              onClick={() => { setActiveTab('jobs'); handleScrollToFeed(); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'jobs' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              OPPORTUNITIES
            </button>
            <button
              onClick={() => { setActiveTab('prompts'); handleScrollToFeed(); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'prompts' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              AI WORKFLOWS
            </button>
          </nav>

          {/* Right Action Profile States */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-900 rounded-xl p-1.5">
                <div className="text-right pl-2 hidden md:block">
                  <span className="text-[10px] text-slate-300 font-bold block truncate max-w-32 leading-none">
                    {currentUser.email}
                  </span>
                  <span className="text-[9px] text-amber-400 font-mono block mt-0.5 leading-none">
                    REP: {currentUser.reputation}
                  </span>
                </div>
                
                {/* Pending or Verified indicators */}
                {currentUser.status === 'pending' ? (
                  <span 
                    title="Your access is restricted until the administrator approves your membership in the Admin Panel."
                    className="text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/25 text-amber-400 px-2 py-1 rounded-lg animate-pulse"
                  >
                    UNDER REVIEW
                  </span>
                ) : (
                  <span className="text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2 py-1 rounded-lg">
                    VERIFIED
                  </span>
                )}

                {/* Admin Switcher */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Shield className="h-3 w-3" /> Admin
                  </button>
                )}

                <button
                  onClick={() => db.logOut()}
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleJoinSEOCommunity}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center gap-1.5 hover:opacity-95 shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
              >
                Join Mastermind
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Guest Welcome Banner */}
      {!currentUser && (
        <div className="relative w-full bg-gradient-to-r from-emerald-950/30 via-slate-950/80 to-cyan-950/30 border-b border-slate-900/60 py-2.5 px-6 text-center text-xs font-mono z-20 flex items-center justify-center gap-2 flex-wrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300">
            <strong>GUEST NOTICE //</strong> To unlock complete expert replies, cast upvotes/ratings, and access the Technical SEO jobs marketplace, you must create a verified account.
          </span>
          <button 
            onClick={handleJoinSEOCommunity}
            className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:scale-102 cursor-pointer"
          >
            Create Account
          </button>
        </div>
      )}

      {/* Hero Section */}
      <Hero 
        onExplore={handleScrollToFeed}
        onJoin={handleJoinSEOCommunity}
        onTrending={handleTrendingFilter}
      />

      {/* Main Community Portal Grid */}
      <main id="main-workspace" className="max-w-6xl w-full mx-auto px-6 py-10 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Discussion Feed or Job Board */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mobile Navigation Tabs Toggle */}
          <div className="flex sm:hidden p-1 bg-slate-900/60 border border-slate-900 rounded-xl mb-4">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition-all ${
                activeTab === 'feed' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition-all ${
                activeTab === 'jobs' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400'
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition-all ${
                activeTab === 'prompts' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400'
              }`}
            >
              Prompts
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'feed' && (
              <motion.div
                key="feed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DiscussionFeed 
                  categoryFilter={categoryFilter}
                  onAskQuestionTrigger={() => setIsAskOpen(true)}
                  onAuthTrigger={() => setIsAuthOpen(true)}
                />
              </motion.div>
            )}
            {activeTab === 'jobs' && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <JobBoard />
              </motion.div>
            )}
            {activeTab === 'prompts' && (
              <motion.div
                key="prompts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PromptLibrary />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Sidebar Widgets */}
        <div className="lg:col-span-1">
          <Sidebar 
            activeCategory={categoryFilter}
            onCategorySelect={(cat) => {
              setCategoryFilter(cat);
              setActiveTab('feed');
              handleScrollToFeed();
            }}
            onPostSelect={() => {}}
          />
        </div>
      </main>

      {/* Live System Activity Footer Status Bar */}
      <footer className="w-full glass-panel border-t border-slate-900 bg-slate-950/60 py-3 px-6 select-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="text-emerald-400/80 animate-pulse">{tickerMessage}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-slate-600" />
              <span>4,392 Clicks / Hour</span>
            </span>
            <span>•</span>
            <span>SEO Intel Deck v1.0.0</span>
          </div>
        </div>
      </footer>

      {/* Floating Notification Center Drawer / Logs Bell */}
      <NotificationCenter />

      {/* Developer Intrusion Panel Trigger */}
      <div className="fixed bottom-6 right-20 z-40">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="relative glass-panel hover:bg-slate-800/80 px-4 py-3.5 rounded-full shadow-lg border border-slate-700/60 hover:border-cyan-500/30 transition-all duration-300 flex items-center gap-1.5 hover:scale-105 font-mono text-[10px] font-bold text-cyan-400 hover:text-cyan-300"
          title="Developer Admin Deck Overlay"
        >
          <Shield className="h-4 w-4" />
          <span>DEV DECK</span>
        </button>
      </div>

      {/* Dialogue Overlays */}
      <AuthDialog 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <AskQuestionDialog 
        isOpen={isAskOpen}
        onClose={() => setIsAskOpen(false)}
      />

      {/* Admin Panel Dialog */}
      <AnimatePresence>
        {isAdminOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            {/* Admin Deck Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl z-10"
            >
              <AdminPanel onClose={() => setIsAdminOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
