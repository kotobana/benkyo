import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const raw = fs.readFileSync('src/apps/kanji/data.json', 'utf8');
const questions = JSON.parse(raw);

test('kanji dataset exists and has valid count', () => {
  assert.equal(Array.isArray(questions), true);
  assert.ok(questions.length >= 740, `Expected at least 740 questions, got ${questions.length}`);
});

test('every question has valid structure and valid answer index', () => {
  for (const q of questions) {
    assert.ok(q.id > 0, `Question id should be positive: ${q.id}`);
    assert.ok(typeof q.kanji === 'string' && q.kanji.length === 1, `Invalid kanji: ${q.kanji}`);
    assert.ok(typeof q.qText === 'string' && q.qText.includes('【'), `qText missing brackets: ${q.qText}`);
    assert.equal(Array.isArray(q.options), true, `options must be array`);
    assert.equal(q.options.length, 4, `options must have 4 items: id ${q.id}`);
    assert.ok([0, 1, 2, 3].includes(q.answerIndex), `Invalid answerIndex ${q.answerIndex} for id ${q.id}`);
    
    // The correct option must contain 【...】
    const correctOpt = q.options[q.answerIndex];
    assert.ok(correctOpt.includes('【'), `Correct option missing 【】: ${correctOpt}`);
    
    // If optionWords exist, must have 4 items
    if (q.optionWords) {
      assert.equal(q.optionWords.length, 4, `optionWords must have 4 items for id ${q.id}`);
      // Correct option word must contain the kanji
      const correctWord = q.optionWords[q.answerIndex];
      assert.ok(correctWord.includes(q.kanji), `answerWord "${correctWord}" should contain kanji "${q.kanji}" for id ${q.id}`);
    }
  }
});

test('all question IDs are unique', () => {
  const ids = new Set(questions.map((q: any) => q.id));
  assert.equal(ids.size, questions.length, 'Duplicate question IDs found');
});
