const NUMERIC_RE = /^\d+(\.\d+)?$/

function numericVotes(votes) {
  return votes
    .map((v) => v.value)
    .filter((v) => NUMERIC_RE.test(v))
    .map(Number)
}

export function average(votes) {
  const nums = numericVotes(votes)
  if (!nums.length) return null
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)
}

export function mode(votes) {
  const freq = {}
  votes.forEach((v) => {
    freq[v.value] = (freq[v.value] ?? 0) + 1
  })
  const max = Math.max(...Object.values(freq))
  return Object.entries(freq)
    .filter(([, count]) => count === max)
    .map(([val]) => val)
}

export function distribution(votes) {
  const freq = {}
  votes.forEach((v) => {
    freq[v.value] = (freq[v.value] ?? 0) + 1
  })
  return Object.entries(freq)
    .map(([value, count]) => ({ value, count, pct: Math.round((count / votes.length) * 100) }))
    .sort((a, b) => b.count - a.count)
}

export function hasConsensus(votes) {
  return new Set(votes.map((v) => v.value)).size === 1
}
