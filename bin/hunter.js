#!/usr/bin/env node
import { BADGES, tierFor, nextThreshold } from '../src/badges.js';
import {
  getUser,
  countMergedPullRequests,
  getTopRepoStars,
  GitHubError,
} from '../src/github.js';

const USAGE = `github-hunter - track your progress toward GitHub achievements

Usage:
  github-hunter <username> [--json]

Options:
  --json        print the report as JSON instead of text

Environment:
  GITHUB_TOKEN  optional token, raises the API rate limit
`;

function entry(badge, count, extra = {}) {
  const { name, description } = BADGES[badge];
  return {
    badge,
    name,
    description,
    count,
    tier: tierFor(badge, count),
    next: nextThreshold(badge, count),
    ...extra,
  };
}

function printText(user, achievements) {
  console.log(`${user.name ?? user.login} (@${user.login})\n`);

  for (const item of achievements) {
    const label = item.tier === 0 ? 'not earned' : `tier ${item.tier}`;
    const remaining =
      item.next === null ? 'max tier reached' : `${item.next - item.count} to go`;

    console.log(`${item.name} (${label})`);
    console.log(`  ${item.description}: ${item.count} - ${remaining}`);
    if (item.repository) {
      console.log(`  most starred: ${item.repository}`);
    }
  }
}

function printJson(user, achievements) {
  const report = {
    user: { login: user.login, name: user.name ?? null },
    achievements,
  };
  console.log(JSON.stringify(report, null, 2));
}

async function main() {
  const args = process.argv.slice(2);
  const wantsHelp = args.includes('--help') || args.includes('-h');
  const asJson = args.includes('--json');
  const login = args.find((arg) => !arg.startsWith('-'));

  if (wantsHelp || !login) {
    console.log(USAGE);
    process.exit(wantsHelp ? 0 : 1);
  }

  const user = await getUser(login);
  const merged = await countMergedPullRequests(user.login);
  const top = await getTopRepoStars(user.login);

  const achievements = [
    entry('pull-shark', merged),
    entry('starstruck', top.stars, { repository: top.name }),
  ];

  if (asJson) {
    printJson(user, achievements);
  } else {
    printText(user, achievements);
  }
}

main().catch((error) => {
  if (error instanceof GitHubError) {
    console.error(error.message);
    process.exit(1);
  }
  throw error;
});
