import { useEffect, useState } from 'react'
import ProjectType from './commponents/ProjectType'
import CreateForm from './commponents/CreateForm'
import { useDispatch, useSelector } from '@store/index'
import { ModalWrap } from './commponents/style'
import { changeCreateVisible, editProject } from '@store/create-propject'
import { useTranslation } from 'react-i18next'

const CreateProject = () => {
  const { createVisible, isEditId } = useSelector(state => state.createProject)
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [state, setState] = useState(2)
  // 项目类型 选择冲刺2 迭代1
  const [projectType, setProjectType] = useState(0)
  const handleOk = () => {}
  const handleCancel = () => {}

  useEffect(() => {
    if (createVisible) {
      setProjectType(0)
      setIsModalOpen(true)
    } else {
      setIsModalOpen(false)
    }
    isEditId ? setState(2) : setState(1)
  }, [createVisible, isEditId])
  // 关闭大弹窗
  const onClose = () => {
    dispatch(changeCreateVisible(false))
    dispatch(editProject({ visible: false, id: '' }))
  }
  return (
    <ModalWrap
      width={832}
      wrapClassName="vertical-center-modal"
      bodyStyle={{ padding: '0' }}
      open={isModalOpen}
      footer={null}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {state === 1 ? (
        <ProjectType
          title={isEditId ? t('edit_item') : t('common.createProject')}
          projectType={projectType}
          onChange={val => {
            setState(2)
            setProjectType(val)
          }}
          onCancel={onClose}
        />
      ) : (
        <CreateForm
          title={isEditId ? t('edit_item') : t('common.createProject')}
          projectType={projectType}
          onCancel={onClose}
          onBack={() => {
            setState(1)
          }}
        />
      )}
    </ModalWrap>
  )
}
export default CreateProject
