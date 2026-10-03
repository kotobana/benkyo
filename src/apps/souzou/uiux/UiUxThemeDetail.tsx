import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Presentation, 
  Globe, 
  Clock, 
  Users, 
  Lightbulb, 
  Sparkles, 
  FileCode, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Gamepad2,
  BookOpen
} from 'lucide-react';
import { UIUX_MARP_MARKDOWN } from './slidesMarp';

interface UiUxThemeDetailProps {
  onBackToHub: () => void;
  onOpenSlides: () => void;
  onOpenDemo: (demoKey: 'burger' | 'game' | 'school', mode: 'bad' | 'good') => void;
  onOpenAllInOneGame: () => void;
}

export const UiUxThemeDetail: React.FC<UiUxThemeDetailProps> = ({
  onBackToHub,
  onOpenSlides,
  onOpenDemo,
  onOpenAllInOneGame
}) => {
  const [showMarpSnippet, setShowMarpSnippet] = useState(false);

  return (
    <div className="theme-detail-container">
      {/* Navigation Header */}
      <div className="theme-detail-nav">
        <button className="theme-back-btn" onClick={onBackToHub}>
          <ArrowLeft size={16} /> 創造学習 テーマ一覧へ戻る
        </button>
        <span className="theme-step-pill">第1回テーマ（50分枠）</span>
      </div>

      {/* Theme Hero Banner */}
      <div className="theme-hero-header">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>デザインとテクノロジーの探究</span>
        </div>
        <h1>UI/UXってなに？<br />〜だまされない・使いやすいデザインを考えよう〜</h1>
        <p className="hero-description">
          「UI＝見た目やボタン」「UX＝使ったときの気持ち」。<br />
          身近な家電やゲーム、Webサイトを通じて、人の行動を左右するデザインの魔法を解き明かします。
          直感クイズで学び、本物の独立Webサイト（クソUI vs 神UI）を操作して体感しよう！
        </p>

        <div className="hero-quick-meta">
          <span><Clock size={15} /> 想定時間: 50分（講義15分＋体験30分＋まとめ5分）</span>
          <span><Users size={15} /> 対象: 中学生（学力不問・直感で楽しめる）</span>
        </div>
      </div>

      {/* Content Section 1: Lecture Slides (Marp) */}
      <div className="detail-section-card">
        <div className="section-card-header">
          <div className="header-icon slides">
            <Presentation size={24} />
          </div>
          <div>
            <h2>① 講義スライド（15分：直感2択クイズ＆解説）</h2>
            <p>Marp形式で記述された大画面プロジェクター投影用スライドです。</p>
          </div>
        </div>

        <div className="slides-feature-grid">
          <div className="slide-feature-box">
            <strong>💡 直感2択クイズ（3問）</strong>
            <p>電子レンジ・データ削除・ドアの2択で「どっちが使いやすい？」を生徒に挙手・投票。</p>
          </div>
          <div className="slide-feature-box">
            <strong>📱 UIとUXの意味をシンプルに理解</strong>
            <p>「UIは見た目、UXは心」として専門用語抜きで自然に納得。</p>
          </div>
          <div className="slide-feature-box">
            <strong>📝 Marp Markdown対応</strong>
            <p>Marp CLIやVS CodeでPDF/PPTX出力可能なMarkdown形式を採用。</p>
          </div>
        </div>

        <div className="section-actions-row">
          <button className="primary-launch-btn" onClick={onOpenSlides}>
            <Presentation size={18} />
            <span>スライドショーを開始（全画面プロジェクター表示）</span>
          </button>
          <button 
            className="secondary-outline-btn"
            onClick={() => setShowMarpSnippet(!showMarpSnippet)}
          >
            <FileCode size={16} />
            <span>Marp形式の概要を見る</span>
          </button>
        </div>

        {showMarpSnippet && (
          <div className="marp-snippet-preview">
            <div className="snippet-header">
              <span>📄 slides.marp.md （抜粋）</span>
            </div>
            <pre>
              <code>{UIUX_MARP_MARKDOWN.split('\n---\n').slice(0, 3).join('\n---\n')}
              {'\n\n(...全12スライド収録中。スライド画面から全文コピー可能...)'}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Content Section 2: Standalone Demo Web Sites */}
      <div className="detail-section-card highlight-demos">
        <div className="section-card-header">
          <div className="header-icon demos">
            <Globe size={24} />
          </div>
          <div>
            <h2>② 本物の独立Webサイトで体験（30分：クソUI vs 神UI）</h2>
            <p>
              埋め込みフレームではなく、<strong>ブラウザ全画面の独立したWebサイト</strong>として開きます。<br />
              実際に生徒のタブレットで操作して、「うわ、めっちゃ押しにくい！」「神UIにしたらサクサク動く！」をリアルに体感できます。
            </p>
          </div>
        </div>

        <div className="standalone-sites-grid">
          {/* Site 1: Burger Shop */}
          <div className="site-launch-card">
            <div className="site-card-top">
              <span className="site-icon">🍔</span>
              <div>
                <h3>デモ1: ハンバーガー注文サイト</h3>
                <span className="category-tag">モバイルオーダー / ネット注文</span>
              </div>
            </div>
            <p className="site-pitch">
              写真がない、ボタンが米粒サイズ「入」、合計金額が非表示、注文ボタンの真横に「全消去」の罠…！
            </p>
            <div className="site-launch-buttons">
              <button 
                className="launch-site-btn bad"
                onClick={() => onOpenDemo('burger', 'bad')}
                title="イライラバーガーを開く"
              >
                💀 クソUI版を開く
              </button>
              <button 
                className="launch-site-btn good"
                onClick={() => onOpenDemo('burger', 'good')}
                title="スマイルバーガーを開く"
              >
                ✨ 神UI版を開く
              </button>
            </div>
          </div>

          {/* Site 2: Game Registration */}
          <div className="site-launch-card">
            <div className="site-card-top">
              <span className="site-icon">⚔️</span>
              <div>
                <h3>デモ2: ゲーム新規登録フォーム</h3>
                <span className="category-tag">ユーザー登録 / フォーム入力</span>
              </div>
            </div>
            <p className="site-pitch">
              パスワードの厳しいルールを隠しておいて急に怒る、戻るボタンで全消去、米粒チェックボックス…！
            </p>
            <div className="site-launch-buttons">
              <button 
                className="launch-site-btn bad"
                onClick={() => onOpenDemo('game', 'bad')}
              >
                💀 クソUI版を開く
              </button>
              <button 
                className="launch-site-btn good"
                onClick={() => onOpenDemo('game', 'good')}
              >
                ✨ 神UI版を開く
              </button>
            </div>
          </div>

          {/* Site 3: School Renraku */}
          <div className="site-launch-card">
            <div className="site-card-top">
              <span className="site-icon">🏫</span>
              <div>
                <h3>デモ3: 学校連絡・健康提出アプリ</h3>
                <span className="category-tag">日常アプリ / 連絡ネットワーク</span>
              </div>
            </div>
            <p className="site-pitch">
              ボタンを押しても音も色も変わらず無反応で連打、超長文スクロールの一番底に「明日の持ち物」が…！
            </p>
            <div className="site-launch-buttons">
              <button 
                className="launch-site-btn bad"
                onClick={() => onOpenDemo('school', 'bad')}
              >
                💀 クソUI版を開く
              </button>
              <button 
                className="launch-site-btn good"
                onClick={() => onOpenDemo('school', 'good')}
              >
                ✨ 神UI版を開く
              </button>
            </div>
          </div>
        </div>

        {/* All-in-one stage runner button */}
        <div className="all-in-one-game-box">
          <div className="all-in-one-info">
            <Gamepad2 size={24} color="#f38b43" />
            <div>
              <strong>全3ステージ通しプレイモード</strong>
              <p>各ステージの罠を順番にすべて探し出して全クリアを目指すチャレンジモードです。</p>
            </div>
          </div>
          <button className="all-in-one-btn" onClick={onOpenAllInOneGame}>
            通しゲームに挑戦 ➔
          </button>
        </div>
      </div>

      {/* Teacher Guide Box */}
      <div className="detail-section-card teacher-guide-box">
        <div className="guide-header">
          <BookOpen size={20} color="#315e4d" />
          <h3>先生・講師のための50分授業進行ガイド</h3>
        </div>
        <div className="guide-body">
          <div className="timeline-row">
            <span className="timeline-time">00〜15分</span>
            <div className="timeline-content">
              <strong>講義スライドで直感クイズ</strong>
              <p>電子レンジやドアの2択で教室を盛り上げます。「どっちが使いやすかった？なんで？」をペアや全体で発問します。</p>
            </div>
          </div>
          <div className="timeline-row">
            <span className="timeline-time">15〜45分</span>
            <div className="timeline-content">
              <strong>班ごとにタブレットでデモサイト体験</strong>
              <p>まずは「クソUI版」を開かせて「どこがひどいか」を探させます。その後「神UI版」に切り替えて「全然違う！」と感動を味わわせます。</p>
            </div>
          </div>
          <div className="timeline-row">
            <span className="timeline-time">45〜50分</span>
            <div className="timeline-content">
              <strong>まとめスライドで日常のデザイン観察へ</strong>
              <p>「使いやすさは誰かの思いやり」。身の回りの自販機やスマホアプリにも工夫があることを伝えて締めくくります。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
