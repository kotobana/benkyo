import { Hono } from 'hono';
import { validLinks, type SchoolLink } from '../src/model.ts';
import { 
  getShinroData, 
  addDailyNews, 
  runScheduledCrawl, 
  type Env as ShinroEnv 
} from './shinro.ts';

type PreparedStatement = {
  bind(...v: unknown[]): PreparedStatement;
  run(): Promise<{ meta: { changes: number } }>;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
};

type DB = {
  prepare(sql: string): PreparedStatement;
};

type Env = ShinroEnv & {
  DB: DB;
  ASSETS: { fetch(r: Request): Promise<Response> };
  EDIT_PASSPHRASE?: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', async (c, next) => {
  c.header('Cache-Control', 'no-store');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Referrer-Policy', 'same-origin');
  c.header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  await next();
});

function isAuthorized(c: any): boolean {
  const expected = c.env.EDIT_PASSPHRASE || 'benkyo';
  const provided = c.req.header('X-Passphrase') || '';
  return expected.length > 0 && provided === expected;
}

// ========================================================
// 1. ポータル用 リンク集 API
// ========================================================

// Public: GET /api/links
app.get('/api/links', async c => {
  try {
    const row = await c.env.DB.prepare('SELECT payload FROM app_data WHERE id=1').first<{ payload: string }>();
    if (!row) return c.json({ links: [] });
    return c.json({ links: JSON.parse(row.payload) });
  } catch {
    return c.json({ error: 'データの読み込みに失敗しました' }, 500);
  }
});

// Auth verification
app.post('/api/auth/verify', async c => {
  const body = await c.req.json().catch(() => ({}));
  const expected = c.env.EDIT_PASSPHRASE || 'benkyo';
  if (body.passphrase && body.passphrase === expected) {
    return c.json({ ok: true });
  }
  return c.json({ ok: false, error: '合言葉が一致しません' }, 401);
});

// Protected: PUT /api/links
app.put('/api/links', async c => {
  if (!isAuthorized(c)) {
    return c.json({ error: '合言葉が一致しないため、保存できません。' }, 401);
  }
  const body = await c.req.json().catch(() => null);
  if (!body || !validLinks(body.links)) {
    return c.json({ error: 'データ形式が正しくありません。' }, 400);
  }

  await c.env.DB.prepare(
    'INSERT INTO app_data (id, payload) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload'
  ).bind(JSON.stringify(body.links)).run();

  return c.json({ ok: true });
});

// ========================================================
// 2. 相模原・橋本 高校入試＆奨学金ナビ API
// ========================================================

// Public: GET /api/shinro/data (学校・奨学金・カレンダー・ニュース一括取得)
app.get('/api/shinro/data', async c => {
  try {
    const data = await getShinroData(c.env.DB);
    return c.json(data);
  } catch (err: any) {
    return c.json({ error: '進路データの取得に失敗しました', details: err?.message }, 500);
  }
});

// Protected: POST /api/shinro/news (ニュース手動追加)
app.post('/api/shinro/news', async c => {
  if (!isAuthorized(c)) {
    return c.json({ error: '合言葉が一致しません' }, 401);
  }
  const body = await c.req.json().catch(() => null);
  if (!body || !body.title || !body.original_url) {
    return c.json({ error: 'タイトルとURLは必須です' }, 400);
  }

  try {
    const created = await addDailyNews(c.env.DB, {
      source_name: body.source_name || '管理者お知らせ',
      title: body.title,
      summary: body.summary || body.title,
      published_date: body.published_date,
      original_url: body.original_url
    });
    return c.json({ ok: true, item: created });
  } catch (err: any) {
    return c.json({ error: 'ニュースの登録に失敗しました', details: err?.message }, 500);
  }
});

// Protected or Internal: POST /api/shinro/crawl (手動での自動更新チェック実行)
app.post('/api/shinro/crawl', async c => {
  if (!isAuthorized(c)) {
    return c.json({ error: '合言葉が一致しません' }, 401);
  }
  try {
    const result = await runScheduledCrawl(c.env);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: 'クローラー実行に失敗しました', details: err?.message }, 500);
  }
});

// ========================================================
// 3. ルーティング & 静的アセット配信
// ========================================================
app.all('/api/*', c => c.json({ error: 'Not found' }, 404));
app.get('*', c => c.env.ASSETS.fetch(c.req.raw));
app.onError((_, c) => c.json({ error: '処理に失敗しました。' }, 500));

// Cloudflare Workers entrypoint (Supports both app.request in tests and scheduled cron in Cloudflare)
const handler = Object.assign(app, {
  async scheduled(event: any, env: Env, ctx: any) {
    ctx.waitUntil(runScheduledCrawl(env));
  }
});

export default handler;
