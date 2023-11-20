import React from 'react'
import MapContent from './components/MapContent'
import { EncephalogramBox } from './styles'
import ToolBar from './components/ToolBar'
import TopArea from './components/TopArea'
import FullScreenBox from './components/FullScreenBox'

const Encephalogram = () => {
  return (
    <FullScreenBox>
      <EncephalogramBox>
        <TopArea />
        <ToolBar />
        <MapContent />
      </EncephalogramBox>
    </FullScreenBox>
  )
}
export default Encephalogram
