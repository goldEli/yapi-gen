import { create } from 'zustand'

export interface Params {
  url: string
  /**
   * 28M
   */
  size?: number
  name?: string
}

export const useImageViewerStore = create<{
  open: boolean
  scale: number
  rotate: number
  params?: Params | null
  isDrag?: boolean
  imageSize?: { w: number; h: number } | null
  setImageSize(d: { w: number; h: number } | null): void
  setIsDrag(isDrag: boolean): void
  setParams(params: Params | null): void
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
  drag: false,
  setImageSize(imageSize) {
    set({ imageSize })
  },
  setIsDrag(isDrag) {
    set({ isDrag })
  },
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
