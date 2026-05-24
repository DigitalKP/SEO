"use client";

import React, { useState } from 'react';
import { db } from '@/lib/db';
import { X, Send, AlertTriangle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AskQuestionDialog({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void 
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Ranking Experiments');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    try {
      db.addPost(title, category, body);
      setTitle('');
      setBody('');
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create discussion topic.");
    }
  };

  const categories = [
    'Ranking Experiments',
    'AI SEO Tactics',
    'Technical SEO Fixes',
    'Indexing Problems Solved',
    'SEO Myth Destroyed'
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

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg w-full p-6 rounded-2xl glass-panel border-emerald-500/20 bg-slate-950 shadow-2xl z-50 overflow-hidden"
          >
            {/* Scanline */}
            <div className="scanline" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <HelpCircle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Post New Intel</span>
                    <h3 className="font-extrabold text-base text-slate-100 font-outfit mt-0.5">
                      Launch Discussion Topic
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-950/30 border border-red-900/40 text-red-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form fields */}
              <div className="space-y-3.5">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Discussion Title (Question / Case Study Title)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Case Study: How we recovered after the Core Update..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-emerald-500/40 rounded-xl text-xs text-slate-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Select Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-emerald-500/40 rounded-xl text-xs text-slate-300 outline-none transition-all cursor-pointer font-mono"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-950 text-slate-300 font-mono">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Core insight / Details / Code snippet
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Provide details about your experiment parameters, the exact URL structure pruned, server logs metrics, or scripts used. Make it practical!"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-800 focus:border-emerald-500/40 rounded-xl text-xs text-slate-200 outline-none transition-all resize-none placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-mono text-slate-400 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-bold font-mono rounded-xl flex items-center gap-1.5 hover:opacity-90 shadow-lg shadow-emerald-500/10 transition-all"
                >
                  Launch Topic
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
