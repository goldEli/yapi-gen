// import ProjectCommonOperation from '@/components/ProjectCommonOperation'
import styled from '@emotion/styled'
import React from 'react'
import Operation from './Operation'

interface IProps {}
const SprintProjectKanBanBox = styled.div`
  padding-top: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const OperationBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
`

const SprintProjectKanBan: React.FC<IProps> = props => {
  return (
    <SprintProjectKanBanBox>
      {/* <ProjectCommonOperation onInputSearch={(val: any) => { }} /> */}
      <OperationBox>
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
      </OperationBox>
    </SprintProjectKanBanBox>
  )
}
export default SprintProjectKanBan
