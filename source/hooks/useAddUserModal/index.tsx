import NewAddUserModalForTandD from '@/components/NewAddUserModal/NewAddUserModalForTandD/NewAddUserModalForTandD'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type OnConfirm = React.ComponentProps<
  typeof NewAddUserModalForTandD
>['onConfirm']

const useAddUserModal = () => {
  const [t] = useTranslation()
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const onConfirmRef = useRef<OnConfirm>()
  const open = (options: { onConfirm: OnConfirm; title?: string }) => {
    setVisible(true)
    onConfirmRef.current = options.onConfirm
    setTitle(options.title ?? t('formWork.addUser'))
  }
  const AddUserModalElement = (
    <NewAddUserModalForTandD
      title={title}
      state={2}
      isVisible={visible}
      onConfirm={async data => {
        await onConfirmRef.current?.(data)
        setVisible(false)
      }}
      onClose={() => setVisible(false)}
    />
  )
  return {
    AddUserModalElement,
    open,
  }
}

export default useAddUserModal