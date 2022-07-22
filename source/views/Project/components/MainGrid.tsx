/* eslint-disable react/no-array-index-key */
import ProjectCard from '@/components/ProjectCard'
import styled from '@emotion/styled'
import { Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import IconFont from '@/components/IconFont'

interface Props {
  onChangeOperation(type: string, id: number): void
  onChangeVisible(): void
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

const list = [
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
]

const MainGrid = (props: Props) => {
  const navigate = useNavigate()
  return (
    <SpaceWrap size={32}>
      {list.map((item, index) => (
        <div
          key={`${item.id}_${index}`}
          onClick={() => navigate('/Detail/Demand')}
        >
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
