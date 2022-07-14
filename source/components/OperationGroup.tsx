import { Divider, Space } from 'antd'
import IconFont from './IconFont'
import styled from '@emotion/styled'
import TableSetting from './TableSetting'

interface Props {
  keys: string[]
  onChangeFilter?(): void
  onChangeGrid?(val: boolean): void
  isGrid?: boolean | undefined
  filterState?: boolean | undefined
}

const Wrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

const IconFontWrap = styled(IconFont)<{ active?: boolean }>(
  {
    fontSize: 20,
    cursor: 'pointer',
  },
  ({ active }) => ({
    color: active ? '#2877FF' : '#969799',
  }),
)

const Box = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const DividerWrap = styled(Divider)({
  height: 20,
  margin: '0 16px',
})

export default (props: Props) => {
  const getHiddenState = (str: string) => !props.keys.includes(str)
  return (
    <Wrap>
      <Box
        hidden={
          !props.keys.filter(item =>
            ['columnar', 'Lattice', 'table'].includes(item),
          ).length
        }
      >
        <Space size={16}>
          <IconFontWrap
            onClick={() => props.onChangeGrid?.(true)}
            active={props.isGrid}
            type="layout"
          />
          <IconFontWrap
            onClick={() => props.onChangeGrid?.(false)}
            active={!props.isGrid}
            type="unorderedlist"
          />
          {/* <IconFontWrap type="app-store" /> */}
        </Space>
        <DividerWrap type="vertical" />
      </Box>
      <Box hidden={getHiddenState('filter')}>
        <IconFontWrap
          active={!props.filterState}
          type="filter"
          onClick={props.onChangeFilter}
        />
        <DividerWrap type="vertical" />
      </Box>
      <Box hidden={getHiddenState('set')}>
        <TableSetting />
      </Box>
    </Wrap>
  )
}
