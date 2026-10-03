import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ThumbsUp, 
  ThumbsDown,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { STAGES_DATA, type Flaw } from '../stagesData';

interface BurgerDemoSiteProps {
  initialMode?: 'bad' | 'good';
  onBack: () => void;
}

export const BurgerDemoSite: React.FC<BurgerDemoSiteProps> = ({
  initialMode = 'bad',
  onBack
}) => {
  const [isGoodUi, setIsGoodUi] = useState(initialMode === 'good');
  const [cartCount, setCartCount] = useState(1);
  const [foundFlaws, setFoundFlaws] = useState<string[]>([]);
  const [activeFlawModal, setActiveFlawModal] = useState<Flaw | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const stage = STAGES_DATA[0]; // Stage 1: Burger
  const flawNoPhoto = stage.flaws.find(f => f.id === 'no-photo')!;
  const flawTinyBtn = stage.flaws.find(f => f.id === 'tiny-button')!;
  const flawHiddenTotal = stage.flaws.find(f => f.id === 'hidden-total')!;
  const flawTrapCancel = stage.flaws.find(f => f.id === 'trap-cancel-btn')!;

  const handleFlawClick = (flaw: Flaw) => {
    if (isGoodUi) return;
    if (!foundFlaws.includes(flaw.id)) {
      setFoundFlaws(prev => [...prev, flaw.id]);
    }
    setActiveFlawModal(flaw);
  };

  return (
    <div className={`standalone-demo-page ${isGoodUi ? 'theme-good-burger' : 'theme-bad-burger'}`}>
      {/* Floating Workshop Control Bar (生徒・講師向け学習バー) */}
      <div className="demo-floating-control-bar">
        <div className="control-bar-left">
          <button className="demo-back-btn" onClick={onBack} title="テーマ一覧に戻る">
            <ArrowLeft size={16} /> 創造学習に戻る
          </button>
          <span className="demo-stage-badge">
            🍔 デモ1: ハンバーガー注文サイト
          </span>
        </div>

        <div className="control-bar-center">
          <div className="demo-mode-switcher">
            <button 
              className={`mode-btn bad ${!isGoodUi ? 'active' : ''}`}
              onClick={() => { setIsGoodUi(false); setOrderSuccess(false); }}
            >
              <ThumbsDown size={14} /> 💀 クソUI版
            </button>
            <button 
              className={`mode-btn good ${isGoodUi ? 'active' : ''}`}
              onClick={() => { setIsGoodUi(true); setOrderSuccess(false); }}
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
          REAL STANDALONE SITE: GOOD UI (スマイルバーガー)
          ======================================================== */}
      {isGoodUi ? (
        <div className="real-site good-burger-site">
          <header className="g-header">
            <div className="g-header-inner">
              <div className="g-brand">
                <span className="brand-icon">🍔</span>
                <span className="brand-name">Smile Burger</span>
                <span className="brand-tagline">できたてのおいしさをそのままに</span>
              </div>
              <div className="g-cart-indicator">
                <ShoppingBag size={20} />
                <span>カート: <strong>{cartCount}点</strong></span>
              </div>
            </div>
          </header>

          <main className="g-main-container">
            <div className="g-hero-banner">
              <h2>スマホでサクッと注文！店頭ですぐ受け取り</h2>
              <p>選んで受け取り時間を指定するだけ。待たずにアツアツをお渡しします。</p>
            </div>

            <section className="g-menu-section">
              <h3 className="section-title">本日のおすすめメニュー</h3>
              
              <div className="g-menu-grid">
                {/* Burger Card */}
                <div className="g-item-card">
                  <div className="g-item-img-wrap">
                    <span className="emoji-photo">🍔</span>
                    <span className="popular-badge">一番人気！</span>
                  </div>
                  <div className="g-item-content">
                    <h4>特製てりやきビーフバーガー</h4>
                    <p className="item-description">
                      ジューシーな100%ビーフパティに、自家製甘辛てりやきソースとシャキシャキの国産レタス。
                    </p>
                    <div className="item-price-row">
                      <span className="price-tag">¥580 <small>(税込)</small></span>
                      <button className="g-add-btn" onClick={() => setCartCount(c => c + 1)}>
                        ＋ カートに追加
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fries Card */}
                <div className="g-item-card">
                  <div className="g-item-img-wrap">
                    <span className="emoji-photo">🍟</span>
                    <span className="popular-badge">セット定番</span>
                  </div>
                  <div className="g-item-content">
                    <h4>カリカリ皮付きフライドポテト(M)</h4>
                    <p className="item-description">
                      外はカリッ、中はホクホク。オリジナルブレンドの岩塩で引き立つジャガイモの甘み。
                    </p>
                    <div className="item-price-row">
                      <span className="price-tag">¥320 <small>(税込)</small></span>
                      <button className="g-add-btn" onClick={() => setCartCount(c => c + 1)}>
                        ＋ カートに追加
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom Floating Order Bar */}
            <div className="g-order-summary-card">
              <div className="summary-left">
                <span>現在のご注文内容:</span>
                <span className="summary-count">合計 <strong>{cartCount}</strong> 点</span>
              </div>
              <div className="summary-center">
                <span>お支払い予定金額:</span>
                <span className="summary-total">¥{580 + (cartCount - 1) * 320}</span>
              </div>
              <div className="summary-right">
                <button 
                  className="g-checkout-btn"
                  onClick={() => setOrderSuccess(true)}
                >
                  注文を確定する (店頭決済) ➔
                </button>
              </div>
            </div>

            {orderSuccess && (
              <div className="order-success-banner">
                <CheckCircle2 size={24} />
                <div>
                  <strong>ご注文ありがとうございました！受取番号: #B-204</strong>
                  <p>約10分でお渡し可能です。レジにて画面をお見せください。</p>
                </div>
              </div>
            )}
          </main>
        </div>
      ) : (
        /* ========================================================
           REAL STANDALONE SITE: BAD UI (イライラバーガー)
           ======================================================== */
        <div className="real-site bad-burger-site">
          <div className="b-announcement-header">
            【警告】システムメンテナンス中につき表示が不安定な場合があります
          </div>

          <header className="b-header">
            <h1>BURGER SHOP - ONLINE SYSTEM Ver 0.91</h1>
          </header>

          <main className="b-main-container">
            <div className="b-instructions">
              メニューを選択してカートに入れてください。金額は注文確定まで計算されません。
            </div>

            <div className="b-menu-table">
              {/* Item 1 */}
              <div className="b-menu-row">
                <div 
                  className="b-no-image clickable-trap"
                  onClick={() => handleFlawClick(flawNoPhoto)}
                  title="クリックして罠を調査"
                >
                  [ 画像表示不可 / NO_IMG_FOUND ]
                  {!foundFlaws.includes('no-photo') && <span className="trap-pulse-dot" />}
                </div>
                <div className="b-info">
                  <span className="b-name">牛肉バーガー（てりやき）</span>
                  <span className="b-price">単価: 580円</span>
                </div>
                <div className="b-action">
                  <button 
                    className="b-tiny-btn clickable-trap"
                    onClick={() => handleFlawClick(flawTinyBtn)}
                    title="クリックして罠を調査"
                  >
                    入
                    {!foundFlaws.includes('tiny-button') && <span className="trap-pulse-dot" />}
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="b-menu-row">
                <div 
                  className="b-no-image clickable-trap"
                  onClick={() => handleFlawClick(flawNoPhoto)}
                  title="クリックして罠を調査"
                >
                  [ 画像なし ]
                  {!foundFlaws.includes('no-photo') && <span className="trap-pulse-dot" />}
                </div>
                <div className="b-info">
                  <span className="b-name">油揚げ芋</span>
                  <span className="b-price">単価: 320円</span>
                </div>
                <div className="b-action">
                  <button 
                    className="b-tiny-btn clickable-trap"
                    onClick={() => handleFlawClick(flawTinyBtn)}
                    title="クリックして罠を調査"
                  >
                    入
                  </button>
                </div>
              </div>
            </div>

            {/* Hidden Total Trap Area */}
            <div 
              className="b-total-box clickable-trap"
              onClick={() => handleFlawClick(flawHiddenTotal)}
              title="クリックして罠を調査"
            >
              <span>小計: <strong>[ 注文ボタンを押すまで非表示 ]</strong></span>
              <small>※ 税率や手数料は決済画面で初めて加算されます</small>
              {!foundFlaws.includes('hidden-total') && <span className="trap-pulse-dot" />}
            </div>

            {/* Destructive Cancel Trap Button Area */}
            <div 
              className="b-actions-row clickable-trap"
              onClick={() => handleFlawClick(flawTrapCancel)}
              title="クリックして罠を調査"
            >
              <button className="b-submit-btn" onClick={() => alert('エラー: 合計金額が確認されていません')}>
                注文確定
              </button>
              <button 
                className="b-danger-btn"
                onClick={() => {
                  setCartCount(0);
                  alert('全カート内容を消去しました！');
                }}
              >
                全消去
              </button>
              {!foundFlaws.includes('trap-cancel-btn') && <span className="trap-pulse-dot" />}
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
