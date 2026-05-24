"use client";

import React, { useEffect, useState } from 'react';
import { db, SimulatedEmail } from '@/lib/db';
import { Mail, Bell, X, CheckCircle, Flame, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function NotificationCenter() {
  const [emails, setEmails] = useState<SimulatedEmail[]>([]);
  const [toasts, setToasts] = useState<(SimulatedEmail & { toastId: string })[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load initial emails
    setEmails(db.getEmails());
    
    // Subscribe to DB changes
    const unsubscribe = db.subscribe(() => {
      const allEmails = db.getEmails();
      setEmails(allEmails);
      setUnreadCount(allEmails.filter(e => !e.read).length);
    });

    // Listen for real-time simulated email events
    const handleEmailEvent = (e: Event) => {
      const customEvent = e as CustomEvent<SimulatedEmail>;
      const newEmail = customEvent.detail;
      
      // Add to active toasts
      const toastId = `${newEmail.id}-${Date.now()}`;
      setToasts(prev => [...prev, { ...newEmail, toastId }]);

      // Auto remove toast after 6 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.toastId !== toastId));
      }, 6000);
    };

    window.addEventListener('simulated-email-sent', handleEmailEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('simulated-email-sent', handleEmailEvent);
    };
  }, []);

  const handleMarkAsRead = (emailId: string) => {
    const updated = emails.map(e => e.id === emailId ? { ...e, read: true } : e);
    setEmails(updated);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('seo_emails');
      if (stored) {
        const parsed = JSON.parse(stored) as SimulatedEmail[];
        const match = parsed.map(e => e.id === emailId ? { ...e, read: true } : e);
        localStorage.setItem('seo_emails', JSON.stringify(match));
      }
    }
    setUnreadCount(updated.filter(e => !e.read).length);
  };

  const getIcon = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('trending') || s.includes('attention') || s.includes('highest')) {
      return <Flame className="h-5 w-5 text-amber-400 animate-pulse" />;
    }
    if (s.includes('approved')) {
      return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    }
    if (s.includes('pending') || s.includes('registration')) {
      return <ShieldAlert className="h-5 w-5 text-cyan-400" />;
    }
    return <Mail className="h-5 w-5 text-indigo-400" />;
  };

  return (
    <>
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.toastId}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="glass-panel border-emerald-500/40 p-4 rounded-xl shadow-2xl pointer-events-auto flex gap-3 items-start relative overflow-hidden bg-slate-950/90"
            >
              {/* Scanline and glowing indicator */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-right from-emerald-500 via-cyan-500 to-transparent animate-pulse-glow" />
              
              <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
                {getIcon(toast.subject)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono font-semibold">Simulated Email Dispatch</span>
                  <span className="text-[9px] text-slate-500 font-mono">Just Now</span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 truncate mt-1">To: {toast.to}</h4>
                <p className="text-xs font-medium text-amber-300 line-clamp-1 mt-0.5">{toast.subject}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 bg-slate-900/60 p-1.5 rounded border border-slate-800/40 font-mono leading-relaxed">
                  {toast.body}
                </p>
                {toast.meta?.type === 'signup_request' && toast.meta?.userId && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        db.approveUser(toast.meta!.userId!);
                        setToasts(prev => prev.filter(t => t.toastId !== toast.toastId));
                        alert("Approved user directly from notification toast!");
                      }}
                      className="flex-1 py-1 bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/30 text-[9px] font-mono font-bold text-emerald-300 rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Approve Access
                    </button>
                    <button
                      onClick={() => {
                        db.disallowUser(toast.meta!.userId!);
                        setToasts(prev => prev.filter(t => t.toastId !== toast.toastId));
                        alert("Rejected user request.");
                      }}
                      className="py-1 px-2.5 bg-red-950/30 hover:bg-red-900/40 border border-red-900/30 text-[9px] font-mono font-bold text-red-400 rounded-lg transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setToasts(prev => prev.filter(t => t.toastId !== toast.toastId))}
                className="text-slate-500 hover:text-slate-200 transition-colors p-0.5 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Bell Trigger */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => {
            setIsOpen(true);
            // Mark all loaded as read
            emails.forEach(e => handleMarkAsRead(e.id));
          }}
          className="relative glass-panel hover:bg-slate-800/80 p-3.5 rounded-full shadow-lg border border-slate-700/60 hover:border-emerald-500/30 transition-all duration-300 flex items-center justify-center hover:scale-105 group"
        >
          <Bell className="h-5 w-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-mono text-[9px] font-extrabold h-5 w-5 flex items-center justify-center rounded-full animate-bounce shadow-lg shadow-emerald-500/20">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Slide-out Email Logs Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50"
            />

            {/* Sidebar panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 max-w-md w-full bg-[#070b19] border-r border-slate-800 shadow-2xl z-50 flex flex-col p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Mail className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg tracking-tight font-outfit text-slate-100">Simulated Email Log</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Review system dispatches sent to users</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Scrollable list of dispatches */}
              <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-4">
                {emails.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <Mail className="h-10 w-10 text-slate-700 mb-2" />
                    <p className="text-sm font-semibold text-slate-500">No emails dispatched yet.</p>
                    <p className="text-xs text-slate-600 mt-1">Simulated notifications (such as user updates or trending answer warnings) will appear here as they trigger.</p>
                  </div>
                ) : (
                  emails.map((email) => (
                    <div
                      key={email.id}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        email.read 
                          ? 'bg-slate-950/40 border-slate-800/80 hover:border-slate-800' 
                          : 'bg-slate-900/60 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.02)]'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md ${email.read ? 'bg-slate-900 text-slate-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {getIcon(email.subject)}
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono block">Recipient</span>
                            <span className="text-xs font-bold font-mono text-slate-200">{email.to}</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1 font-outfit">
                          {email.subject}
                          <ArrowUpRight className="h-3 w-3 text-slate-500" />
                        </h4>
                        <pre className="mt-2 text-[11px] text-slate-400 whitespace-pre-wrap font-mono bg-slate-950/70 p-3 rounded-lg border border-slate-900 leading-relaxed overflow-x-auto select-text">
                          {email.body}
                        </pre>
                      </div>
                      {email.meta?.type === 'signup_request' && email.meta?.userId && (
                        <div className="mt-3.5 flex gap-2 border-t border-slate-900 pt-3">
                          <button
                            onClick={() => {
                              db.approveUser(email.meta!.userId!);
                              alert("Approved user directly from notification log!");
                            }}
                            className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 hover:border-emerald-500/50 text-[10px] font-mono font-bold text-emerald-400 rounded-lg transition-colors cursor-pointer text-center"
                          >
                            Approve Access
                          </button>
                          <button
                            onClick={() => {
                              db.disallowUser(email.meta!.userId!);
                              alert("Rejected user request.");
                            }}
                            className="py-1.5 px-3 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-[10px] font-mono font-bold text-red-400 rounded-lg transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 font-mono">
                  SEO Intel v1.0.0 • Simulating SMTP Delivery
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
