import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRoomStore } from '../store/roomStore'

export function useParticipants(roomId) {
  const setParticipants = useRoomStore((s) => s.setParticipants)
  const upsertParticipant = useRoomStore((s) => s.upsertParticipant)
  const removeParticipant = useRoomStore((s) => s.removeParticipant)

  useEffect(() => {
    if (!roomId) return

    // Carga inicial
    supabase
      .from('participants')
      .select('*')
      .eq('room_id', roomId)
      .then(({ data }) => { if (data) setParticipants(data) })

    // Suscripción en tiempo real
    const channel = supabase
      .channel(`participants:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` },
        (payload) => upsertParticipant(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` },
        (payload) => upsertParticipant(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` },
        (payload) => removeParticipant(payload.old.id)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId, setParticipants, upsertParticipant, removeParticipant])
}
