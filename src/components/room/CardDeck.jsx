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
    await castVote({ roundId: currentRound.id, participantId: localParticipant.id, value })
  }

  if (!currentRound) return null

  return (
    <div className="text-center">
      <p className="text-secondary small mb-3">
        {isRevealed
          ? <><i className="bi bi-eye me-1"></i>Ronda revelada</>
          : selectedCard
          ? <><i className="bi bi-check-circle-fill text-primary me-1"></i>Votaste: <strong className="text-light">{selectedCard}</strong></>
          : <><i className="bi bi-hand-index me-1"></i>Elegí tu carta</>
        }
      </p>
      <div className="d-flex flex-wrap justify-content-center gap-2">
        {cards.map((value) => {
          let state = 'unselected'
          if (isRevealed) state = 'disabled'
          else if (selectedCard === value) state = 'selected'
          return (
            <Card key={value} value={value} state={state} onClick={() => handleSelect(value)} />
          )
        })}
      </div>
    </div>
  )
}
