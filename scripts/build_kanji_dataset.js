import fs from 'node:fs';
import path from 'node:path';

// 1. Fetch SKK-JISYO.L and build reading -> words map
console.log('Downloading SKK dictionary...');
const res = await fetch('https://raw.githubusercontent.com/skk-dev/dict/master/SKK-JISYO.L');
const buf = await res.arrayBuffer();
const decoder = new TextDecoder('euc-jp');
const text = decoder.decode(buf);

const skkDict = new Map();
for (const l of text.split('\n')) {
  if (l.startsWith(';') || !l.includes('/')) continue;
  const slashIdx = l.indexOf(' /');
  if (slashIdx === -1) continue;
  const reading = l.slice(0, slashIdx);
  const candidates = l.slice(slashIdx + 2).split('/').filter(Boolean).map(c => c.split(';')[0]);
  skkDict.set(reading, candidates);
}
console.log('SKK dictionary ready:', skkDict.size, 'entries.');

function kataToHira(k) {
  return k.replace(/[\u30a1-\u30f6]/g, m => String.fromCharCode(m.charCodeAt(0) - 0x60));
}

function extractWordInfo(s) {
  const match = s.match(/([ァ-ヴー]*?)【([ァ-ヴー]+)】([ァ-ヴー]*)/);
  if (!match) return null;
  return {
    fullKana: match[1] + match[2] + match[3],
    fullHira: kataToHira(match[1] + match[2] + match[3]),
    prefix: match[1],
    target: match[2],
    suffix: match[3],
    targetIsPrefix: match[1].length === 0
  };
}

// Read kanji_raw.tsv
const rawContent = fs.readFileSync('kanji_raw.tsv', 'utf8');
const rawLines = rawContent.split('\n').map(l => l.trim()).filter(l => l.length > 0).slice(1);

// Build map of Question sentences to Kanji
const qKanjiMap = new Map();
for (const line of rawLines) {
  const p = line.split('\t').map(s => s.trim());
  if (p.length >= 2) qKanjiMap.set(p[1], p[0]);
}

// Manual overrides for the unresolved 194 questions to guarantee 100% precision
// Format: { [id]: answerIndex (0, 1, 2, or 3) }
const overrides = {
  4: 2, 6: 3, 10: 2, 20: 2, 21: 2, 22: 0, 25: 0, 32: 3, 34: 2, 38: 0,
  43: 3, 48: 1, 51: 0, 54: 2, 57: 0, 64: 1, 67: 3, 69: 2, 71: 3, 74: 3,
  75: 1, 84: 2, 85: 3, 86: 1, 92: 0, 93: 1, 97: 3, 98: 2, 102: 3, 108: 1,
  120: 3, 123: 2, 126: 1, 128: 0, 130: 0, 136: 3, 152: 2, 161: 2, 162: 2, 169: 1,
  170: 3, 177: 0, 180: 3, 183: 0, 190: 2, 193: 3, 194: 2, 196: 2, 198: 3, 205: 2,
  212: 1, 213: 3, 214: 2, 215: 3, 226: 0, 228: 3, 232: 2, 234: 2, 236: 2, 239: 1,
  248: 0, 250: 1, 253: 3, 260: 3, 268: 3, 274: 1, 282: 3, 283: 3, 284: 3, 290: 1,
  299: 0, 300: 0, 302: 3, 303: 2, 306: 1, 307: 3, 308: 1, 309: 1, 310: 2, 311: 1,
  315: 0, 317: 2, 320: 1, 322: 1, 326: 2, 328: 2, 332: 1, 334: 2, 339: 0, 343: 2,
  349: 1, 352: 1, 358: 3, 360: 3, 364: 2, 365: 2, 369: 0, 376: 3, 377: 3, 389: 0,
  392: 3, 394: 3, 399: 1, 400: 1, 401: 0, 403: 0, 404: 3, 416: 0, 418: 0, 423: 2,
  426: 0, 435: 0, 451: 3, 454: 0, 456: 3, 458: 1, 459: 0, 462: 2, 463: 2, 464: 0,
  469: 1, 470: 2, 473: 0, 474: 2, 477: 1, 478: 2, 479: 2, 481: 3, 483: 3, 490: 0,
  494: 2, 497: 0, 498: 2, 500: 0, 503: 1, 504: 1, 507: 1, 514: 0, 521: 3, 522: 2,
  528: 0, 530: 2, 532: 3, 534: 1, 535: 3, 538: 1, 540: 3, 541: 2, 543: 3, 552: 1,
  554: 0, 557: 3, 558: 0, 559: 3, 563: 0, 565: 3, 570: 0, 575: 0, 579: 3, 585: 1,
  588: 2, 590: 2, 600: 2, 601: 2, 608: 3, 609: 2, 612: 0, 614: 1, 615: 3, 619: 3,
  620: 1, 623: 1, 624: 0, 626: 3, 627: 2, 628: 1, 630: 3, 632: 1, 634: 0, 639: 3,
  643: 1, 648: 3, 657: 3, 658: 0, 677: 0, 679: 1, 682: 0, 688: 1, 700: 0, 708: 2,
  711: 3, 715: 2, 719: 3, 721: 0
};

