import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Flame, 
  Trophy, 
  ChevronRight, 
  Eye, 
  BookOpen, 
  HelpCircle
} from 'lucide-react';
import type { KanjiQuestion, QuizMode, QuestionResult } from './types';
import { shuffleQuestionOptions } from './utils';
import kanjiRawList from './data.json';

type Props = {
  onBack: () => void;
};

const QUESTIONS_DATA: KanjiQuestion[] = kanjiRawList as KanjiQuestion[];

// Helper to highlight katakana inside 【...】
function renderSentenceWithHighlight(sentence: string) {
  const parts = sentence.split(/(【[ァ-ヴー]+】)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('【') && part.endsWith('】')) {
          const kana = part.slice(1, -1);
          return (
            <span key={i} className="kanji-kana-badge">
              {kana}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

// Choice labels
const CHOICE_LABELS = ['①', '②', '③', '④'];

export function KanjiApp({ onBack }: Props) {
  const [mode, setMode] = useState<QuizMode>('ten');
  const [questionList, setQuestionList] = useState<KanjiQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<QuestionResult[]>([]);
  const [wrongPool, setWrongPool] = useState<KanjiQuestion[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // 最新の wrongPool を保持する Ref（startQuiz の依存配列から wrongPool を外すため）
  const wrongPoolRef = useRef<KanjiQuestion[]>([]);
  wrongPoolRef.current = wrongPool;

  // Initialize or restart quiz
  const startQuiz = useCallback((selectedMode: QuizMode) => {
    setMode(selectedMode);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setShowAnswer(false);
    setIsFinished(false);

    let pool: KanjiQuestion[] = [];
    if (selectedMode === 'mistakes') {
      const currentWrongs = wrongPoolRef.current;
      if (currentWrongs.length === 0) {
        alert('現在、間違えた問題の履歴はありません。全問からランダムに出題します。');
        pool = [...QUESTIONS_DATA];
      } else {
        pool = [...currentWrongs];
      }
    } else {
      pool = [...QUESTIONS_DATA];
    }

    // Shuffle question order
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = selectedMode === 'ten' ? shuffled.slice(0, 10) : shuffled;

    // 4つの選択肢の並び順を毎回ランダムにシャッフル
    const randomizedQuestions = selected.map(q => shuffleQuestionOptions(q));
    setQuestionList(randomizedQuestions);
  }, []);

  // Initial load（1回のみ実行）
  useEffect(() => {
    startQuiz('ten');
  }, [startQuiz]);

  const currentQ = questionList[currentIndex];

  // Handle selecting an option
  const handleSelectOption = (idx: number) => {
    if (selectedIndex !== null || !currentQ) return;
    setSelectedIndex(idx);

    const isCorrect = idx === currentQ.answerIndex;
    if (isCorrect) {
      setStreak(s => s + 1);
      setShowAnswer(true); // 正解のときは正解表示
    } else {
      setStreak(0);
      setShowAnswer(false); // 不正解のときは最初は回答を伏せておく
      setWrongPool(prev => {
        if (!prev.some(q => q.id === currentQ.id)) {
          return [...prev, currentQ];
        }
        return prev;
      });
    }

    setHistory(prev => [
      ...prev,
      {
        question: currentQ,
        userSelectedIndex: idx,
        isCorrect
      }
    ]);
  };

  // Next Question
  const handleNext = useCallback(() => {
    if (mode === 'ten' && currentIndex + 1 >= questionList.length) {
      setIsFinished(true);
      return;
    }
    if (currentIndex + 1 < questionList.length) {
      setCurrentIndex(c => c + 1);
      setSelectedIndex(null);
      setShowAnswer(false);
    } else {
      // In endless mode, loop or add more with randomized choices
      const reshuffled = [...QUESTIONS_DATA]
        .sort(() => Math.random() - 0.5)
        .map(q => shuffleQuestionOptions(q));
      setQuestionList(reshuffled);
      setCurrentIndex(0);
      setSelectedIndex(null);
      setShowAnswer(false);
    }
  }, [mode, currentIndex, questionList.length]);

  // Keyboard shortcut (Space / Enter for Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex !== null && !isFinished) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, isFinished, handleNext]);

  // Current session stats
  const correctCount = history.filter(h => h.isCorrect).length;
  const totalAnswered = history.length;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  return (
    <div className="kanji-app-container">
      {/* Top Header */}
      <div className="kanji-top-bar">
        <button className="kanji-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> ツール一覧に戻る
        </button>

        <div className="kanji-stats-bar">
          {streak >= 3 && (
            <div className="streak-badge">
              <Flame size={14} className="streak-icon" />
              <span>{streak} 連続正解！</span>
            </div>
          )}
          <div className="stat-pill">
            正答率: <strong>{accuracy}%</strong> ({correctCount}/{totalAnswered})
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="kanji-main-card">
        {/* Sub Header / Mode Switcher */}
        <div className="kanji-header-nav">
          <div className="app-title-group">
            <span className="badge-tag">神奈川県公立高校入試</span>
            <h1>漢字ドリル（問1 形式）</h1>
          </div>

          <div className="mode-tabs">
            <button
              className={`mode-tab ${mode === 'ten' ? 'active' : ''}`}
              onClick={() => startQuiz('ten')}
            >
              10問テスト
            </button>
            <button
              className={`mode-tab ${mode === 'endless' ? 'active' : ''}`}
              onClick={() => startQuiz('endless')}
            >
              エンドレス練習
            </button>
            <button
              className={`mode-tab ${mode === 'mistakes' ? 'active' : ''}`}
              onClick={() => startQuiz('mistakes')}
            >
              復習 ({wrongPool.length})
            </button>
          </div>
        </div>

        {/* Finished / Result Screen */}
        {isFinished ? (
          <div className="kanji-result-view">
            <div className="result-trophy">
              <Trophy size={64} color="#f59e0b" />
            </div>
            <h2>10問テスト終了！</h2>
            <div className="result-score-box">
              <div className="score-main">
                {correctCount} <small>/ 10問 正解</small>
              </div>
              <div className="score-accuracy">正答率: {Math.round((correctCount / 10) * 100)}%</div>
            </div>

            <p className="result-comment">
              {correctCount === 10 && '満点おめでとうございます！神奈川県入試の漢字はバッチリです！🎉'}
              {correctCount >= 8 && correctCount < 10 && '素晴らしい！合格圏内の高い漢字力です！この調子でいきましょう！✨'}
              {correctCount >= 5 && correctCount < 8 && 'よく頑張りました！間違えた漢字を復習してさらに伸ばしましょう！💪'}
              {correctCount < 5 && '何度も繰り返すことで確実に覚えられるようになります。もう一度挑戦してみよう！📖'}
            </p>

            <div className="result-actions">
              <button className="primary-action-btn" onClick={() => startQuiz('ten')}>
                <RotateCcw size={16} /> もう一度10問解く
              </button>
              {wrongPool.length > 0 && (
                <button className="secondary-action-btn" onClick={() => startQuiz('mistakes')}>
                  <BookOpen size={16} /> 間違えた問題（{wrongPool.length}問）を復習
                </button>
              )}
              <button className="quiet-action-btn" onClick={onBack}>
                ツール一覧へ戻る
              </button>
            </div>
          </div>
        ) : currentQ ? (
          /* Active Question View */
          <div className="kanji-quiz-body">
            {/* Progress line */}
            <div className="quiz-progress-meta">
              <span className="q-number">
                {mode === 'ten' ? `第 ${currentIndex + 1} / 10 問` : `第 ${currentIndex + 1} 問`}
              </span>
              <span className="q-hint">
                設問のカタカナと同じ漢字を使う文を、下の①〜④から選んでください。
              </span>
            </div>

            {/* Question Card */}
            <div className="question-prompt-card">
              <div className="q-label">問題</div>
              <div className="q-sentence">
                {renderSentenceWithHighlight(currentQ.qText)}
              </div>
            </div>

            {/* Choices Grid */}
            <div className="choices-grid">
              {currentQ.options.map((optionText, idx) => {
                const isAnswered = selectedIndex !== null;
                const isSelected = selectedIndex === idx;
                const isCorrect = idx === currentQ.answerIndex;
                let btnStateClass = '';

                if (isAnswered) {
                  if (isSelected && isCorrect) {
                    btnStateClass = 'correct-choice';
                  } else if (isSelected && !isCorrect) {
                    btnStateClass = 'wrong-choice';
                  } else if (isCorrect && showAnswer) {
                    btnStateClass = 'reveal-correct-choice';
                  } else {
                    btnStateClass = 'dimmed-choice';
                  }
                }

                return (
                  <button
                    key={idx}
                    className={`choice-card ${btnStateClass}`}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                  >
                    <span className="choice-number">{CHOICE_LABELS[idx]}</span>
                    <span className="choice-text">{renderSentenceWithHighlight(optionText)}</span>
                    {isAnswered && isSelected && isCorrect && (
                      <CheckCircle2 className="choice-status-icon correct" size={20} />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="choice-status-icon wrong" size={20} />
                    )}
                    {isAnswered && !isSelected && isCorrect && showAnswer && (
                      <span className="choice-correct-tag">正解</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer & Explanation Toggle Panel */}
            {selectedIndex !== null && (
              <div className="explanation-panel">
                <div className="explanation-header">
                  <div className="explanation-title">
                    {selectedIndex === currentQ.answerIndex ? (
                      <span className="answer-badge correct">
                        <CheckCircle2 size={16} /> 正解！
                      </span>
                    ) : (
                      <span className="answer-badge wrong">
                        <XCircle size={16} /> 違っています（不正解）
                      </span>
                    )}

                    {showAnswer ? (
                      <span className="answer-kanji-display">
                        問題の漢字: <strong>{currentQ.kanji}</strong>
                        {currentQ.answerWord && <small>（{currentQ.answerWord}）</small>}
                      </span>
                    ) : (
                      <span className="answer-kanji-display muted-prompt">
                        ※回答を確認したい場合はボタンを押してください
                      </span>
                    )}
                  </div>

                  <button
                    className={`toggle-words-btn ${!showAnswer ? 'highlight-open' : ''}`}
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    <Eye size={14} /> {showAnswer ? '回答を隠す' : '正解と解説を見る'}
                  </button>
                </div>

                {showAnswer && (
                  <div className="explanation-content">
                    <p className="explanation-intro">
                      正解は <strong>{CHOICE_LABELS[currentQ.answerIndex]}</strong> です。
                    </p>
                    <div className="words-breakdown">
                      {currentQ.options.map((opt, i) => {
                        const word = currentQ.optionWords ? currentQ.optionWords[i] : null;
                        const isThisCorrect = i === currentQ.answerIndex;
                        return (
                          <div
                            key={i}
                            className={`breakdown-row ${isThisCorrect ? 'highlight-row' : ''}`}
                          >
                            <span className="bd-num">{CHOICE_LABELS[i]}</span>
                            <span className="bd-sentence">{opt}</span>
                            {word && (
                              <span className="bd-word">
                                ➔ <strong>{word}</strong>
                                {isThisCorrect && <span className="target-tag">（{currentQ.kanji}）</span>}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Next Action */}
            <div className="quiz-bottom-actions">
              {selectedIndex === null ? (
                <button
                  className="skip-btn"
                  onClick={() => {
                    handleSelectOption((currentQ.answerIndex + 1) % 4); // mark as incorrect skip
                  }}
                >
                  <HelpCircle size={14} /> 答えを見る（スキップ）
                </button>
              ) : (
                <button className="next-btn" onClick={handleNext}>
                  {mode === 'ten' && currentIndex + 1 >= questionList.length
                    ? '結果を見る'
                    : '次の問題へ'}{' '}
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="loading-box">問題を読み込み中…</div>
        )}
      </div>
    </div>
  );
}
