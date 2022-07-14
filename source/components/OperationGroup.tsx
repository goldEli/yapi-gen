import { Divider, Space } from 'antd'
import IconFont from './IconFont'
import styled from '@emotion/styled'
import TableSetting from './TableSetting'

interface Props {
  keys: string[]
  onChangeFilter?(): void
}

const Wrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

export default (props: Props) => {
  const getHiddenState = (str: string) => !props.keys.includes(str)
  return (
    <Wrap>
      <div
        hidden={
          !props.keys.filter(item =>
            ['columnar', 'Lattice', 'table'].includes(item),
          ).length
        }
      >
        <Space>
          <IconFont type="layout" />
          <IconFont type="unorderedlist" />
          <IconFont type="app-store" />
        </Space>
        <Divider type="vertical" />
      </div>
      <div hidden={getHiddenState('filter')}>
        <IconFont type="filter" onClick={props.onChangeFilter} />
        <Divider type="vertical" />
      </div>
      <div hidden={getHiddenState('sort')}>
        <IconFont type="sort" />
        <Divider type="vertical" />
      </div>
      <div hidden={getHiddenState('set')}>
        <TableSetting />
      </div>
    </Wrap>
  )
}
