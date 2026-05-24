"use client";

import React, { useState } from 'react';
import { db } from '@/lib/db';
import { X, Mail, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthDialog({ 
  isOpen, 
  onClose,
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState('');
  const [referral, setReferral] = useState('Search Console');
  const [error, setError] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setError(null);
      const user = db.logIn(email);
      
      if (user.status === 'pending') {
        setPendingStatus("Your membership request is under review. Admin will evaluate your registration details shortly.");
      } else if (user.status === 'approved') {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    }
  };

  const referralSources = [
    'Search Console',
    'Twitter / X',
    'Hacker News',
    'Discord Masterminds',
    'Private Newsletter',
    'Other Industry Reference'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm w-full p-6 rounded-2xl glass-panel border-emerald-500/20 bg-slate-950 shadow-2xl z-50 overflow-hidden"
          >
            {/* Scanline */}
            <div className="scanline" />

            <div className="flex justify-between items-start pb-3 border-b border-slate-900">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Mastermind Protocol</span>
                <h3 className="font-extrabold text-base text-slate-100 font-outfit mt-0.5">
                  Access SEO War Room
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {pendingStatus ? (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                <ShieldAlert className="h-12 w-12 text-amber-500 animate-pulse-glow" />
                <h4 className="font-extrabold text-sm text-amber-300 uppercase tracking-widest font-mono">
                  MEMBERSHIP PENDING
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-900 select-text">
                  {pendingStatus}
                </p>
                <div className="pt-2 flex flex-col w-full gap-2 font-mono">
                  <span className="text-[9px] text-slate-600">Simulating administrator review for kapilsaini.dm@gmail.com</span>
                  <button
                    onClick={() => {
                      setPendingStatus(null);
                      setEmail('');
                      onClose();
                    }}
                    className="w-full py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-xl font-bold transition-all"
                  >
                    Close Portal
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {error && (
                  <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl text-xs">
                    {error}
                  </div>
                )}

                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                      Professional Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="analyst@searchlabs.io"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9.5 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500/40 rounded-xl text-xs text-slate-200 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                      Referral Source
                    </label>
                    <select
                      value={referral}
                      onChange={(e) => setReferral(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500/40 rounded-xl text-xs text-slate-300 outline-none transition-all cursor-pointer font-mono"
                    >
                      {referralSources.map((ref) => (
                        <option key={ref} value={ref} className="bg-slate-950 text-slate-300 font-mono">
                          {ref}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold font-mono text-xs tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg hover:opacity-90 cursor-pointer"
                >
                  Verify Access
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="pt-2 text-center text-[9px] font-mono text-slate-600 leading-normal">
                  No passwords required. We authorize accounts via cryptographic tokens sent to professional domains.
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
