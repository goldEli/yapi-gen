/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Space } from 'antd'

const SpaceWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 280px); //自动填充，每个单元270
  grid-gap: 24px; //间距10
  justify-content: center;
`
const SpaceWrapItem = styled.div`
  /* width: 100px; height:100px; */
  /* background-color: skyblue; */
  /* margin: 10px; */
`

const AddProject = styled.div({
  height: 144,
  marginLeft: '8px',
  marginTop: '-8px',
  borderRadius: 4,
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 220,
  cursor: 'pointer',
  div: {
    color: 'var(--neutral-n2)',
  },
  svg: {
    color: 'var(--neutral-n3)',
  },
  '&: hover': {
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
