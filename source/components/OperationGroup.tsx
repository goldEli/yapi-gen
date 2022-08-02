/* eslint-disable @typescript-eslint/naming-convention */
import { Divider, Space, Dropdown, Menu } from 'antd'
import IconFont from './IconFont'
import styled from '@emotion/styled'
import { useModel } from '@/models'
import { getIsPermission } from '@/tools/index'

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
  const { projectInfo } = useModel('project')

  const hasFilter = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/get',
  )

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

      {hasFilter ? null : <DividerWrap type="vertical" />}

      {hasFilter
        ? null
        : (
            <IconFontWrap
              active={!props.filterState}
              type="filter"
              onClick={props.onChangeFilter}
            />
          )}

      {props.isGrid ? null : <DividerWrap type="vertical" />}

      {props.isGrid
        ? null
        : (
            <Dropdown overlay={menu}>
              <IconFontWrap active={props.settingState} type="settings" />
            </Dropdown>
          )}
    </SpaceWrap>
  )
}

export default OperationGroup
