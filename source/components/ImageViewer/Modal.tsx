import React, { useState } from 'react'

interface Props {
  isOpen: boolean
  onClose(): void
  children: React.ReactNode
}

const Modal = (props: Props) => {
  const { isOpen, onClose, children } = props
  const overlayStyle: React.CSSProperties = {
    display: isOpen ? 'block' : 'none',
    position: 'fixed',
    zIndex: 9999999999,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const modalStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <div className="viewer-modal" style={overlayStyle} onClick={onClose}>
      <div
        style={modalStyle}
        onClick={e => {
          e.stopPropagation()
          props.onClose()
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
