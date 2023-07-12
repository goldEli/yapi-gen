import React from 'react'
import styled from '@emotion/styled'
import Operation from '../Operation'
import { useDispatch } from '@store/index'
import { onFilter } from '@store/kanBan/kanBan.thunk'

interface ToolBarProps {}

const ToolBarBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  margin: 20px 0px;
  /* position: relative; */
`

const ToolBar: React.FC<ToolBarProps> = props => {
  const dispatch = useDispatch()
  return (
    <ToolBarBox>
      <Operation
        pid={1}
        isGrid={1}
        onChangeGrid={() => {}}
        onChangeIsShowLeft={() => {}}
        onChangeVisible={(e: any) => {}}
        onRefresh={() => {}}
        onSearch={data => {
          dispatch(onFilter())
        }}
        settingState={true}
        onChangeSetting={() => {}}
        isShowLeft={false}
        otherParams={{}}
        dataLength={2}
      />
    </ToolBarBox>
  )
}

export default ToolBar
