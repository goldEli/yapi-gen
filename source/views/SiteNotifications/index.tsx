import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Content } from '../Container'
import Side from './Side'
import DragMoveContainer from '@/components/DragMoveContainer/DragMoveContainer'

const Index = () => {
  const [changeLeft, setChangeLeft] = useState(200)
  return (
    <Content>
      <Side onChangeLeft={setChangeLeft} />

      <div>
        <Outlet />
      </div>
    </Content>
  )
}

export default Index
