// 需求主页右侧操作组件
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { Space, Menu, message } from 'antd'
import styled from '@emotion/styled'
import { getIsPermission, getParamsData } from '@/tools/index'
import { DividerWrap, HasIconMenu, HoverWrap } from './StyleCommon'
import { useTranslation } from 'react-i18next'
import IconFont from './IconFont'
import DropDownMenu from './DropDownMenu'
import { useEffect, useState } from 'react'
import { useSelector } from '@store/index'
import ViewPort from './ViewPort'
import { useLocation, useSearchParams } from 'react-router-dom'
import SetShowField from './SetShowField/indedx'

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
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo } = useSelector(store => store.project)
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleFields, setIsVisibleFields] = useState(false)

  const hasFilter = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/get',
  )

  // 切换显示类型
  const onClickMenu = (number: any) => {
    message.success(t('version2.reviewModeChangeSuccess'))
    props.onChangeGrid?.(number)
    setIsVisible(false)
  }

  // 切换显示类型
  const onClickMenuFields = () => {
    props.onChangeSetting?.()
    setIsVisibleFields(false)
  }

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
    return <Menu items={menuItems} />
  }
  return (
    <SpaceWrap size={8} style={{ marginLeft: 8 }}>
      {location.pathname.includes('Demand') && <ViewPort pid={projectId} />}

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

      <DividerWrap type="vertical" />

      <DropDownMenu
        menu={
          <SetShowField
            onChangeFieldVisible={onClickMenuFields}
            isGrid={props.isGrid}
          />
        }
        icon="settings"
        isVisible={isVisibleFields}
        onChangeVisible={setIsVisibleFields}
        isActive={props.settingState}
      >
        <div>{t('common.tableFieldSet')}123</div>
      </DropDownMenu>
    </SpaceWrap>
  )
}

export default OperationGroup
