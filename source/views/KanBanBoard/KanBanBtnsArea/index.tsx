// 需求主页右侧操作组件
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { Space } from 'antd'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from '@store/index'
import { useSearchParams } from 'react-router-dom'
import SetShowField from './SetShowField'
import SaveAsViewModal from './SaveAsViewModal'
import { DividerWrap } from '@/components/StyleCommon'
import ScreenMinHover from '@/components/ScreenMinHover'
import DropDownMenu from '@/components/DropDownMenu'
import useShareModal from '@/hooks/useShareModal'
import { onFullScreenMode } from '@store/kanBan/kanBan.thunk'
import _ from 'lodash'

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
  const { projectInfo } = useSelector(store => store.project)
  const [isVisibleFields, setIsVisibleFields] = useState(false)
  const dispatch = useDispatch()
  const { userInfo } = useSelector(store => store.user)
  const { sortByView, sortByRowAndStatusOptions, sortByGroupOptions } =
    useSelector(store => store.kanBan)
  const currentView = useMemo(() => {
    return sortByView?.find(item => item.check)
  }, [sortByView])
  let { view } = useSelector(store => store)
  const { viewItemConfig } = useSelector(state => state.kanBan)
  view = { ...view, titles: viewItemConfig?.titles }
  const currentRowAndStatusId = useMemo(() => {
    const key = sortByRowAndStatusOptions?.find(item => item.check)?.key ?? ''
    return parseInt(key, 10)
  }, [sortByRowAndStatusOptions])

  const currentGroupKey = useMemo(() => {
    const key = sortByGroupOptions?.find(item => item.check)?.key ?? ''
    return key
  }, [sortByGroupOptions])

  const { open, ShareModal } = useShareModal()

  return (
    <SpaceWrap size={8} style={{ marginLeft: 8 }}>
      <ShareModal
        id={currentView?.id}
        name={currentView?.name}
        config={view}
        url={window.location.href}
        title={`【${projectInfo.name}-${currentView?.name}-${userInfo?.name}】`}
        otherConfig={{
          currentRowAndStatusId,
          currentGroupKey,
        }}
        viewType={currentView?.type}
        type={2}
      />
      {/* 分享 */}
      <ScreenMinHover
        label={t('share')}
        icon="share"
        onClick={() => {
          // dispatch(openShareModel())
          open({
            onOk: () => {
              return Promise.resolve()
            },
          })
        }}
      />
      <DividerWrap type="vertical" />
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
      <DividerWrap type="vertical" />

      <ScreenMinHover
        label={t('full_screen')}
        icon="full-screen"
        onClick={() => {
          dispatch(onFullScreenMode())
        }}
      />
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
    </SpaceWrap>
  )
}

export default KanBanBtnsArea
