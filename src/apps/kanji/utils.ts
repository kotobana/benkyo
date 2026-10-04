import type { KanjiQuestion } from './types';

/**
 * 問題の4つの選択肢（options）、正解番号（answerIndex）、各選択肢の解説単語（optionWords）を
 * ランダムに並び替える（毎回ランダム化）
 */
export function shuffleQuestionOptions(q: KanjiQuestion): KanjiQuestion {
  // インデックス [0, 1, 2, 3] を Fisher-Yates アルゴリズムでシャッフル
  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = indices[i];
    indices[i] = indices[j];
    indices[j] = temp;
  }

  const newOptions = indices.map(i => q.options[i]) as [string, string, string, string];
  const newAnswerIndex = indices.indexOf(q.answerIndex);
  const newOptionWords = q.optionWords
    ? (indices.map(i => q.optionWords![i]) as [string, string, string, string])
    : undefined;

  return {
    ...q,
    options: newOptions,
    answerIndex: newAnswerIndex,
    optionWords: newOptionWords,
  };
}
