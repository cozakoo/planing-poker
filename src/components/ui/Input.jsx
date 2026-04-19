export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label text-secondary-emphasis fw-medium">{label}</label>
      )}
      <input
        className={`form-control bg-dark border-secondary text-light ${error ? 'is-invalid' : ''} ${className}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  )
}
