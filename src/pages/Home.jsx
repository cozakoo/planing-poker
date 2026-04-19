import { useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../lib/supabase'
import { generateCode, normalizeCode } from '../lib/roomCode'
import { CARD_SETS } from '../lib/cardSets'
import { useRoomStore } from '../store/roomStore'
import { Input } from '../components/ui/Input'

export default function Home() {
  const navigate = useNavigate()
  const setLocalParticipant = useRoomStore((s) => s.setLocalParticipant)

  const [tab, setTab] = useState('create')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Create form
  const [roomName, setRoomName] = useState('')
  const [cardSet, setCardSet] = useState('fibonacci')
  const [hostName, setHostName] = useState('')

  // Join form
  const [joinCode, setJoinCode] = useState('')
  const [joinName, setJoinName] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    if (!roomName.trim() || !hostName.trim()) return
    setLoading(true)
    setError('')

    const participantId = uuidv4()
    let code = generateCode()

    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .insert({ code, name: roomName.trim(), card_set: cardSet, host_participant_id: participantId })
      .select()
      .single()

    if (roomErr) {
      code = generateCode()
      const retry = await supabase
        .from('rooms')
        .insert({ code, name: roomName.trim(), card_set: cardSet, host_participant_id: participantId })
        .select()
        .single()
      if (retry.error) {
        setError('Error al crear la sala. Intentá de nuevo.')
        setLoading(false)
        return
      }
    }

    const roomData = room ?? (await supabase.from('rooms').select().eq('code', code).single()).data

    const { data: round } = await supabase
      .from('rounds')
      .insert({ room_id: roomData.id, status: 'voting' })
      .select()
      .single()

    if (round) {
      await supabase.from('rooms').update({ current_round_id: round.id }).eq('id', roomData.id)
    }

    await supabase.from('participants').insert({
      id: participantId,
      room_id: roomData.id,
      username: hostName.trim(),
    })

    const participant = { id: participantId, username: hostName.trim(), room_id: roomData.id }
    localStorage.setItem('pp_participant', JSON.stringify(participant))
    setLocalParticipant(participant)
    navigate(`/room/${roomData.code}`)
  }

  async function handleJoin(e) {
    e.preventDefault()
    if (!joinCode.trim() || !joinName.trim()) return
    setLoading(true)
    setError('')

    const code = normalizeCode(joinCode)
    const { data: room } = await supabase.from('rooms').select('*').eq('code', code).single()

    if (!room) {
      setError('Sala no encontrada. Revisá el código.')
      setLoading(false)
      return
    }

    const participantId = uuidv4()
    await supabase.from('participants').insert({
      id: participantId,
      room_id: room.id,
      username: joinName.trim(),
    })

    const participant = { id: participantId, username: joinName.trim(), room_id: room.id }
    localStorage.setItem('pp_participant', JSON.stringify(participant))
    setLocalParticipant(participant)
    navigate(`/room/${room.code}`)
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="w-100" style={{ maxWidth: 460 }}>

        {/* Hero */}
        <div className="text-center mb-4">
          <i className="bi bi-suit-spade-fill text-primary" style={{ fontSize: '3rem' }}></i>
          <h1 className="fw-bold text-light mt-2 mb-1">Planning Poker</h1>
          <p className="text-secondary">Estimá en equipo, en tiempo real</p>
        </div>

        {/* Tabs */}
        <ul className="nav nav-pills nav-fill mb-3 p-1 rounded-3" style={{ background: 'var(--bs-card-bg)' }}>
          <li className="nav-item">
            <button
              className={`nav-link w-100 ${tab === 'create' ? 'active' : 'text-secondary'}`}
              onClick={() => { setTab('create'); setError('') }}
            >
              <i className="bi bi-plus-circle me-1"></i>Crear sala
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link w-100 ${tab === 'join' ? 'active' : 'text-secondary'}`}
              onClick={() => { setTab('join'); setError('') }}
            >
              <i className="bi bi-door-open me-1"></i>Unirse
            </button>
          </li>
        </ul>

        {/* Create */}
        {tab === 'create' && (
          <form onSubmit={handleCreate} className="card border-secondary p-4">
            <Input
              label="Nombre de la sala"
              placeholder="Sprint 12 — Backend"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
            <Input
              label="Tu nombre"
              placeholder="Martín"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              required
            />

            <label className="form-label text-secondary-emphasis fw-medium mb-2">Set de cartas</label>
            <div className="btn-group w-100 mb-3" role="group">
              {Object.entries(CARD_SETS).map(([key, { label }]) => (
                <Fragment key={key}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="cardSet"
                    id={`cs-${key}`}
                    checked={cardSet === key}
                    onChange={() => setCardSet(key)}
                  />
                  <label className="btn btn-outline-primary btn-sm" htmlFor={`cs-${key}`}>
                    {label}
                  </label>
                </Fragment>
              ))}
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Creando…</>
                : <><i className="bi bi-plus-circle me-2"></i>Crear sala</>
              }
            </button>
          </form>
        )}

        {/* Join */}
        {tab === 'join' && (
          <form onSubmit={handleJoin} className="card border-secondary p-4">
            <div className="mb-3">
              <label className="form-label text-secondary-emphasis fw-medium">Código de sala</label>
              <input
                className="form-control bg-dark border-secondary text-light text-center fw-bold font-monospace"
                style={{ fontSize: '1.4rem', letterSpacing: '0.3em' }}
                placeholder="A3F9K2"
                value={joinCode}
                onChange={(e) => setJoinCode(normalizeCode(e.target.value))}
                maxLength={6}
                required
              />
            </div>
            <Input
              label="Tu nombre"
              placeholder="Lucas"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              required
            />
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Uniéndome…</>
                : <><i className="bi bi-door-open me-2"></i>Unirse</>
              }
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

