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
    <div className="card border-secondary">
      <div className="card-body">
        {consensus ? (
          <div className="text-center py-2">
            <div className="fs-1 mb-1">🎉</div>
            <p className="text-success fw-semibold mb-1">¡Consenso!</p>
            <span className="display-5 fw-bold text-light">{votes[0].value}</span>
          </div>
        ) : (
          <div className="row text-center mb-3 g-3">
            {avg !== null && (
              <div className="col">
                <div className="text-secondary small text-uppercase mb-1" style={{ letterSpacing: '0.08em' }}>Promedio</div>
                <div className="fs-3 fw-bold text-light">{avg}</div>
              </div>
            )}
            <div className="col">
              <div className="text-secondary small text-uppercase mb-1" style={{ letterSpacing: '0.08em' }}>
                {modes.length === 1 ? 'Moda' : 'Empate'}
              </div>
              <div className="fs-3 fw-bold text-light">{modes.join(' / ')}</div>
            </div>
            <div className="col">
              <div className="text-secondary small text-uppercase mb-1" style={{ letterSpacing: '0.08em' }}>Votos</div>
              <div className="fs-3 fw-bold text-light">{votes.length}</div>
            </div>
          </div>
        )}

        {!consensus && (
          <div className="d-flex flex-column gap-2 mt-2">
            {dist.map(({ value, count, pct }) => (
              <div key={value} className="d-flex align-items-center gap-2">
                <span className="text-light fw-bold text-end" style={{ width: 36, fontSize: '0.9rem' }}>{value}</span>
                <div className="flex-grow-1">
                  <div className="progress" style={{ height: 8, backgroundColor: 'var(--bs-secondary-bg)' }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${pct}%`, transition: 'width 0.5s ease' }}
                    />
                  </div>
                </div>
                <span className="text-secondary" style={{ width: 60, fontSize: '0.8rem' }}>{count}x ({pct}%)</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
