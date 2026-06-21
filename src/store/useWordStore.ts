import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export type Stage = 0 | 1 | 2;

export interface WordItem {
  id: string;
  word: string;
  translation: string;
  stage: Stage;
  readingContext: {
    /** The full sentence- / paragraph-like text containing the target word */
    text: string;
    /** The exact substring inside `text` that should be highlighted */
    highlight: string;
    /** A mnemonic joke to help remember the word */
    joke: string;
  };
  quizContext: {
    /** Sentence with a blank (______) in place of the target word */
    textWithBlank: string;
    /** Three options; one of them is `correct` */
    options: string[];
    /** The correct answer */
    correct: string;
  };
  spellContext: {
    /** Chinese hint shown when the user needs to type the word */
    chineseHint: string;
  };
}

export interface WordState {
  words: WordItem[];
  /** Shuffled IDs that determine the feed display order */
  feedOrder: string[];
  /** IDs of fully mastered words (removed from the active feed) */
  masteredIds: string[];

  /* ---------- actions ---------- */
  shuffleFeed: () => void;
  markAsRead: (id: string) => void;
  markQuizCorrect: (id: string) => void;
  markSpellCorrect: (id: string) => void;
  resetAll: () => void;
}

/* ------------------------------------------------------------------ */
/*  Fisher-Yates shuffle                                               */
/* ------------------------------------------------------------------ */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------ */
/*  Mock data – 5 IELTS-level words with fun contexts                  */
/* ------------------------------------------------------------------ */
const MOCK_WORDS: WordItem[] = [
  {
    id: 'w1',
    word: 'procrastination',
    translation: '拖延症',
    stage: 0,
    readingContext: {
      text: 'My New Year resolution to stop procrastination is going great… I\'ll start implementing it tomorrow, for real this time.',
      highlight: 'procrastination',
      joke: '🤣 Procrastination is like a credit card — lots of fun until the bill arrives. Future you is NOT going to be happy!',
    },
    quizContext: {
      textWithBlank:
        'Due to chronic ______, she submitted her 10 000-word thesis just three hours before the deadline.',
      options: ['procrastination', 'dedication', 'perspiration'],
      correct: 'procrastination',
    },
    spellContext: {
      chineseHint: 'n. 拖延症（拆解：pro- 向前 + crastinus 明天 → 把事情推到明天）',
    },
  },
  {
    id: 'w2',
    word: 'dismantle',
    translation: '拆除； dismantle dismantle dismantle',
    stage: 0,
    readingContext: {
      text: 'The detective managed to dismantle the suspect\'s ironclad alibi piece by piece until nothing was left.',
      highlight: 'dismantle',
      joke: '🧩 I tried to dismantle my junk-food addiction, but removing the first layer just revealed another layer of snacks. It\'s snacks all the way down!',
    },
    quizContext: {
      textWithBlank:
        'The engineers had to ______ the entire engine block to locate the source of the mysterious rattle.',
      options: ['dismantle', 'dismiss', 'disguise'],
      correct: 'dismantle',
    },
    spellContext: {
      chineseHint: 'v. 拆除； dismantle dismantle dismantle dismantle dismantle（dis- 去掉 + mantle 覆盖物）',
    },
  },
  {
    id: 'w3',
    word: 'ludicrous',
    translation: '荒唐可笑的',
    stage: 0,
    readingContext: {
      text: 'The idea that I would willingly pay $1 000 for a pair of sneakers is absolutely ludicrous — yet here we are.',
      highlight: 'ludicrous',
      joke: '😂 Trying to look cool while falling off a hoverboard is the most ludicrous thing I\'ve ever witnessed. Spoiler: you don\'t look cool.',
    },
    quizContext: {
      textWithBlank:
        'The politician\'s explanation was so ______ that even his own supporters burst out laughing during the press conference.',
      options: ['ludicrous', 'logical', 'luminous'],
      correct: 'ludicrous',
    },
    spellContext: {
      chineseHint: 'adj. 荒唐可笑的（lud- 玩 → 像开玩笑一样荒唐）',
    },
  },
  {
    id: 'w4',
    word: 'ubiquitous',
    translation: '无处不在的',
    stage: 0,
    readingContext: {
      text: 'In the modern open-plan office, standing desks and noise-cancelling headphones have become almost ubiquitous.',
      highlight: 'ubiquitous',
      joke: '🌍 Bad opinions on the internet are as ubiquitous as oxygen — you can\'t escape them no matter where you go. Just breathe and scroll past.',
    },
    quizContext: {
      textWithBlank:
        'Smartphones have become so ______ that most people feel physically lost without them for more than five minutes.',
      options: ['ubiquitous', 'ultimate', 'unanimous'],
      correct: 'ubiquitous',
    },
    spellContext: {
      chineseHint: 'adj. 无处不在的（ubi- 哪里 + -quous 到处 → 到处都有）',
    },
  },
  {
    id: 'w5',
    word: 'meticulous',
    translation: '一丝不苟的；谨小慎微的',
    stage: 0,
    readingContext: {
      text: 'She was so meticulous about her bullet journal that she colour-coded her grocery list by food group.',
      highlight: 'meticulous',
      joke: '📋 Being meticulous about cleaning your room doesn\'t count if you just reorganise the mess into aesthetically pleasing piles. I see you, Marie Kondo wannabe.',
    },
    quizContext: {
      textWithBlank:
        'The surgeon\'s ______ pre-operative planning ensured the twelve-hour transplant surgery was a flawless success.',
      options: ['meticulous', 'magnificent', 'mysterious'],
      correct: 'meticulous',
    },
    spellContext: {
      chineseHint: 'adj. 一丝不苟的（met- 害怕 + -icul- 小细节 → 连小细节都怕出错）',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */
export const useWordStore = create<WordState>((set, get) => ({
  words: MOCK_WORDS.map((w) => ({ ...w })),
  feedOrder: shuffle(MOCK_WORDS.map((w) => w.id)),
  masteredIds: [],

  shuffleFeed: () => {
    const { words, masteredIds } = get();
    const active = words
      .filter((w) => !masteredIds.includes(w.id))
      .map((w) => w.id);
    set({ feedOrder: shuffle(active) });
  },

  markAsRead: (id) => {
    set((s) => ({
      words: s.words.map((w) => (w.id === id ? { ...w, stage: 1 as Stage } : w)),
    }));
  },

  markQuizCorrect: (id) => {
    set((s) => ({
      words: s.words.map((w) => (w.id === id ? { ...w, stage: 2 as Stage } : w)),
    }));
  },

  markSpellCorrect: (id) => {
    set((s) => ({
      masteredIds: [...s.masteredIds, id],
    }));
  },

  resetAll: () => {
    set({
      words: MOCK_WORDS.map((w) => ({ ...w })),
      feedOrder: shuffle(MOCK_WORDS.map((w) => w.id)),
      masteredIds: [],
    });
  },
}));

/* ---------- convenience selectors ---------- */
export const selectActiveWords = (s: WordState) =>
  s.feedOrder
    .map((id) => s.words.find((w) => w.id === id)!)
    .filter((w) => w && !s.masteredIds.includes(w.id));
