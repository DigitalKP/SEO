"use client";

import React, { useEffect, useState } from 'react';
import { db, Job } from '@/lib/db';
import { Briefcase, Search, Filter, DollarSign, MapPin, Sparkles, Send, CheckCircle2, User, FileText, ArrowRight, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedExp, setSelectedExp] = useState<string>('All');
  const [activeApplyJob, setActiveApplyJob] = useState<Job | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    setJobs(db.getJobs());
    
    const unsubscribe = db.subscribe(() => {
      setJobs(db.getJobs());
    });

    return () => unsubscribe();
  }, []);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApplyJob || !email || !resumeLink) return;

    db.applyToJob(activeApplyJob.id, email, resumeLink, coverLetter);
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setActiveApplyJob(null);
      setEmail('');
      setResumeLink('');
      setCoverLetter('');
    }, 2500);
  };

  const filteredJobs = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                        j.company.toLowerCase().includes(search.toLowerCase()) ||
                        j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchType = selectedType === 'All' || j.type === selectedType;
    const matchExp = selectedExp === 'All' || j.experience === selectedExp;
    return matchSearch && matchType && matchExp;
  });

  return (
    <div className="w-full">
      {/* Search and Filters Header */}
      <div className="glass-panel border-slate-800/80 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between mb-6 shadow-xl relative overflow-hidden bg-slate-900/40">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search roles, skills, or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10.5 pr-4 py-2.5 bg-slate-950/80 border border-slate-800/60 focus:border-emerald-500/50 rounded-xl text-sm text-slate-200 outline-none transition-all placeholder-slate-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          {/* Job Type Select */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800/60">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-300 font-mono outline-none cursor-pointer pr-1"
            >
              <option value="All" className="bg-slate-950 text-slate-300">All Agreements</option>
              <option value="Full-time" className="bg-slate-950 text-slate-300">Full-time</option>
              <option value="Freelance" className="bg-slate-950 text-slate-300">Freelance</option>
              <option value="Internship" className="bg-slate-950 text-slate-300">Internships</option>
            </select>
          </div>

          {/* Exp Level Select */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800/60">
            <Star className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-300 font-mono outline-none cursor-pointer pr-1"
            >
              <option value="All" className="bg-slate-950 text-slate-300">All Seniority</option>
              <option value="Junior" className="bg-slate-950 text-slate-300">Junior</option>
              <option value="Mid" className="bg-slate-950 text-slate-300">Mid-level</option>
              <option value="Senior" className="bg-slate-950 text-slate-300">Senior</option>
              <option value="Lead" className="bg-slate-950 text-slate-300">Lead</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full glass-panel border-slate-800/80 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
            <Briefcase className="h-10 w-10 text-slate-700 mb-3" />
            <p className="text-sm font-semibold text-slate-500">No matching SEO positions found.</p>
            <p className="text-xs text-slate-600 mt-1">Try expanding your keyword query or resetting the filters.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <motion.div
              layout
              key={job.id}
              className="glass-panel hover:bg-slate-900/40 p-5 rounded-2xl border border-slate-800/60 hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between group relative shadow-md"
            >
              {/* Top Row Info */}
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">{job.company}</span>
                    <h3 className="font-extrabold text-base tracking-tight text-slate-100 font-outfit mt-0.5 group-hover:text-emerald-400 transition-colors">
                      {job.title}
                    </h3>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-mono font-bold ${
                    job.type === 'Full-time' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                    job.type === 'Freelance' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {job.type}
                  </span>
                </div>

                {/* Salary & Location Info */}
                <div className="flex flex-wrap gap-4 mt-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    {job.location}
                  </span>
                </div>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-[9px] font-mono bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/60 text-slate-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Apply Button */}
              <div className="mt-5 pt-4 border-t border-slate-800/50 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-600">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => setActiveApplyJob(job)}
                  className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold font-mono text-emerald-400 rounded-xl flex items-center gap-1.5 transition-all group-hover:translate-x-0.5"
                >
                  Apply Role
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Slide-over Apply Modal */}
      <AnimatePresence>
        {activeApplyJob && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveApplyJob(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg w-full p-6 rounded-2xl glass-panel border-emerald-500/20 bg-slate-950 shadow-2xl z-50 overflow-hidden"
            >
              {/* Scanline */}
              <div className="scanline" />

              {appliedSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-14 w-14 text-emerald-400 animate-bounce mb-4" />
                  <h3 className="font-extrabold text-xl text-slate-100 font-outfit">APPLICATION DISPATCHED</h3>
                  <p className="text-xs font-mono text-slate-400 mt-2 max-w-sm">
                    Simulated email alerts have been sent to your email and the admin team at kapilsaini.dm@gmail.com
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Apply to Position</span>
                      <h3 className="font-extrabold text-lg text-slate-100 font-outfit mt-0.5">
                        {activeApplyJob.title} at {activeApplyJob.company}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveApplyJob(null)}
                      className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">Your Email Address</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          placeholder="professional@seowizard.io"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9.5 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-emerald-500/40 rounded-xl text-xs text-slate-200 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">CV / Portfolio Link</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <input
                          type="url"
                          required
                          placeholder="https://github.com/username or https://myportfolio.com"
                          value={resumeLink}
                          onChange={(e) => setResumeLink(e.target.value)}
                          className="w-full pl-9.5 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-emerald-500/40 rounded-xl text-xs text-slate-200 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">Pitch / Cover Letter</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Detail your organic search achievements, technical indexing strategies, or links to published ranking experiments..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="w-full p-3 bg-slate-900 border border-slate-800 focus:border-emerald-500/40 rounded-xl text-xs text-slate-200 outline-none transition-all resize-none placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveApplyJob(null)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-mono text-slate-400 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-bold font-mono rounded-xl flex items-center gap-1.5 hover:opacity-90 shadow-lg shadow-emerald-500/10 transition-all"
                    >
                      Send Pitch
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
