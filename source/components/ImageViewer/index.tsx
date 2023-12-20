import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import Modal from './Modal'
import { EventBusSingle } from '../CalendarManager/eventBusSingle'
import Header from './Header'
import { create } from 'zustand'
import Image from './Image'
import ToolBar from './Toolbar'
import { Params, useImageViewerStore } from './useImageViewerStore'

interface ImageViewerProps {}

const key = 'image-viewer' + Math.random()

const ImageViewer: React.FC<ImageViewerProps> = props => {
  const { open, setOpen, setRotate, setScale, setParams } =
    useImageViewerStore()

  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    setRotate(0)
    setScale(1)
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
