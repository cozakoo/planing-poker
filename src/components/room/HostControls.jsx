import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRoomStore } from '../../store/roomStore'

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
    if (currentRound) {
      await supabase.from('rounds').update({ status: 'closed' }).eq('id', currentRound.id)
    }
    const { data: newRound } = await supabase
      .from('rounds')
      .insert({ room_id: room.id, status: 'voting' })
      .select()
      .single()
    if (newRound) {
      await supabase.from('rooms').update({ current_round_id: newRound.id }).eq('id', room.id)
    }
    setLoading(false)
  }

  return (
    <div className="d-flex gap-2 flex-wrap">
      {!isRevealed && (
        <button
          className="btn btn-primary"
          onClick={handleReveal}
          disabled={loading || voteCount === 0}
        >
          <i className="bi bi-eye-fill me-2"></i>
          Revelar cartas {voteCount > 0 && <span className="badge bg-white text-primary ms-1">{voteCount}</span>}
        </button>
      )}
      <button
        className="btn btn-outline-secondary"
        onClick={handleNewRound}
        disabled={loading}
      >
        <i className="bi bi-arrow-clockwise me-2"></i>
        Nueva ronda
      </button>
    </div>
  )
}
