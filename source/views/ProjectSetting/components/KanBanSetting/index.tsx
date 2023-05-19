import styled from '@emotion/styled'
import React from 'react'
import ToolBar from './ToolBar'
import Board from './Board'
import BoardLeft from './BoardLeft'
import BoardRight from './BoardRight'
interface IProps {}
const KanBanSettingBox = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px 0 20px;
`
const KanBanSetting: React.FC<IProps> = props => {
  return (
    <KanBanSettingBox>
      <ToolBar />
      <Board>
        <BoardLeft />
        <BoardRight />
      </Board>
    </KanBanSettingBox>
  )
}
export default KanBanSetting
