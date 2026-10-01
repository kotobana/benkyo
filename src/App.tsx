import React, { useEffect, useState } from 'react';
import { ArrowUpRight, BookOpen, GraduationCap, Key, Lock, Plus, Search, Trash2, Unlock } from 'lucide-react';
import { groups, type Category, type SchoolLink, validLink } from './model';

const STORAGE_KEY = 'benkyo_passphrase';

export function App() {
  const [links, setLinks] = useState<SchoolLink[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<SchoolLink | null>(null);
  const [passphrase, setPassphrase] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || '');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInput, setAuthInput] = useState('');
  const [authError, setAuthError] = useState('');

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
        <div className="greeting school-greeting">
          <div>
            <p className="eyebrow">LEARNING SUPPORT / HOME</p>
            <h1>教える時間を、もっと豊かに。</h1>
            <p>無料塾の道具箱。授業の準備から、振り返りまで。</p>
          </div>
          <GraduationCap size={70} strokeWidth={1} />
        </div>

        <div className="school-heading">
          <h2>無料塾のツールホーム</h2>
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

        <div className="panel school-next">
          <h2>これから、この場所に増やせるもの</h2>
          <p>
            生徒ごとの学習記録、授業メモ、問題プリント、授業タイマーなど。必要な道具をひとつずつ追加できる構成です。
          </p>
          <small>これらの専用アプリはまだ未実装です。今は既存の教材・ツールのURLを登録して使えます。</small>
        </div>

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
        <span>benkyo - 無料塾ポータル</span>
        <small>誰でも閲覧可能 · 編集権限保護</small>
      </footer>
    </div>
  );
}
