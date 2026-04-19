export const CARD_SETS = {
  fibonacci: {
    label: 'Fibonacci',
    cards: ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?', '☕'],
  },
  tshirt: {
    label: 'T-Shirt',
    cards: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'],
  },
  powers: {
    label: 'Potencias de 2',
    cards: ['1', '2', '4', '8', '16', '32', '64', '?'],
  },
}

export function getCards(cardSet, customCards = []) {
  if (cardSet === 'custom') return customCards
  return CARD_SETS[cardSet]?.cards ?? CARD_SETS.fibonacci.cards
}

export function parseCustomCards(raw) {
  return raw
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
}
