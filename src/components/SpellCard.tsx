'use client';

import { useState, useRef, useCallback } from 'react';
import { PenLine, Trophy, ArrowRight } from 'lucide-react';
import type { WordItem } from '@/store/useWordStore';
import { useWordStore } from '@/store/useWordStore';

interface Props {
  word: WordItem;
}

export default function SpellCard({ word }: Props) {
  const markSpellCorrect = useWordStore((s) => s.markSpellCorrect);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct' | 'done'>('idle');
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (status === 'correct' || status === 'done') return;

      const trimmed = value.trim().toLowerCase();
      if (trimmed === word.word.toLowerCase()) {
        setStatus('correct');
        setTimeout(() => {
          markSpellCorrect(word.id);
          setStatus('done');
        }, 2000);
      } else {
        setStatus('wrong');
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          setStatus('idle');
          setValue('');
          inputRef.current?.focus();
        }, 800);
      }
    },
    [value, word.word, word.id, status, markSpellCorrect],
  );

  /* ---------- done (mastered) card ---------- */
  if (status === 'done') {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl shadow-lg p-6 mb-5 text-center">
        {/* confetti-like emoji bursts */}
        <ConfettiBurst />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/25 backdrop-blur-sm text-white shadow-inner mb-3">
            <Trophy className="w-8 h-8" />
          </div>
          <p className="text-2xl font-extrabold text-white drop-shadow-sm">
            Mastered! 🏆
          </p>
          <p className="text-emerald-100 text-sm mt-1">
            <span className="font-bold text-white">{word.word}</span> is now in your long-term memory
          </p>
        </div>
      </div>
    );
  }

  /* ---------- normal card ---------- */
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-5 mb-5 transition-all duration-300 animate-slide-up hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]">
      {/* header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white">
          <PenLine className="w-3.5 h-3.5" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-rose-500">
          Spell It
        </span>
      </div>

      {/* Chinese hint */}
      <div className="text-center py-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Type the English word
        </p>
        <p className="text-xl font-bold text-gray-800">{word.spellContext.chineseHint}</p>
      </div>

      {/* input form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (status === 'wrong') setStatus('idle');
            }}
            placeholder="Type the word here…"
            className={`w-full px-4 py-3.5 rounded-xl border-2 text-base text-center font-mono tracking-wider transition-all duration-200 outline-none ${
              status === 'wrong'
                ? 'border-red-400 bg-red-50 text-red-700 placeholder:text-red-300'
                : status === 'correct'
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:border-indigo-400 focus:bg-white focus:shadow-md'
            } ${shaking ? 'animate-shake' : ''}`}
          />

          {/* correct checkmark overlay */}
          {status === 'correct' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-2xl animate-bounce-in">✅</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={value.trim().length === 0}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg hover:from-rose-600 hover:to-pink-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {status === 'correct' ? '✓ Perfect!' : 'Check Spelling'}
        </button>
      </form>

      {/* hint for wrong answer */}
      {status === 'wrong' && (
        <p className="mt-3 text-xs text-center text-red-400 animate-fade-in">
          ✗ Try again — check the letters carefully
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Confetti burst (pure CSS emoji confetti)                           */
/* ------------------------------------------------------------------ */
function ConfettiBurst() {
  const emojis = ['🎉', '✨', '🎊', '⭐', '🌟', '💫', '🏆', '🥳'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {emojis.map((emoji, i) => (
        <span
          key={i}
          className="absolute text-lg animate-confetti"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 0.6}s`,
            animationDuration: `${1.2 + Math.random() * 0.8}s`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
