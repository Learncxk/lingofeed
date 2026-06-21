'use client';

import { useState, useCallback } from 'react';
import { HelpCircle, XCircle, CheckCircle, Zap } from 'lucide-react';
import type { WordItem } from '@/store/useWordStore';
import { useWordStore } from '@/store/useWordStore';

interface Props {
  word: WordItem;
}

export default function QuizCard({ word }: Props) {
  const markQuizCorrect = useWordStore((s) => s.markQuizCorrect);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSelect = useCallback(
    (option: string) => {
      if (result !== null) return; // already answered

      setSelected(option);
      if (option === word.quizContext.correct) {
        setResult('correct');
        // Show "Excellent!" for 1.4s then advance
        setTimeout(() => markQuizCorrect(word.id), 1400);
      } else {
        setResult('wrong');
        setShaking(true);
        setShowCorrect(true);
        setTimeout(() => setShaking(false), 500);
        // Allow another attempt after a brief pause
        setTimeout(() => {
          setResult(null);
          setSelected(null);
          setShowCorrect(false);
        }, 1800);
      }
    },
    [result, word.quizContext.correct, word.id, markQuizCorrect],
  );

  /* ---------- Render ---------- */

  /* Build the display text: highlight the blank portion */
  const parts = word.quizContext.textWithBlank.split('______');

  // Show celebration card when correct
  if (result === 'correct') {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6 mb-5 text-center animate-bounce-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-md mb-3">
          <Zap className="w-7 h-7" />
        </div>
        <p className="text-2xl font-extrabold text-emerald-600">Excellent! 🎉</p>
        <p className="text-sm text-emerald-500 mt-1">You know this word well!</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-5 mb-5 transition-all duration-300 animate-slide-up hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] ${
        shaking ? 'animate-shake' : ''
      }`}
    >
      {/* header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <HelpCircle className="w-3.5 h-3.5" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
          Fill in the Blank
        </span>
      </div>

      {/* sentence with blank */}
      <p className="text-[15px] leading-relaxed text-gray-800 mb-5 select-none">
        {parts.length === 2 ? (
          <>
            {parts[0]}
            <span className="inline-block px-3 py-0.5 mx-0.5 rounded-md bg-amber-50 border-2 border-dashed border-amber-300 text-amber-700 font-bold">
              ______
            </span>
            {parts[1]}
          </>
        ) : (
          word.quizContext.textWithBlank
        )}
      </p>

      {/* options */}
      <div className="space-y-2.5">
        {word.quizContext.options.map((opt) => {
          let btnClass =
            'w-full py-3 px-4 rounded-xl border-2 text-sm font-medium text-left transition-all duration-200 ';

          if (selected === opt && (result as string) === 'correct') {
            btnClass += 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-md';
          } else if (selected === opt && result === 'wrong') {
            btnClass += 'border-red-400 bg-red-50 text-red-700';
          } else if (selected !== null && result !== null && opt === word.quizContext.correct) {
            btnClass += 'border-emerald-400 bg-emerald-50/60 text-emerald-700';
          } else if (result) {
            btnClass += 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed';
          } else {
            btnClass +=
              'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/40 active:scale-[0.98] cursor-pointer';
          }

          return (
            <button
              key={opt}
              disabled={result !== null}
              onClick={() => handleSelect(opt)}
              className={btnClass}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border-2 shrink-0 ${
                    selected === opt && (result as string) === 'correct'
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : selected === opt && result === 'wrong'
                        ? 'border-red-400 bg-red-400 text-white'
                        : 'border-gray-300 text-gray-500'
                  }`}
                >
                  {selected === opt && (result as string) === 'correct'
                    ? '✓'
                    : selected === opt && result === 'wrong'
                      ? '✗'
                      : String.fromCharCode(65 + word.quizContext.options.indexOf(opt))}
                </span>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* wrong-answer feedback */}
      {showCorrect && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">Not quite!</p>
              <p className="text-sm text-red-600 mt-0.5">
                <span className="font-medium">{word.quizContext.correct}</span>
                {' — '}
                {word.translation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
