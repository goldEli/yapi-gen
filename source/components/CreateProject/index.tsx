import { useEffect, useState } from 'react'
import ProjectType from './commponents/ProjectType'
import CreateForm from './commponents/CreateForm'
import { useDispatch, useSelector } from '@store/index'
import { ModalWrap } from './commponents/style'
import { changeCreateVisible, editProject } from '@store/create-propject'

const CreateProject = () => {
  const { createVisible } = useSelector(state => state.createProject)
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  // model_type 1软件开发 2游戏
  const [state, setState] = useState(2)
  // 项目类型 选择冲刺2 迭代1
  const [projectType, setProjectType] = useState(0)
  const handleOk = () => {}
  const handleCancel = () => {}

  useEffect(() => {
    if (createVisible) {
      setIsModalOpen(true)
    }
  }, [createVisible])
  return (
    <ModalWrap
      title="创建项目"
      width={832}
      bodyStyle={{ padding: '0' }}
      open={isModalOpen}
      footer={null}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {state === 1 ? (
        <ProjectType
          projectType={projectType}
          onChange={val => {
            setState(2)
            setProjectType(val)
          }}
          onCancel={() => {
            dispatch(changeCreateVisible(false))
            dispatch(editProject({ visible: false, id: '' }))
          }}
        />
      ) : (
        <CreateForm onBack={() => setState(1)} />
      )}
    </ModalWrap>
  )
}
export default CreateProject
