import { useEffect } from 'react'
import { useRoomStore } from '../store/roomStore'

const STORAGE_KEY = 'pp_participant'

export function useLocalParticipant() {
  const localParticipant = useRoomStore((s) => s.localParticipant)
  const setLocalParticipant = useRoomStore((s) => s.setLocalParticipant)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setLocalParticipant(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [setLocalParticipant])

  function saveParticipant(participant) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participant))
    setLocalParticipant(participant)
  }

  function clearParticipant() {
    localStorage.removeItem(STORAGE_KEY)
    setLocalParticipant(null)
  }

  return { localParticipant, saveParticipant, clearParticipant }
}
