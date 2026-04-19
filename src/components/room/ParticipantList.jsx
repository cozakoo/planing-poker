import { useRoomStore } from '../../store/roomStore'

function Avatar({ name }) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div
      className="rounded-circle bg-primary d-flex align-items-center justify-content-center flex-shrink-0 fw-bold text-white"
      style={{ width: 36, height: 36, fontSize: '0.75rem' }}
    >
      {initials}
    </div>
  )
}

export function ParticipantList() {
  const participantsMap = useRoomStore((s) => s.participants)
  const participants = Object.values(participantsMap)
  const votes = useRoomStore((s) => s.votes)
  const currentRound = useRoomStore((s) => s.currentRound)
  const room = useRoomStore((s) => s.room)

  const isRevealed = currentRound?.status === 'revealed'

  return (
    <div>
      <p className="text-uppercase text-secondary small fw-semibold mb-2" style={{ letterSpacing: '0.08em' }}>
        <i className="bi bi-people-fill me-1"></i>Participantes ({participants.length})
      </p>
      <ul className="list-group list-group-flush">
        {participants.map((p) => {
          const vote = votes[p.id]
          const isHost = p.id === room?.host_participant_id
          return (
            <li key={p.id} className="list-group-item bg-transparent border-secondary d-flex align-items-center gap-2 px-0 py-2">
              <Avatar name={p.username} />
              <div className="flex-grow-1 min-w-0">
                <span className="text-light fw-medium text-truncate d-block" style={{ fontSize: '0.9rem' }}>
                  {p.username}
                  {isHost && (
                    <span className="badge bg-primary ms-2 fw-normal" style={{ fontSize: '0.65rem' }}>host</span>
                  )}
                </span>
              </div>
              {currentRound && (
                <div className="flex-shrink-0">
                  {!vote ? (
                    <span className="text-secondary">—</span>
                  ) : isRevealed ? (
                    <span className="badge bg-success fs-6 px-2">{vote.value}</span>
                  ) : (
                    <span
                      className="d-inline-block bg-primary rounded"
                      style={{ width: 20, height: 28 }}
                      title="Votó"
                    />
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
