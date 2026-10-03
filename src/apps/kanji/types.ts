export type KanjiQuestion = {
  id: number;
  kanji: string;
  qText: string;
  qWord?: string;
  options: [string, string, string, string];
  answerIndex: number; // 0, 1, 2, 3
  answerWord: string;
  optionWords?: [string, string, string, string];
};

export type QuizMode = 'ten' | 'endless' | 'mistakes';

export type QuestionResult = {
  question: KanjiQuestion;
  userSelectedIndex: number;
  isCorrect: boolean;
};
