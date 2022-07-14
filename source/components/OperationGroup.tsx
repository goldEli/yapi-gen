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

const IconFontWrap = styled(IconFont)({
  fontSize: 20,
  color: '#969799',
  cursor: 'pointer',
})

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
          <IconFontWrap type="layout" />
          <IconFontWrap type="unorderedlist" />
          <IconFontWrap type="app-store" />
        </Space>
        <DividerWrap type="vertical" />
      </Box>
      <Box hidden={getHiddenState('filter')}>
        <IconFontWrap type="filter" onClick={props.onChangeFilter} />
        <DividerWrap type="vertical" />
      </Box>
      <Box hidden={getHiddenState('set')}>
        <TableSetting />
      </Box>
    </Wrap>
  )
}
