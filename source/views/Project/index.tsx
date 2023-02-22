import CustomDropdown from '@/components/CustomDropdown'
import IconFont from '@/components/IconFont'
import ProjectCard from '@/components/ProjectCard'
import { HoverIcon } from '@/components/ProjectCard/style'
import ViewPort from '@/components/ViewPort'
import { changeCreateVisible } from '@store/create-propject'
import { useDispatch } from '@store/index'
import { Wrap } from './style'

const ProjectManagementOptimization = () => {
  const row = new Array(10).fill(1)
  const dispatch = useDispatch()

  const onChange = (key: string) => {
    switch (key) {
      case 'edit':
        dispatch(changeCreateVisible(true))
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
    <div>
      <div>
        <ViewPort />
      </div>
      <Wrap>
        {row.map(item => (
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
        ))}
      </Wrap>
    </div>
  )
}

export default ProjectManagementOptimization
