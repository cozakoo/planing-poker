import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useRoomStore } from '../../store/roomStore'
import { Button } from '../ui/Button'

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

  const statusLabel = {
    voting: '🗳 Votando',
    revealed: '👁 Revelado',
    closed: '✅ Cerrado',
  }

  return (
    <header className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div className="flex items-center gap-4 min-w-0">
        <div>
          <h1 className="text-lg font-bold text-white truncate">{room?.name ?? '…'}</h1>
          {currentRound && (
            <span className="text-xs text-slate-400">
              {statusLabel[currentRound.status] ?? currentRound.status}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={copyCode}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-1.5 transition-colors"
        >
          <span className="font-mono font-bold text-slate-200 tracking-widest text-sm">
            {room?.code}
          </span>
          <span className="text-xs text-slate-500">{copied ? '✓ Copiado' : 'Copiar'}</span>
        </button>
        <Button variant="ghost" size="sm" onClick={handleLeave}>
          Salir
        </Button>
      </div>
    </header>
  )
}
