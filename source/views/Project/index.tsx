import ChooseCover from '@/components/ChooseCover'
import CommonModal from '@/components/CommonModal'
import CreateAProjectForm, { IndexRef } from '@/components/CreateAProjectForm'
import CustomDropdown from '@/components/CustomDropdown'
import IconFont from '@/components/IconFont'
import ProjectCard from '@/components/ProjectCard'
import { HoverIcon } from '@/components/ProjectCard/style'
import { useRef, useState } from 'react'
import { Wrap } from './style'

const ProjectManagementOptimization = () => {
  const row = new Array(10).fill(1)
  const [isEdit, setIsEdit] = useState(false)
  const myCreate = useRef<IndexRef>(null)

  const onChange = (key: string) => {
    switch (key) {
      case 'edit':
        setIsEdit(true)
        break
      case 'over':
        break
      case 'del':
        break

      default:
        break
    }
  }
  const onConfirm = () => {
    const data = myCreate.current?.postValue()
  }
  return (
    <Wrap>
      {row.map(item => (
        <ProjectCard key={item}>
          <CustomDropdown onChange={onChange}>
            <HoverIcon>
              <IconFont type="more" />
            </HoverIcon>
          </CustomDropdown>
        </ProjectCard>
      ))}
      <CommonModal
        onConfirm={onConfirm}
        onClose={() => setIsEdit(false)}
        width={832}
        isVisible={isEdit}
        title="编辑项目"
      >
        <div
          style={{
            display: 'flex',
          }}
        >
          <ChooseCover />
          <CreateAProjectForm ref={myCreate} />
        </div>
      </CommonModal>
    </Wrap>
  )
}

export default ProjectManagementOptimization
