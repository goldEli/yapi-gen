/* eslint-disable @typescript-eslint/naming-convention */
import { Divider, Space, Dropdown, Menu, Tooltip } from 'antd'
import IconFont from './IconFont'
import styled from '@emotion/styled'
import { useModel } from '@/models'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'

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
  const [t] = useTranslation()
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
          label: (
            <div onClick={() => props.onChangeSetting?.()}>
              {t('common.setField')}
            </div>
          ),
        },
      ]}
    />
  )
  return (
    <SpaceWrap size={16}>
      <Tooltip title={t('common.board')}>
        <IconFontWrap
          onClick={() => props.onChangeGrid?.(true)}
          active={props.isGrid}
          type="layout"
        />
      </Tooltip>
      <Tooltip title={t('common.list')}>
        <IconFontWrap
          onClick={() => props.onChangeGrid?.(false)}
          active={!props.isGrid}
          type="unorderedlist"
        />
      </Tooltip>

      {hasFilter ? null : <DividerWrap type="vertical" />}

      {hasFilter
        ? null
        : (
            <Tooltip title={t('common.search')}>
              <IconFontWrap
                active={!props.filterState}
                type="filter"
                onClick={props.onChangeFilter}
              />
            </Tooltip>
          )}

      {props.isGrid ? null : <DividerWrap type="vertical" />}

      {props.isGrid
        ? null
        : (
            <Dropdown overlay={menu} trigger={['click']}>
              <Tooltip title={t('common.tableFieldSet')}>
                <IconFontWrap active={props.settingState} type="settings" />
              </Tooltip>
            </Dropdown>
          )}
    </SpaceWrap>
  )
}

export default OperationGroup
