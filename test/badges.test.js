import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BADGES, tierFor, nextThreshold } from '../src/badges.js';

test('a count below the first threshold has not earned the badge', () => {
  assert.equal(tierFor('pull-shark', 0), 0);
  assert.equal(tierFor('pull-shark', 1), 0);
  assert.equal(tierFor('starstruck', 15), 0);
});

test('each threshold crossed raises the tier by one', () => {
  assert.equal(tierFor('pull-shark', 2), 1);
  assert.equal(tierFor('pull-shark', 16), 2);
  assert.equal(tierFor('pull-shark', 128), 3);
  assert.equal(tierFor('pull-shark', 1024), 4);
});

test('counts between thresholds keep the lower tier', () => {
  assert.equal(tierFor('pull-shark', 127), 2);
  assert.equal(tierFor('galaxy-brain', 31), 3);
});

test('the top tier does not overflow', () => {
  assert.equal(tierFor('pull-shark', 999999), 4);
});

test('nextThreshold points at the next tier up', () => {
  assert.equal(nextThreshold('pull-shark', 0), 2);
  assert.equal(nextThreshold('pull-shark', 2), 16);
  assert.equal(nextThreshold('starstruck', 6), 16);
});

test('nextThreshold is null once every tier is earned', () => {
  assert.equal(nextThreshold('pull-shark', 1024), null);
  assert.equal(nextThreshold('pair-extraordinaire', 48), null);
});

test('every badge has four ascending tiers', () => {
  for (const [key, badge] of Object.entries(BADGES)) {
    assert.equal(badge.tiers.length, 4, `${key} should have four tiers`);
    const sorted = [...badge.tiers].sort((a, b) => a - b);
    assert.deepEqual(badge.tiers, sorted, `${key} tiers should ascend`);
  }
});
