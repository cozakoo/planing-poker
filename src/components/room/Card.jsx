export function Card({ value, state = 'unselected', onClick }) {
  // state: 'unselected' | 'selected' | 'disabled' | 'face-down' | 'face-up'
  return (
    <button
      className={`card-poker ${state}`}
      onClick={state === 'unselected' || state === 'selected' ? onClick : undefined}
      disabled={state === 'disabled'}
      aria-label={`Carta ${value}`}
    >
      {state === 'face-down' ? (
        <span className="text-slate-600 text-3xl">🂠</span>
      ) : (
        <span className="text-center leading-none">{value}</span>
      )}
    </button>
  )
}
