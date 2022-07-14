import ProjectCard from '@/components/ProjectCard'
import styled from '@emotion/styled'
import { Space } from 'antd'
import { useNavigate } from 'react-router-dom'

interface Props {
  onChangeOperation(type: string, id: number): void
}

const SpaceWrap = styled(Space)({
  display: 'flex',
  flexWrap: 'wrap',
  padding: '0 8px',
})

const List = [
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

export default (props: Props) => {
  const navigate = useNavigate()
  return (
    <SpaceWrap size={32}>
      {List.map((item, index) => (
        <div key={`${item.id}_${index}`} onClick={() => navigate('/Demand')}>
          <ProjectCard
            item={item}
            onChangeOperation={props.onChangeOperation}
          />
        </div>
      ))}
    </SpaceWrap>
  )
}
