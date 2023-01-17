// 需求主页右侧操作组件
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { Space, Menu, message } from 'antd'
import styled from '@emotion/styled'
import { getIsPermission } from '@/tools/index'
import { DividerWrap, HasIconMenu, HoverWrap } from './StyleCommon'
import { useTranslation } from 'react-i18next'
import IconFont from './IconFont'
import DropDownMenu from './DropDownMenu'
import { useState } from 'react'
import { useSelector } from '@store/index'

interface Props {
  onChangeFilter?(): void
  onChangeGrid?(val: any): void
  onChangeSetting?(): void
  isGrid: any
  filterState: boolean | undefined
  settingState: boolean | undefined
  isDemand?: boolean
}

const SpaceWrap = styled(Space)({
  '.ant-space-item': {
    display: 'flex',
  },
})

const OperationGroup = (props: Props) => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(
    (store: { project: any }) => store.project,
  )
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleFields, setIsVisibleFields] = useState(false)

  const hasFilter = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/get',
  )

  // 切换显示类型
  const onClickMenu = (number: any) => {
    props.onChangeGrid?.(number)
    setIsVisible(false)
    message.success(t('version2.reviewModeChangeSuccess'))
  }

  // 切换显示类型
  const onClickMenuFields = () => {
    props.onChangeSetting?.()
    setIsVisibleFields(false)
  }

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={onClickMenuFields}>{t('common.setField')}</div>,
        },
      ]}
    />
  )

  const menuType = () => {
    let menuItems = [
      {
        key: 'list',
        label: (
          <HasIconMenu onClick={() => onClickMenu(0)} isCheck={!props.isGrid}>
            <div className="left">
              <IconFont className="icon" type="unorderedlist" />
              <span className="label">{t('common.list')}</span>
            </div>
            <IconFont className="checked" type={props.isGrid ? '' : 'check'} />
          </HasIconMenu>
        ),
      },
      {
        key: 'thumbnail',
        label: (
          <HasIconMenu
            onClick={() => onClickMenu(1)}
            isCheck={props.isGrid === 1}
          >
            <div className="left">
              <IconFont className="icon" type="layout" />
              <span className="label">{t('common.board')}</span>
            </div>
            <IconFont
              className="checked"
              type={props.isGrid === 1 ? 'check' : ''}
            />
          </HasIconMenu>
        ),
      },
      {
        key: 'tree',
        label: (
          <HasIconMenu
            onClick={() => onClickMenu(2)}
            isCheck={props.isGrid === 2}
          >
            <div className="left">
              <IconFont className="icon" type="tree-list" />
              <span className="label">{t('version2.tree')}</span>
            </div>
            <IconFont
              className="checked"
              type={props.isGrid === 2 ? 'check' : ''}
            />
          </HasIconMenu>
        ),
      },
    ]

    if (!props.isDemand) {
      menuItems = menuItems.filter((i: any) => i.key !== 'tree')
    }
    return <Menu items={menuItems} />
  }
  return (
    <SpaceWrap size={8} style={{ marginLeft: 8 }}>
      <DropDownMenu
        isVisible={isVisible}
        onChangeVisible={setIsVisible}
        menu={menuType}
        icon={
          props.isGrid === 1
            ? 'layout'
            : props.isGrid === 2
            ? 'tree-list'
            : 'unorderedlist'
        }
      >
        <HasIconMenu>
          <div className="label">
            {props.isGrid === 1 && t('common.board')}
            {props.isGrid === 2 && t('version2.tree')}
            {!props.isGrid && t('common.list')}
          </div>
        </HasIconMenu>
      </DropDownMenu>

      {!hasFilter && <DividerWrap type="vertical" />}

      {!hasFilter && (
        <HoverWrap onClick={props.onChangeFilter} isActive={!props.filterState}>
          <IconFont className="iconMain" type="filter" />
          <span className="label">{t('common.search')}</span>
        </HoverWrap>
      )}

      {(props.isGrid === 0 || props.isGrid === 2) && (
        <DividerWrap type="vertical" />
      )}

      {(props.isGrid === 0 || props.isGrid === 2) && (
        <DropDownMenu
          menu={menu}
          icon="settings"
          isVisible={isVisibleFields}
          onChangeVisible={setIsVisibleFields}
          isActive={props.settingState}
        >
          <div>{t('common.tableFieldSet')}</div>
        </DropDownMenu>
      )}
    </SpaceWrap>
  )
}

export default OperationGroup
