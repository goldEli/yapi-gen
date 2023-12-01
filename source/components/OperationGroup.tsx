// 需求主页右侧操作组件
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { Space, Menu, message } from 'antd'
import styled from '@emotion/styled'
import { getIsPermission, getParamsData } from '@/tools/index'
import { DividerWrap, HasIconMenu } from './StyleCommon'
import { useTranslation } from 'react-i18next'
import IconFont from './IconFont'
import DropDownMenu from './DropDownMenu'
import { useState, useRef } from 'react'
import { useSelector } from '@store/index'
import ViewPort from './ViewPort'
import { useLocation, useSearchParams } from 'react-router-dom'
import SetShowField from './SetShowField/indedx'
import ScreenMinHover from './ScreenMinHover'
import { getMessage } from './Message'

interface Props {
  onChangeFilter?(): void
  onChangeGrid?(val: any): void
  onChangeSetting?(): void
  isGrid?: any
  filterState: boolean | undefined
  settingState: boolean | undefined
  isDemand?: boolean
  onRefresh?(): void
  // 是否有切换模式
  notGrid?: boolean
  onChangeView?(): void
}

const SpaceWrap = styled(Space)({
  color: 'var(--neutral-n3)',
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
  const ViewPortRef = useRef<any>()
  const hasFilter = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/get' : 'b/transaction/get',
  )

  // 切换显示类型
  const onClickMenu = (number: any) => {
    getMessage({ msg: t('version2.reviewModeChangeSuccess'), type: 'success' })
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
              <span
                style={{
                  color: 'var(--neutral-n2)',
                }}
                className="label"
              >
                {t('common.list')}
              </span>
            </div>
            <IconFont className="checked" type={props.isGrid ? '' : 'check'} />
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
              <span
                style={{
                  color: 'var(--neutral-n2)',
                }}
                className="label"
              >
                {t('version2.tree')}
              </span>
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
      {(location.pathname.includes('Demand') ||
        location.pathname.includes('Affair') ||
        location.pathname.includes('Defect')) && (
        <>
          <ViewPort
            pid={projectId}
            type={1}
            onChangeView={() => {
              console.log('ViewPortRef-----1', ViewPortRef)
            }}
            ref={ViewPortRef}
          />
          <DividerWrap type="vertical" />
        </>
      )}

      {!props.notGrid && (
        <>
          <DropDownMenu
            isVisible={isVisible}
            onChangeVisible={setIsVisible}
            menu={menuType}
            icon={props.isGrid === 2 ? 'tree-list' : 'unorderedlist'}
          >
            <HasIconMenu>
              <div className="label">
                {props.isGrid === 2 && t('version2.tree')}
                {!props.isGrid && t('common.list')}
              </div>
            </HasIconMenu>
          </DropDownMenu>
          <DividerWrap type="vertical" />
        </>
      )}

      {!hasFilter && (
        <ScreenMinHover
          label={t('common.search')}
          icon="filter"
          onClick={props.onChangeFilter}
          isActive={!props.filterState}
        />
      )}

      <DividerWrap type="vertical" />

      <ScreenMinHover
        label={t('common.refresh')}
        icon="sync"
        onClick={props.onRefresh}
      />

      <DividerWrap type="vertical" />

      <DropDownMenu
        menu={
          <SetShowField
            onChangeFieldVisible={onClickMenuFields}
            onChangeView={type => {
              // type 1创建视图  2 管理视图
              if (type === 1) {
                ViewPortRef.current?.onChangeCreate()
                return
              }
              ViewPortRef.current?.onChangeView()
            }}
            isGrid={props.isGrid}
          />
        }
        icon="settings"
        isVisible={isVisibleFields}
        onChangeVisible={setIsVisibleFields}
        isActive={props.settingState}
      >
        <div>{t('common.tableFieldSet')}</div>
      </DropDownMenu>
    </SpaceWrap>
  )
}

export default OperationGroup
