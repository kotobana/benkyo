import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UIUX_SLIDES } from '../src/apps/souzou/uiux/slidesData.ts';
import { STAGES_DATA } from '../src/apps/souzou/uiux/stagesData.ts';

test('UIUX_SLIDES has valid slides and structure', () => {
  assert.ok(UIUX_SLIDES.length >= 10, 'Should have at least 10 slides');

  const slideIds = new Set<string>();

  UIUX_SLIDES.forEach((slide, index) => {
    assert.ok(slide.id, `Slide at index ${index} must have an id`);
    assert.ok(!slideIds.has(slide.id), `Duplicate slide id: ${slide.id}`);
    slideIds.add(slide.id);

    assert.ok(slide.title, `Slide ${slide.id} must have a title`);
    assert.ok(slide.section, `Slide ${slide.id} must have a section`);

    if (slide.type === 'intro-quiz') {
      assert.ok(slide.quizData, `Quiz slide ${slide.id} must have quizData`);
      assert.ok(slide.quizData.optionA, `Quiz slide ${slide.id} must have optionA`);
      assert.ok(slide.quizData.optionB, `Quiz slide ${slide.id} must have optionB`);
      assert.ok(slide.quizData.explanation, `Quiz slide ${slide.id} must have explanation`);
    }

    if (slide.type === 'content') {
      assert.ok(slide.contentPoints && slide.contentPoints.length > 0, `Content slide ${slide.id} must have contentPoints`);
    }
  });
});

test('STAGES_DATA has 3 stages with valid flaws and good/bad UI definitions', () => {
  assert.equal(STAGES_DATA.length, 3, 'Should have exactly 3 stages');

  const stageIds = new Set<string>();
  const allFlawIds = new Set<string>();

  STAGES_DATA.forEach(stage => {
    assert.ok(!stageIds.has(stage.id), `Duplicate stage id: ${stage.id}`);
    stageIds.add(stage.id);

    assert.ok(stage.title, `Stage ${stage.id} must have a title`);
    assert.ok(stage.badUiName, `Stage ${stage.id} must have badUiName`);
    assert.ok(stage.goodUiName, `Stage ${stage.id} must have goodUiName`);
    assert.ok(stage.situation, `Stage ${stage.id} must have situation`);
    assert.ok(stage.flaws && stage.flaws.length === 4, `Stage ${stage.id} must have 4 flaws`);

    stage.flaws.forEach(flaw => {
      assert.ok(!allFlawIds.has(flaw.id), `Duplicate flaw id: ${flaw.id}`);
      allFlawIds.add(flaw.id);

      assert.ok(flaw.name, `Flaw ${flaw.id} must have name`);
      assert.ok(flaw.targetElement, `Flaw ${flaw.id} must have targetElement`);
      assert.ok(flaw.explanation, `Flaw ${flaw.id} must have explanation`);
      assert.ok(flaw.howToFix, `Flaw ${flaw.id} must have howToFix`);
    });
  });

  assert.equal(allFlawIds.size, 12, 'Should have exactly 12 unique flaws across all stages');
});
