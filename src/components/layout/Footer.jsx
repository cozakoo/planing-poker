export function Footer() {
  return (
    <footer className="app-footer py-3 mt-auto">
      <div className="container d-flex align-items-center justify-content-center gap-4">
        <span className="text-secondary small">
          Hecho por <strong className="text-light">Martín Arcos</strong>
        </span>
        <a
          href="https://github.com/cozakoo"
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center gap-1"
          title="GitHub"
        >
          <i className="bi bi-github fs-5"></i>
          <span className="small">cozakoo</span>
        </a>
        <a
          href="https://linkedin.com/in/martin-arcos"
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center gap-1"
          title="LinkedIn"
        >
          <i className="bi bi-linkedin fs-5"></i>
          <span className="small">martin-arcos</span>
        </a>
      </div>
    </footer>
  )
}
