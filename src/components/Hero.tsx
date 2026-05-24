"use client";

import React, { useEffect, useRef } from 'react';
import { Sparkles, Terminal, Flame, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero({ 
  onExplore, 
  onJoin, 
  onTrending 
}: { 
  onExplore: () => void; 
  onJoin: () => void; 
  onTrending: () => void; 
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(16, 185, 129, 0.4)';
        context.fill();
      }
    }

    const particles: Particle[] = Array.from({ length: 45 }, () => new Particle());

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      drawConnections();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden w-full pt-16 pb-20 border-b border-slate-900/60 bg-slate-950/20">
      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />
      
      {/* Cyber Grid */}
      <div className="cyber-grid" />

      {/* Floating SEO Charts (Visual Wow factor) */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6 pointer-events-none opacity-30 select-none scale-110">
        {/* Floating chart 1 */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="p-4 rounded-xl border border-emerald-500/20 bg-slate-950/60 backdrop-blur-md w-72"
        >
          <div className="flex justify-between items-center mb-2 text-[10px] font-mono text-emerald-400">
            <span>ORGANIC CLICKS TREND</span>
            <span>+248%</span>
          </div>
          <svg className="w-full h-16" viewBox="0 0 100 40">
            <defs>
              <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M 0 35 Q 15 25 30 28 T 60 12 T 90 4 L 100 2 L 100 40 L 0 40 Z" fill="url(#chart-grad)" />
            <path d="M 0 35 Q 15 25 30 28 T 60 12 T 90 4 L 100 2" fill="none" stroke="#10b981" strokeWidth="1.5" />
          </svg>
        </motion.div>

        {/* Floating chart 2 */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="p-4 rounded-xl border border-cyan-500/20 bg-slate-950/60 backdrop-blur-md w-64 ml-12"
        >
          <div className="flex justify-between items-center mb-2 text-[10px] font-mono text-cyan-400">
            <span>CRAWL RATE EFFICIENCY</span>
            <span>0.12s / page</span>
          </div>
          <svg className="w-full h-14" viewBox="0 0 100 40">
            <defs>
              <linearGradient id="chart-grad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M 0 32 L 20 28 L 40 15 L 60 18 L 80 8 L 100 5 L 100 40 L 0 40 Z" fill="url(#chart-grad2)" />
            <path d="M 0 32 L 20 28 L 40 15 L 60 18 L 80 8 L 100 5" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
          </svg>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl text-left">
          {/* Tagline */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-semibold tracking-wide mb-6"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>SEO_WAR_ROOM_PROTOCOL_1.0</span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-100 to-emerald-400 font-outfit leading-[1.08] mb-6"
          >
            The Future of SEO Discussions Starts Here.
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base md:text-lg font-medium leading-relaxed mb-8 max-w-2xl font-sans"
          >
            Live SEO discussions, ranking experiments, AI SEO tactics, indexing solutions, technical fixes, and practical growth strategies from a real community.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <button
              onClick={onExplore}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-slate-950 font-bold font-mono text-xs tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/15 hover:scale-102 cursor-pointer"
            >
              <span>Explore Discussions</span>
            </button>
            <button
              onClick={onJoin}
              className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-slate-100 font-bold font-mono text-xs tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
              <span>Join SEO Community</span>
            </button>
            <button
              onClick={onTrending}
              className="px-6 py-3.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-300 font-semibold font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Flame className="h-4.5 w-4.5 text-amber-500" />
              <span>Trending Answers</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
