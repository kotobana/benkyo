import { Hono } from 'hono';
import { validLinks, type SchoolLink } from '../src/model.ts';

type PreparedStatement = {
  bind(...v: unknown[]): PreparedStatement;
  run(): Promise<{ meta: { changes: number } }>;
  first<T>(): Promise<T | null>;
};

type DB = {
  prepare(sql: string): PreparedStatement;
};

type Env = {
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

app.all('/api/*', c => c.json({ error: 'Not found' }, 404));
app.get('*', c => c.env.ASSETS.fetch(c.req.raw));
app.onError((_, c) => c.json({ error: '処理に失敗しました。' }, 500));

export default app;
