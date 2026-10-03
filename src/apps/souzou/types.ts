export type Slide = {
  id: string;
  section: string; // e.g., 'イントロ', '解説', 'まとめ'
  title: string;
  subtitle?: string;
  type: 'intro-quiz' | 'content' | 'comparison' | 'summary';
  quizData?: {
    question: string;
    optionA: {
      label: string;
      title: string;
      desc: string;
      isRecommended: boolean;
      points: string[];
    };
    optionB: {
      label: string;
      title: string;
      desc: string;
      isRecommended: boolean;
      points: string[];
    };
    explanation: string;
  };
  contentPoints?: {
    heading: string;
    body: string;
    badge?: string;
  }[];
  notesForTeacher?: string; // 講師用ファシリテーションメモ
};

export type UiUxStage = {
  id: string;
  title: string;
  description: string;
  category: string;
  badUiName: string;
  goodUiName: string;
  flaws: {
    id: string;
    title: string;
    issue: string; // ダメな理由
    fix: string;   // どう直すべきか
    points: number;
  }[];
};
