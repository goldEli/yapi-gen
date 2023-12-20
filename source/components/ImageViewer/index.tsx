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
  setOpen(open: boolean): void
}>(set => ({
  open: false,
  setOpen: open => {
    set({ open })
  },
}))

const ImageViewer: React.FC<ImageViewerProps> = props => {
  const { open, setOpen } = useImageViewerStore()

  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
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
