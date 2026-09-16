import { test } from 'node:test';
import assert from 'node:assert/strict';
import { describeReset } from '../src/rate-limit.js';

const NOW = 1_700_000_000_000;

test('a reset in the past reads as now', () => {
  assert.equal(describeReset(NOW / 1000 - 30, NOW), 'resets now');
});

test('under a minute is reported in seconds', () => {
  assert.equal(describeReset(NOW / 1000 + 45, NOW), 'resets in 45s');
});

test('a minute or more is rounded up to whole minutes', () => {
  assert.equal(describeReset(NOW / 1000 + 60, NOW), 'resets in 1 min');
  assert.equal(describeReset(NOW / 1000 + 61, NOW), 'resets in 2 min');
  assert.equal(describeReset(NOW / 1000 + 600, NOW), 'resets in 10 min');
});
