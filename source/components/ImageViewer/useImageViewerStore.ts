import { create } from 'zustand'

export interface Params {
  url: string
  /**
   * 28M
   */

  name?: string
}

export const useImageViewerStore = create<{
  open: boolean
  scale: number
  rotate: number
  params?: Params
  setParams(params: Params): void
  setOpen(open: boolean): void
  setRotate(rotate: number): void
  setScale(scale: number): void
  zoomIn(): void
  zoomOut(): void
  onRotate(): void
}>(set => ({
  open: false,
  scale: 1,
  rotate: 0,
  setParams(params) {
    set({ params })
  },
  onRotate: () => {
    set(state => {
      return { rotate: state.rotate + 90 }
    })
  },
  setRotate: rotate => {
    set({ rotate })
  },
  setScale: scale => {
    set({ scale })
  },
  setOpen: open => {
    set({ open })
  },
  zoomIn: () => {
    set(state => {
      if (state.scale >= 3) {
        return { scale: state.scale }
      }
      return { scale: fixNum(state.scale + 0.1) }
    })
  },
  zoomOut: () => {
    set(state => {
      if (state.scale <= 0.1) {
        return { scale: state.scale }
      }
      return { scale: fixNum(state.scale - 0.1) }
    })
  },
}))
function fixNum(num: number) {
  const ret = parseFloat(num.toFixed(1))
  return ret
}
