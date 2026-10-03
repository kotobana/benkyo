import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Gamepad2, 
  ArrowLeft,
  Sparkles,
  Play
} from 'lucide-react';
import { UIUX_SLIDES } from './slidesData';

type Props = {
  onBack: () => void;
  onLaunchGame: () => void;
};

export function UiUxSlideDeck({ onBack, onLaunchGame }: Props) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [revealedQuizAnswer, setRevealedQuizAnswer] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<'A' | 'B' | null>(null);
  const [showTeacherNotes, setShowTeacherNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slide = UIUX_SLIDES[currentSlideIndex];
  const totalSlides = UIUX_SLIDES.length;

  // Slide navigation
  const goToNext = () => {
    if (currentSlideIndex + 1 < totalSlides) {
      setCurrentSlideIndex(i => i + 1);
      setRevealedQuizAnswer(false);
      setSelectedQuizOption(null);
    }
  };

  const goToPrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(i => i - 1);
      setRevealedQuizAnswer(false);
      setSelectedQuizOption(null);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className={`slide-deck-wrapper ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {/* Top Slide Control Bar */}
      <div className="slide-deck-header">
        <button className="slide-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> 創造学習ホーム
        </button>

        <div className="slide-progress-indicator">
          <span className="section-pill">{slide.section}</span>
          <span className="slide-counter">{currentSlideIndex + 1} / {totalSlides}</span>
        </div>

        <div className="slide-deck-header-actions">
          <button 
            className={`teacher-notes-toggle ${showTeacherNotes ? 'active' : ''}`}
            onClick={() => setShowTeacherNotes(!showTeacherNotes)}
            title="先生用ファシリテーションメモを表示"
          >
            <Lightbulb size={15} /> {showTeacherNotes ? 'メモを隠す' : '先生用メモ'}
          </button>
          <button className="fullscreen-btn" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Slide Canvas */}
      <div className="slide-canvas">
        {/* Slide Head */}
        <div className="slide-title-block">
          <span className="slide-eyebrow">{slide.section}</span>
          <h1 className="slide-main-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-sub-title">{slide.subtitle}</p>}
        </div>

        {/* Slide Body: Intro Quiz */}
        {slide.type === 'intro-quiz' && slide.quizData && (
          <div className="slide-quiz-content">
            <div className="quiz-question-banner">
              <HelpCircle size={22} className="quiz-q-icon" />
              <span>{slide.quizData.question}</span>
            </div>

            <div className="quiz-options-comparison">
              {/* Option A */}
              <div 
                className={`quiz-card ${selectedQuizOption === 'A' ? 'chosen' : ''} ${revealedQuizAnswer && !slide.quizData.optionA.isRecommended ? 'not-best' : ''}`}
                onClick={() => {
                  setSelectedQuizOption('A');
                  setRevealedQuizAnswer(true);
                }}
              >
                <div className="quiz-card-badge label-a">{slide.quizData.optionA.label}</div>
                <h3>{slide.quizData.optionA.title}</h3>
                <p className="quiz-card-desc">{slide.quizData.optionA.desc}</p>
                <ul className="quiz-card-points">
                  {slide.quizData.optionA.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="quiz-vs-badge">VS</div>

              {/* Option B */}
              <div 
                className={`quiz-card ${selectedQuizOption === 'B' ? 'chosen' : ''} ${revealedQuizAnswer && slide.quizData.optionB.isRecommended ? 'is-best' : ''}`}
                onClick={() => {
                  setSelectedQuizOption('B');
                  setRevealedQuizAnswer(true);
                }}
              >
                <div className="quiz-card-badge label-b">{slide.quizData.optionB.label}</div>
                <h3>{slide.quizData.optionB.title}</h3>
                <p className="quiz-card-desc">{slide.quizData.optionB.desc}</p>
                <ul className="quiz-card-points">
                  {slide.quizData.optionB.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
                {revealedQuizAnswer && slide.quizData.optionB.isRecommended && (
                  <div className="best-choice-banner">
                    <CheckCircle2 size={16} /> こっちがおすすめデザイン！
                  </div>
                )}
              </div>
            </div>

            {/* Explanation reveal */}
            {revealedQuizAnswer ? (
              <div className="quiz-explanation-box">
                <Lightbulb size={20} className="lightbulb-icon" />
                <div>
                  <strong>デザインのポイント：</strong>
                  <p>{slide.quizData.explanation}</p>
                </div>
              </div>
            ) : (
              <div className="quiz-prompt-vote">
                <span>👉 画面の [A] または [B] をクリックして、みんなの意見を確かめてみよう！</span>
              </div>
            )}
          </div>
        )}

        {/* Slide Body: Standard Content */}
        {slide.type !== 'intro-quiz' && slide.contentPoints && (
          <div className="slide-content-points-grid">
            {slide.contentPoints.map((item, idx) => (
              <div className="content-point-card" key={idx}>
                <div className="point-card-header">
                  {item.badge && <span className="point-badge">{item.badge}</span>}
                  <h2>{item.heading}</h2>
                </div>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* Special Launch Game Callout on Slide 11 */}
        {slide.id === 's11' && (
          <div className="slide-launch-game-callout">
            <button className="launch-game-big-btn" onClick={onLaunchGame}>
              <Gamepad2 size={24} /> 『クソUI脱出ゲーム』を始める！
            </button>
            <p>※ タブレットでグループごとにプレイできます</p>
          </div>
        )}
      </div>

      {/* Teacher Notes Drawer */}
      {showTeacherNotes && slide.notesForTeacher && (
        <div className="teacher-notes-bar">
          <div className="notes-tag">💡 先生用ファシリテーションメモ</div>
          <p>{slide.notesForTeacher}</p>
        </div>
      )}

      {/* Slide Navigation Footer Bar */}
      <div className="slide-deck-footer">
        <button 
          className="slide-nav-btn prev"
          onClick={goToPrev}
          disabled={currentSlideIndex === 0}
        >
          <ChevronLeft size={20} /> 前のスライド
        </button>

        {/* Dots indicator */}
        <div className="slide-dots">
          {UIUX_SLIDES.map((_, i) => (
            <span 
              key={i} 
              className={`dot ${i === currentSlideIndex ? 'active' : ''}`}
              onClick={() => {
                setCurrentSlideIndex(i);
                setRevealedQuizAnswer(false);
                setSelectedQuizOption(null);
              }}
            />
          ))}
        </div>

        {currentSlideIndex + 1 === totalSlides ? (
          <button className="slide-nav-btn game-link" onClick={onLaunchGame}>
            <Gamepad2 size={18} /> ゲーム画面へ
          </button>
        ) : (
          <button className="slide-nav-btn next" onClick={goToNext}>
            次のスライド <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
