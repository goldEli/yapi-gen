import { Divider, Space } from 'antd'
import IconFont from './IconFont'
import styled from '@emotion/styled'
import TableSetting from './TableSetting'

interface Props {
  onChangeFilter?(): void
  onChangeGrid?(val: boolean): void
  isGrid?: boolean | undefined
  filterState?: boolean | undefined
}

const SpaceWrap = styled(Space)({
  '.ant-space-item': {
    display: 'flex',
  },
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

const DividerWrap = styled(Divider)({
  height: 20,
  margin: 0,
})

export default (props: Props) => {
  return (
    <SpaceWrap size={16}>
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
      <DividerWrap type="vertical" />
      <IconFontWrap
        active={!props.filterState}
        type="filter"
        onClick={props.onChangeFilter}
      />
      <DividerWrap type="vertical" />
      <TableSetting />
    </SpaceWrap>
  )
}
