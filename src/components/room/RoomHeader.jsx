import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useRoomStore } from '../../store/roomStore'

const STATUS_BADGE = {
  voting:   { label: 'Votando',  cls: 'bg-primary' },
  revealed: { label: 'Revelado', cls: 'bg-success' },
  closed:   { label: 'Cerrado',  cls: 'bg-secondary' },
}

export function RoomHeader() {
  const room = useRoomStore((s) => s.room)
  const currentRound = useRoomStore((s) => s.currentRound)
  const localParticipant = useRoomStore((s) => s.localParticipant)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  function copyCode() {
    navigator.clipboard.writeText(room?.code ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleLeave() {
    if (localParticipant) {
      await supabase.from('participants').delete().eq('id', localParticipant.id)
    }
    navigate('/')
  }

  const status = STATUS_BADGE[currentRound?.status]

  return (
    <nav className="navbar border-bottom border-secondary px-0 mb-3" style={{ background: 'var(--bs-card-bg)' }}>
      <div className="container-fluid px-3">
        {/* Left: room name + status */}
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-suit-spade-fill text-primary fs-5"></i>
          <span className="fw-bold text-light fs-5">{room?.name ?? '…'}</span>
          {status && (
            <span className={`badge ${status.cls}`} style={{ fontSize: '0.7rem' }}>{status.label}</span>
          )}
        </div>

        {/* Right: code + leave */}
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-outline-secondary room-code-badge"
            onClick={copyCode}
            title="Copiar código"
          >
            <i className={`bi ${copied ? 'bi-check-lg text-success' : 'bi-clipboard'} me-1`}></i>
            {room?.code}
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={handleLeave}>
            <i className="bi bi-box-arrow-right me-1"></i>Salir
          </button>
        </div>
      </div>
    </nav>
  )
}
