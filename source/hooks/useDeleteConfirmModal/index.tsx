import React, { useRef } from 'react'
import styled from '@emotion/styled'
import DeleteConfirm from '@/components/DeleteConfirm'

interface DeleteConfirmModalProps {}

interface OpenOptions {
  title: string
  text: string
  onConfirm(): Promise<any>
}

export const useDeleteConfirmModal = () => {
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [text, setText] = React.useState('')
  const onConfirm = useRef<OpenOptions['onConfirm'] | null>(null)

  const open = (options: OpenOptions) => {
    setDeleteModalVisible(true)
    setTitle(options.title)
    setText(options.text)
    onConfirm.current = options.onConfirm
  }

  const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = props => {
    return (
      <DeleteConfirm
        isVisible={deleteModalVisible}
        title={title}
        text={text}
        onConfirm={() => {
          onConfirm.current?.().then(() => {
            setDeleteModalVisible(false)
          })
        }}
        onChangeVisible={() => {
          setDeleteModalVisible(false)
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
