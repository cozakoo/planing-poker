import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../lib/supabase'
import { generateCode, normalizeCode } from '../lib/roomCode'
import { CARD_SETS } from '../lib/cardSets'
import { useRoomStore } from '../store/roomStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function Home() {
  const navigate = useNavigate()
  const setLocalParticipant = useRoomStore((s) => s.setLocalParticipant)

  const [tab, setTab] = useState('create') // 'create' | 'join'
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

    // Crear sala
    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .insert({
        code,
        name: roomName.trim(),
        card_set: cardSet,
        host_participant_id: participantId,
      })
      .select()
      .single()

    if (roomErr) {
      // Reintento si colisión de código
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

    // Crear primera ronda
    const { data: round } = await supabase
      .from('rounds')
      .insert({ room_id: roomData.id, status: 'voting' })
      .select()
      .single()

    if (round) {
      await supabase.from('rooms').update({ current_round_id: round.id }).eq('id', roomData.id)
    }

    // Registrar participante (host)
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

    const { data: room } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', code)
      .single()

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-1">
          <div className="text-5xl">🃏</div>
          <h1 className="text-3xl font-bold text-white">Planning Poker</h1>
          <p className="text-slate-400 text-sm">Estimá en equipo, en tiempo real</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-800/60 rounded-xl p-1">
          {['create', 'join'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'create' ? '✨ Crear sala' : '🚪 Unirse'}
            </button>
          ))}
        </div>

        {/* Create */}
        {tab === 'create' && (
          <form onSubmit={handleCreate} className="space-y-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6">
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
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-300">Set de cartas</label>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(CARD_SETS).map(([key, { label, cards }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCardSet(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      cardSet === key
                        ? 'border-brand-500 bg-brand-600/20 text-brand-300'
                        : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {label}
                    <span className="ml-1.5 text-slate-500">{cards.slice(0, 4).join(' ')}&hellip;</span>
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creando…' : 'Crear sala'}
            </Button>
          </form>
        )}

        {/* Join */}
        {tab === 'join' && (
          <form onSubmit={handleJoin} className="space-y-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6">
            <Input
              label="Código de sala"
              placeholder="A3F9K2"
              value={joinCode}
              onChange={(e) => setJoinCode(normalizeCode(e.target.value))}
              maxLength={6}
              className="font-mono tracking-widest text-center text-lg uppercase"
              required
            />
            <Input
              label="Tu nombre"
              placeholder="Lucas"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Uniéndome…' : 'Unirse'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
