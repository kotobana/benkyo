import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validLink, validLinks, type SchoolLink } from '../src/model.ts';
import app from '../server/index.ts';

const link: SchoolLink = {
  id: 'test-1',
  title: 'テスト教材',
  url: 'https://example.com/drill',
  category: 'prepare',
  description: 'テスト用説明'
};

test('validLink accepts valid link', () => {
  assert.equal(validLink(link), true);
});

test('validLink rejects invalid url and category', () => {
  assert.equal(validLink({ ...link, url: 'javascript:alert(1)' }), false);
  assert.equal(validLink({ ...link, category: 'unknown' }), false);
  assert.equal(validLink({ ...link, title: '' }), false);
});

test('validLinks checks array and uniqueness', () => {
  assert.equal(validLinks([link]), true);
  assert.equal(validLinks([link, link]), false);
});

test('server allows public get and protects put', async () => {
  const env = {
    EDIT_PASSPHRASE: 'secret-key',
    DB: {
      prepare: () => ({
        bind: () => ({
          run: async () => ({ meta: { changes: 1 } }),
          first: async () => ({ payload: JSON.stringify([link]) })
        }),
        first: async () => ({ payload: JSON.stringify([link]) }),
        run: async () => ({ meta: { changes: 1 } })
      })
    },
    ASSETS: { fetch: async () => new Response('assets') }
  };

  // GET is public
  const getRes = await app.request('http://localhost/api/links', {}, env as any);
  assert.equal(getRes.status, 200);
  const data = await getRes.json();
  assert.equal(data.links.length, 1);

  // PUT without passphrase rejected
  const putNoAuth = await app.request('http://localhost/api/links', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ links: [link] })
  }, env as any);
  assert.equal(putNoAuth.status, 401);

  // PUT with valid passphrase succeeds
  const putValid = await app.request('http://localhost/api/links', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Passphrase': 'secret-key' },
    body: JSON.stringify({ links: [link] })
  }, env as any);
  assert.equal(putValid.status, 200);
});
