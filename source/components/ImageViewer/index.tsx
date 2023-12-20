import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import Modal from './Modal'
import { EventBusSingle } from '../CalendarManager/eventBusSingle'
import Header from './Header'
import { create } from 'zustand'
import Image from './Image'
import ToolBar from './Toolbar'

interface ImageViewerProps {}

const key = 'image-viewer' + Math.random()

export const useImageViewerStore = create<{
  open: boolean
  scale: number
  rotate: number
  setOpen(open: boolean): void
  setRotate(rotate: number): void
  setScale(scale: number): void
  zoomIn(): void
  zoomOut(): void
  onRotate(): void
}>(set => ({
  open: true,
  scale: 1,
  rotate: 0,
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

const ImageViewer: React.FC<ImageViewerProps> = props => {
  const { open, setOpen, setRotate, setScale } = useImageViewerStore()

  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    setRotate(0)
    setScale(1)
  }
  useEffect(() => {
    EventBusSingle.getInstance().register(`open-${key}`, () => {
      openModal()
    })
  }, [])
  return (
    <Modal isOpen={open} onClose={closeModal}>
      <Header />
      <Image />
      <ToolBar />
    </Modal>
  )
}

export default ImageViewer

export const openImageViewer = () => {
  EventBusSingle.getInstance().dispatch(`open-${key}`)
}
