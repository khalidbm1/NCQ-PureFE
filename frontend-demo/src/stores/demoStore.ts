import { create } from 'zustand'

interface DemoState {
  // Tour state
  tourCompleted: boolean
  setTourCompleted: (completed: boolean) => void
  
  // User preferences
  showTooltips: boolean
  toggleTooltips: () => void
  
  // Demo progress
  visitedPages: string[]
  addVisitedPage: (page: string) => void
  
  // Feature highlights
  highlightedFeatures: string[]
  addHighlightedFeature: (feature: string) => void
  
  // Reset demo
  resetDemo: () => void
}

export const useDemoStore = create<DemoState>((set) => ({
  // Tour state
  tourCompleted: false,
  setTourCompleted: (completed) => set({ tourCompleted: completed }),
  
  // User preferences
  showTooltips: true,
  toggleTooltips: () => set((state) => ({ showTooltips: !state.showTooltips })),
  
  // Demo progress
  visitedPages: [],
  addVisitedPage: (page) => set((state) => ({
    visitedPages: [...new Set([...state.visitedPages, page])]
  })),
  
  // Feature highlights
  highlightedFeatures: [],
  addHighlightedFeature: (feature) => set((state) => ({
    highlightedFeatures: [...new Set([...state.highlightedFeatures, feature])]
  })),
  
  // Reset demo
  resetDemo: () => set({
    tourCompleted: false,
    showTooltips: true,
    visitedPages: [],
    highlightedFeatures: [],
  }),
}))