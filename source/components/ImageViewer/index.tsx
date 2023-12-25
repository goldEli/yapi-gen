import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { EventBusSingle } from '../CalendarManager/eventBusSingle'
import Header from './Header'
import Image from './Image'
import ToolBar from './Toolbar'
import { Params, useImageViewerStore } from './useImageViewerStore'

interface ImageViewerProps {}

const key = 'image-viewer' + Math.random()

const ImageViewer: React.FC<ImageViewerProps> = props => {
  const { open, setOpen, setRotate, setScale, setParams, setImageSize } =
    useImageViewerStore()

  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    setRotate(0)
    setScale(1)
    setImageSize(null)
    setParams(null)
  }
  useEffect(() => {
    EventBusSingle.getInstance().register(`open-${key}`, (p: Params) => {
      setParams({
        url: p.url,
        name: p.name ? p.name : p.url?.split('/').pop(),
      })
      openModal()
    })
  }, [])
  useEffect(() => {
    EventBusSingle.getInstance().register(`close-${key}`, () => {
      closeModal()
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

export const openImageViewer = (p: Params) => {
  EventBusSingle.getInstance().dispatch(`open-${key}`, p)
}
export const closeImageViewer = () => {
  EventBusSingle.getInstance().dispatch(`close-${key}`)
}