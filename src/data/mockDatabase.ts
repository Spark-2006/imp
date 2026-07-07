export interface GameWord {
  word: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  clues: string[];
}

export const MOCK_WORDS: GameWord[] = [
  {
    word: 'അലക്കുക (Alakkuka)',
    category: 'College Slang / Action',
    difficulty: 'medium',
    clues: [
      'It means washing clothes, but we use it for beating someone up.',
      'What you do to dirty clothes.',
      'Hostel boys do this before exams... wait, no they don\'t.'
    ]
  },
  {
    word: 'തേപ്പ് (Theppu)',
    category: 'Relationships / Slang',
    difficulty: 'easy',
    clues: [
      'Using an iron box.',
      'When your lover dumps you for someone else.',
      'The most painful experience for a Kerala college student.'
    ]
  },
  {
    word: 'കോഴി (Kozhi)',
    category: 'Animals / Slang',
    difficulty: 'easy',
    clues: [
      'A bird that gives eggs.',
      'A guy who is always trying to flirt with girls.',
      'Often found roaming around the ladies hostel.'
    ]
  },
  {
    word: 'പണി പാളി (Pani Paali)',
    category: 'Situations',
    difficulty: 'medium',
    clues: [
      'Work got ruined.',
      'When you get caught doing something wrong.',
      'A famous phrase when the plan completely fails.'
    ]
  },
  {
    word: 'വെള്ളമടി (Vellamadi)',
    category: 'Action',
    difficulty: 'hard',
    clues: [
      'Hitting water.',
      'What uncles do at the beverage outlet.',
      'Drinking alcohol.'
    ]
  },
  {
    word: 'കട്ടൻ (Kattan)',
    category: 'Drinks',
    difficulty: 'easy',
    clues: [
      'Black.',
      'Tea without milk.',
      'The fuel of a Malayali programmer.'
    ]
  }
];

export const CATEGORIES = Array.from(new Set(MOCK_WORDS.map(w => w.category)));
