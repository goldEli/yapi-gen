import React, { useRef, useState } from 'react'
import RepeatConfirm, { RepeatConfirmProps } from '@/components/RepeatConfirm'

interface DeleteConfirmModalProps {}
type ModalProps = Omit<
  RepeatConfirmProps,
  'onConfirm' | 'onChangeVisible' | 'isVisible'
> & {
  onConfirm(): Promise<any>
}

export const useRepeatConfirmModal = () => {
  const [repeatModalVisible, setRepeatModalVisible] = React.useState(false)
  const onConfirm = useRef<ModalProps['onConfirm'] | null>(null)
  const [modalProps, setModalProps] = useState<ModalProps>()

  const open = (options: ModalProps) => {
    setModalProps(options)
    setRepeatModalVisible(true)
    onConfirm.current = options.onConfirm
  }

  const RepeatConfirmModal: React.FC<DeleteConfirmModalProps> = props => {
    return (
      <RepeatConfirm
        {...modalProps}
        isVisible={repeatModalVisible}
        onConfirm={async () => {
          await onConfirm.current?.()
          setRepeatModalVisible(false)
        }}
        onChangeVisible={() => {
          setRepeatModalVisible(false)
        }}
      />
    )
  }
  return {
    RepeatConfirmModal,
    open,
  }
}

export default useRepeatConfirmModal
