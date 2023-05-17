import styled from '@emotion/styled'
import React from 'react'
import Operation from './Operation'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import KanBan from './KanBan'

interface IProps {}
const SprintProjectKanBanBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`

const ToolBarBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  /* position: relative; */
`

const SprintProjectKanBan: React.FC<IProps> = props => {
  return (
    <SprintProjectKanBanBox>
      <ProjectCommonOperation onInputSearch={val => {}} />
      <ToolBarBox>
        <Operation
          pid={1}
          isGrid={1}
          onChangeGrid={() => {}}
          onChangeIsShowLeft={() => {}}
          onChangeVisible={(e: any) => {}}
          onRefresh={() => {}}
          onSearch={() => {}}
          settingState={true}
          onChangeSetting={() => {}}
          isShowLeft={false}
          otherParams={{}}
          dataLength={2}
        />
      </ToolBarBox>
      <KanBan />
    </SprintProjectKanBanBox>
  )
}
export default SprintProjectKanBan
