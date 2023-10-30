import AddDepartmentOrTeamModal from '@/components/AddDepartmentOrTeamModal'
import NewAddUserModalForTandD from '@/components/NewAddUserModal/NewAddUserModalForTandD/NewAddUserModalForTandD'
import { getProjectIdByUrl } from '@/tools'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type OnConfirm = React.ComponentProps<
  typeof NewAddUserModalForTandD
>['onConfirm']

const useAddUserModal = () => {
  const [t] = useTranslation()
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<any>()
  const [people, setPeople] = useState([])
  const onConfirmRef = useRef<OnConfirm>()
  const open = (options: {
    type?: number | undefined
    onConfirm: OnConfirm
    title?: string
    people?: any
  }) => {
    setType(options?.type)
    setVisible(true)
    setPeople(options.people)
    onConfirmRef.current = options.onConfirm
    setTitle(options.title ?? t('formWork.addUser'))
  }
  const AddUserModalElement = type ? (
    <NewAddUserModalForTandD
      defaultPeople={people}
      title={title}
      state={2}
      isVisible={visible}
      onConfirm={async data => {
        await onConfirmRef.current?.(data)
        setVisible(false)
      }}
      onClose={() => setVisible(false)}
    />
  ) : (
    <AddDepartmentOrTeamModal
      users={people}
      projectId={getProjectIdByUrl()}
      type={2}
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
