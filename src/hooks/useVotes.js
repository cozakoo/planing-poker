import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRoomStore } from '../store/roomStore'

export function useVotes(roundId) {
  const setVotes = useRoomStore((s) => s.setVotes)
  const upsertVote = useRoomStore((s) => s.upsertVote)

  useEffect(() => {
    if (!roundId) return

    // Carga inicial
    supabase
      .from('votes')
      .select('*')
      .eq('round_id', roundId)
      .then(({ data }) => { if (data) setVotes(data) })

    // Suscripción en tiempo real
    const channel = supabase
      .channel(`votes:${roundId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes', filter: `round_id=eq.${roundId}` },
        (payload) => upsertVote(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'votes', filter: `round_id=eq.${roundId}` },
        (payload) => upsertVote(payload.new)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roundId, setVotes, upsertVote])
}

export async function castVote({ roundId, participantId, value }) {
  const { error } = await supabase
    .from('votes')
    .upsert(
      { round_id: roundId, participant_id: participantId, value },
      { onConflict: 'round_id,participant_id' }
    )
  return !error
}
