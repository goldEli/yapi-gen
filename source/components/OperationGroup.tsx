/* eslint-disable @typescript-eslint/naming-convention */
import { Divider, Space, Dropdown, Menu } from 'antd'
import IconFont from './IconFont'
import styled from '@emotion/styled'

interface Props {
  onChangeFilter?(): void
  onChangeGrid?(val: boolean): void
  onChangeSetting?(): void
  isGrid: boolean | undefined
  filterState: boolean | undefined
  settingState: boolean | undefined
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

const OperationGroup = (props: Props) => {
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label:
            <div onClick={() => props.onChangeSetting?.()}>设置显示字段</div>
          ,
        },
      ]}
    />
  )
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

      <Dropdown overlay={menu}>
        <IconFontWrap active={props.settingState} type="settings" />
      </Dropdown>
    </SpaceWrap>
  )
}

export default OperationGroup
