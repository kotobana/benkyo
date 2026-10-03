import React from 'react';
import { 
  Compass, 
  Presentation, 
  Gamepad2, 
  Clock, 
  Users, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Layers, 
  ArrowLeft,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface SouzouHubProps {
  onBackToPortal: () => void;
  onSelectTheme: (themeId: string) => void;
  onQuickOpenSlides?: () => void;
  onQuickOpenGame?: () => void;
}

export const SouzouHub: React.FC<SouzouHubProps> = ({
  onBackToPortal,
  onSelectTheme,
  onQuickOpenSlides,
  onQuickOpenGame
}) => {
  return (
    <div className="souzou-hub-container">
      {/* Navigation Header */}
      <div className="souzou-hub-nav">
        <button className="souzou-back-btn" onClick={onBackToPortal}>
          <ArrowLeft size={16} /> ポータルへ戻る
        </button>
        <span className="souzou-tag">月1回 50分探究プログラム</span>
      </div>

      {/* Hero Banner */}
      <div className="souzou-hero">
        <div className="souzou-hero-content">
          <div className="souzou-hero-badge">
            <Compass size={18} />
            <span>創造学習（そうぞうがくしゅう）</span>
          </div>
          <h1>「なぜ？」から広がる、<br />テクノロジーとデザインの探究</h1>
          <p>
            中学生向けに月1回・50分枠で実施する探究型ワークショップです。<br />
            難しい勉強ではなく、「直感クイズ」と「本物の独立Webサイト」で、<br />
            身近なスマホやアプリの仕組みを楽しく解き明かします。
          </p>
        </div>
      </div>

      {/* Workshop Schedule / Guide Box */}
      <div className="souzou-guide-bar">
        <div className="guide-item">
          <Clock size={20} className="guide-icon" />
          <div>
            <strong>基本時間割（計50分）</strong>
            <p>講義 15分 ➔ 体験ゲーム 30分 ➔ まとめ 5分</p>
          </div>
        </div>
        <div className="guide-item">
          <Users size={20} className="guide-icon" />
          <div>
            <strong>授業スタイル</strong>
            <p>大画面でMarpスライド ＋ 班ごとにタブレットで独立Webサイト</p>
          </div>
        </div>
        <div className="guide-item">
          <Lightbulb size={20} className="guide-icon" />
          <div>
            <strong>指導のポイント</strong>
            <p>知識の暗記ではなく「使ったときの気持ち」を言葉にする</p>
          </div>
        </div>
      </div>

      {/* Workshop Series List */}
      <div className="souzou-sessions-section">
        <h2 className="souzou-section-title">
          <Layers size={22} />
          <span>学習テーマ・教材アーカイブ</span>
        </h2>

        {/* Lesson 1: Active */}
        <div className="souzou-lesson-card current">
          <div className="lesson-badge-row">
            <span className="lesson-status-badge active">
              <Sparkles size={14} /> 第1回（公開中）
            </span>
            <span className="lesson-duration">想定時間: 50分（講義15分＋ゲーム30分＋まとめ5分）</span>
          </div>

          <div className="lesson-main-info">
            <h3>UI/UXってなに？ 〜だまされない・使いやすいデザインを考えよう〜</h3>
            <p className="lesson-desc">
              「UI＝見た目やボタン」「UX＝使ったときの気持ち」。<br />
              身近な家電やゲームの画面を通じて、どうしてデザインが人の行動を左右するのかを学びます。
              Marpスライド講義と、本物の独立Webサイト（クソUI vs 神UI）を体験しよう！
            </p>
          </div>

          {/* Flow preview */}
          <div className="lesson-flow-grid">
            <div className="flow-step">
              <div className="flow-step-num">1</div>
              <div className="flow-step-body">
                <strong>講義（15分）: 直感クイズと解説</strong>
                <p>電子レンジやドアの2択クイズからUI/UXの意味を自然に理解。</p>
              </div>
            </div>
            <div className="flow-step">
              <div className="flow-step-num">2</div>
              <div className="flow-step-body">
                <strong>体験（30分）: 独立デモサイト</strong>
                <p>バーガー注文・登録画面の「イライラする罠」を班で探そう！</p>
              </div>
            </div>
            <div className="flow-step">
              <div className="flow-step-num">3</div>
              <div className="flow-step-body">
                <strong>まとめ（5分）: 見え方が変わる日常</strong>
                <p>「使いやすさは誰かの思いやり」。身の回りのデザインを観察しよう。</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="lesson-actions">
            <button className="souzou-action-btn primary-enter" onClick={() => onSelectTheme('uiux')}>
              <span>第1回の部屋に入る（スライド＆独立デモ）</span>
              <ChevronRight size={18} />
            </button>
            {onQuickOpenSlides && (
              <button className="souzou-action-btn slides" onClick={onQuickOpenSlides}>
                <Presentation size={16} />
                <span>スライド直通</span>
              </button>
            )}
            {onQuickOpenGame && (
              <button className="souzou-action-btn game" onClick={onQuickOpenGame}>
                <Gamepad2 size={16} />
                <span>ゲーム直通</span>
              </button>
            )}
          </div>
        </div>

        {/* Lesson 2: Coming Soon */}
        <div className="souzou-lesson-card upcoming">
          <div className="lesson-badge-row">
            <span className="lesson-status-badge upcoming">
              <Calendar size={14} /> 第2回（次回予定）
            </span>
            <span className="lesson-duration">想定時間: 50分</span>
          </div>

          <div className="lesson-main-info">
            <h3>パスワードとセキュリティ 〜クラッカーからアカウントを守れ！〜</h3>
            <p className="lesson-desc">
              「誕生日」「123456」はどうして危険？パスワード破りシミュレーターを使って、
              ハッカーがどうやってアカウントを乗っ取るかを体験。絶対に破られない強い合言葉の作り方を身につけます。
            </p>
          </div>

          <div className="upcoming-footer">
            <span>✨ 開発中（近日公開予定）</span>
          </div>
        </div>

        {/* Lesson 3: Coming Soon */}
        <div className="souzou-lesson-card upcoming">
          <div className="lesson-badge-row">
            <span className="lesson-status-badge upcoming">
              <Calendar size={14} /> 第3回（計画中）
            </span>
            <span className="lesson-duration">想定時間: 50分</span>
          </div>

          <div className="lesson-main-info">
            <h3>ネットの情報のウソとホント 〜フェイクニュース見分け探偵〜</h3>
            <p className="lesson-desc">
              SNSに流れてくる「驚きのニュース」。AI画像や誇張されたタイトルのトリックを見破り、
              信頼できる情報源を確かめる「ファクトチェック」のスキルをゲーム感覚で体験します。
            </p>
          </div>

          <div className="upcoming-footer">
            <span>✨ 企画進行中</span>
          </div>
        </div>
      </div>

      {/* Teacher Guide Card */}
      <div className="souzou-teacher-tips">
        <div className="teacher-tips-header">
          <BookOpen size={20} />
          <h3>先生・講師の方へ：授業進行のアドバイス</h3>
        </div>
        <div className="tips-content">
          <ul>
            <li>
              <strong>知識の暗記は一切不要です：</strong>
              「どっちが使いやすかった？」「どこでイライラした？」など、感情や直感を言葉にすることを最も大切にしてください。
            </li>
            <li>
              <strong>ゲーム中の声かけ：</strong>
              「うわ、このボタンひどい！」「ここ騙された！」と盛り上がったら大成功です。「じゃあどうしたら良くなる？」と問いかけてみてください。
            </li>
            <li>
              <strong>神UIとの切り替え：</strong>
              ゲーム画面上部の「✨ 神UI版」ボタンを押すと、同じ画面の模範的デザインが表示されます。「全然違う！」という感動を体験させてあげてください。
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
