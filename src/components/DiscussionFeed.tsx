"use client";

import React, { useEffect, useState } from 'react';
import { db, Post, Answer, Comment, User, getUserRank } from '@/lib/db';
import { 
  ArrowUp, ArrowDown, MessageSquare, Eye, Bookmark, Share2, 
  Flame, Award, Clock, CornerDownRight, Send, AlertTriangle, 
  Sparkles, CheckCircle2, User as UserIcon, X, Compass, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function DiscussionFeed({ 
  categoryFilter = 'All',
  onAskQuestionTrigger 
}: { 
  categoryFilter: string;
  onAskQuestionTrigger: () => void;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [activeAnswersComments, setActiveAnswersComments] = useState<Record<string, Comment[]>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newAnswerText, setNewAnswerText] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeWeek, setActiveWeek] = useState<string>('Week 2 (Latest)');

  // Error notifications for review state
  const [accessError, setAccessError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    setPosts(db.getPosts(categoryFilter, activeWeek));
    setCurrentUser(db.getCurrentUser());

    // Subscribe to DB changes
    const unsubscribe = db.subscribe(() => {
      setPosts(db.getPosts(categoryFilter, activeWeek));
      setCurrentUser(db.getCurrentUser());
      if (selectedPost) {
        const fresh = db.getPostById(selectedPost.id);
        if (fresh) setSelectedPost(fresh);
      }
    });

    return () => unsubscribe();
  }, [categoryFilter, activeWeek, selectedPost]);

  // Load answers when a post is selected
  useEffect(() => {
    if (selectedPost) {
      const allAnswers = db.getAnswers(selectedPost.id);
      setAnswers(allAnswers);

      // Load comments for each answer
      const commentsMap: Record<string, Comment[]> = {};
      allAnswers.forEach(ans => {
        commentsMap[ans.id] = db.getComments(ans.id);
      });
      setActiveAnswersComments(commentsMap);
    }
  }, [selectedPost, posts]);

  const handlePostClick = (post: Post) => {
    db.recordPostClick(post.id);
    setSelectedPost(post);
  };

  const handleUpvotePost = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    
    // Check membership access rules
    if (!currentUser) {
      setAccessError("Authentication required. Please sign in first.");
      return;
    }
    if (currentUser.status !== 'approved') {
      setAccessError("Your membership request is under review.");
      return;
    }

    db.upvotePost(postId);
    
    // Launch a little confetti burst for visual satisfaction!
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#10b981', '#06b6d4', '#eab308']
    });
  };

  const handleDownvotePost = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    
    if (!currentUser) {
      setAccessError("Authentication required. Please sign in.");
      return;
    }
    if (currentUser.status !== 'approved') {
      setAccessError("Your membership request is under review.");
      return;
    }

    db.downvotePost(postId);
  };

  const handleUpvoteAnswer = (answerId: string) => {
    if (!currentUser) {
      setAccessError("Authentication required.");
      return;
    }
    if (currentUser.status !== 'approved') {
      setAccessError("Your membership request is under review.");
      return;
    }

    db.upvoteAnswer(answerId);
  };

  const handleAddAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newAnswerText.trim()) return;

    if (!currentUser) {
      setAccessError("Authentication required. Please sign in.");
      return;
    }
    if (currentUser.status !== 'approved') {
      setAccessError("Your membership request is under review.");
      return;
    }

    try {
      db.addAnswer(selectedPost.id, newAnswerText);
      setNewAnswerText('');
    } catch (err: any) {
      setAccessError(err.message || "Failed to post answer.");
    }
  };

  const handleAddCommentSubmit = (answerId: string) => {
    const txt = commentInputs[answerId];
    if (!selectedPost || !txt || !txt.trim()) return;

    if (!currentUser) {
      setAccessError("Authentication required. Please sign in.");
      return;
    }
    if (currentUser.status !== 'approved') {
      setAccessError("Your membership request is under review.");
      return;
    }

    try {
      db.addComment(selectedPost.id, answerId, txt);
      setCommentInputs(prev => ({ ...prev, [answerId]: '' }));
    } catch (err: any) {
      setAccessError(err.message || "Failed to add comment.");
    }
  };

  const handleShare = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      const shareUrl = `${window.location.origin}/post/${post.id}`;
      navigator.clipboard.writeText(shareUrl);
      alert("Discussion link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-4">
      {/* Feed Sub-Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <Compass className="h-4.5 w-4.5 text-emerald-400" />
          <h2 className="text-sm font-extrabold tracking-widest text-slate-400 font-mono uppercase">
            {categoryFilter === 'All' ? 'GLOBAL DISCUSSION WAR ROOM' : categoryFilter.toUpperCase()}
          </h2>
        </div>
        
        {currentUser?.status === 'approved' && (
          <button
            onClick={onAskQuestionTrigger}
            className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-xs font-bold font-mono text-emerald-400 rounded-xl flex items-center gap-1.5 transition-all hover:scale-102"
          >
            <PlusCircle className="h-4 w-4" />
            Launch Topic
          </button>
        )}
      </div>

      {/* Access Denial alert toast */}
      <AnimatePresence>
        {accessError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-3.5 bg-red-950/40 border border-red-900/40 text-red-300 rounded-xl text-xs flex justify-between items-center shadow-lg relative overflow-hidden"
          >
            {/* Red alert scanner line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 animate-pulse-glow" />
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
              <span>{accessError}</span>
            </div>
            <button
              onClick={() => setAccessError(null)}
              className="p-1 rounded hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Week Switcher Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-950/40 border border-slate-900 rounded-2xl w-fit">
        <button
          onClick={() => setActiveWeek('Week 2 (Latest)')}
          className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl transition-all ${
            activeWeek === 'Week 2 (Latest)'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
              : 'text-slate-500 hover:text-slate-300 border border-transparent'
          }`}
        >
          Week 2 (Latest)
        </button>
        <button
          onClick={() => setActiveWeek('Week 1 (Archive)')}
          className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl transition-all ${
            activeWeek === 'Week 1 (Archive)'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
              : 'text-slate-500 hover:text-slate-300 border border-transparent'
          }`}
        >
          Week 1 (Archive)
        </button>
        <button
          onClick={() => setActiveWeek('All')}
          className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl transition-all ${
            activeWeek === 'All'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
              : 'text-slate-500 hover:text-slate-300 border border-transparent'
          }`}
        >
          All Weeks
        </button>
      </div>

      {/* Live Feed List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="glass-panel border-slate-800/80 p-12 text-center rounded-2xl">
            <MessageSquare className="h-8 w-8 text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">No active discussions in this channel yet.</p>
            <p className="text-xs text-slate-600 mt-1">Be the first to post a technical fix or core update case study!</p>
          </div>
        ) : (
          posts.map((post) => {
            // Determine if post qualifies for gold glow: e.g., impressions >= 4000
            const hasTopGlow = post.impressions >= 4000;

            return (
              <motion.div
                key={post.id}
                onClick={() => handlePostClick(post)}
                className={`glass-panel p-5 rounded-2xl flex flex-col md:flex-row gap-5 hover:bg-slate-900/30 transition-all duration-300 relative cursor-pointer group ${
                  hasTopGlow 
                    ? 'glass-panel-gold border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.06)]' 
                    : 'hover:border-slate-700/60'
                }`}
              >
                {/* Gold Highlight Tag */}
                {hasTopGlow && (
                  <div className="absolute -top-2.5 left-6 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold font-mono text-[9px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-amber-500/10">
                    <Award className="h-3 w-3" />
                    <span>Top Performing SEO Insight</span>
                  </div>
                )}

                {/* Vote Column */}
                <div className="flex md:flex-col items-center justify-between md:justify-start gap-1 bg-slate-950/40 px-3 py-1.5 md:py-2.5 rounded-xl border border-slate-900 shrink-0 h-fit w-full md:w-auto">
                  <button
                    onClick={(e) => handleUpvotePost(e, post.id)}
                    className="p-1 rounded hover:bg-slate-900 text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    <ArrowUp className="h-4.5 w-4.5" />
                  </button>
                  <span className="text-xs font-mono font-extrabold text-slate-300 px-1">
                    {post.upvotes - post.downvotes}
                  </span>
                  <button
                    onClick={(e) => handleDownvotePost(e, post.id)}
                    className="p-1 rounded hover:bg-slate-900 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <ArrowDown className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Main Content Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500">
                    <span className="text-slate-300 font-semibold flex items-center gap-1">
                      <span className="text-xs">{post.author.avatar}</span>
                      @{post.author.username}
                      {(() => {
                        const rank = getUserRank(post.author.reputation);
                        return (
                          <span className={`text-[8px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded border ml-1 leading-none ${rank.color}`}>
                            {rank.icon} {rank.title}
                          </span>
                        );
                      })()}
                    </span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                      hasTopGlow 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                        : 'bg-slate-950/80 text-slate-400 border border-slate-800'
                    }`}>
                      {post.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base md:text-lg tracking-tight mt-2 text-slate-100 group-hover:text-emerald-400 transition-colors font-outfit leading-snug">
                    {post.title}
                  </h3>

                  {/* Analytics Sub-row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {post.impressions >= 1000 ? `${(post.impressions/1000).toFixed(1)}K` : post.impressions} views
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {post.commentsCount} comments
                    </span>
                    
                    {post.peopleReadingNow > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                          {post.peopleReadingNow} reading now
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Footer Interaction Badges (Bookmark, share, Read more) */}
                <div className="flex md:flex-col items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/50 shrink-0">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); alert("Topic bookmarked!"); }}
                      className="p-2 rounded-xl bg-slate-950/40 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-500 hover:text-slate-300 transition-all"
                      title="Bookmark Thread"
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => handleShare(e, post)}
                      className="p-2 rounded-xl bg-slate-950/40 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-500 hover:text-slate-300 transition-all"
                      title="Share link"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>

                  <button className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-emerald-500/20 text-xs font-bold font-mono text-slate-300 hover:text-emerald-400 rounded-xl transition-all">
                    Read Intel
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Slide-over Detailed Q&A Drawer */}
      <AnimatePresence>
        {selectedPost && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40"
            />

            {/* Sidebar details panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 max-w-2xl w-full bg-[#050814] border-l border-slate-800/80 shadow-2xl z-40 flex flex-col p-6 overflow-hidden"
            >
              {/* Scanline */}
              <div className="scanline" />

              {/* Panel Header */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-800/80">
                <div className="min-w-0 pr-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                    {selectedPost.category}
                  </span>
                  <h2 className="font-extrabold text-lg text-slate-100 font-outfit mt-1 leading-snug">
                    {selectedPost.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-slate-400">
                    <span className="text-slate-300 font-bold flex items-center gap-1">
                      {selectedPost.author.avatar} @{selectedPost.author.username}
                      {(() => {
                        const rank = getUserRank(selectedPost.author.reputation);
                        return (
                          <span className={`text-[8px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded border ml-1 leading-none ${rank.color}`}>
                            {rank.icon} {rank.title}
                          </span>
                        );
                      })()}
                    </span>
                    <span>•</span>
                    <span>Rep: {selectedPost.author.reputation}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors shrink-0"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Panel Body (Answers and comments) */}
              <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-6">
                
                {/* Answers Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    REPLIES & Ranking Strategies ({answers.length})
                  </h3>

                  {answers.map((answer) => (
                    <div 
                      key={answer.id}
                      className={`p-4 rounded-xl border transition-all ${
                        answer.isTopInsight 
                          ? 'bg-slate-900/40 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.03)]'
                          : 'bg-slate-950/60 border-slate-900/60'
                      }`}
                    >
                      {/* Top Insight Badge */}
                      {answer.isTopInsight && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 text-[9px] font-mono font-bold mb-3">
                          <Award className="h-3 w-3" />
                          <span>Top Performing SEO Insight</span>
                        </div>
                      )}

                      {/* Answer header */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                            {answer.author.avatar} @{answer.author.username}
                            {(() => {
                              const rank = getUserRank(answer.author.reputation);
                              return (
                                <span className={`text-[8px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded border ml-1 leading-none ${rank.color}`}>
                                  {rank.icon} {rank.title}
                                </span>
                              );
                            })()}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Rep: {answer.author.reputation}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(answer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Content block */}
                      <pre className="mt-3 text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed select-text font-medium bg-slate-950/80 p-3.5 rounded-xl border border-slate-900 overflow-x-auto">
                        {answer.content}
                      </pre>

                      {/* Vote & Reply stats bar */}
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-900/60 text-xs font-mono">
                        <button
                          onClick={() => handleUpvoteAnswer(answer.id)}
                          className="flex items-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors"
                        >
                          <ArrowUp className="h-4 w-4" />
                          <span>{answer.upvotes}</span>
                        </button>
                      </div>

                      {/* Nested comments thread */}
                      <div className="mt-4 pl-4 border-l border-slate-900 space-y-3.5">
                        {activeAnswersComments[answer.id]?.map(comment => (
                          <div key={comment.id} className="flex gap-2 items-start text-xs">
                            <CornerDownRight className="h-4 w-4 text-slate-700 shrink-0 mt-0.5" />
                            <div className="flex-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                              <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
                                <span className="font-bold text-slate-400">@{comment.author.username}</span>
                                <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-slate-300 font-sans leading-relaxed select-text">{comment.content}</p>
                            </div>
                          </div>
                        ))}

                        {/* Add Comment Input */}
                        <div className="flex gap-2 items-center pl-6">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentInputs[answer.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [answer.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddCommentSubmit(answer.id);
                            }}
                            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-300 outline-none focus:border-cyan-500/30"
                          />
                          <button
                            onClick={() => handleAddCommentSubmit(answer.id)}
                            className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors"
                          >
                            <Send className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit New Answer Form */}
                <form onSubmit={handleAddAnswerSubmit} className="pt-4 border-t border-slate-800/80">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
                    POST AN INSIGHT OR STRATEGY
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter your ranking findings, indexing hacks, or code fixes..."
                    value={newAnswerText}
                    onChange={(e) => setNewAnswerText(e.target.value)}
                    className="w-full p-3.5 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-200 outline-none focus:border-emerald-500/30 resize-none font-sans"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                    >
                      Post Answer
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
