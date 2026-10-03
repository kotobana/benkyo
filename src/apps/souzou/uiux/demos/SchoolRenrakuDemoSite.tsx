import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ThumbsUp, 
  ThumbsDown,
  Calendar,
  FileText,
  AlertCircle,
  Bell
} from 'lucide-react';
import { STAGES_DATA, type Flaw } from '../stagesData';

interface SchoolRenrakuDemoSiteProps {
  initialMode?: 'bad' | 'good';
  onBack: () => void;
}

export const SchoolRenrakuDemoSite: React.FC<SchoolRenrakuDemoSiteProps> = ({
  initialMode = 'bad',
  onBack
}) => {
  const [isGoodUi, setIsGoodUi] = useState(initialMode === 'good');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [badClickCount, setBadClickCount] = useState(0);
  const [foundFlaws, setFoundFlaws] = useState<string[]>([]);
  const [activeFlawModal, setActiveFlawModal] = useState<Flaw | null>(null);

  const stage = STAGES_DATA[2]; // Stage 3: School Renraku App
  const flawFeedback = stage.flaws.find(f => f.id === 'no-feedback-buttons')!;
  const flawBuried = stage.flaws.find(f => f.id === 'buried-important-info')!;

  const handleFlawClick = (flaw: Flaw) => {
    if (isGoodUi) return;
    if (!foundFlaws.includes(flaw.id)) {
      setFoundFlaws(prev => [...prev, flaw.id]);
    }
    setActiveFlawModal(flaw);
  };

  const handleBadBtnClick = () => {
    setBadClickCount(c => c + 1);
    // 押しても何の反応もしない（無反応）
    handleFlawClick(flawFeedback);
  };

  return (
    <div className={`standalone-demo-page ${isGoodUi ? 'theme-good-school' : 'theme-bad-school'}`}>
      {/* Floating Workshop Control Bar */}
      <div className="demo-floating-control-bar">
        <div className="control-bar-left">
          <button className="demo-back-btn" onClick={onBack}>
            <ArrowLeft size={16} /> 創造学習に戻る
          </button>
          <span className="demo-stage-badge">
            🏫 デモ3: 学校連絡・出席健康アプリ
          </span>
        </div>

        <div className="control-bar-center">
          <div className="demo-mode-switcher">
            <button 
              className={`mode-btn bad ${!isGoodUi ? 'active' : ''}`}
              onClick={() => { setIsGoodUi(false); setHasSubmitted(false); setBadClickCount(0); }}
            >
              <ThumbsDown size={14} /> 💀 クソUI版
            </button>
            <button 
              className={`mode-btn good ${isGoodUi ? 'active' : ''}`}
              onClick={() => { setIsGoodUi(true); setHasSubmitted(false); }}
            >
              <ThumbsUp size={14} /> ✨ 神UI版（改善後）
            </button>
          </div>
        </div>

        <div className="control-bar-right">
          {!isGoodUi ? (
            <span className="flaws-found-chip">
              発見した罠: <strong>{foundFlaws.length}</strong> / {stage.flaws.length}
            </span>
          ) : (
            <span className="good-ui-chip">
              <Sparkles size={14} /> 神UI体験中
            </span>
          )}
        </div>
      </div>

      {/* ========================================================
          REAL STANDALONE SITE: GOOD UI (親切な学校連絡アプリ)
          ======================================================== */}
      {isGoodUi ? (
        <div className="real-site good-school-site">
          <header className="school-app-header">
            <div className="header-brand">
              <span className="app-icon">🏫</span>
              <h1>青葉中学校 連絡ネットワーク</h1>
            </div>
            <span className="user-badge">3年2組 出席番号14番</span>
          </header>

          <main className="school-main-container">
            {/* Top Important Notice Alert Banner (重要情報は一番上！) */}
            <div className="urgent-alert-box">
              <div className="alert-badge">
                <AlertCircle size={18} />
                <span>明日の最重要持ち物・連絡</span>
              </div>
              <p className="urgent-body">
                <strong>【明日（木曜）の持ち物：体操着・体育館シューズ】</strong><br />
                午前中に体力測定を実施します。忘れ物のないよう準備してください。
              </p>
            </div>

            {/* Attendance & Health Card Action Card */}
            <div className="attendance-card">
              <div className="attendance-card-header">
                <h3>📋 本日の出席・健康状態チェック</h3>
                <span className="date-tag">本日 10月4日(金)</span>
              </div>

              {hasSubmitted ? (
                <div className="submission-confirmed-box">
                  <CheckCircle2 size={36} color="#16a34a" />
                  <div>
                    <strong>提出が完了しました！（8:12 記録済み）</strong>
                    <p>本日も元気に行ってらっしゃい！体調に気をつけて過ごしましょう。</p>
                  </div>
                </div>
              ) : (
                <div className="attendance-inputs-wrap">
                  <div className="temp-row">
                    <span>今朝の体温:</span>
                    <strong className="temp-val">36.5 ℃</strong>
                    <span className="health-ok-badge">異常なし（良好）</span>
                  </div>
                  <button 
                    className="interactive-submit-btn"
                    onClick={() => setHasSubmitted(true)}
                  >
                    <CheckCircle2 size={18} /> 健康カードを提出する（ポン！と反応）
                  </button>
                </div>
              )}
            </div>

            {/* General Announcements */}
            <div className="general-notices-section">
              <h3>学校からのお便り・連絡事項</h3>
              <div className="notice-item">
                <FileText size={18} className="doc-icon" />
                <div>
                  <strong>進路説明会のご案内（保護者用配布物）</strong>
                  <p>来週水曜日の進路説明会に関する案内プリントをPDFで掲載しました。</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        /* ========================================================
           REAL STANDALONE SITE: BAD UI (悪夢の学校連絡アプリ)
           ======================================================== */
        <div className="real-site bad-school-site">
          <header className="bad-school-header">
            <h3>学務情報・健康連絡システム（ver 1.02b）</h3>
          </header>

          <main className="bad-school-container">
            <div className="bad-intro">
              連絡事項一覧および日々の送信手続きを行ってください。
            </div>

            {/* No Feedback Dead Button Trap */}
            <div 
              className="bad-card-action clickable-trap"
              onClick={handleBadBtnClick}
              title="クリックして罠を調査"
            >
              <div className="dead-btn-label">
                【健康観察カードの送信】
              </div>
              <button className="bad-dead-btn">
                提出（クリックしても音も色も変わらず完全に無反応）
              </button>
              {badClickCount > 0 && (
                <div className="bad-confusion-note">
                  （現在 {badClickCount} 回押されましたが、画面は何も変わりません！「あれ？押せてないのかな？」と何度も連打してしまいます）
                </div>
              )}
              {!foundFlaws.includes('no-feedback-buttons') && <span className="trap-pulse-dot" />}
            </div>

            {/* Long Scroll of useless text */}
            <div className="bad-scroll-content">
              <h4>学校教育目標及び重点施策に関する年度報告書抜粋</h4>
              <p>
                本校におきましては、知・徳・体の調和のとれた心豊かな人間の育成を目指し、地域社会との緊密な連携のもと、教育活動を展開してまいりました。昨今における生徒の自主的・主体的態度の育成に関しては、各学年および分掌組織が一体となり、日々の指導法の改善と充実を図っているところであります。
              </p>
              <p>
                また、学習指導要領の趣旨を踏まえ、探究型学習の導入や情報活用能力の育成にも力を注いでおり、各教科における指導案の見直しや評価方法の再検討を進めております。生徒一人ひとりの個性を伸長させ、社会の変化に柔軟に対応できる資質・能力を育むため、今後とも保護者の皆様の温かいご理解とご協力を賜りますようお願い申し上げます。
              </p>
              <p>
                （中略…さらに延々と学校の沿革や規約が画面をスクロールしてもスクロールしても続きます…）
              </p>
              <p>
                環境整備事業につきましても、夏季休業期間中を利用した校舎一部の改修工事が滞りなく完了し、生徒の学習環境の向上に寄与するものと期待されております。
              </p>

              {/* Buried Important Info at bottom trap */}
              <div 
                className="buried-info-box clickable-trap"
                onClick={() => handleFlawClick(flawBuried)}
                title="クリックして罠を調査"
              >
                <small style={{ color: '#999', display: 'block', marginBottom: 4 }}>
                  （※こんな超長文を一番下までスクロールして初めて発見できる…）
                </small>
                <strong>【明日の重要持ち物：体操着・体育館シューズ】</strong>
                <p>※こんな場所にあったら誰も気づきません！全員忘れ物してしまいます！</p>
                {!foundFlaws.includes('buried-important-info') && <span className="trap-pulse-dot" />}
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Flaw Discovery Popup Modal */}
      {activeFlawModal && (
        <div className="demo-modal-overlay" onClick={() => setActiveFlawModal(null)}>
          <div className="demo-modal-card" onClick={e => e.stopPropagation()}>
            <div className="demo-modal-header">
              <span className="demo-modal-badge">🎉 罠を発見しました！</span>
              <button className="demo-modal-close" onClick={() => setActiveFlawModal(null)}>
                <X size={18} />
              </button>
            </div>

            <h3>{activeFlawModal.name}</h3>

            <div className="demo-modal-box bad">
              <strong>💀 なんでダメなの？（悪いUX）</strong>
              <p>{activeFlawModal.explanation}</p>
            </div>

            <div className="demo-modal-box good">
              <strong>✨ どう直すべき？（神UIの知恵）</strong>
              <p>{activeFlawModal.howToFix}</p>
            </div>

            <div className="demo-modal-footer">
              <button 
                className="demo-switch-good-btn"
                onClick={() => {
                  setIsGoodUi(true);
                  setActiveFlawModal(null);
                }}
              >
                ✨ 神UI版に切り替えて本物の改善を見る！
              </button>
              <button className="demo-stay-btn" onClick={() => setActiveFlawModal(null)}>
                このまま調査を続ける
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
