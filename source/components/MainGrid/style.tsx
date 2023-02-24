/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Space } from 'antd'

const SpaceWrap = styled(Space)({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: '10px 0',
})

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
    color: '#646566',
  },
  svg: {
    color: '#969799',
  },
  '&: hover': {
    div: {
      color: '#2877ff',
    },
    svg: {
      color: '#2877ff',
    },
  },
})

const DataWrap = styled.div({
  height: '100%',
  overflowX: 'auto',
})

export { SpaceWrap, AddProject, DataWrap }
