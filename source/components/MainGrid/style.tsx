/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Space } from 'antd'

const SpaceWrap = styled.div`
  /* display: grid;
  grid-template-columns: repeat(auto-fill, 280px); //自动填充，每个单元270
  grid-gap: 24px; //间距10
  justify-content: center;
  border: 1px solid;
  height: 100%; */
  display: flex;
  flex-wrap: wrap;
`
export const ScrollBox = styled.div`
  /* border: 1px solid red; */
  height: calc(100% - 20px);
  overflow-y: scroll;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin: auto;
  /* width: calc(100% - 120px); */
  /* margin-left: 72px; */
  .infinite-scroll-component__outerdiv {
    width: 100%;
  }
  .infinite-scroll-component {
    display: flex;
    flex-wrap: wrap;
    gap: 24px 24px;
  }
`
const SpaceWrapItem = styled.div`
  width: calc(16% - 10px);
  /* border: 1px solid blue; */
`

const AddProject = styled.div({
  border: '1px solid var(--neutral-n5)',
  height: 124,

  borderRadius: 4,
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 272,
  cursor: 'pointer',
  div: {
    color: 'var(--neutral-n2)',
  },
  svg: {
    color: 'var(--neutral-n3)',
  },
  '&: hover': {
    border: '1px solid var(--primary-d1)',
    div: {
      color: 'var(--primary-d1)',
    },
    svg: {
      color: 'var(--primary-d1)',
    },
  },
})

const DataWrap = styled.div({
  paddingTop: '16px',
  height: 'calc(100vh - 180px)',
  overflowY: 'scroll',
  margin: 'auto',
})

export { SpaceWrap, AddProject, DataWrap, SpaceWrapItem }
