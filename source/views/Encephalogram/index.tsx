import React from 'react'
import MapContent from './components/MapContent'
import { EncephalogramBox } from './styles'
import ToolBar from './components/ToolBar'
import TopArea from './components/TopArea'

const Encephalogram = () => {
  return (
    <EncephalogramBox>
      <TopArea />
      <ToolBar />
      <MapContent />
    </EncephalogramBox>
  )
}
export default Encephalogram
