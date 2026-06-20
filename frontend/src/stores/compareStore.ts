import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { University } from '@/types'

interface CompareState {
  compareList: University[]
  addToCompare: (university: University) => void
  removeFromCompare: (universityId: string) => void
  clearCompare: () => void
  isInCompare: (universityId: string) => boolean
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareList: [],
      addToCompare: (university) => {
        const { compareList } = get()
        if (compareList.length >= 4) return
        if (!compareList.find((u) => u.id === university.id)) {
          set({ compareList: [...compareList, university] })
        }
      },
      removeFromCompare: (universityId) => {
        set({
          compareList: get().compareList.filter((u) => u.id !== universityId),
        })
      },
      clearCompare: () => set({ compareList: [] }),
      isInCompare: (universityId) =>
        !!get().compareList.find((u) => u.id === universityId),
    }),
    {
      name: 'compare-storage',
    }
  )
)
