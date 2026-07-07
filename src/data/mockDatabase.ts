export interface GameWord {
  wordMal: string;
  wordEng: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  vagueHintMal: string;
  vagueHintEng: string;
  clues: string[];
}

export const MOCK_WORDS: GameWord[] = [
  {
    wordMal: 'അലക്കുക',
    wordEng: 'Washing/Beating (Alakkuka)',
    category: 'Action',
    difficulty: 'medium',
    vagueHintMal: 'ഇതൊരു പ്രവൃത്തിയാണ് (It is an action)',
    vagueHintEng: 'It is a physical action',
    clues: [
      'What you do to dirty clothes.',
      'Hostel boys do this before exams... wait, no they don\'t.'
    ]
  },
  {
    wordMal: 'തേപ്പ്',
    wordEng: 'Ironing/Dumping (Theppu)',
    category: 'Relationships / Slang',
    difficulty: 'easy',
    vagueHintMal: 'വസ്ത്രങ്ങളുമായി അല്ലെങ്കിൽ പ്രണയവുമായി ബന്ധപ്പെട്ടത്',
    vagueHintEng: 'Related to clothes or romance',
    clues: [
      'Using an iron box.',
      'When your lover dumps you for someone else.'
    ]
  },
  {
    wordMal: 'കോഴി',
    wordEng: 'Chicken/Flirt (Kozhi)',
    category: 'Animals / Slang',
    difficulty: 'easy',
    vagueHintMal: 'ഒരു ജീവി',
    vagueHintEng: 'A living creature',
    clues: [
      'A bird that gives eggs.',
      'A guy who is always trying to flirt with girls.'
    ]
  },
  {
    wordMal: 'പണി പാളി',
    wordEng: 'Plan Failed (Pani Paali)',
    category: 'Situations',
    difficulty: 'medium',
    vagueHintMal: 'ഒരു മോശം അവസ്ഥ',
    vagueHintEng: 'A bad situation',
    clues: [
      'When you get caught doing something wrong.',
      'A famous phrase when the plan completely fails.'
    ]
  },
  {
    wordMal: 'കട്ടൻ',
    wordEng: 'Black Tea (Kattan)',
    category: 'Drinks',
    difficulty: 'easy',
    vagueHintMal: 'കുടിക്കുന്ന എന്തോ ഒന്ന്',
    vagueHintEng: 'Something you drink',
    clues: [
      'Tea without milk.',
      'The fuel of a Malayali programmer.'
    ]
  }
];

export const CATEGORIES = Array.from(new Set(MOCK_WORDS.map(w => w.category)));
