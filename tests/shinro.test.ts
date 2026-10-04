import { test } from 'node:test';
import assert from 'node:assert/strict';
import { 
  DEFAULT_SCHOOLS, 
  DEFAULT_SCHOLARSHIPS, 
  DEFAULT_EVENTS, 
  calculateDailyActions 
} from '../src/apps/shinro/defaultData.ts';
import { parsePublicSiteHtml } from '../server/shinro.ts';

test('DEFAULT_SCHOOLS includes key schools around Hashimoto and Sagamihara', () => {
  assert.ok(DEFAULT_SCHOOLS.length >= 8, 'Expected at least 8 schools');
  
  const aihara = DEFAULT_SCHOOLS.find(s => s.id === 'aihara');
  assert.ok(aihara, 'Aihara High School must exist');
  assert.ok(aihara.station.includes('橋本駅'), 'Aihara station must mention Hashimoto');

  const hashimoto = DEFAULT_SCHOOLS.find(s => s.id === 'hashimoto');
  assert.ok(hashimoto, 'Hashimoto High School must exist');
  assert.ok(hashimoto.station.includes('橋本駅'), 'Hashimoto station must mention Hashimoto');

  const koyokan = DEFAULT_SCHOOLS.find(s => s.id === 'koyokan');
  assert.ok(koyokan, 'Koyokan Creative school must exist');
  assert.equal(koyokan.category, 'public_creative');
});

test('DEFAULT_SCHOLARSHIPS includes key grant and reduction schemes', () => {
  assert.ok(DEFAULT_SCHOLARSHIPS.length >= 3);

  const kyufu = DEFAULT_SCHOLARSHIPS.find(s => s.id === 'kanagawa_kyufu');
  assert.ok(kyufu);
  assert.equal(kyufu.type, 'grant');
  assert.ok(kyufu.amount_desc.includes('返還不要'));

  const ikuei = DEFAULT_SCHOLARSHIPS.find(s => s.id === 'sagamihara_ikuei');
  assert.ok(ikuei);
  assert.equal(ikuei.provider, '相模原市');
});

test('calculateDailyActions correctly classifies urgent, warning, and upcoming deadlines', () => {
  const baseDate = '2026-10-04';
  const mockEvents = [
    {
      id: 101,
      school_id: 'aihara',
      title: '本日締切の説明会',
      category: 'briefing' as const,
      event_date: '2026-10-18',
      deadline_date: '2026-10-04' // 0 days left
    },
    {
      id: 102,
      school_id: 'hashimoto',
      title: 'あと2日締切の予約',
      category: 'briefing' as const,
      event_date: '2026-10-20',
      deadline_date: '2026-10-06' // 2 days left
    },
    {
      id: 103,
      school_id: null,
      title: '来週締切の奨学金',
      category: 'scholarship' as const,
      event_date: '2026-10-25',
      deadline_date: '2026-10-12' // 8 days left
    },
    {
      id: 104,
      school_id: null,
      title: '昨日終了したイベント',
      category: 'briefing' as const,
      event_date: '2026-10-03',
      deadline_date: '2026-10-03' // past (-1 days)
    }
  ];

  const actions = calculateDailyActions(mockEvents, DEFAULT_SCHOOLS, baseDate);

  // 過去分 (id: 104) は除外されるため 3 件
  assert.equal(actions.length, 3);

  // 1番目は本日締切 (urgent)
  assert.equal(actions[0].event.id, 101);
  assert.equal(actions[0].urgency, 'urgent');
  assert.equal(actions[0].daysLeft, 0);

  // 2番目は2日後 (warning)
  assert.equal(actions[1].event.id, 102);
  assert.equal(actions[1].urgency, 'warning');
  assert.equal(actions[1].daysLeft, 2);

  // 3番目は8日後 (upcoming)
  assert.equal(actions[2].event.id, 103);
  assert.equal(actions[2].urgency, 'upcoming');
  assert.equal(actions[2].daysLeft, 8);
});

test('parsePublicSiteHtml extracts articles with dates and full URLs', () => {
  const sampleHtml = `
    <html>
      <body>
        <div class="news-list">
          <ul>
            <li>
              <span class="date">2026年10月02日</span>
              <a href="/docs/u5t/cnt/f6892/senkou_kijun.html">令和9年度公立高等学校入学者選抜に係る選考基準について</a>
            </li>
            <li>
              <a href="https://example.com/sagamihara/ikuei_boshu.html">相模原市育英奨学生の募集要項を公開しました（令和8年9月28日）</a>
            </li>
            <li>
              <a href="/other/unrelated.html">無関係なリンクテキスト</a>
            </li>
          </ul>
        </div>
      </body>
    </html>
  `;

  const items = parsePublicSiteHtml(sampleHtml, '神奈川県教育委員会', 'https://www.pref.kanagawa.jp');
  assert.equal(items.length, 2);

  assert.ok(items[0].title.includes('選考基準'));
  assert.equal(items[0].url, 'https://www.pref.kanagawa.jp/docs/u5t/cnt/f6892/senkou_kijun.html');

  assert.ok(items[1].title.includes('育英奨学生'));
  assert.equal(items[1].url, 'https://example.com/sagamihara/ikuei_boshu.html');
});
