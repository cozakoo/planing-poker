export function Card({ value, state = 'unselected', onClick }) {
  // state: 'unselected' | 'selected' | 'disabled' | 'face-down' | 'face-up'
  return (
    <button
      className={`poker-card ${state} border-0`}
      onClick={state === 'unselected' || state === 'selected' ? onClick : undefined}
      disabled={state === 'disabled'}
      aria-label={`Carta ${value}`}
    >
      {state === 'face-down' ? (
        <i className="bi bi-suit-spade-fill opacity-25 fs-4"></i>
      ) : (
        <span>{value}</span>
      )}
    </button>
  )
}
