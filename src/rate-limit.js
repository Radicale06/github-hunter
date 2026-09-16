// The x-ratelimit-reset header carries the reset time as seconds since the
// epoch. Turn that into something a person can act on.
export function describeReset(resetEpochSeconds, now = Date.now()) {
  const seconds = Math.max(0, Math.round((resetEpochSeconds * 1000 - now) / 1000));

  if (seconds === 0) return 'resets now';
  if (seconds < 60) return `resets in ${seconds}s`;

  const minutes = Math.ceil(seconds / 60);
  return `resets in ${minutes} min`;
}
