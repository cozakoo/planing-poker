import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRoomStore } from '../../store/roomStore'
import { Button } from '../ui/Button'

export function HostControls() {
  const room = useRoomStore((s) => s.room)
  const currentRound = useRoomStore((s) => s.currentRound)
  const localParticipant = useRoomStore((s) => s.localParticipant)
  const votes = useRoomStore((s) => s.votes)
  const [loading, setLoading] = useState(false)

  const isHost = localParticipant?.id === room?.host_participant_id
  if (!isHost) return null

  const isRevealed = currentRound?.status === 'revealed'
  const voteCount = Object.keys(votes).length

  async function handleReveal() {
    if (!currentRound || isRevealed) return
    setLoading(true)
    await supabase
      .from('rounds')
      .update({ status: 'revealed', revealed_at: new Date().toISOString() })
      .eq('id', currentRound.id)
    setLoading(false)
  }

  async function handleNewRound() {
    if (!room) return
    setLoading(true)

    // Cerrar ronda actual
    if (currentRound) {
      await supabase
        .from('rounds')
        .update({ status: 'closed' })
        .eq('id', currentRound.id)
    }

    // Crear nueva ronda
    const { data: newRound } = await supabase
      .from('rounds')
      .insert({ room_id: room.id, title: null, status: 'voting' })
      .select()
      .single()

    if (newRound) {
      await supabase
        .from('rooms')
        .update({ current_round_id: newRound.id })
        .eq('id', room.id)
    }

    setLoading(false)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {!isRevealed && (
        <Button
          onClick={handleReveal}
          disabled={loading || voteCount === 0}
          size="md"
        >
          👁 Revelar cartas {voteCount > 0 && `(${voteCount})`}
        </Button>
      )}
      <Button
        onClick={handleNewRound}
        variant="secondary"
        disabled={loading}
        size="md"
      >
        🔄 Nueva ronda
      </Button>
    </div>
  )
}
