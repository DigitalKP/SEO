"use client";

import React, { useEffect, useState } from 'react';
import { db, User, AuditLog, Post } from '@/lib/db';
import { Shield, Users, Activity, FileText, Check, Ban, AlertOctagon, Trash, TrendingUp, Laptop, Globe, UserCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'activity' | 'posts' | 'analytics'>('users');
  const [analyticsData, setAnalyticsData] = useState<{ views: number[]; clicks: number[]; time: string[] }>({
    views: [1420, 1680, 2100, 1850, 2400, 3100, 3450],
    clicks: [420, 510, 680, 590, 810, 1120, 1250],
    time: ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  });

  useEffect(() => {
    setUsers(db.getUsers());
    setLogs(db.getLogs());
    setPosts(db.getPosts());

    const unsubscribe = db.subscribe(() => {
      setUsers(db.getUsers());
      setLogs(db.getLogs());
      setPosts(db.getPosts());
    });

    // Simulate real-time traffic ticker updating
    const interval = setInterval(() => {
      setAnalyticsData(prev => {
        const nextViews = [...prev.views.slice(1), prev.views[prev.views.length - 1] + Math.floor(Math.random() * 200) - 80];
        const nextClicks = [...prev.clicks.slice(1), prev.clicks[prev.clicks.length - 1] + Math.floor(Math.random() * 80) - 30];
        
        const now = new Date();
        const nextTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const nextTimes = [...prev.time.slice(1), nextTimeStr];

        return {
          views: nextViews,
          clicks: nextClicks,
          time: nextTimes
        };
      });
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleApprove = (userId: string) => {
    db.approveUser(userId);
  };

  const handleDisallow = (userId: string) => {
    db.disallowUser(userId);
  };

  const handleBan = (userId: string) => {
    db.banUser(userId);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm("Are you sure you want to remove this discussion?")) {
      if (typeof window !== 'undefined') {
        const storedPosts = localStorage.getItem('seo_posts');
        if (storedPosts) {
          const parsed = JSON.parse(storedPosts) as Post[];
          const filtered = parsed.filter(p => p.id !== postId);
          localStorage.setItem('seo_posts', JSON.stringify(filtered));
          db.addLog('post_created', `Admin removed post: ${postId}`);
          // trigger refresh
          db.tickImpressions();
        }
      }
    }
  };

  const handleResetData = () => {
    if (confirm("WARNING: This will reset all modifications, users, upvotes, and logs. Proceed?")) {
      db.clearAllData();
    }
  };

  // SVG dimensions for analytics charts
  const width = 450;
  const height = 150;
  const maxVal = Math.max(...analyticsData.views) * 1.1;

  const pointsViews = analyticsData.views.map((val, idx) => {
    const x = (idx / (analyticsData.views.length - 1)) * (width - 40) + 20;
    const y = height - (val / maxVal) * (height - 30) - 10;
    return `${x},${y}`;
  }).join(' ');

  const pointsClicks = analyticsData.clicks.map((val, idx) => {
    const x = (idx / (analyticsData.clicks.length - 1)) * (width - 40) + 20;
    const y = height - (val / maxVal) * (height - 30) - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="glass-panel border-cyan-500/20 p-6 rounded-2xl shadow-2xl relative bg-slate-950/95 overflow-hidden flex flex-col h-full max-h-[85vh]">
      {/* Scanline overlay */}
      <div className="scanline" />
      
      {/* Header */}
      <div className="flex justify-between items-start pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Shield className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl tracking-tight text-slate-100 font-outfit">ADMIN INTEL DECK</h2>
            <p className="text-[10px] text-slate-400 font-mono">Platform operations & verification panel</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleResetData}
            title="Reset DB Seed"
            className="p-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-red-400 hover:text-red-300 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset DB
          </button>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-mono transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mt-4 p-1 bg-slate-900/60 border border-slate-900 rounded-xl">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'users' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          MEMBERS ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'posts' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          DISCUSSIONS
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'activity' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          SYSTEM LOGS
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'analytics' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          REALTIME TRAFFIC
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto mt-4 pr-1">
        {/* Members Tab */}
        {activeTab === 'users' && (
          <div className="space-y-3.5">
            {users.map(u => (
              <div 
                key={u.id} 
                className="p-4 rounded-xl bg-slate-950 border border-slate-900 hover:border-slate-800 transition-all flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold font-mono text-cyan-400">{u.email}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-mono font-bold ${
                        u.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        u.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                        u.status === 'banned' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {u.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Rep: {u.reputation}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Role: {u.role}</span>
                    </div>
                  </div>

                  {u.email !== 'kapilsaini.dm@gmail.com' && (
                    <div className="flex gap-1.5">
                      {u.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(u.id)}
                          className="px-2 py-1 bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-900/40 text-emerald-400 hover:text-emerald-300 text-xs font-mono font-semibold rounded flex items-center gap-1 transition-all"
                        >
                          <Check className="h-3 w-3" /> Approve
                        </button>
                      )}
                      {u.status !== 'disallowed' && u.status !== 'banned' && (
                        <button
                          onClick={() => handleDisallow(u.id)}
                          className="px-2 py-1 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-900/30 text-amber-500 hover:text-amber-400 text-xs font-mono font-semibold rounded flex items-center gap-1 transition-all"
                        >
                          Disallow
                        </button>
                      )}
                      {u.status !== 'banned' && (
                        <button
                          onClick={() => handleBan(u.id)}
                          className="px-2 py-1 bg-red-950/30 hover:bg-red-900/40 border border-red-900/40 text-red-400 hover:text-red-300 text-xs font-mono font-semibold rounded flex items-center gap-1 transition-all"
                        >
                          <Ban className="h-3 w-3" /> Ban
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-500">
                  <div className="flex items-center gap-1">
                    <Laptop className="h-3 w-3 text-slate-600 shrink-0" />
                    <span className="truncate">{u.deviceInfo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3 text-slate-600 shrink-0" />
                    <span>IP: {u.ipAddress}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3 text-slate-600 shrink-0" />
                    <span>Ref: {u.referralSource}</span>
                  </div>
                  <div>
                    <span>Joined: {new Date(u.joinedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Discussions Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-3">
            {posts.map(p => (
              <div 
                key={p.id} 
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 hover:border-slate-800 transition-all flex justify-between items-center gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-950">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">By @{p.author.username}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mt-1.5 truncate">{p.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-slate-500">
                    <span>Upvotes: {p.upvotes}</span>
                    <span>Views: {p.views}</span>
                    <span>Impressions: {p.impressions}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePost(p.id)}
                  className="p-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-red-400 hover:text-red-300 rounded-lg transition-colors shrink-0"
                  title="Remove Discussion"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-2 font-mono text-[11px] leading-relaxed">
            {logs.map(log => (
              <div 
                key={log.id} 
                className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex gap-2.5 items-start"
              >
                <span className="text-slate-600 shrink-0 select-none">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <div className="flex-1">
                  <span className={`font-bold tracking-wide ${
                    log.type === 'signup_request' ? 'text-cyan-400' :
                    log.type === 'user_approved' ? 'text-emerald-400' :
                    log.type === 'user_disallowed' ? 'text-amber-500' :
                    log.type === 'user_banned' ? 'text-red-500' :
                    log.type === 'post_created' ? 'text-indigo-400' :
                    'text-slate-400'
                  }`}>
                    {log.type.toUpperCase()}:
                  </span>{' '}
                  <span className="text-slate-300">{log.details}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Live Connections</span>
                <span className="text-xl font-extrabold text-cyan-400 mt-1 block font-outfit animate-pulse">24 Active</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Daily Operations</span>
                <span className="text-xl font-extrabold text-emerald-400 mt-1 block font-outfit">1,348 req/hr</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Global Latency</span>
                <span className="text-xl font-extrabold text-indigo-400 mt-1 block font-outfit">18ms</span>
              </div>
            </div>

            {/* Glowing SVG Chart */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300 font-outfit">Community Feed Clicks vs. Views Ticker</span>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" /> Views
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> Clicks
                  </span>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="bg-slate-950 border border-slate-900/60 p-2 rounded-lg flex items-center justify-center overflow-x-auto">
                <svg className="w-full min-w-[320px] max-w-[440px]" viewBox={`0 0 ${width} ${height}`}>
                  {/* Grids */}
                  <line x1="20" y1="10" x2={width - 20} y2="10" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="20" y1="70" x2={width - 20} y2="70" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="20" y1="130" x2={width - 20} y2="130" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="4 4" />
                  
                  {/* Axis lines */}
                  <line x1="20" y1="10" x2="20" y2="130" stroke="#374151" strokeWidth="1" />
                  <line x1="20" y1="130" x2={width - 20} y2="130" stroke="#374151" strokeWidth="1" />

                  {/* Views Line (Cyan) */}
                  <polyline
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                    points={pointsViews}
                    className="drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                  />
                  
                  {/* Clicks Line (Emerald) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    points={pointsClicks}
                    className="drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  />

                  {/* Coordinates Markers */}
                  {analyticsData.views.map((v, idx) => {
                    const x = (idx / (analyticsData.views.length - 1)) * (width - 40) + 20;
                    const y = height - (v / maxVal) * (height - 30) - 10;
                    return (
                      <g key={`v-dot-${idx}`}>
                        <circle cx={x} cy={y} r="3.5" fill="#06b6d4" />
                        <circle cx={x} cy={y} r="6" fill="none" stroke="#06b6d4" strokeWidth="0.5" className="animate-pulse" />
                      </g>
                    );
                  })}

                  {/* Time Labels */}
                  {analyticsData.time.map((t, idx) => {
                    const x = (idx / (analyticsData.time.length - 1)) * (width - 40) + 20;
                    return (
                      <text
                        key={`lbl-${idx}`}
                        x={x}
                        y={height - 2}
                        fill="#6b7280"
                        fontSize="8"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {t}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-800 text-center font-mono text-[9px] text-slate-600">
        SECURITY DECK: ACTIVE SECTOR_14 // SYSTEM OPERATIONAL
      </div>
    </div>
  );
}
