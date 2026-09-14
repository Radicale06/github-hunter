// Tier thresholds for the GitHub achievements that can be measured from
// public API data. Achievements like YOLO and Quickdraw are one-off events
// with no counter behind them, so they are not listed here.

export const BADGES = {
  'pull-shark': {
    name: 'Pull Shark',
    description: 'Pull requests merged',
    tiers: [2, 16, 128, 1024],
  },
  starstruck: {
    name: 'Starstruck',
    description: 'Stars on a repository you own',
    tiers: [16, 128, 512, 4096],
  },
  'pair-extraordinaire': {
    name: 'Pair Extraordinaire',
    description: 'Merged pull requests with a co-author',
    tiers: [1, 10, 24, 48],
  },
  'galaxy-brain': {
    name: 'Galaxy Brain',
    description: 'Accepted answers in discussions',
    tiers: [2, 8, 16, 32],
  },
};

// GitHub renders the tiers above the first one as x2, x3 and x4 next to the
// badge art. Tier 0 means the badge has not been earned yet.
export function tierFor(badge, count) {
  const { tiers } = BADGES[badge];
  let tier = 0;
  for (const threshold of tiers) {
    if (count >= threshold) tier += 1;
  }
  return tier;
}

export function nextThreshold(badge, count) {
  return BADGES[badge].tiers.find((threshold) => count < threshold) ?? null;
}
