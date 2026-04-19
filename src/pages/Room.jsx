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

  const room = useRoomStore((s) => s.room)
  const currentRound = useRoomStore((s) => s.currentRound)

  const { refetch } = useRoom(code)

  useEffect(() => {
    const stored = localStorage.getItem('pp_participant')
    if (!stored) { navigate('/'); return }

    refetch().then((roomData) => {
      if (!roomData) { navigate('/'); return }
      const participant = JSON.parse(stored)
      if (participant.room_id !== roomData.id) { navigate('/'); return }
      setLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useParticipants(room?.id)
  useRounds(room?.id)
  useVotes(currentRound?.id)

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-center text-secondary">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="mb-0">Cargando sala…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-xl py-4">
      <RoomHeader />
      <div className="row g-4">

        {/* Sidebar — participantes */}
        <div className="col-12 col-lg-3">
          <div className="card border-secondary h-100">
            <div className="card-body">
              <ParticipantList />
            </div>
          </div>
        </div>

        {/* Main — votación */}
        <div className="col-12 col-lg-9 d-flex flex-column gap-3">
          <HostControls />
          <VotingResults />
          <div className="card border-secondary flex-grow-1">
            <div className="card-body d-flex align-items-center justify-content-center py-5">
              <CardDeck />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
