#!/usr/bin/env node
import { BADGES, tierFor, nextThreshold } from '../src/badges.js';
import { getUser, countMergedPullRequests, GitHubError } from '../src/github.js';

const USAGE = `github-hunter - track your progress toward GitHub achievements

Usage:
  github-hunter <username>

Environment:
  GITHUB_TOKEN  optional token, raises the API rate limit
`;

function report(badge, count) {
  const { name, description } = BADGES[badge];
  const tier = tierFor(badge, count);
  const next = nextThreshold(badge, count);
  const label = tier === 0 ? 'not earned' : `tier ${tier}`;
  const remaining = next === null ? 'max tier reached' : `${next - count} to go`;

  console.log(`${name} (${label})`);
  console.log(`  ${description}: ${count} - ${remaining}`);
}

async function main() {
  const [login] = process.argv.slice(2);

  if (!login || login === '--help' || login === '-h') {
    console.log(USAGE);
    process.exit(login ? 0 : 1);
  }

  const user = await getUser(login);
  console.log(`${user.name ?? user.login} (@${user.login})\n`);

  report('pull-shark', await countMergedPullRequests(user.login));
}

main().catch((error) => {
  if (error instanceof GitHubError) {
    console.error(error.message);
    process.exit(1);
  }
  throw error;
});
