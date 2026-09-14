const API = 'https://api.github.com';

class GitHubError extends Error {}

async function request(path) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`${API}${path}`, { headers });

  if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
    throw new GitHubError(
      'GitHub API rate limit reached. Set GITHUB_TOKEN to raise the limit.',
    );
  }
  if (response.status === 404) {
    throw new GitHubError('No such user on GitHub.');
  }
  if (!response.ok) {
    throw new GitHubError(`GitHub API returned ${response.status}.`);
  }

  return response.json();
}

export async function getUser(login) {
  return request(`/users/${encodeURIComponent(login)}`);
}

// The search API caps out at 1000 results per query, but total_count is
// reported accurately regardless, which is all we need for a counter.
export async function countMergedPullRequests(login) {
  const query = `author:${login}+type:pr+is:merged`;
  const result = await request(`/search/issues?q=${query}&per_page=1`);
  return result.total_count;
}

export { GitHubError };
