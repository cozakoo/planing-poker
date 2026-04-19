import { useRoomStore } from '../../store/roomStore'

function Avatar({ name }) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div className="w-9 h-9 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
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
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
        Participantes ({participants.length})
      </h3>
      {participants.map((p) => {
        const vote = votes[p.id]
        const isHost = p.id === room?.host_participant_id
        return (
          <div
            key={p.id}
            className="flex items-center gap-3 bg-slate-800/60 rounded-lg px-3 py-2"
          >
            <Avatar name={p.username} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {p.username}
                {isHost && (
                  <span className="ml-1.5 text-xs text-brand-400 font-normal">host</span>
                )}
              </p>
            </div>
            {/* Estado del voto */}
            {currentRound && (
              <div className="shrink-0">
                {!vote ? (
                  <span className="text-xs text-slate-600">—</span>
                ) : isRevealed ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300 text-sm font-bold border border-emerald-700">
                    {vote.value}
                  </span>
                ) : (
                  <span className="w-5 h-7 rounded bg-brand-700 inline-block" title="Votó" />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
