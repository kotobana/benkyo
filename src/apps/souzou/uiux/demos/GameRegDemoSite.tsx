import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  X, 
  ThumbsUp, 
  ThumbsDown,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { STAGES_DATA, type Flaw } from '../stagesData';

interface GameRegDemoSiteProps {
  initialMode?: 'bad' | 'good';
  onBack: () => void;
}

export const GameRegDemoSite: React.FC<GameRegDemoSiteProps> = ({
  initialMode = 'bad',
  onBack
}) => {
  const [isGoodUi, setIsGoodUi] = useState(initialMode === 'good');
  const [username, setUsername] = useState('勇者タロウ');
  const [password, setPassword] = useState('pass123');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [foundFlaws, setFoundFlaws] = useState<string[]>([]);
  const [activeFlawModal, setActiveFlawModal] = useState<Flaw | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [badErrorShown, setBadErrorShown] = useState(false);

  const stage = STAGES_DATA[1]; // Stage 2: Game Registration
  const flawPassword = stage.flaws.find(f => f.id === 'hidden-password-rules')!;
  const flawBack = stage.flaws.find(f => f.id === 'clear-on-back')!;
  const flawSubmit = stage.flaws.find(f => f.id === 'ambiguous-submit')!;
  const flawTerms = stage.flaws.find(f => f.id === 'tiny-terms-checkbox')!;

  const handleFlawClick = (flaw: Flaw) => {
    if (isGoodUi) return;
    if (!foundFlaws.includes(flaw.id)) {
      setFoundFlaws(prev => [...prev, flaw.id]);
    }
    setActiveFlawModal(flaw);
  };

  // Good UI password validators
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  const handleBadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBadErrorShown(true);
    handleFlawClick(flawPassword);
  };

  const handleGoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasMinLength && hasNumber && hasLetter && termsAgreed) {
      setSubmitSuccess(true);
    }
  };

  return (
    <div className={`standalone-demo-page ${isGoodUi ? 'theme-good-game' : 'theme-bad-game'}`}>
      {/* Floating Workshop Control Bar */}
      <div className="demo-floating-control-bar">
        <div className="control-bar-left">
          <button className="demo-back-btn" onClick={onBack}>
            <ArrowLeft size={16} /> 創造学習に戻る
          </button>
          <span className="demo-stage-badge">
            ⚔️ デモ2: オンラインゲーム会員登録
          </span>
        </div>

        <div className="control-bar-center">
          <div className="demo-mode-switcher">
            <button 
              className={`mode-btn bad ${!isGoodUi ? 'active' : ''}`}
              onClick={() => { setIsGoodUi(false); setSubmitSuccess(false); }}
            >
              <ThumbsDown size={14} /> 💀 クソUI版
            </button>
            <button 
              className={`mode-btn good ${isGoodUi ? 'active' : ''}`}
              onClick={() => { setIsGoodUi(true); setSubmitSuccess(false); setBadErrorShown(false); }}
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
          REAL STANDALONE SITE: GOOD UI (親切なゲーム登録画面)
          ======================================================== */}
      {isGoodUi ? (
        <div className="real-site good-game-site">
          <div className="game-auth-card">
            <div className="auth-card-header">
              <div className="game-logo-badge">⚔️ QUEST LEGENDS ONLINE</div>
              <h2>冒険者アカウント新規作成</h2>
              <p>わずか1分で登録完了！広大な世界へ旅立とう。</p>
            </div>

            {submitSuccess ? (
              <div className="game-reg-success">
                <CheckCircle2 size={48} color="#16a34a" />
                <h3>アカウント作成が完了しました！</h3>
                <p>ようこそ、<strong>{username}</strong> さん！ゲームを開始できます。</p>
                <button className="game-start-btn" onClick={() => setSubmitSuccess(false)}>
                  冒険をはじめる ➔
                </button>
              </div>
            ) : (
              <form onSubmit={handleGoodSubmit} className="good-game-form">
                <div className="form-item">
                  <label htmlFor="good-username">プレイヤー名（ニックネーム）</label>
                  <input 
                    id="good-username"
                    type="text" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="例: レジェンド勇者"
                    required
                  />
                  <small className="field-hint">※ あとからいつでも変更できます</small>
                </div>

                <div className="form-item">
                  <label htmlFor="good-password">パスワード設定</label>
                  <div className="password-input-wrap">
                    <input 
                      id="good-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="8文字以上の英数字"
                      required
                    />
                    <button 
                      type="button" 
                      className="eye-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Realtime Feedback Requirement Chips */}
                  <div className="password-rules-chips">
                    <span className={`rule-chip ${hasMinLength ? 'ok' : ''}`}>
                      {hasMinLength ? <CheckCircle2 size={12} /> : <XCircle size={12} />} 8文字以上
                    </span>
                    <span className={`rule-chip ${hasLetter ? 'ok' : ''}`}>
                      {hasLetter ? <CheckCircle2 size={12} /> : <XCircle size={12} />} 英字を含む
                    </span>
                    <span className={`rule-chip ${hasNumber ? 'ok' : ''}`}>
                      {hasNumber ? <CheckCircle2 size={12} /> : <XCircle size={12} />} 数字を含む
                    </span>
                  </div>
                </div>

                <div className="form-item terms-item">
                  <label className="good-terms-checkbox-label">
                    <input 
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={e => setTermsAgreed(e.target.checked)}
                      required
                    />
                    <span>
                      <a href="#terms" onClick={e => e.preventDefault()}>利用規約</a> と 
                      <a href="#privacy" onClick={e => e.preventDefault()}>プライバシーポリシー</a> に同意します
                    </span>
                  </label>
                </div>

                <div className="form-submit-row">
                  <button 
                    type="submit" 
                    className="good-submit-btn"
                    disabled={!hasMinLength || !hasLetter || !hasNumber || !termsAgreed}
                  >
                    利用規約に同意して冒険を始める ➔
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================
           REAL STANDALONE SITE: BAD UI (悪夢のクソUI登録画面)
           ======================================================== */
        <div className="real-site bad-game-site">
          <div className="bad-site-window">
            <div className="bad-top-nav">
              <div 
                className="bad-back-link clickable-trap"
                onClick={() => {
                  setUsername('');
                  setPassword('');
                  alert('【注意】前のページに戻ったため、これまで入力したデータがすべて消去されました！');
                  handleFlawClick(flawBack);
                }}
                title="クリックして罠を調査"
              >
                ← 戻る（全データ消去）
                {!foundFlaws.includes('clear-on-back') && <span className="trap-pulse-dot" />}
              </div>
              <span>新規ユーザー登録フォーム - SYSTEM ID: #9901</span>
            </div>

            <div className="bad-form-content">
              <h3>アカウント作成手続き</h3>

              {badErrorShown && (
                <div 
                  className="bad-error-banner clickable-trap"
                  onClick={() => handleFlawClick(flawPassword)}
                  title="クリックして罠を調査"
                >
                  【致命的エラー】パスワードが規定を満たしていません！<br />
                  （条件：大文字小文字英数字および特殊記号を各1文字以上含む10文字以上である必要があります）
                  <br /><small>※そんな条件、どこにも書いてないのに急に怒られる！</small>
                  {!foundFlaws.includes('hidden-password-rules') && <span className="trap-pulse-dot" />}
                </div>
              )}

              <form onSubmit={handleBadSubmit}>
                <div className="bad-field">
                  <label>登録名</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>

                <div 
                  className="bad-field clickable-trap"
                  onClick={() => handleFlawClick(flawPassword)}
                  title="クリックして罠を調査"
                >
                  <label>暗証番号（パスワード）</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <small className="bad-hidden-rules">
                    ※ 入力規則はセキュリティ保護のため非公開です。エラー時に確認してください。
                  </small>
                  {!foundFlaws.includes('hidden-password-rules') && <span className="trap-pulse-dot" />}
                </div>

                {/* Tiny Checkbox Trap */}
                <div 
                  className="bad-terms-area clickable-trap"
                  onClick={() => handleFlawClick(flawTerms)}
                  title="クリックして罠を調査"
                >
                  <label className="bad-terms-label">
                    <input 
                      type="checkbox" 
                      className="bad-tiny-checkbox"
                    />
                    <span style={{ fontSize: '9px', color: '#888' }}>
                      第42条第3項に基づく利用規約（全180ページ）を熟読し完全に同意します。
                    </span>
                  </label>
                  {!foundFlaws.includes('tiny-terms-checkbox') && <span className="trap-pulse-dot" />}
                </div>

                {/* Ambiguous Submit Trap Button */}
                <div 
                  className="bad-actions-row clickable-trap"
                  onClick={() => handleFlawClick(flawSubmit)}
                  title="クリックして罠を調査"
                >
                  <button type="submit" className="bad-ambiguous-btn">
                    次へ進む / 登録確認 / 破棄
                  </button>
                  <small style={{ display: 'block', fontSize: '10px', color: '#999', marginTop: 4 }}>
                    ※ どの処理が行われるかはサーバー状態により決定されます
                  </small>
                  {!foundFlaws.includes('ambiguous-submit') && <span className="trap-pulse-dot" />}
                </div>
              </form>
            </div>
          </div>
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
