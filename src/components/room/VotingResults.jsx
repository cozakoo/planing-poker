import { useRoomStore } from '../../store/roomStore'
import { average, mode, distribution, hasConsensus } from '../../lib/stats'

export function VotingResults() {
  const currentRound = useRoomStore((s) => s.currentRound)
  const votesMap = useRoomStore((s) => s.votes)
  const votes = Object.values(votesMap)

  if (currentRound?.status !== 'revealed' || !votes.length) return null

  const avg = average(votes)
  const modes = mode(votes)
  const dist = distribution(votes)
  const consensus = hasConsensus(votes)

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-4">
      {consensus ? (
        <div className="text-center space-y-1">
          <div className="text-4xl">🎉</div>
          <p className="text-emerald-400 font-semibold">¡Consenso!</p>
          <p className="text-3xl font-bold text-white">{votes[0].value}</p>
        </div>
      ) : (
        <div className="flex justify-around text-center">
          {avg !== null && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Promedio</p>
              <p className="text-2xl font-bold text-white">{avg}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
              {modes.length === 1 ? 'Moda' : 'Empate'}
            </p>
            <p className="text-2xl font-bold text-white">{modes.join(' / ')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Votos</p>
            <p className="text-2xl font-bold text-white">{votes.length}</p>
          </div>
        </div>
      )}

      {/* Distribución */}
      {!consensus && (
        <div className="space-y-2">
          {dist.map(({ value, count, pct }) => (
            <div key={value} className="flex items-center gap-3">
              <span className="w-10 text-right text-sm font-bold text-slate-300">{value}</span>
              <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-10">{count}x ({pct}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
