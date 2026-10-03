import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Presentation, 
  Globe, 
  Clock, 
  Users, 
  Sparkles, 
  FileCode, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { UIUX_MARP_MARKDOWN } from './slidesMarp';

interface UiUxThemeDetailProps {
  onBackToHub: () => void;
  onOpenSlides: () => void;
}

export const UiUxThemeDetail: React.FC<UiUxThemeDetailProps> = ({
  onBackToHub,
  onOpenSlides
}) => {
  const [showMarpSnippet, setShowMarpSnippet] = useState(false);
  const [openTeacherGuideIndex, setOpenTeacherGuideIndex] = useState<number | null>(null);

  const toggleTeacherGuide = (index: number) => {
    setOpenTeacherGuideIndex(current => current === index ? null : index);
  };

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
          Marpスライド講義と、本物の独立Webサイト（クソUI vs 神UI）を体験しよう！
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

      {/* Content Section 2: Real Standalone Demo Web Sites */}
      <div className="detail-section-card highlight-demos">
        <div className="section-card-header">
          <div className="header-icon demos">
            <Globe size={24} />
          </div>
          <div>
            <h2>② 本物の独立Webサイトで体験（30分：クソUI vs 神UI）</h2>
            <p>
              埋め込み式ではなく、<strong>HTML・CSS・JavaScriptが完全に独立した本物のWebサイト</strong>が新しいタブで開きます。<br />
              学習用ポップアップやヒントは一切ありません。生徒が本物のサイトとして触り、先生の問いかけで気づきを深めます。
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
              写真がない、ボタンが極小「入」、合計金額が非表示、注文確定の横に「全取消」の罠ボタン…！
            </p>
            <div className="site-launch-buttons">
              <a 
                href="/demos/burger-bad/"
                target="_blank"
                rel="noopener noreferrer"
                className="launch-site-btn bad"
                title="新しいタブでイライラバーガーを開く"
              >
                💀 クソUI版を開く (別タブ ↗)
              </a>
              <a 
                href="/demos/burger-good/"
                target="_blank"
                rel="noopener noreferrer"
                className="launch-site-btn good"
                title="新しいタブでスマイルバーガーを開く"
              >
                ✨ 神UI版を開く (別タブ ↗)
              </a>
            </div>

            {/* 先生用解説アコーディオン */}
            <div className="teacher-guide-accordion">
              <button 
                className="accordion-toggle" 
                onClick={() => toggleTeacherGuide(1)}
              >
                <HelpCircle size={14} />
                <span>先生用ファシリテーションメモ（罠と解説ポイント）</span>
                {openTeacherGuideIndex === 1 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openTeacherGuideIndex === 1 && (
                <div className="accordion-content">
                  <ul>
                    <li><strong>写真がない：</strong>文字だけでは具材や大きさが想像できない。「どんな味か分からないよね？」と問いかける。</li>
                    <li><strong>極小「入」ボタン：</strong>指で押そうとしても小さすぎて当たらない。押し間違いの原因。</li>
                    <li><strong>合計金額非表示：</strong>買ってみるまでいくら払うか分からない恐怖感。</li>
                    <li><strong>全取消ボタンの配置：</strong>注文確定のすぐ真横に赤い全取消があり、誤操作で全データが消える。</li>
                  </ul>
                </div>
              )}
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
              <a 
                href="/demos/game-bad/"
                target="_blank"
                rel="noopener noreferrer"
                className="launch-site-btn bad"
              >
                💀 クソUI版を開く (別タブ ↗)
              </a>
              <a 
                href="/demos/game-good/"
                target="_blank"
                rel="noopener noreferrer"
                className="launch-site-btn good"
              >
                ✨ 神UI版を開く (別タブ ↗)
              </a>
            </div>

            {/* 先生用解説アコーディオン */}
            <div className="teacher-guide-accordion">
              <button 
                className="accordion-toggle" 
                onClick={() => toggleTeacherGuide(2)}
              >
                <HelpCircle size={14} />
                <span>先生用ファシリテーションメモ（罠と解説ポイント）</span>
                {openTeacherGuideIndex === 2 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openTeacherGuideIndex === 2 && (
                <div className="accordion-content">
                  <ul>
                    <li><strong>後出しパスワード条件：</strong>最初から「英数8文字」と書くべきなのに、送信してから怒られるイライラ。神UIのリアルタイム緑チェックと比較。</li>
                    <li><strong>戻ると全消去：</strong>一度戻ったら全部消えてやり直し。「また最初から！？」という徒労感。</li>
                    <li><strong>米粒チェックボックス：</strong>利用規約が小さすぎて指でチェックできない。</li>
                  </ul>
                </div>
              )}
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
              <a 
                href="/demos/school-bad/"
                target="_blank"
                rel="noopener noreferrer"
                className="launch-site-btn bad"
              >
                💀 クソUI版を開く (別タブ ↗)
              </a>
              <a 
                href="/demos/school-good/"
                target="_blank"
                rel="noopener noreferrer"
                className="launch-site-btn good"
              >
                ✨ 神UI版を開く (別タブ ↗)
              </a>
            </div>

            {/* 先生用解説アコーディオン */}
            <div className="teacher-guide-accordion">
              <button 
                className="accordion-toggle" 
                onClick={() => toggleTeacherGuide(3)}
              >
                <HelpCircle size={14} />
                <span>先生用ファシリテーションメモ（罠と解説ポイント）</span>
                {openTeacherGuideIndex === 3 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openTeacherGuideIndex === 3 && (
                <div className="accordion-content">
                  <ul>
                    <li><strong>無反応ボタン（ノーフィードバック）：</strong>押しても画面も音も変わらないので「押せたのかな？」と何回も連打してしまう。神UIの「提出完了（ポン！）」と比較。</li>
                    <li><strong>一番下に埋もれた最重要連絡：</strong>明日の体操着という一番知りたい情報が長文の奥底にある。神UIのように最上部に赤枠で出すべき。</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Guide Box */}
      <div className="detail-section-card teacher-guide-box">
        <div className="guide-header">
          <BookOpen size={20} color="#315e4d" />
          <h3>先生・講師のための50分授業進行タイムテーブル</h3>
        </div>
        <div className="guide-body">
          <div className="timeline-row">
            <span className="timeline-time">00〜15分</span>
            <div className="timeline-content">
              <strong>Marp講義スライドで直感クイズ</strong>
              <p>電子レンジやドアの2択で教室を盛り上げます。「どっちが使いやすかった？なんで？」をペアや全体で発問し、UIとUXの概念を伝えます。</p>
            </div>
          </div>
          <div className="timeline-row">
            <span className="timeline-time">15〜45分</span>
            <div className="timeline-content">
              <strong>班ごとにタブレットで独立デモサイト体験</strong>
              <p>
                生徒に「クソUI版」のリンクを開かせます。「えーっ！これ写真ないじゃん！」「ボタン小さすぎ！」と声が上がったら大成功です。<br />
                その後「神UI版」を開かせると「うわ、めっちゃ使いやすい！」と劇的な感動が生まれます。
              </p>
            </div>
          </div>
          <div className="timeline-row">
            <span className="timeline-time">45〜50分</span>
            <div className="timeline-content">
              <strong>まとめスライドで日常のデザイン観察へ</strong>
              <p>「使いやすさは誰かの思いやり」。身の回りの自販機やノートの書き方にもUI/UXがあることを伝えて締めくくります。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
