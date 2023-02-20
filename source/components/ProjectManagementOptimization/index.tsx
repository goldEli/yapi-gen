import { useState } from 'react'
import ChooseCover from '../ChooseCover'
import CommonModal from '../CommonModal'
import CreateAProjectForm from '../CreateAProjectForm'
import CustomDropdown from '../CustomDropdown'
import IconFont from '../IconFont'
import ProjectCard from '../ProjectCard'
import { HoverIcon } from '../ProjectCard/style'
import { Wrap } from './style'

const ProjectManagementOptimization = () => {
  const row = new Array(10).fill(1)
  const [isEdit, setIsEdit] = useState(true)

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
          <CreateAProjectForm />
        </div>
      </CommonModal>
    </Wrap>
  )
}

export default ProjectManagementOptimization
