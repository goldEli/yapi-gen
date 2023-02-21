import ChooseCover, { IndexRef2 } from '@/components/ChooseCover'
import CommonModal from '@/components/CommonModal'
import CreateAProjectForm, { IndexRef } from '@/components/CreateAProjectForm'
import CustomDropdown from '@/components/CustomDropdown'
import IconFont from '@/components/IconFont'
import ProjectCard from '@/components/ProjectCard'
import { HoverIcon } from '@/components/ProjectCard/style'
import ViewPort from '@/components/ViewPort'
import { useRef, useState } from 'react'
import { Wrap } from './style'

const ProjectManagementOptimization = () => {
  const row = new Array(10).fill(1)
  const [isEdit, setIsEdit] = useState(false)
  const myCreate = useRef<IndexRef>(null)
  const myCover = useRef<IndexRef2>(null)

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
    const data2 = myCover.current?.activeCover
    // console.log(data, data2)
  }
  return (
    <Wrap>
      <ViewPort />
      {/* {row.map(item => (
        <ProjectCard key={item}>
          <CustomDropdown onChange={onChange}>
            <HoverIcon>
              <IconFont
                style={{
                  color: 'var(--neutral-n3)',
                }}
                type="more"
              />
            </HoverIcon>
          </CustomDropdown>
        </ProjectCard>
      ))} */}
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
          <ChooseCover ref={myCover} />
          <CreateAProjectForm ref={myCreate} />
        </div>
      </CommonModal>
    </Wrap>
  )
}

export default ProjectManagementOptimization
