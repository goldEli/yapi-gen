// 需求主页右侧操作组件
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { Space, Menu, message } from 'antd'
import styled from '@emotion/styled'
import { getIsPermission, getParamsData } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useDispatch, useSelector } from '@store/index'
import { useLocation, useSearchParams } from 'react-router-dom'
import SetShowField from './SetShowField'
import SaveAsViewModal from './SaveAsViewModal'
import ShareModal from './ShareModal'
import { DividerWrap, HasIconMenu, HoverWrap } from '@/components/StyleCommon'
import { getMessage } from '@/components/Message'
import ScreenMinHover from '@/components/ScreenMinHover'
import IconFont from '@/components/IconFont'
import DropDownMenu from '@/components/DropDownMenu'
import { openShareModel } from '@store/kanBan/kanBan.thunk'

interface Props {
  onChangeFilter?(): void
  onChangeGrid?(val: any): void
  onChangeSetting?(): void
  isGrid: 1 | 2
  filterState: boolean | undefined
  settingState: boolean | undefined
  isDemand?: boolean
  onRefresh?(): void
}

const SpaceWrap = styled(Space)({
  color: 'var(--neutral-n3)',
  '.ant-space-item': {
    display: 'flex',
  },
})

const KanBanBtnsArea = (props: Props) => {
  const [t] = useTranslation()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo } = useSelector(store => store.project)
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleFields, setIsVisibleFields] = useState(false)
  const dispatch = useDispatch()

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
        key: 'thumbnail',
        label: (
          <HasIconMenu
            onClick={() => onClickMenu(1)}
            isCheck={props.isGrid === 1}
          >
            <div className="left">
              <IconFont className="icon" type="layout" />
              <span
                style={{
                  color: 'var(--neutral-n2)',
                }}
                className="label"
              >
                {t('common.board')}
              </span>
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
      {/* 分享 */}
      <ScreenMinHover
        label={t('share')}
        icon="share"
        onClick={() => {
          dispatch(openShareModel())
        }}
      />
      <DividerWrap type="vertical" />
      {/* 视图 */}
      {/* <>
        <ViewPort pid={projectId} type={2} />
        <DividerWrap type="vertical" />
      </> */}

      {/* <DropDownMenu
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
      </DropDownMenu> */}

      {/* 筛选 */}
      <>
        <ScreenMinHover
          label={t('common.search')}
          icon="filter"
          onClick={props.onChangeFilter}
          isActive={!props.filterState}
        />
      </>

      <DividerWrap type="vertical" />

      {/* 刷新 */}
      <ScreenMinHover
        label={t('common.refresh')}
        icon="sync"
        onClick={props.onRefresh}
      />
      {/* 全屏 */}
      {/* <DividerWrap type="vertical" />
     
      <ScreenMinHover
        label={t('full_screen')}
        icon="full-screen"
        onClick={() => {}}
      /> */}
      <DividerWrap type="vertical" />

      {/* 设置 */}
      <DropDownMenu
        menu={<SetShowField />}
        icon="settings"
        isVisible={isVisibleFields}
        onChangeVisible={setIsVisibleFields}
      >
        <div>{t('common.tableFieldSet')}</div>
      </DropDownMenu>
      <SaveAsViewModal />
      <ShareModal />
    </SpaceWrap>
  )
}

export default KanBanBtnsArea
