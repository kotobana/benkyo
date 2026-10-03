import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  Trophy, 
  ChevronRight, 
  ShoppingBag, 
  UserCheck, 
  Calendar, 
  Eye, 
  EyeOff, 
  Flame, 
  X,
  SlidersHorizontal,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { STAGES_DATA, type StageData, type Flaw } from './stagesData';

type Props = {
  onBack: () => void;
  onOpenSlides: () => void;
};

export function UiUxGame({ onBack, onOpenSlides }: Props) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isGoodUiMode, setIsGoodUiMode] = useState(false);
  const [foundFlaws, setFoundFlaws] = useState<Record<string, string[]>>({
    'stage-burger': [],
    'stage-game-reg': [],
    'stage-school-app': []
  });
  const [activeModalFlaw, setActiveModalFlaw] = useState<Flaw | null>(null);
  const [showClearScreen, setShowClearScreen] = useState(false);

  const stage = STAGES_DATA[currentStageIndex];
  const stageFound = foundFlaws[stage.id] || [];
  const allFoundForStage = stageFound.length === stage.flaws.length;

  // Handle clicking a flaw target in Bad UI mode
  const handleFlawClick = (flaw: Flaw) => {
    if (isGoodUiMode) return; // Only discoverable in Bad UI mode
    if (!stageFound.includes(flaw.id)) {
      setFoundFlaws(prev => ({
        ...prev,
        [stage.id]: [...prev[stage.id], flaw.id]
      }));
    }
    setActiveModalFlaw(flaw);
  };

  // Check total completion
  const totalFlawsCount = STAGES_DATA.reduce((acc, s) => acc + s.flaws.length, 0);
  const totalFoundCount = Object.values(foundFlaws).reduce((acc, arr) => acc + arr.length, 0);

  const handleNextStage = () => {
    setActiveModalFlaw(null);
    if (currentStageIndex + 1 < STAGES_DATA.length) {
      setCurrentStageIndex(i => i + 1);
      setIsGoodUiMode(false);
    } else {
      setShowClearScreen(true);
    }
  };

  return (
    <div className="uiux-game-container">
      {/* Top Bar */}
      <div className="game-top-bar">
        <div className="top-nav-buttons">
          <button className="game-back-btn" onClick={onBack}>
            <ArrowLeft size={16} /> 創造学習ホーム
          </button>
          <button className="game-slides-link-btn" onClick={onOpenSlides}>
            📖 講義スライドを見る
          </button>
        </div>

        <div className="game-progress-stats">
          <span className="flaws-total-badge">
            見つけた罠: <strong>{totalFoundCount}</strong> / {totalFlawsCount} 個
          </span>
        </div>
      </div>

      {/* Main Game Card */}
      <div className="game-main-card">
        {/* Stage Selection & Mode Switcher */}
        <div className="game-stage-header">
          <div className="stage-tabs">
            {STAGES_DATA.map((stg, i) => {
              const isCleared = (foundFlaws[stg.id] || []).length === stg.flaws.length;
              return (
                <button
                  key={stg.id}
                  className={`stage-tab ${currentStageIndex === i ? 'active' : ''} ${isCleared ? 'cleared' : ''}`}
                  onClick={() => {
                    setCurrentStageIndex(i);
                    setIsGoodUiMode(false);
                  }}
                >
                  <span className="stage-tab-num">Stage {stg.number}</span>
                  <span className="stage-tab-title">{stg.title}</span>
                  {isCleared && <CheckCircle2 size={14} className="tab-cleared-icon" />}
                </button>
              );
            })}
          </div>

          {/* Good UI / Bad UI Mode Toggle Switch */}
          <div className="ui-mode-toggle-card">
            <span className="toggle-label">表示モード:</span>
            <div className="mode-toggle-pill">
              <button
                className={`mode-pill-btn bad ${!isGoodUiMode ? 'active' : ''}`}
                onClick={() => setIsGoodUiMode(false)}
              >
                <ThumbsDown size={14} /> 💀 クソUI版
              </button>
              <button
                className={`mode-pill-btn good ${isGoodUiMode ? 'active' : ''}`}
                onClick={() => setIsGoodUiMode(true)}
              >
                <ThumbsUp size={14} /> ✨ 神UI版（改善後）
              </button>
            </div>
          </div>
        </div>

        {/* Stage Briefing Box */}
        <div className={`stage-banner ${isGoodUiMode ? 'good-banner' : 'bad-banner'}`}>
          <div className="stage-banner-left">
            <h2>{isGoodUiMode ? stage.goodUiName : stage.badUiName}</h2>
            <p>{stage.situation}</p>
          </div>
          <div className="stage-flaw-checklist">
            <div className="checklist-title">
              {isGoodUiMode ? '✨ 改善されたポイント' : '💀 潜んでいる罠を探せ！'} ({stageFound.length}/{stage.flaws.length})
            </div>
            <div className="checklist-items">
              {stage.flaws.map(f => {
                const found = stageFound.includes(f.id);
                return (
                  <span key={f.id} className={`flaw-chip ${found ? 'found' : ''}`}>
                    {found ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {found ? f.name : '？？？？'}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Site Simulation Viewport */}
        <div className="site-viewport-container">
          <div className="browser-mock-bar">
            <div className="browser-dots">
              <span className="b-dot red" />
              <span className="b-dot yellow" />
              <span className="b-dot green" />
            </div>
            <div className="browser-url-bar">
              https://{stage.id}.example.com/{isGoodUiMode ? 'good-ui' : 'bad-ui'}
            </div>
          </div>

          <div className="mock-site-canvas">
            {/* STAGE 1: Burger Site */}
            {stage.id === 'stage-burger' && (
              <BurgerSiteSimulation 
                isGoodUi={isGoodUiMode}
                onFlawClick={handleFlawClick}
                foundFlaws={stageFound}
              />
            )}

            {/* STAGE 2: Game Registration */}
            {stage.id === 'stage-game-reg' && (
              <GameRegSimulation 
                isGoodUi={isGoodUiMode}
                onFlawClick={handleFlawClick}
                foundFlaws={stageFound}
              />
            )}

            {/* STAGE 3: School App */}
            {stage.id === 'stage-school-app' && (
              <SchoolAppSimulation 
                isGoodUi={isGoodUiMode}
                onFlawClick={handleFlawClick}
                foundFlaws={stageFound}
              />
            )}
          </div>
        </div>

        {/* Bottom Bar: Status & Next */}
        <div className="game-bottom-bar">
          <div className="game-status-hint">
            {!isGoodUiMode ? (
              <span>💡 クソUI版の画面内にある<strong>「使いづらい！」「押しにくい！」</strong>と思う場所をクリックしてみてね！</span>
            ) : (
              <span>✨ 神UI版です！どこが使いやすくなったか、上のボタンでクソUI版と見比べてみよう！</span>
            )}
          </div>

          {allFoundForStage && (
            <button className="next-stage-btn" onClick={handleNextStage}>
              {currentStageIndex + 1 < STAGES_DATA.length ? '次のステージへ進む ➔' : '全ステージ制覇！結果を見る 🏆'}
            </button>
          )}
        </div>
      </div>

      {/* Flaw Discovery Popup Modal */}
      {activeModalFlaw && (
        <div className="modal-backdrop" onClick={() => setActiveModalFlaw(null)}>
          <div className="flaw-modal" onClick={e => e.stopPropagation()}>
            <div className="flaw-modal-header">
              <div className="flaw-modal-badge">🎉 罠を発見！</div>
              <button className="flaw-modal-close" onClick={() => setActiveModalFlaw(null)}>
                <X size={18} />
              </button>
            </div>

            <h2>{activeModalFlaw.name}</h2>

            <div className="flaw-card-box bad-box">
              <div className="box-title">💀 なんでダメなの？（悪いUX）</div>
              <p>{activeModalFlaw.explanation}</p>
            </div>

            <div className="flaw-card-box good-box">
              <div className="box-title">✨ どう直すべき？（神UIの知恵）</div>
              <p>{activeModalFlaw.howToFix}</p>
            </div>

            <div className="flaw-modal-actions">
              <button 
                className="switch-to-good-btn"
                onClick={() => {
                  setIsGoodUiMode(true);
                  setActiveModalFlaw(null);
                }}
              >
                ✨ 神UI版に切り替えて確認する！
              </button>
              <button className="modal-confirm-btn" onClick={() => setActiveModalFlaw(null)}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Clear Celebration View */}
      {showClearScreen && (
        <div className="modal-backdrop">
          <div className="flaw-modal clear-modal">
            <Trophy size={64} color="#f59e0b" style={{ margin: '0 auto 16px' }} />
            <h2>脱出大成功！全ステージ制覇！</h2>
            <p className="clear-comment">
              おめでとうございます！すべてのクソUIの罠を見つけ出しました！<br />
              みんなはもう、使う人の気持ちがわかる<strong>立派なUI/UXデザイナー</strong>です！✨
            </p>

            <div className="clear-actions">
              <button 
                className="switch-to-good-btn"
                onClick={() => {
                  setShowClearScreen(false);
                  onOpenSlides();
                }}
              >
                📖 まとめスライドを見る
              </button>
              <button 
                className="modal-confirm-btn"
                onClick={() => {
                  setShowClearScreen(false);
                  setCurrentStageIndex(0);
                  setIsGoodUiMode(false);
                }}
              >
                もう一度遊ぶ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Stage 1: Burger Site Simulation
   ========================================================================== */
function BurgerSiteSimulation({ 
  isGoodUi, 
  onFlawClick, 
  foundFlaws 
}: { 
  isGoodUi: boolean; 
  onFlawClick: (f: Flaw) => void;
  foundFlaws: string[];
}) {
  const [cartCount, setCartCount] = useState(1);
  const stage = STAGES_DATA[0];

  const flawNoPhoto = stage.flaws.find(f => f.id === 'no-photo')!;
  const flawTinyBtn = stage.flaws.find(f => f.id === 'tiny-button')!;
  const flawHiddenTotal = stage.flaws.find(f => f.id === 'hidden-total')!;
  const flawTrapCancel = stage.flaws.find(f => f.id === 'trap-cancel-btn')!;

  return (
    <div className={`site-sim burger-sim ${isGoodUi ? 'good-sim' : 'bad-sim'}`}>
      <div className="sim-header">
        <div className="sim-brand">🍔 {isGoodUi ? 'Smile Burger' : 'Burger Shop'}</div>
        {isGoodUi && <div className="sim-cart-badge">🛒 カート ({cartCount})</div>}
      </div>

      <div className="sim-body">
        {/* Menu Items */}
        <div className="menu-grid">
          {/* Item 1 */}
          <div className="menu-card">
            {/* Photo area */}
            <div 
              className={`menu-img-box ${!isGoodUi ? 'clickable-trap' : ''}`}
              onClick={() => !isGoodUi && onFlawClick(flawNoPhoto)}
              title={!isGoodUi ? 'ここをクリックして罠を調査' : ''}
            >
              {isGoodUi ? (
                <div className="good-photo">🍔 特製てりやきバーガー</div>
              ) : (
                <div className="bad-photo">
                  [ 写真なし / NO IMAGE ]
                  {!foundFlaws.includes('no-photo') && <span className="trap-pulse-dot" />}
                </div>
              )}
            </div>

            <div className="menu-info">
              <h4>てりやきビーフバーガー</h4>
              <p className="menu-desc">
                {isGoodUi ? '特製甘辛醤油ダレにたっぷりレタスとビーフ100%パティ！' : '牛肉とパンと野菜'}
              </p>
              <div className="menu-price">¥580</div>

              {/* Add to cart button */}
              <div className="cart-btn-wrapper">
                {isGoodUi ? (
                  <button className="good-cart-btn" onClick={() => setCartCount(c => c + 1)}>
                    ＋ カートに追加
                  </button>
                ) : (
                  <button 
                    className="bad-tiny-btn clickable-trap"
                    onClick={() => onFlawClick(flawTinyBtn)}
                    title="ここをクリックして罠を調査"
                  >
                    入
                    {!foundFlaws.includes('tiny-button') && <span className="trap-pulse-dot" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="menu-card">
            <div 
              className={`menu-img-box ${!isGoodUi ? 'clickable-trap' : ''}`}
              onClick={() => !isGoodUi && onFlawClick(flawNoPhoto)}
            >
              {isGoodUi ? (
                <div className="good-photo">🍟 カリカリポテト(M)</div>
              ) : (
                <div className="bad-photo">[ 写真なし ]</div>
              )}
            </div>
            <div className="menu-info">
              <h4>フライドポテト</h4>
              <p className="menu-desc">
                {isGoodUi ? '外はカリッと、中はホクホクの揚げたて塩ポテト。' : '芋の油揚げ'}
              </p>
              <div className="menu-price">¥320</div>

              <div className="cart-btn-wrapper">
                {isGoodUi ? (
                  <button className="good-cart-btn" onClick={() => setCartCount(c => c + 1)}>
                    ＋ カートに追加
                  </button>
                ) : (
                  <button 
                    className="bad-tiny-btn clickable-trap"
                    onClick={() => onFlawClick(flawTinyBtn)}
                  >
                    入
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Total Price Area */}
        <div 
          className={`total-price-bar ${!isGoodUi ? 'clickable-trap' : ''}`}
          onClick={() => !isGoodUi && onFlawClick(flawHiddenTotal)}
          title={!isGoodUi ? 'ここをクリックして罠を調査' : ''}
        >
          {isGoodUi ? (
            <div className="good-total-box">
              <span>現在の合計 ({cartCount}点):</span>
              <strong className="total-amount">¥{580 + (cartCount - 1) * 320}</strong>
            </div>
          ) : (
            <div className="bad-total-box">
              <span>合計金額： [ ？？？？？ ]</span>
              <small>※ 注文ボタンを押すまで表示されません</small>
              {!foundFlaws.includes('hidden-total') && <span className="trap-pulse-dot" />}
            </div>
          )}
        </div>

        {/* Checkout Buttons */}
        <div 
          className={`checkout-actions-row ${!isGoodUi ? 'clickable-trap' : ''}`}
          onClick={() => !isGoodUi && onFlawClick(flawTrapCancel)}
          title={!isGoodUi ? 'ここをクリックして罠を調査' : ''}
        >
          {isGoodUi ? (
            <div className="good-checkout-actions">
              <button className="good-cancel-btn">✕ 戻る</button>
              <button className="good-order-btn">注文を確定する (¥{580 + (cartCount - 1) * 320}) ➔</button>
            </div>
          ) : (
            <div className="bad-checkout-actions">
              <button className="bad-order-btn">注文確定</button>
              <button className="bad-cancel-btn">全消去</button>
              {!foundFlaws.includes('trap-cancel-btn') && <span className="trap-pulse-dot" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Stage 2: Game Registration Simulation
   ========================================================================== */
function GameRegSimulation({ 
  isGoodUi, 
  onFlawClick, 
  foundFlaws 
}: { 
  isGoodUi: boolean; 
  onFlawClick: (f: Flaw) => void;
  foundFlaws: string[];
}) {
  const [password, setPassword] = useState('pass');
  const [showBadError, setShowBadError] = useState(false);
  const stage = STAGES_DATA[1];

  const flawPassword = stage.flaws.find(f => f.id === 'hidden-password-rules')!;
  const flawBack = stage.flaws.find(f => f.id === 'clear-on-back')!;
  const flawSubmit = stage.flaws.find(f => f.id === 'ambiguous-submit')!;
  const flawTerms = stage.flaws.find(f => f.id === 'tiny-terms-checkbox')!;

  return (
    <div className={`site-sim game-sim ${isGoodUi ? 'good-sim' : 'bad-sim'}`}>
      <div className="sim-header">
        <div 
          className={`sim-back-link ${!isGoodUi ? 'clickable-trap' : ''}`}
          onClick={() => !isGoodUi && onFlawClick(flawBack)}
          title={!isGoodUi ? 'ここをクリックして罠を調査' : ''}
        >
          ← {isGoodUi ? 'マイページへ戻る（入力保持）' : '戻る（全データ消去）'}
          {!isGoodUi && !foundFlaws.includes('clear-on-back') && <span className="trap-pulse-dot" />}
        </div>
        <div className="sim-brand">⚔️ Legend of Quest - 新規登録</div>
      </div>

      <div className="sim-body form-body">
        <div className="form-group">
          <label>ニックネーム</label>
          <input type="text" defaultValue="ゆうしゃタロウ" />
        </div>

        {/* Password Group */}
        <div 
          className={`form-group ${!isGoodUi ? 'clickable-trap' : ''}`}
          onClick={() => {
            if (!isGoodUi) {
              setShowBadError(true);
              onFlawClick(flawPassword);
            }
          }}
          title={!isGoodUi ? 'ここをクリックして罠を調査' : ''}
        >
          <label>パスワード</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)} 
          />
          {isGoodUi ? (
            <div className="good-pw-checklist">
              <span className={password.length >= 8 ? 'valid' : 'invalid'}>
                {password.length >= 8 ? '✓' : '○'} 8文字以上
              </span>
              <span className={/[A-Z]/.test(password) ? 'valid' : 'invalid'}>
                {/[A-Z]/.test(password) ? '✓' : '○'} 英大文字を含む
              </span>
              <span className={/[0-9]/.test(password) ? 'valid' : 'invalid'}>
                {/[0-9]/.test(password) ? '✓' : '○'} 数字を含む
              </span>
            </div>
          ) : (
            <div className="bad-pw-box">
              {showBadError && (
                <div className="bad-error-alert">
                  ❌ エラー：パスワードは8文字以上・大文字・記号を含める必要があります！（最初から言ってよ！）
                </div>
              )}
              {!foundFlaws.includes('hidden-password-rules') && <span className="trap-pulse-dot" />}
            </div>
          )}
        </div>

        {/* Terms Checkbox */}
        <div 
          className={`terms-row ${!isGoodUi ? 'clickable-trap' : ''}`}
          onClick={() => !isGoodUi && onFlawClick(flawTerms)}
          title={!isGoodUi ? 'ここをクリックして罠を調査' : ''}
        >
          {isGoodUi ? (
            <label className="good-checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>利用規約とプライバシーポリシーに同意する</span>
            </label>
          ) : (
            <div className="bad-checkbox-label">
              <input type="checkbox" style={{ width: 8, height: 8 }} />
              <small style={{ fontSize: 9 }}>同意する（文字を押しても反応しません）</small>
              {!foundFlaws.includes('tiny-terms-checkbox') && <span className="trap-pulse-dot" />}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div 
          className={`submit-btn-row ${!isGoodUi ? 'clickable-trap' : ''}`}
          onClick={() => !isGoodUi && onFlawClick(flawSubmit)}
          title={!isGoodUi ? 'ここをクリックして罠を調査' : ''}
        >
          {isGoodUi ? (
            <button className="good-submit-btn">
              ✨ アカウントを作成して冒険を始める！
            </button>
          ) : (
            <button className="bad-disabled-looking-btn">
              決定（押せるのか押せないのか不明）
              {!foundFlaws.includes('ambiguous-submit') && <span className="trap-pulse-dot" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Stage 3: School App Simulation
   ========================================================================== */
function SchoolAppSimulation({ 
  isGoodUi, 
  onFlawClick, 
  foundFlaws 
}: { 
  isGoodUi: boolean; 
  onFlawClick: (f: Flaw) => void;
  foundFlaws: string[];
}) {
  const stage = STAGES_DATA[2];

  const flawColor = stage.flaws.find(f => f.id === 'eye-bleeding-colors')!;
  const flawBuried = stage.flaws.find(f => f.id === 'buried-important-info')!;
  const flawFeedback = stage.flaws.find(f => f.id === 'no-feedback-buttons')!;
  const flawDays = stage.flaws.find(f => f.id === 'jumbled-days')!;

  return (
    <div className={`site-sim school-sim ${isGoodUi ? 'good-sim' : 'bad-sim'}`}>
      <div 
        className={`school-sim-wrapper ${!isGoodUi ? 'bad-colors clickable-trap' : 'good-colors'}`}
        onClick={() => !isGoodUi && onFlawClick(flawColor)}
        title={!isGoodUi ? '配色をクリックして罠を調査' : ''}
      >
        <div className="sim-header">
          <div className="sim-brand">🏫 みなみ中学校 連絡手帳</div>
          {!isGoodUi && !foundFlaws.includes('eye-bleeding-colors') && <span className="trap-pulse-dot" />}
        </div>

        <div className="sim-body">
          {/* If Good UI: Important info on top! */}
          {isGoodUi && (
            <div className="good-urgent-card">
              <span className="urgent-badge">★ 明日の持ち物（最重要）</span>
              <h3>体操着・水泳セット・習字道具をお忘れなく！</h3>
            </div>
          )}

          {/* Timetable Days */}
          <div 
            className={`timetable-box ${!isGoodUi ? 'clickable-trap' : ''}`}
            onClick={e => {
              if (!isGoodUi) {
                e.stopPropagation();
                onFlawClick(flawDays);
              }
            }}
            title={!isGoodUi ? '曜日並びをクリックして罠を調査' : ''}
          >
            <h4>📅 週間時間割</h4>
            <div className="days-row">
              {isGoodUi ? (
                <>
                  <span className="day-pill active">月 (TODAY)</span>
                  <span className="day-pill">火</span>
                  <span className="day-pill">水</span>
                  <span className="day-pill">木</span>
                  <span className="day-pill">金</span>
                </>
              ) : (
                <>
                  <span className="day-pill">月</span>
                  <span className="day-pill">金</span>
                  <span className="day-pill">火</span>
                  <span className="day-pill">木</span>
                  <span className="day-pill">水</span>
                  {!foundFlaws.includes('jumbled-days') && <span className="trap-pulse-dot" />}
                </>
              )}
            </div>
          </div>

          {/* Action button without feedback in bad UI */}
          <div 
            className={`school-action-btn-row ${!isGoodUi ? 'clickable-trap' : ''}`}
            onClick={e => {
              if (!isGoodUi) {
                e.stopPropagation();
                onFlawClick(flawFeedback);
              }
            }}
            title={!isGoodUi ? 'ボタンをクリックして罠を調査' : ''}
          >
            {isGoodUi ? (
              <button className="good-interactive-btn">
                出席・健康カードを提出する（ポン！と反応）
              </button>
            ) : (
              <button className="bad-dead-btn">
                提出（押しても音も色も変わらず無反応）
                {!foundFlaws.includes('no-feedback-buttons') && <span className="trap-pulse-dot" />}
              </button>
            )}
          </div>

          {/* If Bad UI: Important info buried at bottom */}
          {!isGoodUi && (
            <div 
              className="bad-buried-info clickable-trap"
              onClick={e => {
                e.stopPropagation();
                onFlawClick(flawBuried);
              }}
              title="ここをクリックして罠を調査"
            >
              <small>（長文スクロールした一番下）</small>
              <p>【明日の持ち物：体操着】※こんな下にあったら誰も気づきません！</p>
              {!foundFlaws.includes('buried-important-info') && <span className="trap-pulse-dot" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
