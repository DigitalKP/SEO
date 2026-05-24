"use client";

import React, { useState } from 'react';
import { Copy, Check, Terminal, Sparkles, Code, Cpu, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface PromptWorkflow {
  id: string;
  title: string;
  category: 'ChatGPT / Claude' | 'Python Scripts' | 'Google Sheets';
  description: string;
  metrics: string;
  prompt: string;
}

const DEFAULT_PROMPTS: PromptWorkflow[] = [
  {
    id: 'pr-1',
    title: 'Topical Authority Semantic Entity Clusterer',
    category: 'ChatGPT / Claude',
    description: 'Instructs Claude or ChatGPT to map a list of raw keywords into parent semantic nodes, identifying entities, topical gaps, and building optimized URL slug patterns.',
    metrics: 'Input: up to 10K keywords • Output: CSV topical structure',
    prompt: `Act as an elite semantic SEO architect. I will give you a list of keywords. Your task is to perform semantic keyword clustering.
Structure the response into a structured table containing:
1. Topic Hub (Parent Category)
2. Child Topic (Sub-Category)
3. Target Keyword
4. Search Intent (Informational, Transactional, Navigational)
5. Suggested URL Slug (Semantic structure)
6. LSI / Entity synonyms to include in the copy

Algorithm Rules:
- Do not repeat keywords.
- Cluster by search intent and topical relevance, not just alphabetical match.
- Highlight "Parent" hub nodes that should host long-form pillar content.

Raw Keywords list:
[INSERT KEYWORDS HERE]`
  },
  {
    id: 'pr-2',
    title: 'Nested JSON-LD FAQ & Product Schema Generator',
    category: 'ChatGPT / Claude',
    description: 'Prompts the LLM to output syntax-valid nested JSON-LD schema blocks combining Product ratings, Offers, FAQs, and Organization entities into a single tag.',
    metrics: 'Output: Google rich snippet compliant JSON-LD',
    prompt: `Analyze the following webpage copy and extract key details (Product Name, Price, Currency, Reviews, Rating, FAQ questions, and Answers). 
Generate a single, unified, syntax-valid nested JSON-LD script that includes:
- Schema type: Product
- Schema type: Offer (nested)
- Schema type: AggregateRating (nested)
- Schema type: FAQPage (containing FAQ questions and answers)

Ensure no syntax errors occur and the JSON is strictly formatted inside a code block. Do not include markdown warnings outside of the code block.

Webpage content:
[INSERT WEBPAGE CONTENT OR COPY HERE]`
  },
  {
    id: 'pr-3',
    title: 'Python Server Log Crawl Budget Analyzer',
    category: 'Python Scripts',
    description: 'A Python script that parses server access logs to count Googlebot crawl frequencies across specific subdirectories, identifying crawl waste on 404s/redirects.',
    metrics: 'Requirements: Pandas, User-Agent filtering',
    prompt: `import pandas as pd
import re

# Regex to parse standard Apache/Nginx logs
log_file_path = "access.log"
log_pattern = re.compile(
    r'(?P<ip>\\S+) \\S+ \\S+ \\[(?P<time>.*?)\\] "(?P<request>.*?)" (?P<status>\\d+) (?P<bytes>\\S+) "(?P<referrer>.*?)" "(?P<user_agent>.*?)"'
)

logs = []
with open(log_file_path, "r") as f:
    for line in f:
        match = log_pattern.match(line)
        if match:
            logs.append(match.groupdict())

df = pd.DataFrame(logs)
# Filter for Googlebot
googlebot_df = df[df['user_agent'].str.contains("Googlebot", case=False, na=False)]

print(f"Total Googlebot Requests: {len(googlebot_df)}")
print("\\nRequests by Response Status:")
print(googlebot_df['status'].value_counts())

# Extract directories
googlebot_df['url'] = googlebot_df['request'].apply(lambda x: x.split()[1] if len(x.split()) > 1 else "")
googlebot_df['subdir'] = googlebot_df['url'].apply(lambda x: "/" + x.split('/')[1] if len(x.split('/')) > 1 else "/")

print("\\nMost Crawled Directories by Googlebot:")
print(googlebot_df['subdir'].value_counts().head(10))`
  }
];

export default function PromptLibrary() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <Cpu className="h-4.5 w-4.5 text-emerald-400" />
          <h2 className="text-sm font-extrabold tracking-widest text-slate-400 font-mono uppercase">
            AI SEO PROMPTS & WORKFLOW LIBRARY
          </h2>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-950 flex items-center gap-1">
          <Sparkles className="h-3 w-3 animate-pulse" />
          CLAUDE 3.5 & CHATGPT READY
        </span>
      </div>

      {/* Prompts Cards Grid */}
      <div className="space-y-5">
        {DEFAULT_PROMPTS.map((item) => (
          <div
            key={item.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden"
          >
            {/* Top metrics tags */}
            <div className="flex justify-between items-start gap-2 flex-wrap">
              <div>
                <span className={`text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded font-bold border ${
                  item.category.includes('Python') 
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                }`}>
                  {item.category}
                </span>
                <h3 className="font-extrabold text-base tracking-tight text-slate-100 font-outfit mt-2">
                  {item.title}
                </h3>
              </div>

              <button
                onClick={() => handleCopy(item.id, item.prompt)}
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/35 text-xs font-bold font-mono text-emerald-450 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md select-none shrink-0"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied Prompt!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>

            {/* Description */}
            <p className="text-xs font-medium text-slate-400 leading-relaxed mt-2.5">
              {item.description}
            </p>

            {/* Specs row */}
            <div className="flex items-center gap-1.5 mt-3.5 text-[10px] font-mono text-slate-500">
              <Terminal className="h-3.5 w-3.5 text-slate-600" />
              <span>{item.metrics}</span>
            </div>

            {/* Code Block Preview */}
            <div className="mt-4 bg-slate-950 rounded-xl border border-slate-900 overflow-hidden text-left relative group">
              <div className="flex justify-between items-center bg-slate-900/60 px-4 py-2 border-b border-slate-950 text-[10px] font-mono text-slate-500 select-none">
                <span>Code Output Preview</span>
                <span className="text-[9px] text-slate-600">YAML / TEXT BLOCK</span>
              </div>
              <pre className="p-4 text-[11px] text-slate-400 font-mono overflow-x-auto whitespace-pre-wrap max-h-36 select-text leading-relaxed">
                {item.prompt}
              </pre>
              {/* Fade out cover overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