// Function to find the most fitting word for any sentence
const specialWordFix = {
  '駅の【ケン】バイ機の使い方を教わる。': '券売',
  '物語の宇宙船が未知の【チュウ】イキに入る。': '宙域',
  'カイ【ヨク】を楽しむ人々が集まる。': '海浴',
  '事実が【ショウ】ゼンと明らかになる。': '昭然'
};

function findBestWord(sentence, preferredKanji = null) {
  if (specialWordFix[sentence]) return specialWordFix[sentence];
  const info = extractWordInfo(sentence);
  if (!info) return '';
  const candidates = skkDict.get(info.fullHira) || [];
  if (preferredKanji) {
    const match = candidates.find(w => {
      if (!w.includes(preferredKanji)) return false;
      if (info.targetIsPrefix) return w.startsWith(preferredKanji);
      return w.endsWith(preferredKanji);
    });
    if (match) return match;
  }
  // Return first standard candidate
  return candidates[0] || info.fullKana;
}

const dataset = [];

for (let r = 0; r < rawLines.length; r++) {
  const p = rawLines[r].split('\t').map(s => s.trim());
  if (p[0] === '需') {
    p[1] = '季節による【ジュ】ヨウの変化を調べる。';
    p[2] = '祖父のチョウ【ジュ】を祝う。';
    p[3] = '読書感想文が県の賞を【ジュ】ショウした。';
    p[4] = '商品の【ジュ】キュウの関係を学ぶ。';
    p[5] = '校庭の【ジュ】モクを調べる。';
  }
  if (p.length < 6) continue;

  const id = r + 1;
  const kanji = p[0];
  const qText = p[1];
  const opts = [p[2], p[3], p[4], p[5]];

  let ansIdx = -1;
  if (overrides[id] !== undefined) {
    ansIdx = overrides[id];
  } else {
    // Determine automatically via SKK and dummy filter
    const matchIndices = [];
    for (let i = 0; i < 4; i++) {
      const info = extractWordInfo(opts[i]);
      if (!info) continue;
      const candidates = skkDict.get(info.fullHira) || [];
      const matchingWord = candidates.find(w => {
        if (!w.includes(kanji)) return false;
        if (info.targetIsPrefix) return w.startsWith(kanji);
        return w.endsWith(kanji);
      });
      if (matchingWord) {
        const otherK = qKanjiMap.get(opts[i]);
        if (otherK && otherK !== kanji) continue;
        matchIndices.push(i);
      }
    }
    if (matchIndices.length === 1) {
      ansIdx = matchIndices[0];
    } else {
      console.warn(`Row ${id} (${kanji}) unresolved! matches:`, matchIndices);
      ansIdx = matchIndices[0] || 0;
    }
  }

  const qWord = findBestWord(qText, kanji);
  const optionWords = opts.map((opt, i) => {
    return findBestWord(opt, i === ansIdx ? kanji : null);
  });
  const answerWord = optionWords[ansIdx] || '';

  dataset.push({
    id,
    kanji,
    qText,
    qWord,
    options: opts,
    answerIndex: ansIdx,
    answerWord,
    optionWords
  });
}

console.log('Total questions built:', dataset.length);
fs.mkdirSync('src/apps/kanji', { recursive: true });
fs.writeFileSync('src/apps/kanji/data.json', JSON.stringify(dataset, null, 2), 'utf8');
console.log('Successfully saved to src/apps/kanji/data.json!');
