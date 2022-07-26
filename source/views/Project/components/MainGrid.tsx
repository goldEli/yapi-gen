import ProjectCard from '@/components/ProjectCard'
import styled from '@emotion/styled'
import { Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import IconFont from '@/components/IconFont'

interface Props {
  onChangeOperation(type: string, id: number): void
  onChangeVisible(): void
  projectList: any
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

  const onToDetail = (item: any) => {
    navigate(`/Detail/Demand?id=${item.id}`)
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
      <AddProject onClick={props.onChangeVisible}>
        <IconFont
          style={{ color: '#969799', fontSize: 24, marginBottom: 16 }}
          type="plus"
        />
        <div style={{ color: '#646566', fontSize: 14 }}>创建项目</div>
      </AddProject>
    </SpaceWrap>
  )
}

export default MainGrid
