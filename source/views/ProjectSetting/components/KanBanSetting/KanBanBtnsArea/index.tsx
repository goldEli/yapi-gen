// 需求主页右侧操作组件
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { Space } from 'antd'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useDispatch } from '@store/index'
import SetShowField from './SetShowField'
import SaveAsViewModal from './SaveAsViewModal'
import ShareModal from './ShareModal'
import { DividerWrap } from '@/components/StyleCommon'
import ScreenMinHover from '@/components/ScreenMinHover'
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
  const [isVisibleFields, setIsVisibleFields] = useState(false)
  const dispatch = useDispatch()

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
