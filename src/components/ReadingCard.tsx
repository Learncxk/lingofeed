'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { WordItem } from '@/store/useWordStore';
import { useWordStore } from '@/store/useWordStore';

interface Props {
  word: WordItem;
}

export default function ReadingCard({ word }: Props) {
  const markAsRead = useWordStore((s) => s.markAsRead);
  const [expanded, setExpanded] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="bg-white/80 rounded-2xl shadow-lg border border-emerald-200 p-6 mb-5 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-emerald-700 font-semibold text-lg">Word added to review!</p>
        <p className="text-emerald-500 text-sm mt-1">Scroll down — a quiz is waiting for you 🎯</p>
      </div>
    );
  }

  const parts = word.readingContext.text.split(
    new RegExp(`(${escapeRegex(word.readingContext.highlight)})`, 'gi'),
  );

  function handleClick() {
    if (expanded) {
      // "Got it" → advance store
      markAsRead(word.id);
      setDone(true);
    } else {
      setExpanded(true);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-5 mb-5 transition-all duration-300 animate-slide-up hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]">
      {/* header row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <BookOpen className="w-3.5 h-3.5" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          New Word
        </span>
      </div>

      {/* tweet-like body */}
      <p className="text-[15px] leading-relaxed text-gray-800 mb-1 select-none">
        {parts.map((part, i) => {
          const isHighlight = part.toLowerCase() === word.readingContext.highlight.toLowerCase();
          return isHighlight ? (
            <button
              key={i}
              onClick={() => !expanded && setExpanded(true)}
              className="relative inline font-bold text-indigo-600 cursor-pointer transition-colors hover:text-indigo-500 focus:outline-none"
            >
              {part}
              <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-60" />
            </button>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
      </p>

      {/* expandable accordion */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          expanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="rounded-xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 p-4 space-y-3">
          {/* translation */}
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Translation
            </span>
            <p className="text-lg font-bold text-indigo-700 mt-0.5">{word.translation}</p>
          </div>

          {/* divider */}
          <div className="border-t border-indigo-100/60" />

          {/* joke */}
          <div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Mnemonic 💡
            </span>
            <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{word.readingContext.joke}</p>
          </div>
        </div>

        {/* Got it button */}
        <button
          onClick={handleClick}
          className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 active:scale-[0.98] transition-all duration-200"
        >
          Got it ✓
        </button>
      </div>

      {/* tap hint when collapsed */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          Tap the highlighted word
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/** Escape special regex chars so user-supplied strings work in `new RegExp` */
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
