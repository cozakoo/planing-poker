// Chars sin ambiguos: sin 0/O, 1/I
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateCode(length = 6) {
  return Array.from({ length }, () =>
    CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('')
}

export function normalizeCode(raw) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
}
