# github-hunter

Track your progress toward GitHub profile achievements from the command line.

GitHub shows the badges you have earned, but not how close you are to the next
tier. `github-hunter` reads your public activity and fills in the gap.

## Usage

No install step and no dependencies - Node 18 or newer is all you need.

```
node bin/hunter.js <username>
```

```
Oussama Chaabene (@Radicale06)

Pull Shark (tier 1)
  Pull requests merged: 2 - 14 to go
```

Unauthenticated requests to the GitHub search API are limited to 10 per
minute. Set `GITHUB_TOKEN` to a personal access token to raise that limit:

```
GITHUB_TOKEN=ghp_... node bin/hunter.js <username>
```

## Achievement tiers

| Achievement | Counter | Tiers |
| --- | --- | --- |
| Pull Shark | Pull requests merged | 2 / 16 / 128 / 1024 |
| Starstruck | Stars on a repository you own | 16 / 128 / 512 / 4096 |
| Pair Extraordinaire | Merged pull requests with a co-author | 1 / 10 / 24 / 48 |
| Galaxy Brain | Accepted answers in discussions | 2 / 8 / 16 / 32 |

Three achievements have no counter behind them and so are not tracked here:

- **Quickdraw** - close an issue or pull request within five minutes of opening it.
- **YOLO** - merge a pull request without a review.
- **Public Sponsor** - sponsor someone through GitHub Sponsors, publicly.

Two more are retired and can no longer be earned: Arctic Code Vault Contributor
and Mars 2020 Helicopter Contributor.

## Notes

Achievements are computed from public activity and are not granted instantly -
expect a delay of anywhere from a few hours to a couple of days. If none of
them show up at all, check that **Show Achievements on my profile** is enabled
under Settings, and that the email on your commits is verified on your account.

## License

MIT
