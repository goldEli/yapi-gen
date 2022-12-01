// 需求主页右侧操作组件

/* eslint-disable @typescript-eslint/naming-convention */
import { Space, Dropdown, Menu, Tooltip } from 'antd'
import styled from '@emotion/styled'
import { useModel } from '@/models'
import { getIsPermission } from '@/tools/index'
import { DividerWrap, IconFontWrap } from './StyleCommon'
import { useTranslation } from 'react-i18next'

const IconWrap = styled(IconFontWrap)({
  '&: hover': {
    color: '#2877ff',
  },
})

interface Props {
  onChangeFilter?(): void
  onChangeGrid?(val: any): void
  onChangeSetting?(): void
  isGrid: any
  filterState: boolean | undefined
  settingState: boolean | undefined
}

const SpaceWrap = styled(Space)({
  '.ant-space-item': {
    display: 'flex',
  },
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
        <IconWrap
          onClick={() => props.onChangeGrid?.(1)}
          active={props.isGrid === 1}
          type="layout"
        />
      </Tooltip>
      <Tooltip title={t('common.list')}>
        <IconWrap
          onClick={() => props.onChangeGrid?.(0)}
          active={!props.isGrid}
          type="unorderedlist"
        />
      </Tooltip>
      <Tooltip title="树形">
        <IconWrap
          onClick={() => props.onChangeGrid?.(2)}
          active={props.isGrid === 2}
          type="slider-02"
        />
      </Tooltip>

      {!hasFilter && <DividerWrap type="vertical" />}

      {!hasFilter && (
        <Tooltip title={t('common.search')}>
          <IconWrap
            active={!props.filterState}
            type="filter"
            onClick={props.onChangeFilter}
          />
        </Tooltip>
      )}

      {!props.isGrid && <DividerWrap type="vertical" />}

      {!props.isGrid && (
        <Dropdown overlay={menu} trigger={['click']}>
          <Tooltip title={t('common.tableFieldSet')}>
            <IconWrap active={props.settingState} type="settings" />
          </Tooltip>
        </Dropdown>
      )}
    </SpaceWrap>
  )
}

export default OperationGroup
