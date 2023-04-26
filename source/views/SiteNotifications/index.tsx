import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Content } from '../Container'
import Side from './Side'

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
