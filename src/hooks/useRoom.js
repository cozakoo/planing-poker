import { useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useRoomStore } from '../store/roomStore'

export function useRoom(roomCode) {
  const setRoom = useRoomStore((s) => s.setRoom)
  const setCurrentRound = useRoomStore((s) => s.setCurrentRound)
  const room = useRoomStore((s) => s.room)

  const fetchRoom = useCallback(async () => {
    if (!roomCode) return

    const { data: roomData, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', roomCode.toUpperCase())
      .single()

    if (error || !roomData) return null

    setRoom(roomData)

    if (roomData.current_round_id) {
      const { data: roundData } = await supabase
        .from('rounds')
        .select('*')
        .eq('id', roomData.current_round_id)
        .single()
      if (roundData) setCurrentRound(roundData)
    }

    return roomData
  }, [roomCode, setRoom, setCurrentRound])

  useEffect(() => {
    fetchRoom()

    // Suscripción a cambios en rooms (host cambia current_round_id)
    if (!roomCode) return
    const channel = supabase
      .channel(`room:${roomCode}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `code=eq.${roomCode.toUpperCase()}` },
        (payload) => setRoom(payload.new)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomCode, fetchRoom, setRoom])

  return { room, refetch: fetchRoom }
}
