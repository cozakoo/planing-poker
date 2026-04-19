import { create } from 'zustand'

export const useRoomStore = create((set, get) => ({
  // Identidad local (persiste en localStorage)
  localParticipant: null,

  // Sala y ronda actual
  room: null,
  currentRound: null,

  // Colecciones como maps para O(1) lookup
  participants: {},   // { [id]: participant }
  votes: {},          // { [participantId]: vote }

  // UI
  selectedCard: null,

  // --- Actions ---
  setLocalParticipant: (p) => set({ localParticipant: p }),

  setRoom: (room) => set({ room }),

  setCurrentRound: (round) => {
    const prev = get().currentRound
    // Si cambia la ronda, limpiamos votos y selección
    if (prev?.id !== round?.id) {
      set({ currentRound: round, votes: {}, selectedCard: null })
    } else {
      set({ currentRound: round })
    }
  },

  setParticipants: (list) => {
    const map = {}
    list.forEach((p) => { map[p.id] = p })
    set({ participants: map })
  },

  upsertParticipant: (p) =>
    set((s) => ({ participants: { ...s.participants, [p.id]: p } })),

  removeParticipant: (id) =>
    set((s) => {
      const { [id]: _removed, ...rest } = s.participants
      return { participants: rest }
    }),

  setVotes: (list) => {
    const map = {}
    list.forEach((v) => { map[v.participant_id] = v })
    set({ votes: map })
  },

  upsertVote: (v) =>
    set((s) => ({ votes: { ...s.votes, [v.participant_id]: v } })),

  removeVote: (participantId) =>
    set((s) => {
      const { [participantId]: _removed, ...rest } = s.votes
      return { votes: rest }
    }),

  setSelectedCard: (card) => set({ selectedCard: card }),

  resetRound: () => set({ votes: {}, selectedCard: null }),

  // Selectores derivados (fuera del store, en los hooks/components)
}))
