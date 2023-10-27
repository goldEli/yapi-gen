import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Side from './Side'
import styled from '@emotion/styled'

const Content = styled.div`
  height: calc(100vh - 56px);
  width: 100%;

  display: flex;
`

const dataArray = [
  {
    icon: 'question-circle-o',
    color: '#FF5500',
    title: 'Senior Product Designer',
    text: 'Senior Product Designer',
  },
  {
    icon: 'plus-circle-o',
    color: '#5FC296',
    title: 'Senior Animator',
    text: 'Senior Animator',
  },
  {
    icon: 'check-circle-o',
    color: '#2DB7F5',
    title: 'Visual Designer',
    text: 'Visual Designer',
  },
  {
    icon: 'cross-circle-o',
    color: '#FFAA00',
    title: 'Computer Engineer',
    text: 'Computer Engineer',
  },
]
const childrenToRender = dataArray.map((item, i) => {
  const { icon, color, title, text } = item
  return (
    <div key={i} className="list-sort-demo-list">
      <div className="list-sort-demo-icon"></div>
      <div className="list-sort-demo-text">
        <h1>{title}</h1>
        <p
          style={{
            color,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  )
})

const Index = () => {
  const [changeLeft, setChangeLeft] = useState(200)
  return (
    <Content>
      <Side onChangeLeft={setChangeLeft} />

      <div style={{ flex: '1' }}>
        <Outlet />
      </div>
    </Content>
  )
}

export default Index
