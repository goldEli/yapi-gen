import React, { useState, useRef } from 'react'
import styled from '@emotion/styled'
import DeleteConfirm, { DeleteConfirmProps } from '@/components/DeleteConfirm'
import { EventBus } from '../CalendarManager/eventBus'

interface DeleteConfirmGlobalModalProps {}

type ModalProps = Omit<
  DeleteConfirmProps,
  'onConfirm' | 'onChangeVisible' | 'isVisible'
> & {
  onConfirm(): Promise<any>
}
const KEY = 'openModal'
const DeleteConfirmGlobalModal: React.FC<
  DeleteConfirmGlobalModalProps
> = props => {
  const [visible, setVisible] = useState(false)
  const onConfirm = useRef<ModalProps['onConfirm'] | null>(null)
  const [modalProps, setModalProps] = useState<ModalProps>()

  // const open = (options: ModalProps) => {
  //   setModalProps(options)
  //   setVisible(true)
  //   onConfirm.current = options.onConfirm
  // }

  React.useEffect(() => {
    EventBus.getInstance().register(KEY, (options: ModalProps) => {
      setModalProps(options)
      setVisible(true)
      onConfirm.current = options.onConfirm
    })
  }, [])
  return (
    <DeleteConfirm
      {...modalProps}
      isVisible={visible}
      onConfirm={() => {
        onConfirm.current?.()
        setVisible(false)
      }}
      onChangeVisible={() => {
        setVisible(false)
        modalProps?.onCancel?.()
      }}
    />
  )
}

export const openConfirmModal = (options: ModalProps) => {
  EventBus.getInstance().dispatch(KEY, options)
}

export default DeleteConfirmGlobalModal
