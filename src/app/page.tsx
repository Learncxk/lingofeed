'use client';

import { useEffect } from 'react';
import {
  BookOpen,
  HelpCircle,
  PenLine,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { useWordStore, selectActiveWords } from '@/store/useWordStore';
import ReadingCard from '@/components/ReadingCard';
import QuizCard from '@/components/QuizCard';
import SpellCard from '@/components/SpellCard';

export default function HomePage() {
  const words = useWordStore((s) => s.words);
  const masteredIds = useWordStore((s) => s.masteredIds);
  const resetAll = useWordStore((s) => s.resetAll);
  const activeWords = useWordStore(selectActiveWords);
  const total = words.length;

  // Reset on first mount so we always start fresh
  useEffect(() => {
    resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mastered = masteredIds.length;
  const progress = total > 0 ? (mastered / total) * 100 : 0;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* ---------- Fixed header ---------- */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                LingoFeed
              </span>
              <span className="ml-1.5 text-[10px] font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                MVP
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2.5">
            <div className="text-right">
              <p className="text-[11px] font-medium text-gray-400 leading-tight">MASTERED</p>
              <p className="text-sm font-bold text-gray-800 leading-tight">
                {mastered}
                <span className="text-gray-400 font-normal">/{total}</span>
              </p>
            </div>
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="3"
                  strokeDasharray={`${progress * 0.97} 100`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-[10px] font-bold text-indigo-600">
                {mastered > 0 ? Math.round(progress) : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Thin progress bar under header */}
        <div className="h-0.5 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* ---------- Feed ---------- */}
      <main className="max-w-md mx-auto px-4 pt-20 pb-10">
        {activeWords.length === 0 && mastered === total ? (
          /* ---- all mastered ---- */
          <div className="mt-8 text-center animate-bounce-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg mb-4">
              <Trophy className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800">
              All words mastered! 🎉
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">
              You&apos;ve completed today&apos;s LingoFeed. Come back tomorrow for
              new words!
            </p>
            <button
              onClick={resetAll}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 active:scale-[0.98] transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Review Again
            </button>
          </div>
        ) : (
          /* ---- card feed ---- */
          <>
            {activeWords.map((word, idx) => (
              <div key={word.id}>
                {idx === 0 && (
                  <p className="text-xs text-gray-400 mb-3 text-center">
                    — Today&apos;s feed · {activeWords.length} words —
                  </p>
                )}

                {word.stage === 0 && <ReadingCard word={word} />}
                {word.stage === 1 && <QuizCard word={word} />}
                {word.stage === 2 && <SpellCard word={word} />}
              </div>
            ))}

            {/* end of feed indicator */}
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-8 h-px bg-gray-200" />
                You&apos;ve reached the end
                <span className="w-8 h-px bg-gray-200" />
              </div>
            </div>
          </>
        )}
      </main>

      {/* ---------- floating legend (very subtle) ---------- */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-white/70 backdrop-blur-lg rounded-full border border-gray-200/60 px-4 py-1.5 shadow-sm">
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Read
            </span>
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> Quiz
            </span>
            <span className="flex items-center gap-1">
              <PenLine className="w-3 h-3" /> Spell
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
