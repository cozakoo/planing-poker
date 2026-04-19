import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { useParticipants } from '../hooks/useParticipants'
import { useVotes } from '../hooks/useVotes'
import { useRounds } from '../hooks/useRounds'
import { useRoomStore } from '../store/roomStore'
import { RoomHeader } from '../components/room/RoomHeader'
import { ParticipantList } from '../components/room/ParticipantList'
import { CardDeck } from '../components/room/CardDeck'
import { VotingResults } from '../components/room/VotingResults'
import { HostControls } from '../components/room/HostControls'

export default function Room() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const localParticipant = useRoomStore((s) => s.localParticipant)
  const room = useRoomStore((s) => s.room)
  const currentRound = useRoomStore((s) => s.currentRound)

  const { refetch } = useRoom(code)

  useEffect(() => {
    const stored = localStorage.getItem('pp_participant')
    if (!stored) {
      navigate('/')
      return
    }
    // Cargar sala y verificar que el participante pertenece a esta sala
    refetch().then((roomData) => {
      if (!roomData) {
        navigate('/')
        return
      }
      const participant = JSON.parse(stored)
      if (participant.room_id !== roomData.id) {
        navigate('/')
        return
      }
      setLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useParticipants(room?.id)
  useRounds(room?.id)
  useVotes(currentRound?.id)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 animate-pulse">Cargando sala…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col max-w-6xl mx-auto px-4 py-6 gap-6">
      <RoomHeader />

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Sidebar — participantes */}
        <aside className="w-full lg:w-72 shrink-0">
          <ParticipantList />
        </aside>

        {/* Main — votación */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Controles del host */}
          <HostControls />

          {/* Resultados (solo cuando está revelado) */}
          <VotingResults />

          {/* Mazo de cartas */}
          <div className="flex-1 flex items-center justify-center">
            <CardDeck />
          </div>
        </main>
      </div>
    </div>
  )
}
