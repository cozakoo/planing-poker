import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRoomStore } from '../store/roomStore'

export function useRounds(roomId) {
  const setCurrentRound = useRoomStore((s) => s.setCurrentRound)
  const room = useRoomStore((s) => s.room)

  useEffect(() => {
    if (!roomId) return

    const channel = supabase
      .channel(`rounds:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rounds', filter: `room_id=eq.${roomId}` },
        (payload) => {
          // Solo actualizar si es la ronda activa del room
          setCurrentRound(payload.new)
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rounds', filter: `room_id=eq.${roomId}` },
        (payload) => {
          if (payload.new.id === room?.current_round_id) {
            setCurrentRound(payload.new)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId, room?.current_round_id, setCurrentRound])
}
