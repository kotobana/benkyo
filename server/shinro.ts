import { 
  DEFAULT_SCHOOLS, 
  DEFAULT_SCHOLARSHIPS, 
  DEFAULT_EVENTS, 
  DEFAULT_NEWS 
} from '../src/apps/shinro/defaultData.ts';
import type { 
  LocalSchool, 
  ScholarshipScheme, 
  CalendarEvent, 
  DailyNewsItem, 
  ShinroDataResponse 
} from '../src/apps/shinro/types.ts';

type PreparedStatement = {
  bind(...v: unknown[]): PreparedStatement;
  run(): Promise<{ meta: { changes: number } }>;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
};

type DB = {
  prepare(sql: string): PreparedStatement;
};

export type Env = {
  DB: DB;
  ASSETS: { fetch(r: Request): Promise<Response> };
  EDIT_PASSPHRASE?: string;
};

/**
 * テーブルが存在しない場合に自動作成・初期データ投入を行う自己修復関数
 */
export async function initShinroTables(db: DB): Promise<void> {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS local_schools (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        short_name TEXT NOT NULL,
        category TEXT NOT NULL,
        station TEXT NOT NULL,
        deviation_range TEXT,
        features TEXT NOT NULL,
        website_url TEXT NOT NULL
      );
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS scholarship_schemes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        type TEXT NOT NULL,
        amount_desc TEXT NOT NULL,
        target_audience TEXT NOT NULL,
        application_period TEXT NOT NULL,
        summary_points TEXT NOT NULL,
        official_url TEXT NOT NULL
      );
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        school_id TEXT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        event_date TEXT,
        deadline_date TEXT,
        url TEXT,
        note TEXT
      );
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS daily_news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_name TEXT NOT NULL,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        published_date TEXT NOT NULL,
        original_url TEXT NOT NULL,
        is_approved INTEGER DEFAULT 1
      );
    `).run();

    // 学校マスターが空なら初期シード
    const schoolCount = await db.prepare('SELECT COUNT(*) as count FROM local_schools').first<{ count: number }>();
    if (!schoolCount || schoolCount.count === 0) {
      for (const s of DEFAULT_SCHOOLS) {
        await db.prepare(`
          INSERT OR REPLACE INTO local_schools (id, name, short_name, category, station, deviation_range, features, website_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(s.id, s.name, s.short_name, s.category, s.station, s.deviation_range || '', s.features, s.website_url).run();
      }
    }

    // 奨学金マスターが空なら初期シード
    const schCount = await db.prepare('SELECT COUNT(*) as count FROM scholarship_schemes').first<{ count: number }>();
    if (!schCount || schCount.count === 0) {
      for (const sc of DEFAULT_SCHOLARSHIPS) {
        await db.prepare(`
          INSERT OR REPLACE INTO scholarship_schemes (id, name, provider, type, amount_desc, target_audience, application_period, summary_points, official_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(sc.id, sc.name, sc.provider, sc.type, sc.amount_desc, sc.target_audience, sc.application_period, JSON.stringify(sc.summary_points), sc.official_url).run();
      }
    }

    // カレンダーイベントの最新化
    for (const ev of DEFAULT_EVENTS) {
      await db.prepare(`
        INSERT OR REPLACE INTO calendar_events (id, school_id, title, category, event_date, deadline_date, url, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(ev.id, ev.school_id, ev.title, ev.category, ev.event_date, ev.deadline_date, ev.url || '', ev.note || '').run();
    }

    // 最新ニュースの同期
    for (const n of DEFAULT_NEWS) {
      await db.prepare(`
        INSERT OR REPLACE INTO daily_news (id, source_name, title, summary, published_date, original_url, is_approved)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(n.id, n.source_name, n.title, n.summary, n.published_date, n.original_url, n.is_approved).run();
    }
  } catch (err) {
    console.error('Failed to init shinro tables:', err);
  }
}

/**
 * 進路・奨学金データを一括取得する
 */
export async function getShinroData(db: DB): Promise<ShinroDataResponse> {
  await initShinroTables(db);

  try {
    const schoolsQuery = await db.prepare('SELECT * FROM local_schools').all<LocalSchool>();
    const scholarshipsRaw = await db.prepare('SELECT * FROM scholarship_schemes').all<{
      id: string;
      name: string;
      provider: string;
      type: string;
      amount_desc: string;
      target_audience: string;
      application_period: string;
      summary_points: string;
      official_url: string;
    }>();
    const eventsQuery = await db.prepare('SELECT * FROM calendar_events ORDER BY event_date ASC').all<CalendarEvent>();
    const newsQuery = await db.prepare('SELECT * FROM daily_news WHERE is_approved = 1 ORDER BY published_date DESC, id DESC LIMIT 30').all<DailyNewsItem>();

    const scholarships: ScholarshipScheme[] = (scholarshipsRaw.results || []).map(s => {
      let points: string[] = [];
      try {
        points = JSON.parse(s.summary_points);
      } catch {
        points = [s.summary_points];
      }
      return {
        ...s,
        type: s.type as any,
        summary_points: points
      };
    });

    return {
      schools: schoolsQuery.results?.length ? schoolsQuery.results : DEFAULT_SCHOOLS,
      scholarships: scholarships.length ? scholarships : DEFAULT_SCHOLARSHIPS,
      events: eventsQuery.results?.length ? eventsQuery.results : DEFAULT_EVENTS,
      news: newsQuery.results?.length ? newsQuery.results : DEFAULT_NEWS,
      updatedAt: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Falling back to default shinro data due to DB read error:', err);
    return {
      schools: DEFAULT_SCHOOLS,
      scholarships: DEFAULT_SCHOLARSHIPS,
      events: DEFAULT_EVENTS,
      news: DEFAULT_NEWS,
      updatedAt: new Date().toISOString()
    };
  }
}

/**
 * 新着ニュースの手動追加
 */
export async function addDailyNews(
  db: DB, 
  item: { source_name: string; title: string; summary: string; published_date?: string; original_url: string }
): Promise<DailyNewsItem> {
  await initShinroTables(db);
  const pubDate = item.published_date || new Date().toISOString().slice(0, 10);

  const res = await db.prepare(`
    INSERT INTO daily_news (source_name, title, summary, published_date, original_url, is_approved)
    VALUES (?, ?, ?, ?, ?, 1)
  `).bind(item.source_name, item.title, item.summary, pubDate, item.original_url).run();

  return {
    id: (res.meta as any)?.last_row_id || Date.now(),
    source_name: item.source_name,
    title: item.title,
    summary: item.summary,
    published_date: pubDate,
    original_url: item.original_url,
    is_approved: 1
  };
}

/**
 * 簡易HTMLパーサー: 公的機関サイトのリンクと日付・タイトルを抽出する
 */
export function parsePublicSiteHtml(
  html: string, 
  sourceName: string, 
  baseUrl: string
): Array<{ title: string; date: string; url: string }> {
  const items: Array<{ title: string; date: string; url: string }> = [];

  // 神奈川県・相模原市等でよく見られる <a href="...">日付 タイトル</a> または <li>...</li> パターン
  // 1. 日付パターン (2026年10月02日 / 2026/10/02 / 令和〇年〇月〇日)
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(html)) !== null) {
    const rawHref = match[1];
    const rawText = match[2].replace(/<[^>]+>/g, '').trim();

    if (!rawText || rawText.length < 5) continue;
    // PDFや特定お知らせを含むもの
    if (!rawText.includes('選抜') && !rawText.includes('入試') && !rawText.includes('説明会') && 
        !rawText.includes('奨学') && !rawText.includes('育英') && !rawText.includes('募集') &&
        !rawText.includes('基準') && !rawText.includes('高校')) {
      continue;
    }

    // 日付を抽出（見つからなければ今日の日付）
    const dateMatch = rawText.match(/(\d{4})[年\/-](\d{1,2})[月\/-](\d{1,2})/) || 
                      rawText.match(/令和(\d+)年(\d{1,2})月(\d{1,2})日/);
    
    let dateStr = new Date().toISOString().slice(0, 10);
    if (dateMatch) {
      if (rawText.includes('令和')) {
        const year = 2018 + parseInt(dateMatch[1], 10);
        const month = String(dateMatch[2]).padStart(2, '0');
        const day = String(dateMatch[3]).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      } else {
        const year = dateMatch[1];
        const month = String(dateMatch[2]).padStart(2, '0');
        const day = String(dateMatch[3]).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      }
    }

    // URLの解決
    let fullUrl = rawHref;
    if (rawHref.startsWith('/')) {
      const u = new URL(baseUrl);
      fullUrl = `${u.origin}${rawHref}`;
    } else if (!rawHref.startsWith('http')) {
      fullUrl = new URL(rawHref, baseUrl).toString();
    }

    const cleanTitle = rawText.replace(/\s+/g, ' ').slice(0, 100);

    // 重複防止
    if (!items.some(i => i.url === fullUrl || i.title === cleanTitle)) {
      items.push({
        title: cleanTitle,
        date: dateStr,
        url: fullUrl
      });
    }

    if (items.length >= 5) break;
  }

  return items;
}

/**
 * 自動更新チェッカー（Cron実行 & 手動実行共通）
 * 神奈川県教育委員会・相模原市の最新情報を自動巡回
 */
export async function runScheduledCrawl(env: Env): Promise<{
  success: boolean;
  newArticlesCount: number;
  logs: string[];
}> {
  await initShinroTables(env.DB);
  const logs: string[] = [];
  let newCount = 0;

  const TARGETS = [
    {
      source: '神奈川県教育委員会',
      url: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen/index.html'
    },
    {
      source: '相模原市',
      url: 'https://www.city.sagamihara.kanagawa.jp/kosodate/1006889/index.html'
    }
  ];

  for (const target of TARGETS) {
    try {
      logs.push(`Checking target: ${target.source} (${target.url})`);
      const response = await fetch(target.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BenkyoBot/1.0; +https://benkyo.benrin-47e25389.workers.dev)',
          'Accept': 'text/html,application/xhtml+xml'
        }
      });

      if (!response.ok) {
        logs.push(`Failed to fetch ${target.source}: HTTP ${response.status}`);
        continue;
      }

      const html = await response.text();
      const extracted = parsePublicSiteHtml(html, target.source, target.url);
      logs.push(`Extracted ${extracted.length} candidate items from ${target.source}`);

      for (const item of extracted) {
        const existing = await env.DB.prepare('SELECT id FROM daily_news WHERE original_url = ? OR title = ?')
          .bind(item.url, item.title)
          .first();

        if (!existing) {
          await env.DB.prepare(`
            INSERT INTO daily_news (source_name, title, summary, published_date, original_url, is_approved)
            VALUES (?, ?, ?, ?, ?, 1)
          `).bind(
            target.source, 
            item.title, 
            `【${target.source} 公式更新】「${item.title}」が公開されました。最新の詳細は公式リンクをご確認ください。`, 
            item.date, 
            item.url
          ).run();

          newCount++;
          logs.push(`+ NEW ARTICLE: [${target.source}] ${item.title}`);
        }
      }
    } catch (err: any) {
      logs.push(`Error crawling ${target.source}: ${err?.message || err}`);
    }
  }

  logs.push(`Crawl finished. Added ${newCount} new items.`);
  return {
    success: true,
    newArticlesCount: newCount,
    logs
  };
}
