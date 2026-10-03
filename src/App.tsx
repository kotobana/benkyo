import React, { useEffect, useState } from 'react';
import { 
  ArrowUpRight, 
  BookOpen, 
  GraduationCap, 
  Key, 
  Plus, 
  Search, 
  Trash2, 
  Unlock, 
  Sparkles, 
  Clock, 
  FileText, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Compass,
  Presentation,
  Gamepad2
} from 'lucide-react';
import { groups, type Category, type SchoolLink, validLink } from './model';

const KanjiApp = React.lazy(() => 
  import('./apps/kanji/KanjiApp').then(m => ({ default: m.KanjiApp }))
);

const SouzouApp = React.lazy(() => 
  import('./apps/souzou/SouzouApp').then(m => ({ default: m.SouzouApp }))
);

const STORAGE_KEY = 'benkyo_passphrase';

export type ViewState = 'portal' | 'kanji' | 'souzou';

function getHashView(): ViewState {
  const hash = window.location.hash;
  if (hash === '#kanji') return 'kanji';
  if (hash.startsWith('#souzou')) return 'souzou';
  return 'portal';
}

export function App() {
  const [view, setView] = useState<ViewState>(getHashView);

  const [activeTab, setActiveTab] = useState<'apps' | 'links'>('apps');
  const [links, setLinks] = useState<SchoolLink[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<SchoolLink | null>(null);
  const [passphrase, setPassphrase] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || '');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInput, setAuthInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Handle Hash Change
  useEffect(() => {
    const handleHash = () => {
      setView(getHashView());
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (newView: ViewState) => {
    setView(newView);
    if (newView === 'kanji') window.location.hash = '#kanji';
    else if (newView === 'souzou') window.location.hash = '#souzou';
    else window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial fetch (Public)
  useEffect(() => {
    fetch('/api/links')
      .then(async r => {
        if (!r.ok) throw Error('データを読み込めませんでした。');
        return r.json();
      })
      .then(v => {
        setLinks(v.links || []);
      })
      .catch(e => setError(e.message));
  }, []);

  // Save (Create or Update)
  async function save(updatedLinks: SchoolLink[], currentPassphrase = passphrase) {
    if (busy) return;
    setBusy(true);
    try {
      const r = await fetch('/api/links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Passphrase': currentPassphrase
        },
        body: JSON.stringify({ links: updatedLinks })
      });

      if (!r.ok) {
        if (r.status === 401) {
          setShowAuthModal(true);
          throw Error('合言葉が一致しないか設定されていません。合言葉を入力してください。');
        }
        throw Error('保存できませんでした。入力を残してありますので再試行してください。');
      }

      setLinks(updatedLinks);
      setForm(null);
      setError('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  // Open form with auth check
  function openForm(link: SchoolLink) {
    if (!passphrase) {
      setShowAuthModal(true);
      return;
    }
    setForm(link);
  }

  // Verify and save passphrase
  async function handleVerifyPassphrase(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    try {
      const r = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase: authInput })
      });
      if (r.ok) {
        localStorage.setItem(STORAGE_KEY, authInput);
        setPassphrase(authInput);
        setShowAuthModal(false);
        setAuthError('');
        if (!form) {
          setForm({ id: crypto.randomUUID(), title: '', url: '', category: 'prepare', description: '' });
        }
      } else {
        setAuthError('合言葉が一致しません。');
      }
    } catch {
      setAuthError('接続エラーが発生しました。');
    }
  }

  function handleLock() {
    localStorage.removeItem(STORAGE_KEY);
    setPassphrase('');
  }

  // If Kanji App view is active
  if (view === 'kanji') {
    return (
      <div className="space-shell">
        <header>
          <div className="brand" style={{ cursor: 'pointer' }} onClick={() => navigateTo('portal')}>
            <GraduationCap size={24} />
            <span>benkyo</span>
            <small>無料塾のツールホーム</small>
          </div>
          <div className="auth-controls">
            <button className="quiet" onClick={() => navigateTo('portal')}>
              ホームへ戻る
            </button>
          </div>
        </header>

        <div className="space-content" style={{ maxWidth: '960px' }}>
          <React.Suspense fallback={<div className="kanji-app-container"><div className="kanji-main-card"><div className="loading-box">漢字ドリルを読み込み中…</div></div></div>}>
            <KanjiApp onBack={() => navigateTo('portal')} />
          </React.Suspense>
        </div>

        <footer>
          <span>benkyo - 無料塾ポータル & 学習ツール集</span>
          <small>誰でも利用可能</small>
        </footer>
      </div>
    );
  }

  // If Souzou App view is active (創造学習アプリ)
  if (view === 'souzou') {
    const isDemoPage = window.location.hash.includes('/demo/');

    // 本物の独立デモサイトの場合、外枠フレームやヘッダーなしの完全独立全画面で開く！
    if (isDemoPage) {
      return (
        <React.Suspense fallback={<div className="loading-box" style={{ padding: '60px', textAlign: 'center' }}>デモWebサイトを読み込み中…</div>}>
          <SouzouApp onBackToPortal={() => navigateTo('portal')} />
        </React.Suspense>
      );
    }

    return (
      <div className="space-shell">
        <header>
          <div className="brand" style={{ cursor: 'pointer' }} onClick={() => navigateTo('portal')}>
            <GraduationCap size={24} />
            <span>benkyo</span>
            <small>無料塾のツールホーム</small>
          </div>
          <div className="auth-controls">
            <button className="quiet" onClick={() => navigateTo('portal')}>
              ホームへ戻る
            </button>
          </div>
        </header>

        <React.Suspense fallback={<div className="loading-box" style={{ padding: '40px', textAlign: 'center' }}>創造学習アプリを読み込み中…</div>}>
          <SouzouApp onBackToPortal={() => navigateTo('portal')} />
        </React.Suspense>

        <footer>
          <span>benkyo - 無料塾ポータル & 創造学習</span>
          <small>誰でも利用可能</small>
        </footer>
      </div>
    );
  }

  // Main Portal View
  return (
    <div className="space-shell">
      <header>
        <div className="brand">
          <GraduationCap size={24} />
          <span>benkyo</span>
          <small>無料塾のツールホーム</small>
        </div>

        <div className="auth-controls">
          {passphrase ? (
            <>
              <span className="auth-status unlocked">
                <Unlock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                編集可能
              </span>
              <button className="quiet" onClick={handleLock}>
                ロック
              </button>
            </>
          ) : (
            <button className="quiet" onClick={() => { setAuthInput(''); setAuthError(''); setShowAuthModal(true); }}>
              <Key size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              合言葉で編集解除
            </button>
          )}
        </div>
      </header>

      <div className="space-content school-content">
        {/* Hero Greeting */}
        <div className="greeting school-greeting">
          <div>
            <p className="eyebrow">LEARNING SUPPORT / HOME</p>
            <h1>教える時間を、もっと豊かに。</h1>
            <p>無料塾の道具箱。自作学習アプリから、教材リンク集まで。</p>
          </div>
          <GraduationCap size={70} strokeWidth={1} />
        </div>

        {/* Tab switcher between Apps and Links */}
        <div className="portal-tabs-nav">
          <button 
            className={`portal-tab-btn ${activeTab === 'apps' ? 'active' : ''}`}
            onClick={() => setActiveTab('apps')}
          >
            <Sparkles size={16} /> 学習ツール・アプリ集
          </button>
          <button 
            className={`portal-tab-btn ${activeTab === 'links' ? 'active' : ''}`}
            onClick={() => setActiveTab('links')}
          >
            <BookOpen size={16} /> 教材・外部ツールリンク
          </button>
        </div>

        {/* TAB 1: Apps Hub */}
        {activeTab === 'apps' && (
          <section className="apps-hub-section">
            <div className="section-header-row">
              <h2><Sparkles size={20} color="#315e4d" /> 自作学習アプリ集</h2>
              <p>授業や自習でそのまま使えるインタラクティブなWebアプリです。</p>
            </div>

            <div className="app-cards-grid">
              {/* Featured: Souzou Learning Workshop */}
              <div className="app-card featured" style={{ borderLeft: '4px solid #f38b43' }}>
                <div>
                  <div className="app-card-top">
                    <div className="app-card-icon" style={{ background: '#fef3e7', color: '#db7632' }}>
                      <Compass size={26} />
                    </div>
                    <div className="app-card-title-group">
                      <span className="badge-tag" style={{ background: '#fef3e7', color: '#b06000' }}>月1回・50分探究プログラム</span>
                      <h3>創造学習（そうぞうがくしゅう）</h3>
                    </div>
                  </div>
                  <p>
                    中学生向け探究型学習プログラム集！<br />
                    身近なテクノロジーやデザインの仕組みを、直感クイズや本物の独立デモWebサイトで解き明かすシリーズです。
                    第1回「UI/UXってなに？」を公開中。テーマごとのMarpスライドと独立デモサイトを収録。
                  </p>
                </div>
                <div className="app-card-footer">
                  <span className="app-card-meta">第1回: UI/UX 公開中 / テーマ別アーカイブ</span>
                  <button className="app-launch-btn" style={{ background: '#f38b43' }} onClick={() => navigateTo('souzou')}>
                    アプリを開く <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              {/* Featured: Kanji Quiz App */}
              <div className="app-card featured">
                <div>
                  <div className="app-card-top">
                    <div className="app-card-icon">
                      <GraduationCap size={26} />
                    </div>
                    <div className="app-card-title-group">
                      <span className="badge-tag">全746問収録</span>
                      <h3>神奈川県高校入試 漢字練習</h3>
                    </div>
                  </div>
                  <p>
                    神奈川県公立高校入試（国語・問1）の定番形式！<br />
                    設問と同じ漢字を使う文を4択から選ぶ実戦ドリルです。クリックで即座に正誤判定＆すべての選択肢の漢字解説が表示されます。
                  </p>
                </div>
                <div className="app-card-footer">
                  <span className="app-card-meta">10問テスト / エンドレス / 復習</span>
                  <button className="app-launch-btn" onClick={() => navigateTo('kanji')}>
                    アプリを開く <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              {/* Planned App 1: Class Timer */}
              <div className="app-card coming-soon">
                <div>
                  <div className="app-card-top">
                    <div className="app-card-icon" style={{ background: '#f0f3eb', color: '#68776f' }}>
                      <Clock size={24} />
                    </div>
                    <div className="app-card-title-group">
                      <span className="badge-tag secondary">企画・準備中</span>
                      <h3>授業・演習タイマー</h3>
                    </div>
                  </div>
                  <p>
                    演習時間や小テスト、グループワークの残り時間を大きな画面で見やすく表示・カウントダウンするタイマーです。
                  </p>
                </div>
                <div className="app-card-footer">
                  <span className="app-card-meta">近日追加予定</span>
                </div>
              </div>

              {/* Planned App 2: Student Learning Record */}
              <div className="app-card coming-soon">
                <div>
                  <div className="app-card-top">
                    <div className="app-card-icon" style={{ background: '#f0f3eb', color: '#68776f' }}>
                      <FileText size={24} />
                    </div>
                    <div className="app-card-title-group">
                      <span className="badge-tag secondary">企画・準備中</span>
                      <h3>学習記録・引き継ぎメモ</h3>
                    </div>
                  </div>
                  <p>
                    生徒ごとの進み具合や得意・苦手分野、次回の講師への引き継ぎ内容を安全に共有・記録するツールです。
                  </p>
                </div>
                <div className="app-card-footer">
                  <span className="app-card-meta">近日追加予定</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: Links Section */}
        {activeTab === 'links' && (
          <section className="links-hub-section">
            <div className="school-heading">
              <h2>無料塾のツール・教材リンク集</h2>
              <button
                className="primary"
                disabled={busy}
                onClick={() =>
                  openForm({
                    id: crypto.randomUUID(),
                    title: '',
                    url: '',
                    category: 'prepare',
                    description: ''
                  })
                }
              >
                <Plus size={16} /> 教材・ツールを登録
              </button>
            </div>

            <p className="help">
              誰でも閲覧できます。登録・編集・削除を行うには、講師用の合言葉が必要です。
            </p>

            {error && <div className="error" role="alert">{error}</div>}

            <label className="search">
              <Search size={17} />
              <input
                aria-label="塾のツールを検索"
                placeholder="教材やツールを探す…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </label>

            <div className="school-groups">
              {Object.entries(groups).map(([key, g]) => (
                <section className="school-group" key={key}>
                  <small>{g.number}</small>
                  <h2>{g.title}</h2>
                  <p>{g.description}</p>
                  {links
                    .filter(l => l.category === key && (l.title + ' ' + l.description).includes(query))
                    .map(l => (
                      <div className="school-link" key={l.id}>
                        <a href={l.url} target="_blank" rel="noopener noreferrer">
                          <BookOpen size={18} />
                          <span>
                            <strong>{l.title}</strong>
                            <small>{l.description || new URL(l.url).hostname}</small>
                          </span>
                          <ArrowUpRight size={16} />
                        </a>
                        <button disabled={busy} className="quiet" onClick={() => openForm(l)}>
                          編集
                        </button>
                      </div>
                    ))}
                  {!links.some(l => l.category === key) && (
                    <div className="school-empty">
                      ここに教材やツールへのリンクを<br />
                      まとめられます。
                    </div>
                  )}
                </section>
              ))}
            </div>
          </section>
        )}

        {/* Edit Modal */}
        {form && (
          <div className="modal-backdrop">
            <section role="dialog" aria-modal="true" aria-label="塾のツール登録" className="modal">
              <h2>教材・ツールの登録</h2>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  let url: URL;
                  try {
                    url = new URL(form.url);
                    if (!['https:', 'http:'].includes(url.protocol)) throw Error();
                  } catch {
                    setError('http または https のURLを入力してください。');
                    return;
                  }
                  void save([...links.filter(l => l.id !== form.id), { ...form, url: url.href }]);
                }}
              >
                <label>
                  名前
                  <input
                    autoFocus
                    required
                    maxLength={200}
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </label>
                <label>
                  URL
                  <input
                    type="url"
                    required
                    maxLength={2000}
                    value={form.url}
                    onChange={e => setForm({ ...form, url: e.target.value })}
                    placeholder="https://…"
                  />
                </label>
                <label>
                  使う場面
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as Category })}
                  >
                    {Object.entries(groups).map(([k, g]) => (
                      <option value={k} key={k}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  ひとこと説明
                  <textarea
                    maxLength={1000}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </label>
                <div className="modal-actions">
                  {links.some(l => l.id === form.id) && (
                    <button
                      type="button"
                      disabled={busy}
                      className="danger"
                      onClick={() => {
                        if (confirm('このリンクを削除しますか？')) {
                          void save(links.filter(l => l.id !== form.id));
                        }
                      }}
                    >
                      <Trash2 size={15} /> 削除
                    </button>
                  )}
                  <button type="button" className="secondary" disabled={busy} onClick={() => setForm(null)}>
                    閉じる
                  </button>
                  <button className="primary" disabled={busy}>
                    {busy ? '保存中…' : '保存する'}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {/* Passphrase Modal */}
        {showAuthModal && (
          <div className="modal-backdrop">
            <section role="dialog" aria-modal="true" aria-label="合言葉の入力" className="modal">
              <h2>合言葉の入力</h2>
              <p className="help">
                教材・ツールの登録や編集を行うには講師用の合言葉（パスコード）が必要です。
              </p>
              {authError && <div className="error" role="alert">{authError}</div>}
              <form onSubmit={handleVerifyPassphrase}>
                <label>
                  合言葉
                  <input
                    type="password"
                    autoFocus
                    required
                    value={authInput}
                    onChange={e => setAuthInput(e.target.value)}
                    placeholder="合言葉を入力"
                  />
                </label>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => { setShowAuthModal(false); setAuthError(''); }}
                  >
                    キャンセル
                  </button>
                  <button className="primary" type="submit">
                    解除する
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>

      <footer>
        <span>benkyo - 無料塾ポータル & 自作学習ツール集</span>
        <small>誰でも閲覧可能 · 編集権限保護</small>
      </footer>
    </div>
  );
}
