import ProjectCard from '@/components/ProjectCard'
import styled from '@emotion/styled'
import { Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import IconFont from '@/components/IconFont'
import { getIsPermission } from '@/tools'
import { useModel } from '@/models'

interface Props {
  onChangeOperation(type: string, id: number, e?: any): void
  onChangeVisible(): void
  projectList: any
  onAddClear?(): void
}

const SpaceWrap = styled(Space)({
  display: 'flex',
  flexWrap: 'wrap',
  padding: '0 8px',
})

const AddProject = styled.div({
  height: 144,
  borderRadius: 4,
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 220,
  cursor: 'pointer',
})

const MainGrid = (props: Props) => {
  const navigate = useNavigate()
  const { userInfo } = useModel('user')
  const isPermission = getIsPermission(
    userInfo?.company_permissions,
    'b/project/save',
  )

  const onToDetail = (item: any) => {
    navigate(`/Detail/Demand?id=${item.id}`)
  }

  const onAddClick = () => {
    props.onChangeVisible()
    props.onAddClear?.()
  }

  return (
    <SpaceWrap size={32}>
      {props.projectList.list?.map((item: any) => (
        <div key={item.id} onClick={() => onToDetail(item)}>
          <ProjectCard
            item={item}
            onChangeOperation={props.onChangeOperation}
          />
        </div>
      ))}
      <AddProject onClick={onAddClick}>
        <IconFont
          style={{ color: '#969799', fontSize: 24, marginBottom: 16 }}
          type="plus"
        />
        {isPermission
          ? null
          : <div style={{ color: '#646566', fontSize: 14 }}>创建项目</div>
        }
      </AddProject>
    </SpaceWrap>
  )
}

export default MainGrid
