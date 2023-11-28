import React, { useRef, useState } from 'react'
import styled from '@emotion/styled'
import DeleteConfirm, { DeleteConfirmProps } from '@/components/DeleteConfirm'

interface DeleteConfirmModalProps {}

// interface OpenOptions {
//   title: string
//   text: string
//   onConfirm(): Promise<any>
// }
type ModalProps = Omit<
  DeleteConfirmProps,
  'onConfirm' | 'onChangeVisible' | 'isVisible'
> & {
  onConfirm(): Promise<any>
  onChangeVisible?(): any
}

export const useDeleteConfirmModal = () => {
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false)
  const onConfirm = useRef<ModalProps['onConfirm'] | null>(null)
  const onChangeVisible = useRef<ModalProps['onChangeVisible'] | null>(null)
  const [modalProps, setModalProps] = useState<ModalProps>()

  const open = (options: ModalProps) => {
    setModalProps(options)
    setDeleteModalVisible(true)
    onConfirm.current = options.onConfirm
    onChangeVisible.current = options.onChangeVisible
  }

  const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = props => {
    return (
      <DeleteConfirm
        {...modalProps}
        isVisible={deleteModalVisible}
        onConfirm={async () => {
          await onConfirm.current?.()
          setDeleteModalVisible(false)
        }}
        onChangeVisible={() => {
          setDeleteModalVisible(false)
          onChangeVisible.current?.()
        }}
      />
    )
  }
  return {
    DeleteConfirmModal,
    open,
  }
}

export default useDeleteConfirmModal
