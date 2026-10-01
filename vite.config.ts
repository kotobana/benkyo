import { defineConfig } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { validLinks, type SchoolLink } from './src/model';
import type { Connect } from 'vite';

function localApi(server: { middlewares: Connect.Server }) {
  const PASSPHRASE = process.env.EDIT_PASSPHRASE || 'benkyo';

  server.middlewares.use('/api', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');

    await mkdir('.local', { recursive: true });
    let links: SchoolLink[] = [];
    try {
      links = JSON.parse(await readFile('.local/links.json', 'utf8'));
    } catch (e: any) {
      if (e.code !== 'ENOENT') console.error(e);
    }

    const url = new URL(req.url || '', `http://${req.headers.host}`);

    // GET /api/links (Public)
    if (url.pathname === '/links' && req.method === 'GET') {
      res.end(JSON.stringify({ links }));
      return;
    }

    // POST /api/auth/verify
    if (url.pathname === '/auth/verify' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      try {
        const input = JSON.parse(body);
        if (input.passphrase === PASSPHRASE) {
          res.end(JSON.stringify({ ok: true }));
          return;
        }
      } catch {}
      res.statusCode = 401;
      res.end(JSON.stringify({ ok: false, error: '合言葉が一致しません' }));
      return;
    }

    // PUT /api/links (Protected)
    if (url.pathname === '/links' && req.method === 'PUT') {
      const passphrase = req.headers['x-passphrase'];
      if (passphrase !== PASSPHRASE) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: '合言葉が一致しないため、保存できません。' }));
        return;
      }

      let body = '';
      for await (const chunk of req) body += chunk;
      try {
        const input = JSON.parse(body);
        if (!validLinks(input.links)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'データ形式が不正です' }));
          return;
        }
        links = input.links;
        await writeFile('.local/links.json', JSON.stringify(links, null, 2));
        res.end(JSON.stringify({ ok: true }));
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    }

    next();
  });
}

export default defineConfig({
  plugins: [
    {
      name: 'local-api',
      configureServer: localApi,
      configurePreviewServer: localApi
    }
  ]
});
