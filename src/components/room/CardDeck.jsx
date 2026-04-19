import { Card } from './Card'
import { useRoomStore } from '../../store/roomStore'
import { getCards } from '../../lib/cardSets'
import { castVote } from '../../hooks/useVotes'

export function CardDeck() {
  const room = useRoomStore((s) => s.room)
  const currentRound = useRoomStore((s) => s.currentRound)
  const selectedCard = useRoomStore((s) => s.selectedCard)
  const setSelectedCard = useRoomStore((s) => s.setSelectedCard)
  const localParticipant = useRoomStore((s) => s.localParticipant)

  const isRevealed = currentRound?.status === 'revealed'
  const cards = getCards(room?.card_set, room?.custom_cards)

  async function handleSelect(value) {
    if (isRevealed || !currentRound || !localParticipant) return
    setSelectedCard(value)
    await castVote({
      roundId: currentRound.id,
      participantId: localParticipant.id,
      value,
    })
  }

  if (!currentRound) return null

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-slate-400">
        {isRevealed ? 'Ronda revelada' : selectedCard ? `Votaste: ${selectedCard}` : 'Elegí tu carta'}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {cards.map((value) => {
          let state = 'unselected'
          if (isRevealed) state = 'disabled'
          else if (selectedCard === value) state = 'selected'
          return (
            <Card
              key={value}
              value={value}
              state={state}
              onClick={() => handleSelect(value)}
            />
          )
        })}
      </div>
    </div>
  )
}
