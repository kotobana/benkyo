import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  GraduationCap, 
  Coins, 
  AlertTriangle, 
  ExternalLink, 
  Share2, 
  Check, 
  Search, 
  RefreshCw, 
  Plus, 
  Filter, 
  ShieldCheck, 
  HeartHandshake, 
  Info, 
  ChevronRight,
  Send,
  Building2
} from 'lucide-react';
import type { 
  LocalSchool, 
  ScholarshipScheme, 
  CalendarEvent, 
  DailyNewsItem, 
  ShinroDataResponse, 
  SchoolCategory 
} from './types';
import { 
  DEFAULT_SCHOOLS, 
  DEFAULT_SCHOLARSHIPS, 
  DEFAULT_EVENTS, 
  DEFAULT_NEWS, 
  calculateDailyActions 
} from './defaultData';

interface ShinroAppProps {
  onBackToPortal: () => void;
  passphrase?: string;
}

export const ShinroApp: React.FC<ShinroAppProps> = ({ onBackToPortal, passphrase }) => {
  const [data, setData] = useState<ShinroDataResponse>({
    schools: DEFAULT_SCHOOLS,
    scholarships: DEFAULT_SCHOLARSHIPS,
    events: DEFAULT_EVENTS,
    news: DEFAULT_NEWS,
    updatedAt: new Date().toISOString()
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'urgent' | 'schools' | 'scholarships' | 'news'>('urgent');
  const [schoolFilter, setSchoolFilter] = useState<'all' | SchoolCategory>('all');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [copied, setCopied] = useState(false);

  // 管理者用クローラー実行ステート
  const [crawlBusy, setCrawlBusy] = useState(false);
  const [crawlMessage, setCrawlMessage] = useState('');

  // 新規ニュース登録モーダル
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSource, setNewsSource] = useState('神奈川県教育委員会');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsUrl, setNewsUrl] = useState('');

  // データ取得
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/shinro/data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn('API error, using default fallback data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 今日のアクション判定
  const dailyActions = useMemo(() => {
    return calculateDailyActions(data.events, data.schools);
  }, [data.events, data.schools]);

  // 学校フィルター
  const filteredSchools = useMemo(() => {
    return data.schools.filter(school => {
      const matchesCategory = schoolFilter === 'all' || school.category === schoolFilter;
      const matchesSearch = schoolSearch === '' || 
        school.name.includes(schoolSearch) || 
        school.features.includes(schoolSearch) ||
        school.station.includes(schoolSearch);
      return matchesCategory && matchesSearch;
    });
  }, [data.schools, schoolFilter, schoolSearch]);

  // LINE/URL共有
  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `【相模原・橋本 高校入試＆奨学金ナビ】中学生・保護者向けに高校説明会や給付金情報をまとめています！\n${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: '相模原・橋本 高校入試＆奨学金ナビ',
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 管理者: クローラー即時実行
  const handleTriggerCrawl = async () => {
    if (!passphrase || crawlBusy) return;
    setCrawlBusy(true);
    setCrawlMessage('県教委・市役所サイトを巡回中…');
    try {
      const res = await fetch('/api/shinro/crawl', {
        method: 'POST',
        headers: { 'X-Passphrase': passphrase }
      });
      const result = await res.json();
      if (result.success) {
        setCrawlMessage(`チェック完了！ 新着記事: ${result.newArticlesCount}件`);
        fetchData();
      } else {
        setCrawlMessage('チェック中にエラーが発生しました');
      }
    } catch {
      setCrawlMessage('通信エラーが発生しました');
    } finally {
      setCrawlBusy(false);
      setTimeout(() => setCrawlMessage(''), 5000);
    }
  };

  // 管理者: ニュース手動追加
  const handleAddNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsUrl) return;

    try {
      const res = await fetch('/api/shinro/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Passphrase': passphrase || ''
        },
        body: JSON.stringify({
          source_name: newsSource,
          title: newsTitle,
          summary: newsSummary || newsTitle,
          original_url: newsUrl
        })
      });

      if (res.ok) {
        setShowAddNewsModal(false);
        setNewsTitle('');
        setNewsSummary('');
        setNewsUrl('');
        fetchData();
      } else {
        alert('登録に失敗しました。合言葉を確認してください。');
      }
    } catch {
      alert('通信エラーが発生しました');
    }
  };

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }, []);

  return (
    <div className="shinro-container">
      {/* Top Bar */}
      <div className="shinro-top-bar">
        <button className="shinro-back-btn" onClick={onBackToPortal}>
          <ArrowLeft size={16} /> ポータルへ戻る
        </button>

        <div className="shinro-top-actions">
          <span className="shinro-today-pill">
            <Clock size={13} /> {todayStr} 更新
          </span>

          <button className="shinro-share-btn" onClick={handleShare} title="保護者や生徒にLINEやURLで教える">
            {copied ? <Check size={14} color="#16a34a" /> : <Share2 size={14} />}
            <span>{copied ? 'コピーしました！' : 'LINEで共有'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="shinro-hero">
        <div className="shinro-hero-badge">
          <MapPin size={16} />
          <span>相模原市（橋本・緑区・中央区）の中学生・保護者向け進路サポート</span>
        </div>
        <h1>相模原・橋本 高校入試＆奨学金ナビ</h1>
        <p className="shinro-hero-desc">
          「今週予約すべき説明会は？」「返さなくていい給付金はもらえる？」<br />
          相模原・橋本周辺から通える高校情報と、申請期限のある奨学金・支援制度を日次で集約して届けています。
        </p>

        {/* 管理者用バー（合言葉解除時のみ） */}
        {passphrase && (
          <div className="admin-quick-bar">
            <span className="admin-badge">🔑 管理者モード</span>
            <button 
              className="admin-btn crawl" 
              onClick={handleTriggerCrawl}
              disabled={crawlBusy}
            >
              <RefreshCw size={14} className={crawlBusy ? 'spin' : ''} />
              <span>県教委・市役所を今すぐ自動チェック</span>
            </button>
            <button 
              className="admin-btn add"
              onClick={() => setShowAddNewsModal(true)}
            >
              <Plus size={14} />
              <span>お知らせ手動追加</span>
            </button>
            {crawlMessage && <span className="admin-status-msg">{crawlMessage}</span>}
          </div>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="shinro-tabs-bar">
        <button 
          className={`shinro-tab-btn ${activeTab === 'urgent' ? 'active' : ''}`}
          onClick={() => setActiveTab('urgent')}
        >
          <AlertTriangle size={16} />
          <span>今日・今週のアクション</span>
          {dailyActions.length > 0 && (
            <span className="badge-count">{dailyActions.length}</span>
          )}
        </button>

        <button 
          className={`shinro-tab-btn ${activeTab === 'scholarships' ? 'active' : ''}`}
          onClick={() => setActiveTab('scholarships')}
        >
          <Coins size={16} />
          <span>奨学金・お金の支援（返済不要）</span>
        </button>

        <button 
          className={`shinro-tab-btn ${activeTab === 'schools' ? 'active' : ''}`}
          onClick={() => setActiveTab('schools')}
        >
          <Building2 size={16} />
          <span>橋本から通える高校一覧（{data.schools.length}校）</span>
        </button>

        <button 
          className={`shinro-tab-btn ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          <Sparkles size={16} />
          <span>新着お知らせ速報（{data.news.length}件）</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: 今日・今週のアクション（締切自動ハイライト）
          ======================================================== */}
      {activeTab === 'urgent' && (
        <div className="shinro-tab-content">
          <div className="section-intro-card alert-intro">
            <div>
              <h2>🚨 今日・今週の締切＆重要イベント</h2>
              <p>申し込み期限を過ぎると参加できない説明会や、申請が遅れると受給できない奨学金を優先表示しています。</p>
            </div>
          </div>

          {dailyActions.length === 0 ? (
            <div className="empty-state-box">
              <Check size={36} color="#16a34a" />
              <h3>現在、直近3日以内に迫った締め切りはありません</h3>
              <p>下の「高校一覧」や「奨学金」タブから、今後の予定や支援制度をご確認ください。</p>
            </div>
          ) : (
            <div className="actions-list">
              {dailyActions.map((action, idx) => (
                <div key={idx} className={`action-card ${action.urgency}`}>
                  <div className="action-urgency-badge">
                    <span>{action.label}</span>
                  </div>

                  <div className="action-body">
                    <div className="action-meta">
                      {action.school ? (
                        <span className="action-school-tag">🏫 {action.school.name}</span>
                      ) : (
                        <span className="action-school-tag general">🏛️ 神奈川県 / 相模原市</span>
                      )}
                      {action.event.deadline_date && (
                        <span className="action-date-tag">
                          締切日: <strong>{action.event.deadline_date}</strong>
                        </span>
                      )}
                      {action.event.event_date && (
                        <span className="action-date-tag">
                          開催日: {action.event.event_date}
                        </span>
                      )}
                    </div>

                    <h3 className="action-title">{action.event.title}</h3>

                    {action.event.note && (
                      <p className="action-note">{action.event.note}</p>
                    )}
                  </div>

                  {action.event.url && (
                    <div className="action-footer">
                      <a 
                        href={action.event.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="action-link-btn"
                      >
                        <span>公式案内・Web予約を開く</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 入試の年間スケジュール早見表 */}
          <div className="schedule-overview-box">
            <div className="overview-header">
              <Calendar size={18} color="#2b5f49" />
              <h3>神奈川県公立高校入試 2026-2027 重要日程早見表</h3>
            </div>
            <div className="timeline-steps">
              <div className="step-item">
                <span className="step-month">9〜11月</span>
                <div className="step-content">
                  <strong>学校説明会・オープンキャンパスの集中期</strong>
                  <p>相原高校・橋本高校など各校でWeb事前予約制。定員が埋まりやすいため早めの予約が必要です。</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-month">10月〜11月</span>
                <div className="step-content">
                  <strong>相模原市育英奨学生 予約申請 & 私立高校事前相談</strong>
                  <p>中学3年生向けに高校進学後の奨学金予約が実施されます。</p>
                </div>
              </div>
              <div className="step-item highlight">
                <span className="step-month">1月28日〜2月1日</span>
                <div className="step-content">
                  <strong>公立高校 インターネット出願期間</strong>
                  <p>パソコンやスマートフォンから出願登録を行います。</p>
                </div>
              </div>
              <div className="step-item highlight">
                <span className="step-month">2月16日（火）</span>
                <div className="step-content">
                  <strong>公立高校 学力検査（入試本番）</strong>
                  <p>全日制共通。特色検査（相模原・相模原弥栄など）は同日または翌日に実施。</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-month">2月27日（金）</span>
                <div className="step-content">
                  <strong>合格発表 & 就学支援金手続き開始</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: 奨学金・お金のサポート（返済不要チェック）
          ======================================================== */}
      {activeTab === 'scholarships' && (
        <div className="shinro-tab-content">
          <div className="section-intro-card scholarship-intro">
            <div>
              <h2>💰 高校進学のお金サポート・奨学金まとめ</h2>
              <p>
                「高校はお金がかかるから…」と諦める必要はありません。<br />
                国の授業料無償化に加えて、<strong>神奈川県や相模原市には教科書代・修学旅行費を直接もらえる返済不要の制度</strong>があります。
              </p>
            </div>
          </div>

          <div className="scholarships-grid">
            {data.scholarships.map(sch => {
              const isGrant = sch.type === 'grant';
              const isReduction = sch.type === 'reduction';

              return (
                <div key={sch.id} className={`scholarship-card ${sch.type}`}>
                  <div className="sch-top">
                    <div className="sch-badge-group">
                      <span className="sch-provider">{sch.provider}</span>
                      {isGrant && <span className="sch-type-tag grant">返還不要（もらえる）</span>}
                      {isReduction && <span className="sch-type-tag reduction">授業料実質0円</span>}
                      {!isGrant && !isReduction && <span className="sch-type-tag loan">無利子貸与</span>}
                    </div>
                    <span className="sch-period">申請時期: {sch.application_period}</span>
                  </div>

                  <h3 className="sch-name">{sch.name}</h3>
                  <div className="sch-amount-pill">{sch.amount_desc}</div>

                  <div className="sch-target-box">
                    <strong>対象となるご家庭:</strong>
                    <p>{sch.target_audience}</p>
                  </div>

                  <div className="sch-points-list">
                    <strong>💡 3行でわかるポイント:</strong>
                    <ul>
                      {sch.summary_points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="sch-footer">
                    <a 
                      href={sch.official_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="sch-official-link"
                    >
                      <span>詳しい申請方法・要件（公式ページ）</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 相模原市相談窓口カード */}
          <div className="sagamihara-consult-card">
            <div className="consult-icon">
              <HeartHandshake size={32} color="#2b5f49" />
            </div>
            <div className="consult-body">
              <h3>相模原市の子育て・就学支援 相談窓口（橋本・緑区）</h3>
              <p>
                「うちの収入で対象になるか分からない」「手続きの書き方が難しい」という場合は、
                緑区役所（橋本駅前・ミウィ橋本内）または各まちづくりセンターで親身に相談に乗ってもらえます。
              </p>
              <div className="consult-contacts">
                <span>📍 <strong>緑区役所 子育て支援課:</strong> 042-775-8815（橋本駅北口）</span>
                <span>📍 <strong>相模原市教育委員会 学務課:</strong> 042-769-8282</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: 橋本から通える高校一覧
          ======================================================== */}
      {activeTab === 'schools' && (
        <div className="shinro-tab-content">
          <div className="section-intro-card schools-intro">
            <div>
              <h2>🏫 橋本周辺の中学生が通いやすい高校一覧</h2>
              <p>橋本駅から電車・バスで30分圏内の主要県立高校と、学び直し・定時制高校の特色をまとめました。</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="school-filter-row">
            <div className="filter-chips">
              <button 
                className={`chip ${schoolFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSchoolFilter('all')}
              >
                すべて ({data.schools.length})
              </button>
              <button 
                className={`chip ${schoolFilter === 'public_general' ? 'active' : ''}`}
                onClick={() => setSchoolFilter('public_general')}
              >
                公立普通科
              </button>
              <button 
                className={`chip ${schoolFilter === 'public_special' ? 'active' : ''}`}
                onClick={() => setSchoolFilter('public_special')}
              >
                実業・専門学科（相原・弥栄等）
              </button>
              <button 
                className={`chip ${schoolFilter === 'public_creative' ? 'active' : ''}`}
                onClick={() => setSchoolFilter('public_creative')}
              >
                クリエイティブ・定時制
              </button>
            </div>

            <div className="search-box">
              <Search size={15} color="#66776e" />
              <input 
                type="text" 
                placeholder="高校名・特徴・駅名で検索…" 
                value={schoolSearch}
                onChange={e => setSchoolSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Schools Grid */}
          <div className="schools-grid">
            {filteredSchools.map(school => {
              // この高校に関連する直近イベント
              const schoolEvents = data.events.filter(e => e.school_id === school.id);

              return (
                <div key={school.id} className="school-card">
                  <div className="school-card-header">
                    <div>
                      <span className="school-category-tag">
                        {school.category === 'public_special' ? '専門・実業科' : 
                         school.category === 'public_creative' ? 'クリエイティブ・定時制' : '公立普通科'}
                      </span>
                      <h3 className="school-name">{school.name}</h3>
                      <div className="school-station">
                        <MapPin size={13} />
                        <span>{school.station}</span>
                      </div>
                    </div>
                    {school.deviation_range && (
                      <div className="school-deviation-badge">
                        <small>目安</small>
                        <strong>{school.deviation_range}</strong>
                      </div>
                    )}
                  </div>

                  <p className="school-features">{school.features}</p>

                  {/* 近日の説明会 */}
                  {schoolEvents.length > 0 && (
                    <div className="school-upcoming-events">
                      <div className="event-label">
                        <Calendar size={13} />
                        <span>近日の説明会・オープンキャンパス</span>
                      </div>
                      {schoolEvents.map(ev => (
                        <div key={ev.id} className="event-row">
                          <span className="ev-date">{ev.event_date || '要確認'}</span>
                          <span className="ev-title">{ev.title}</span>
                          {ev.deadline_date && (
                            <span className="ev-deadline">（予約締切: {ev.deadline_date}）</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="school-card-footer">
                    <a 
                      href={school.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="school-link-btn"
                    >
                      <span>{school.short_name}高校の公式HPを見る</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: 新着お知らせ速報（県教委・市役所）
          ======================================================== */}
      {activeTab === 'news' && (
        <div className="shinro-tab-content">
          <div className="section-intro-card news-intro">
            <div>
              <h2>📰 神奈川県教育委員会・相模原市の新着お知らせ</h2>
              <p>毎朝自動クローラーが巡回して集約した最新の公式ニュース一覧です。</p>
            </div>
            <button 
              className="refresh-news-btn"
              onClick={fetchData}
              disabled={loading}
              title="最新情報に更新"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>更新</span>
            </button>
          </div>

          <div className="news-timeline">
            {data.news.map(item => (
              <div key={item.id} className="news-item-card">
                <div className="news-meta">
                  <span className="news-source">{item.source_name}</span>
                  <span className="news-date">{item.published_date}</span>
                </div>
                <h3 className="news-title">
                  <a href={item.original_url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                    <ExternalLink size={14} />
                  </a>
                </h3>
                <p className="news-summary">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 新着手動追加モーダル（管理者用） */}
      {showAddNewsModal && (
        <div className="modal-overlay" onClick={() => setShowAddNewsModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>新着お知らせの手動追加</h3>
              <button className="close-btn" onClick={() => setShowAddNewsModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddNewsSubmit} className="news-form">
              <label>
                情報元:
                <select value={newsSource} onChange={e => setNewsSource(e.target.value)}>
                  <option value="神奈川県教育委員会">神奈川県教育委員会</option>
                  <option value="相模原市">相模原市</option>
                  <option value="相原高校">相原高校</option>
                  <option value="橋本高校">橋本高校</option>
                  <option value="無料塾 benkyo">無料塾 benkyo 独自案内</option>
                </select>
              </label>

              <label>
                タイトル:
                <input 
                  type="text" 
                  required
                  placeholder="例: 相原高校 第3回説明会の追加予約が開始されました" 
                  value={newsTitle} 
                  onChange={e => setNewsTitle(e.target.value)} 
                />
              </label>

              <label>
                わかりやすい3行要約・解説:
                <textarea 
                  rows={3}
                  placeholder="保護者向けにわかりやすく要約した内容を入力してください"
                  value={newsSummary}
                  onChange={e => setNewsSummary(e.target.value)}
                />
              </label>

              <label>
                公式案内URL:
                <input 
                  type="url" 
                  required
                  placeholder="https://..." 
                  value={newsUrl} 
                  onChange={e => setNewsUrl(e.target.value)} 
                />
              </label>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddNewsModal(false)}>
                  キャンセル
                </button>
                <button type="submit" className="submit-btn">
                  公開・登録する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
